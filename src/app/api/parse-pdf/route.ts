import { convertToLegacyFormat, deterministicParser } from '@/lib/pdf-parser-deterministic';
import { NextRequest, NextResponse } from 'next/server';

// Multi-layer PDF text extraction function
async function extractTextFromFile(file: File): Promise<string> {
  console.log(`🔄 Extracting text from ${file.type} file...`);
  
  try {
    if (file.type === 'application/pdf') {
      return await extractFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractFromDOCX(file);
    } else {
      // Fallback for text-based files
      return await file.text();
    }
  } catch (error) {
    console.error('❌ Text extraction failed:', error);
    throw new Error('Failed to extract text from file');
  }
}

async function extractFromPDF(file: File): Promise<string> {
  try {
    // Try pdf-parse first (most reliable for text-based PDFs)
    console.log('📖 Attempting pdf-parse extraction...');
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await pdfParse(Buffer.from(arrayBuffer));
    
    if (result.text && result.text.length > 100) {
      console.log('✅ pdf-parse successful');

      return cleanExtractedText(result.text);
    }
  } catch (error) {
    console.warn('⚠️ pdf-parse failed:', error);
  }

  try {
    // Fallback to pdfjs-dist
    console.log('📖 Attempting pdfjs-dist extraction...');
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source for Node.js environment
    if (typeof window === 'undefined') {
      // Use the correct worker path for pdfjs-dist
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    if (fullText.length > 50) {
      console.log('✅ pdfjs-dist successful');

      return cleanExtractedText(fullText);
    }
  } catch (error) {
    console.warn('⚠️ pdfjs-dist failed:', error);
  }

  throw new Error('All PDF extraction methods failed');
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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log(`🔍 Starting PDF extraction for: ${file.name} (${file.type})`);
    
    // Multi-layer extraction pipeline
    const extractedText = await extractTextFromFile(file);
    console.log(`📄 Extracted text length: ${extractedText.length} characters`);
    
    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json({
        success: false,
        error: 'Failed to extract text from PDF. Please ensure the file contains readable text.',
        extractedLength: extractedText.length
      }, { status: 400 });
    }
    
    // Parse with DETERMINISTIC parser - same input = same output ALWAYS
    const rawResult = deterministicParser.parse(extractedText);
    const parsedResume = convertToLegacyFormat(rawResult);
    
    console.log(`📊 Parsing Results: ${(parsedResume.confidence.overall * 100).toFixed(1)}% confidence, ${parsedResume.warnings.length} warnings`);
    console.log(`🔑 Parse ID: ${rawResult.parseId} (use this to verify determinism)`);

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
      extractionMethod: parsedResume.parseMethod,
      contact: parsedResume.extractedData.personalInfo,
      summary: parsedResume.extractedData.summary,
      // Return confidence as OBJECT with overall, skills, experience, projects
      confidence: {
        overall: parsedResume.confidence.overall,
        skills: parsedResume.confidence.sections?.skills || 0,
        experience: parsedResume.confidence.sections?.experience || 0,
        projects: parsedResume.confidence.sections?.projects || 0
      },
      warnings: parsedResume.warnings,
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
    
    return NextResponse.json(
      { error: 'Internal server error while processing file' },
      { status: 500 }
    );
  }
}
