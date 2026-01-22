import { convertToLegacyFormat, deterministicParser } from '@/lib/pdf-parser-deterministic';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// EXTRACTION CONFIDENCE CALCULATOR
// ============================================================================

interface ExtractionResult {
  text: string;
  extractedChars: number;
  fileSize: number;
  isLikelyVectorized: boolean;
  extractionConfidence: number;
  extractionMethod: string | null;
}

function calculateExtractionConfidence(text: string, fileSize: number): number {
  const charCount = text.trim().length;
  
  // HARD FAIL: No text extracted
  if (charCount === 0) return 0;
  if (charCount < 50) return 0.05;
  if (charCount < 100) return 0.15;
  if (charCount < 200) return 0.25;
  
  // Check for gibberish (CID fonts without Unicode mapping)
  const gibberishRatio = (text.match(/[^\x20-\x7E\n\u00A0-\u024F]/g) || []).length / charCount;
  if (gibberishRatio > 0.4) return 0.1;
  if (gibberishRatio > 0.25) return 0.3;
  
  // Check for resume keywords
  const keywordMatches = text.match(/experience|education|skills?|projects?|work|employment|summary|objective|certifications?/gi) || [];
  const hasKeywords = keywordMatches.length >= 2;
  
  if (!hasKeywords && charCount < 500) return 0.35;
  if (!hasKeywords) return 0.5;
  
  // Good extraction
  if (charCount >= 1000 && hasKeywords) return 0.9;
  if (charCount >= 500 && hasKeywords) return 0.75;
  
  return Math.min(0.85, 0.4 + (charCount / 2000));
}

// ============================================================================
// NON-EXTRACTABLE PDF RESPONSE (422)
// ============================================================================

function createNonExtractableResponse(extractedChars: number, fileSize: number) {
  const isLikelyVectorized = fileSize > 30000 && extractedChars < 50;
  
  return NextResponse.json({
    success: false,
    errorCode: 'NON_EXTRACTABLE_PDF',
    message: isLikelyVectorized
      ? 'This PDF contains outlined/vectorized text or custom fonts that prevent text extraction.'
      : 'Unable to extract readable text from this PDF.',
    extractedChars,
    fileSize,
    isLikelyVectorized,
    confidence: {
      overall: 0,
      extraction: 0,
      skills: 0,
      experience: 0,
      projects: 0
    },
    solutions: [
      'Re-export your resume from Word or Google Docs as a standard PDF',
      'Download your resume from LinkedIn (Profile → More → Save to PDF)',
      'Use the "Paste Text Instead" option to manually input your resume',
      'If using Canva/Figma, export with "Embed fonts" option disabled'
    ],
    extractedData: null,
    text: null
  }, { status: 422 });
}

// Multi-layer PDF text extraction function
async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  console.log(`🔄 Extracting text from ${file.type} file...`);
  const arrayBuffer = await file.arrayBuffer();
  const fileSize = arrayBuffer.byteLength;
  
  try {
    if (file.type === 'application/pdf') {
      return await extractFromPDF(file, fileSize);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const text = await extractFromDOCX(file);
      return {
        text,
        extractedChars: text.trim().length,
        fileSize,
        isLikelyVectorized: false,
        extractionConfidence: calculateExtractionConfidence(text, fileSize),
        extractionMethod: 'mammoth-docx'
      };
    } else {
      // Fallback for text-based files
      const text = await file.text();
      return {
        text,
        extractedChars: text.trim().length,
        fileSize,
        isLikelyVectorized: false,
        extractionConfidence: calculateExtractionConfidence(text, fileSize),
        extractionMethod: 'raw-text'
      };
    }
  } catch (error) {
    console.error('❌ Text extraction failed:', error);
    return {
      text: '',
      extractedChars: 0,
      fileSize,
      isLikelyVectorized: fileSize > 30000,
      extractionConfidence: 0,
      extractionMethod: null
    };
  }
}

