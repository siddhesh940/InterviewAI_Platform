const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createWorker } = require('tesseract.js');

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
    .trim();
}

// Extract structured data from text using regex patterns
function extractStructuredData(text: string) {
  const skills: string[] = [];
  const experience: string[] = [];
  const education: string[] = [];
  const projects: string[] = [];
  const achievements: string[] = [];

  // Common skill keywords
  const skillPatterns = [
    /(?:skills?|technologies?|tools?|languages?)[:\s]*([^\n]+)/gi,
    /(?:proficient|experienced?|familiar)\s+(?:in|with)[:\s]*([^\n]+)/gi,
  ];

  // Experience patterns
  const experiencePatterns = [
    /(?:experience|work|employment|career)[:\s]*([^\n]+)/gi,
    /(?:\d{4}[-–]\d{4}|\d{4}[-–]present|present)[\s:]*([^\n]+)/gi,
  ];

  // Education patterns
  const educationPatterns = [
    /(?:education|degree|university|college|school)[:\s]*([^\n]+)/gi,
    /(?:bachelor|master|phd|bs|ba|ms|ma|mba|btech|mtech)[^\n]*/gi,
  ];

  // Project patterns
  const projectPatterns = [
    /(?:projects?|portfolio)[:\s]*([^\n]+)/gi,
    /(?:built|developed|created|designed)[:\s]*([^\n]+)/gi,
  ];

  // Achievement patterns
  const achievementPatterns = [
    /(?:achievements?|awards?|honors?|accomplishments?)[:\s]*([^\n]+)/gi,
    /(?:received|won|earned|achieved)[:\s]*([^\n]+)/gi,
  ];

  // Extract data using patterns
  [skillPatterns, experiencePatterns, educationPatterns, projectPatterns, achievementPatterns].forEach((patterns, index) => {
    const targetArray = [skills, experience, education, projects, achievements][index];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(pattern, '$1').trim();
          if (cleaned && cleaned.length > 3 && cleaned.length < 200) {
            targetArray.push(cleaned);
          }
        });
      }
    });
  });

  return {
    skills: [...new Set(skills)].slice(0, 20), // Remove duplicates, limit to 20
    experience: [...new Set(experience)].slice(0, 10),
    education: [...new Set(education)].slice(0, 5),
    projects: [...new Set(projects)].slice(0, 10),
    achievements: [...new Set(achievements)].slice(0, 10),
  };
}

// Primary method: pdf-parse (Node-based)
async function parsePdfWithPdfParse(buffer: Buffer): Promise<ParseResult> {
  try {
    const data = await pdfParse(buffer, {
      // Options to handle various PDF types
      max: 0, // Parse all pages
      version: 'v1.10.100'
    });
    
    let cleanText = cleanExtractedText(data.text);
    
    // If text is too short, it might be an image-based PDF
    if (cleanText.length < 50) {
      throw new Error('Extracted text too short, might be image-based PDF');
    }

    // Additional cleaning for common PDF issues
    cleanText = cleanText
      .replace(/\s{3,}/g, ' ') // Multiple spaces to single
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/(\d+)([a-zA-Z])/g, '$1 $2') // Space between numbers and letters
      .trim();

    return {
      success: true,
      text: cleanText,
      method: 'pdf-parse',
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    console.warn('pdf-parse failed:', error);
    throw error;
  }
}

// Secondary fallback: pdfjs-dist
async function parsePdfWithPdfJs(buffer: Buffer): Promise<ParseResult> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    const cleanText = cleanExtractedText(fullText);
    
    if (cleanText.length < 50) {
      throw new Error('Extracted text too short, might be image-based PDF');
    }

    return {
      success: true,
      text: cleanText,
      method: 'pdfjs-dist',
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    console.warn('pdfjs-dist failed:', error);
    throw error;
  }
}

// OCR fallback for image-based PDFs using Tesseract.js
async function parsePdfWithOCR(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log('Attempting OCR parsing...');
    
    const worker = await createWorker('eng', 1, {
      logger: m => console.log('OCR:', m)
    });
    
    // Try to OCR the buffer directly (works for image files)
    const { data: { text, confidence } } = await worker.recognize(buffer);
    
    await worker.terminate();

    // Check confidence level
    if (confidence < 60) {
      throw new Error(`OCR confidence too low: ${confidence}%`);
    }

    const cleanText = cleanExtractedText(text);
    
    if (cleanText.length < 30) {
      throw new Error('OCR produced insufficient text');
    }

    console.log(`OCR success with ${confidence}% confidence`);

    return {
      success: true,
      text: cleanText,
      method: `tesseract-ocr (${confidence}% confidence)`,
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    console.warn('OCR failed:', error);
    throw error;
  }
}

// DOCX parser using mammoth
async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const cleanText = cleanExtractedText(result.value);
    
    if (cleanText.length < 50) {
      throw new Error('Extracted text too short');
    }

    return {
      success: true,
      text: cleanText,
      method: 'mammoth-docx',
      extractedData: extractStructuredData(cleanText),
    };
  } catch (error) {
    console.warn('DOCX parsing failed:', error);
    throw error;
  }
}

// Main function with fallback chain
export async function parsePdfWithFallbacks(file: File): Promise<ParseResult> {
  console.log(`📄 Starting to parse file: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;

  // Handle DOCX files
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await parseDocx(buffer);
  }

  // Handle PDF files with fallback chain
  const methods = [
    { name: 'pdf-parse', fn: parsePdfWithPdfParse },
    { name: 'pdfjs-dist', fn: parsePdfWithPdfJs },
    { name: 'tesseract-ocr', fn: parsePdfWithOCR },
  ];

  let lastError: Error | null = null;

  for (const method of methods) {
    try {
      console.log(`🔄 Attempting PDF parsing with ${method.name}...`);
      const result = await method.fn(buffer);
      console.log(`✅ Success with ${method.name}! Extracted ${result.text?.length || 0} characters`);
      
return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(`❌ ${method.name} failed: ${errorMsg}`);
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
  }

  // If all methods failed
  return {
    success: false,
    error: `All parsing methods failed. Last error: ${lastError?.message || 'Unknown error'}`,
  };
}
