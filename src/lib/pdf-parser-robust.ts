// Utility function for dynamic imports in Node.js environment
async function getParsingLibraries() {
  try {
    const mammoth = await import('mammoth');
    const pdfParse = await import('pdf-parse');
    
    return {
      mammoth: mammoth.default || mammoth,
      pdfParse: pdfParse.default || pdfParse,
      available: true
    };
  } catch (error) {
    console.warn('Failed to load parsing libraries:', error);
    
return {
      mammoth: null,
      pdfParse: null,
      available: false
    };
  }
}

export interface ParseResult {
  success: boolean;
  text?: string;
  error?: string;
  method?: string;
  extractedData?: {
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
    achievements: string[];
  };
}

// Clean extracted text by removing unwanted symbols and metadata
function cleanExtractedText(text: string): string {
  if (!text) {return '';}
  
  return text
    // Remove PDF metadata and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove common PDF artifacts
    .replace(/\f/g, '\n') // Form feed to newline
    .replace(/\r\n/g, '\n') // Windows line endings
    .replace(/\r/g, '\n') // Mac line endings
    // Remove repeated symbols
    .replace(/[•·∙‣⁃]{2,}/g, '• ')
    .replace(/[-–—]{3,}/g, '---')
    // Clean up spacing
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
    .replace(/^\s+|\s+$/g, '') // Trim start/end
    .replace(/\s{3,}/g, ' ') // Multiple spaces to single
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/(\d+)([a-zA-Z])/g, '$1 $2') // Space between numbers and letters
    .trim();
}

// Extract structured data from text using advanced regex patterns and section detection
function extractStructuredData(text: string) {
  const skills: string[] = [];
  const experience: string[] = [];
  const education: string[] = [];
  const projects: string[] = [];
  const achievements: string[] = [];

  // Split text into lines for better processing
  
  // Section headers detection - more comprehensive

  // Advanced skill extraction patterns
  const skillPatterns = [
    // Direct skill lists with common separators
    /(?:skills?|technologies?|tools?|languages?)[\s:]*(.+?)(?:\n\n|\n[A-Z]|$)/gis,
    // Programming languages specifically
    /(?:programming\s+languages?|languages?)[\s:]*([^\n]+)/gi,
    // Frameworks and libraries
    /(?:frameworks?|libraries)[\s:]*([^\n]+)/gi,
    // Technical expertise
    /(?:expertise|proficient|experienced?|familiar)\s+(?:in|with)[\s:]*([^\n]+)/gi,
    // Bullet point skills
    /[•·∙‣⁃]\s*([a-zA-Z][^•·∙‣⁃\n]+)/g,
  ];

  // Enhanced experience patterns
  const experiencePatterns = [
    // Standard date ranges with job titles
    /(\d{4}[-–/]\d{4}|\d{4}[-–/]present|present|\d{1,2}\/\d{4}\s*[-–]\s*\d{1,2}\/\d{4})[\s:]*([^\n]+)/gi,
    // Company and role patterns
    /(?:at\s+|@\s+)?([A-Z][a-zA-Z\s&.,]+)[\s,]*(?:as\s+|-)?\s*([A-Z][a-zA-Z\s]+)/g,
    // Job titles with companies
    /([A-Z][a-zA-Z\s]+?)\s+(?:at\s+|@\s+)([A-Z][a-zA-Z\s&.,]+)/g,
  ];

  // Enhanced education patterns
  const educationPatterns = [
    // Degree types with institutions
    /(?:bachelor|master|phd|doctorate|bs|ba|ms|ma|mba|btech|mtech|be|me|bsc|msc|phd)[\s\w]*(?:\s+(?:of|in)\s+[\w\s]+)?(?:\s+from\s+|,\s*)?([a-zA-Z\s.,&]+?)(?:\(?\d{4}\)?|$)/gi,
    // University/College patterns
    /(university|college|institute|school)\s+of\s+[\w\s]+|[\w\s]+\s+(?:university|college|institute)/gi,
    // Graduation years
    /graduated?\s+(?:in\s+)?(\d{4})|class\s+of\s+(\d{4})/gi,
  ];

  // Enhanced project patterns
  const projectPatterns = [
    // Project titles and descriptions
    /(?:project|built|developed|created|designed|implemented)[\s:]*([^\n]+)/gi,
    // GitHub/Portfolio links
    /(?:github|portfolio|demo)[\s:]*([^\n\s]+)/gi,
    // Technology stacks
    /(?:technologies?|tech\s+stack|built\s+with|using)[\s:]*([^\n]+)/gi,
  ];

  // Enhanced achievement patterns
  const achievementPatterns = [
    // Awards and recognitions
    /(?:award|recognition|honor|achievement|certification|certified)[\s:]*([^\n]+)/gi,
    // Performance metrics
    /(?:increased|improved|reduced|achieved|delivered)[\s:]*([^\n]+)/gi,
    // Quantifiable achievements
    /(\d+%|\d+x|\$\d+[km]?|\d+\+)\s*([^\n]+)/gi,
    // Additional achievement patterns
    /(?:received|won|earned|achieved|awarded)[:\s]*([^\n]+)/gi,
    /(?:certified|certification)[:\s]*([^\n]+)/gi,
  ];

  // Extract data using patterns
  const allPatterns = [
    { patterns: skillPatterns, target: skills },
    { patterns: experiencePatterns, target: experience },
    { patterns: educationPatterns, target: education },
    { patterns: projectPatterns, target: projects },
    { patterns: achievementPatterns, target: achievements },
  ];

  allPatterns.forEach(({ patterns, target }) => {
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(pattern, '$1').trim();
          // Filter out noise and ensure meaningful content
          if (cleaned && 
              cleaned.length > 3 && 
              cleaned.length < 200 && 
              !cleaned.match(/^[:\s\-•]+$/) &&
              !target.includes(cleaned)) {
            target.push(cleaned);
          }
        });
      }
    });
  });

  return {
    skills: skills.slice(0, 20), // Limit to prevent overwhelming
    experience: experience.slice(0, 10),
    education: education.slice(0, 5),
    projects: projects.slice(0, 10),
    achievements: achievements.slice(0, 10),
  };
}

