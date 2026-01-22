import { unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

// Method 1: Using pdf2json
async function extractWithPdf2Json(buffer: Buffer): Promise<string> {
  const PDFParser = (await import('pdf2json')).default;
  
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataReady', (pdfData: { Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }> }) => {
      try {
        let text = '';
        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const r of textItem.R) {
                    if (r.T) {
                      text += decodeURIComponent(r.T) + ' ';
                    }
                  }
                }
              }
            }
            text += '\n\n';
          }
        }
        resolve(text.trim());
      } catch (e) {
        reject(e);
      }
    });
    
    pdfParser.on('pdfParser_dataError', (err: Error) => {
      reject(err);
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

// Method 2: Using pdf-parse as fallback
async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text || '';
}

// Method 3: Using unpdf as final fallback
async function extractWithUnpdf(uint8Array: Uint8Array): Promise<string> {
  const { extractText } = await import('unpdf');
  const { text } = await extractText(uint8Array, { mergePages: true });
  return text || '';
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log('Buffer size:', buffer.length);

    let extractedText = '';
    const errors: string[] = [];

    // Try Method 1: pdf2json (most reliable for complex fonts)
    try {
      console.log('Trying pdf2json...');
      extractedText = await extractWithPdf2Json(buffer);
      console.log('pdf2json extracted:', extractedText.length, 'characters');
    } catch (e) {
      console.log('pdf2json failed:', e);
      errors.push(`pdf2json: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // If pdf2json didn't get enough text, try pdf-parse
    if (extractedText.trim().length < 50) {
      try {
        console.log('Trying pdf-parse...');
        const pdfParseText = await extractWithPdfParse(buffer);
        console.log('pdf-parse extracted:', pdfParseText.length, 'characters');
        if (pdfParseText.trim().length > extractedText.trim().length) {
          extractedText = pdfParseText;
        }
      } catch (e) {
        console.log('pdf-parse failed:', e);
        errors.push(`pdf-parse: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }

    // If still not enough text, try unpdf
    if (extractedText.trim().length < 50) {
      try {
        console.log('Trying unpdf...');
        const unpdfText = await extractWithUnpdf(uint8Array);
        console.log('unpdf extracted:', unpdfText.length, 'characters');
        if (unpdfText.trim().length > extractedText.trim().length) {
          extractedText = unpdfText;
        }
      } catch (e) {
        console.log('unpdf failed:', e);
        errors.push(`unpdf: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }

    // Clean up extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    console.log('Final extracted text length:', extractedText.length);
    
    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        { 
          error: 'This PDF appears to be scanned or image-based. Please paste your resume text manually.',
          details: errors.length > 0 ? errors.join('; ') : undefined
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      text: extractedText,
      pages: 1,
      method: 'multi-fallback'
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to extract text from PDF: ${errorMessage}. Please paste your resume text manually.` },
      { status: 500 }
    );
  } finally {
    // Clean up temp file if created
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