async function extractFromPDF(file: File, fileSize: number): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  let bestText = '';
  let extractionMethod: string | null = null;
  const errors: string[] = [];

  // Method 1: pdf2json with getRawTextContent (MOST RELIABLE for Node.js)
  try {
    console.log('📖 Attempting pdf2json extraction...');
    const PDFParser = (await import('pdf2json')).default;
    
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      const timeout = setTimeout(() => {
        reject(new Error('pdf2json timeout'));
      }, 30000);
      
      pdfParser.on('pdfParser_dataReady', () => {
        clearTimeout(timeout);
        try {
          // Use getRawTextContent which is the proper method
          const rawText = (pdfParser as any).getRawTextContent();
          console.log(`📖 pdf2json getRawTextContent returned ${rawText?.length || 0} chars`);
          resolve(rawText || '');
        } catch (e) {
          console.log('📖 getRawTextContent failed, trying manual extraction');
          // Fallback to manual extraction
          try {
            const pdfData = (pdfParser as any).data;
            let extractedText = '';
            if (pdfData && pdfData.Pages) {
              for (const page of pdfData.Pages) {
                if (page.Texts) {
                  for (const textItem of page.Texts) {
                    if (textItem.R) {
                      for (const r of textItem.R) {
                        if (r.T) {
                          try {
                            extractedText += decodeURIComponent(r.T) + ' ';
                          } catch {
                            extractedText += r.T + ' ';
                          }
                        }
                      }
                    }
                  }
                }
                extractedText += '\n';
              }
            }
            resolve(extractedText.trim());
          } catch (fallbackErr) {
            reject(fallbackErr);
          }
        }
      });
      
      pdfParser.on('pdfParser_dataError', (err: any) => {
        clearTimeout(timeout);
        reject(err?.parserError || err);
      });
      
      pdfParser.parseBuffer(buffer);
    });
    
    if (text.trim().length > bestText.trim().length) {
      bestText = text;
      extractionMethod = 'pdf2json';
      console.log(`✅ pdf2json extracted ${bestText.length} characters`);
    }
  } catch (error: any) {
    console.warn('⚠️ pdf2json failed:', error?.message || error);
    errors.push(`pdf2json: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  // Method 2: unpdf (uses pdfjs under hood but simpler API)
  if (bestText.trim().length < 100) {
    try {
      console.log('📖 Attempting unpdf extraction...');
      const { extractText } = await import('unpdf');
      const result = await extractText(uint8Array, { mergePages: true });
      
      if (result.text && result.text.trim().length > bestText.trim().length) {
        bestText = result.text;
        extractionMethod = 'unpdf';
        console.log(`✅ unpdf extracted ${bestText.length} characters`);
      }
    } catch (error: any) {
      console.warn('⚠️ unpdf failed:', error?.message || error);
      errors.push(`unpdf: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  // Method 3: pdf-parse with custom render
  if (bestText.trim().length < 100) {
    try {
      console.log('📖 Attempting pdf-parse extraction...');
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      
      // Custom render function to better extract text
      const options = {
        pagerender: (pageData: any) => {
          return pageData.getTextContent().then((textContent: any) => {
            let text = '';
            for (const item of textContent.items) {
              text += item.str + ' ';
            }
            return text;
          });
        }
      };
      
      const result = await pdfParse(buffer, options);
      
      if (result.text && result.text.trim().length > bestText.length) {
        bestText = result.text;
        extractionMethod = 'pdf-parse';
        console.log(`✅ pdf-parse extracted ${bestText.length} characters`);
      }
    } catch (error: any) {
      console.warn('⚠️ pdf-parse failed:', error?.message || error);
      errors.push(`pdf-parse: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  // Method 4: Enhanced raw buffer text extraction
  if (bestText.trim().length < 50) {
    try {
      console.log('📖 Attempting raw buffer text extraction...');
      
      const rawText = buffer.toString('latin1'); // Use latin1 for better binary handling
      
      // PDF text streams pattern - text between BT and ET markers
      const btEtPattern = /BT\s*([\s\S]*?)\s*ET/g;
      let streamText = '';
      let match;
      
      while ((match = btEtPattern.exec(rawText)) !== null) {
        // Extract text from Tj and TJ operators
        const tjMatches = match[1].match(/\(([^)]*)\)\s*Tj/g);
        if (tjMatches) {
          for (const tj of tjMatches) {
            const text = tj.match(/\(([^)]*)\)/);
            if (text) streamText += text[1] + ' ';
          }
        }
        
        // TJ arrays
        const tjArrays = match[1].match(/\[(.*?)\]\s*TJ/g);
        if (tjArrays) {
          for (const tjArray of tjArrays) {
            const strings = tjArray.match(/\(([^)]*)\)/g);
            if (strings) {
              for (const s of strings) {
                streamText += s.slice(1, -1) + '';
              }
            }
          }
        }
      }
      
      // Also extract any readable text patterns
      const readablePattern = /[A-Za-z][A-Za-z0-9\s@.,\-:;!?'"()]{10,}/g;
      const readableMatches = rawText.match(readablePattern);
      let readableText = '';
      if (readableMatches) {
        readableText = readableMatches
          .filter(t => !/^[A-Z][a-z]+$/.test(t)) // Filter out single words
          .join(' ');
      }
      
      const extractedFromRaw = streamText.length > readableText.length ? streamText : readableText;
      
      if (extractedFromRaw.trim().length > bestText.trim().length) {
        bestText = extractedFromRaw;
        extractionMethod = 'raw-buffer';
        console.log(`✅ Raw extraction got ${bestText.length} characters`);
      }
    } catch (error) {
      console.warn('⚠️ Raw extraction failed:', error);
      errors.push(`raw: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  // Clean up extracted text
  bestText = bestText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  const extractedChars = bestText.length;
  const isLikelyVectorized = fileSize > 30000 && extractedChars < 50;
  const extractionConfidence = calculateExtractionConfidence(bestText, fileSize);

  // Log extraction result
  if (extractedChars < 50) {
    console.error('❌ All extraction methods failed or returned minimal text');
    console.log(`📋 Errors: ${errors.join('; ')}`);
    console.log(`📊 File size: ${fileSize} bytes, Extracted: ${extractedChars} chars`);
    console.log(`🔍 Likely vectorized: ${isLikelyVectorized}`);
  } else {
    console.log(`✅ Final extracted text: ${extractedChars} characters`);
    console.log(`📊 Extraction confidence: ${(extractionConfidence * 100).toFixed(1)}%`);
  }

  return {
    text: extractedChars >= 50 ? cleanExtractedText(bestText) : bestText,
    extractedChars,
    fileSize,
    isLikelyVectorized,
    extractionConfidence,
    extractionMethod
  };
}

async function extractFromDOCX(file: File): Promise<string> {
  try {
    const mammoth = (await import('mammoth')).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.value && result.value.length > 50) {
      console.log('✅ DOCX extraction successful');

      return cleanExtractedText(result.value);
    }
  } catch (error) {
    console.warn('⚠️ DOCX extraction failed:', error);
  }
  
  throw new Error('DOCX extraction failed');
}

function cleanExtractedText(text: string): string {
  return text
    // Normalize line endings first
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove non-printable characters but KEEP newlines and essential punctuation
    .replace(/[^\x20-\x7E\n\u00A0-\u024F\u1E00-\u1EFF]/g, ' ')
    // Clean up multiple spaces on SAME line (not newlines!)
    .replace(/[^\S\n]+/g, ' ')
    // Reduce excessive blank lines to max 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .filter((line, i, arr) => {
      // Remove empty lines if previous was also empty
      if (!line && i > 0 && !arr[i - 1]) {
        return false;
      }

      return true;
    })
    .join('\n')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let extractionResult: ExtractionResult;
    let fileName = 'unknown';
    
    // Handle JSON body (manual text input)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      
      if (!body.text || body.text.trim().length < 50) {
        return NextResponse.json({
          success: false,
          errorCode: 'TEXT_TOO_SHORT',
          message: 'Text is too short. Please provide at least 50 characters.',
          extractedChars: body.text?.length || 0,
          extractedData: null
        }, { status: 400 });
      }
      
      console.log(`🔍 Processing manual text input (${body.text.length} characters)`);
      const cleanedText = cleanExtractedText(body.text);
      fileName = 'Manual Text Input';
      
      extractionResult = {
        text: cleanedText,
        extractedChars: cleanedText.length,
        fileSize: body.text.length,
        isLikelyVectorized: false,
        extractionConfidence: 0.95, // Manual input is trusted
        extractionMethod: 'manual-input'
      };
    } 
    // Handle FormData (file upload)
    else {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({
          success: false,
          errorCode: 'NO_FILE',
          message: 'No file provided',
          extractedData: null
        }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          errorCode: 'INVALID_FILE_TYPE',
          message: 'Invalid file type. Only PDF and DOCX files are supported.',
          extractedData: null
        }, { status: 400 });
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({
          success: false,
          errorCode: 'FILE_TOO_LARGE',
          message: 'File size too large. Maximum size is 10MB.',
          extractedData: null
        }, { status: 400 });
      }

      console.log(`🔍 Starting PDF extraction for: ${file.name} (${file.type})`);
      fileName = file.name;
      
      // Multi-layer extraction pipeline
      extractionResult = await extractTextFromFile(file);
    }
    
    // =========================================================================
    // CRITICAL: NON-EXTRACTABLE PDF GATE (422 Response)
    // =========================================================================
    if (extractionResult.extractedChars < 50) {
      console.log(`🚫 NON-EXTRACTABLE PDF detected: ${extractionResult.extractedChars} chars from ${extractionResult.fileSize} bytes`);
      return createNonExtractableResponse(extractionResult.extractedChars, extractionResult.fileSize);
    }
    
    console.log(`📄 Extracted text: ${extractionResult.extractedChars} characters`);
    console.log(`📊 Extraction confidence: ${(extractionResult.extractionConfidence * 100).toFixed(1)}%`);
    
    // Parse with DETERMINISTIC parser - same input = same output ALWAYS
    const rawResult = deterministicParser.parse(extractionResult.text);
    const parsedResume = convertToLegacyFormat(rawResult);
    
    // Calculate combined confidence (extraction + parsing)
    const parsingConfidence = parsedResume.confidence.overall;
    const combinedConfidence = Math.min(extractionResult.extractionConfidence, parsingConfidence);
    
    console.log(`📊 Parsing Results: ${(parsingConfidence * 100).toFixed(1)}% confidence`);
    console.log(`📊 Combined Confidence: ${(combinedConfidence * 100).toFixed(1)}%`);
    console.log(`🔑 Parse ID: ${rawResult.parseId}`);

    // Transform extracted data to match expected format
    const experienceStrings = parsedResume.extractedData.experience.map(exp => 
      `${exp.jobTitle} at ${exp.companyName} (${exp.startDate} - ${exp.endDate})`
    );
    
    const projectStrings = parsedResume.extractedData.projects.map(proj => 
      `${proj.name}: ${proj.description}`
    );
    
    const educationStrings = parsedResume.extractedData.education.map(edu => 
      `${edu.degree} from ${edu.institution} (${edu.year})`
    );

    // Flatten skills for backward compatibility - DEDUPLICATED
    const allSkillsRaw = [
      ...parsedResume.extractedData.skills.technical,
      ...parsedResume.extractedData.skills.languages,
      ...parsedResume.extractedData.skills.frameworks,
      ...parsedResume.extractedData.skills.databases,
      ...parsedResume.extractedData.skills.tools
    ];
    
    // Remove duplicates case-insensitively, keeping the first occurrence
    const seenSkills = new Set<string>();
    const allSkills = allSkillsRaw.filter(skill => {
      const normalizedSkill = skill.toLowerCase().trim();
      if (seenSkills.has(normalizedSkill)) {
        return false;
      }
      seenSkills.add(normalizedSkill);

      return true;
    });

    return NextResponse.json({
      success: true,
      text: parsedResume.rawText,
      skills: allSkills,
      experience: experienceStrings,
      education: educationStrings,
      projects: projectStrings,
      achievements: parsedResume.extractedData.achievements.map(a => a.title),
      extractionMethod: extractionResult.extractionMethod || parsedResume.parseMethod,
      contact: parsedResume.extractedData.personalInfo,
      summary: parsedResume.extractedData.summary,
      // Return confidence as OBJECT with overall, skills, experience, projects
      confidence: {
        overall: combinedConfidence,
        extraction: extractionResult.extractionConfidence,
        parsing: parsingConfidence,
        skills: parsedResume.confidence.sections?.skills || 0,
        experience: parsedResume.confidence.sections?.experience || 0,
        projects: parsedResume.confidence.sections?.projects || 0
      },
      warnings: parsedResume.warnings,
      // Extraction metadata for debugging
      extractionDetails: {
        extractedChars: extractionResult.extractedChars,
        fileSize: extractionResult.fileSize,
        method: extractionResult.extractionMethod,
        isLikelyVectorized: extractionResult.isLikelyVectorized
      },
      // Enhanced structured data with categorized skills
      structuredData: {
        experience: parsedResume.extractedData.experience,
        projects: parsedResume.extractedData.projects,
        education: parsedResume.extractedData.education,
        skills: parsedResume.extractedData.skills,
        personalInfo: parsedResume.extractedData.personalInfo,
        achievements: parsedResume.extractedData.achievements,
        certifications: parsedResume.extractedData.certifications
      },
      // Parsing metadata with determinism info
      parseMetadata: {
        parseId: rawResult.parseId, // Same resume = same parseId
        confidence: parsedResume.confidence,
        sectionsDetected: parsedResume.sections.map(s => s.type),
        missingSections: rawResult.missingSections,
        sectionConfidence: parsedResume.sectionConfidence,
        parseMethod: parsedResume.parseMethod,
        warnings: parsedResume.warnings
      }
    });

  } catch (error) {
    console.error('Error in parse-pdf API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a PDF extraction failure (legacy handling)
    if (errorMessage.includes('PDF_EXTRACTION_FAILED') || 
        errorMessage.includes('scanned') || 
        errorMessage.includes('image-based') ||
        errorMessage.includes('vectorized')) {
      return NextResponse.json({
        success: false,
        errorCode: 'NON_EXTRACTABLE_PDF',
        message: 'This PDF contains text that cannot be extracted programmatically.',
        extractedChars: 0,
        fileSize: 0,
        confidence: { overall: 0 },
        solutions: [
          'Re-export your resume from Word or Google Docs as a standard PDF',
          'Download your resume from LinkedIn (Profile → More → Save to PDF)',
          'Use the "Paste Text Instead" option to manually input your resume'
        ],
        extractedData: null
      }, { status: 422 });
    }
    
    // Actual server error (not extraction failure)
    return NextResponse.json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal server error while processing file',
      userMessage: 'Something went wrong. Please try again or use the paste text option.',
      extractedData: null
    }, { status: 500 });
  }
}