// Primary method: pdf-parse with better error handling
async function parsePdfWithPdfParse(buffer: Buffer): Promise<ParseResult> {
  try {
    const { pdfParse } = await getParsingLibraries();
    
    if (!pdfParse) {
      throw new Error('pdf-parse library not available');
    }

    console.log('🔍 Parsing PDF with pdf-parse...');
    
    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
      version: 'v1.10.100'
    });
    
    if (!data || !data.text) {
      throw new Error('No text extracted from PDF');
    }

    let cleanText = cleanExtractedText(data.text);
    
    // If text is too short, it might be an image-based PDF
    if (cleanText.length < 50) {
      throw new Error(`Extracted text too short (${cleanText.length} chars), might be image-based PDF`);
    }

    console.log(`✅ pdf-parse extracted ${cleanText.length} characters from ${data.numpages || 'unknown'} pages`);

    return {
      success: true,
      text: cleanText,
      method: `pdf-parse (${data.numpages || 'unknown'} pages)`,
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('❌ pdf-parse failed:', errorMsg);
    throw error;
  }
}

// DOCX parser using mammoth with better error handling
async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    const { mammoth } = await getParsingLibraries();
    
    if (!mammoth) {
      throw new Error('mammoth library not available');
    }

    console.log('🔍 Parsing DOCX with mammoth...');
    
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result || !result.value) {
      throw new Error('No text extracted from DOCX');
    }

    const cleanText = cleanExtractedText(result.value);
    
    if (cleanText.length < 50) {
      throw new Error(`Extracted text too short (${cleanText.length} chars)`);
    }

    // Log any conversion messages
    if (result.messages && result.messages.length > 0) {
      console.log('📝 DOCX conversion notes:', result.messages.map(m => m.message).join(', '));
    }

    console.log(`✅ mammoth extracted ${cleanText.length} characters from DOCX`);

    return {
      success: true,
      text: cleanText,
      method: 'mammoth-docx',
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('❌ DOCX parsing failed:', errorMsg);
    throw error;
  }
}

// Fallback: Basic text extraction for edge cases
async function parseWithBasicExtraction(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log('🔍 Attempting basic text extraction...');
    
    // Convert buffer to string and try to extract readable text
    const rawText = buffer.toString('utf8');
    
    // Look for readable text patterns
    const textMatches = rawText.match(/[a-zA-Z\s]{10,}/g);
    
    if (!textMatches || textMatches.length === 0) {
      throw new Error('No readable text found in buffer');
    }

    const extractedText = textMatches
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanText = cleanExtractedText(extractedText);
    
    if (cleanText.length < 30) {
      throw new Error(`Extracted text too short (${cleanText.length} chars)`);
    }

    console.log(`✅ Basic extraction found ${cleanText.length} characters`);

    return {
      success: true,
      text: cleanText,
      method: 'basic-text-extraction',
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn('❌ Basic extraction failed:', errorMsg);
    throw error;
  }
}

// Main function with comprehensive fallback chain
export async function parsePdfWithFallbacks(file: File): Promise<ParseResult> {
  console.log(`📄 Starting to parse file: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file buffer');
    }

    // Handle DOCX files
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('🔍 Detected DOCX file, parsing with Mammoth...');
      
return await parseDocx(buffer);
    }

    // Handle PDF files with comprehensive fallback chain
    const methods = [
      { 
        name: 'pdf-parse', 
        fn: parsePdfWithPdfParse,
        description: 'Primary PDF text extraction using pdf-parse'
      },
      { 
        name: 'basic-extraction', 
        fn: parseWithBasicExtraction,
        description: 'Basic text pattern extraction'
      },
    ];

    const errors: string[] = [];

    for (const method of methods) {
      try {
        console.log(`🔄 Attempting ${method.description}...`);
        const result = await method.fn(buffer);
        console.log(`✅ Success with ${method.name}! Extracted ${result.text?.length || 0} characters`);
        
return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn(`❌ ${method.name} failed: ${errorMsg}`);
        errors.push(`${method.name}: ${errorMsg}`);
        continue;
      }
    }

    // If all methods failed
    const combinedError = `All parsing methods failed:\n${errors.join('\n')}`;
    console.error('💥 All parsing methods failed:', combinedError);
    
    return {
      success: false,
      error: combinedError,
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('💥 Critical error during parsing:', errorMsg);
    
    return {
      success: false,
      error: `Critical parsing error: ${errorMsg}`,
    };
  }
}
