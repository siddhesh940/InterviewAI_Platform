import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Path to the InterviewPrep folder in the public directory
    const interviewPrepPath = path.join(process.cwd(), 'public', 'InterviewPrep');
    
    // Check if directory exists
    if (!fs.existsSync(interviewPrepPath)) {
      return NextResponse.json({ error: 'Interview resources directory not found' }, { status: 404 });
    }

    // Read directory contents
    const files = fs.readdirSync(interviewPrepPath);
    
    // Filter for PDF files only
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        name: file,
        displayName: formatDisplayName(file),
        path: `/InterviewPrep/${file}`
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error('Error reading interview resources:', error);
    
return NextResponse.json({ error: 'Failed to load interview resources' }, { status: 500 });
  }
}

function formatDisplayName(filename: string): string {
  // Remove .pdf extension and clean up the name
  let displayName = filename.replace(/\.pdf$/i, '');
  
  // Replace underscores and hyphens with spaces
  displayName = displayName.replace(/[_-]/g, ' ');
  
  // Remove numbers at the beginning (like "1.Java" -> "Java")
  displayName = displayName.replace(/^\d+\./, '');
  
  // Capitalize first letter of each word
  displayName = displayName.replace(/\b\w/g, (char) => char.toUpperCase());
  
  // Clean up common patterns
  displayName = displayName
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\(\d+pgs\)/i, '') // Remove page counts like (61pgs)
    .replace(/\s*\(online study4u\)/i, '') // Remove specific patterns
    .trim();
  
  return displayName;
}
