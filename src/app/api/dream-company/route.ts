import { COMPANY_CONFIG } from '@/lib/company-config';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Path to the public directory where company folders are located
    const publicPath = path.join(process.cwd(), 'public');
    
    // Check if public directory exists
    if (!fs.existsSync(publicPath)) {
      console.error('Public directory not found:', publicPath);
      
return NextResponse.json({ 
        error: 'Public directory not found',
        expectedPath: publicPath
      }, { status: 404 });
    }

    // Process each company using the centralized configuration
    const companies = Object.entries(COMPANY_CONFIG)
      .filter(([, config]) => {
        const companyPath = path.join(publicPath, config.folderName);
        const exists = fs.existsSync(companyPath);
        const isDirectory = exists && fs.lstatSync(companyPath).isDirectory();
        
        if (!exists) {
          console.warn(`Company folder not found: ${companyPath}`);
        } else if (!isDirectory) {
          console.warn(`Company path is not a directory: ${companyPath}`);
        }
        
        return exists && isDirectory;
      })
      .map(([slug, config]) => {
        const companyPath = path.join(publicPath, config.folderName);
        
        // Count total resources recursively in all subfolders with improved error handling
        function countPDFsRecursively(folderPath: string): number {
          let count = 0;
          try {
            const items = fs.readdirSync(folderPath, { withFileTypes: true });
            for (const item of items) {
              if (item.isFile() && item.name.toLowerCase().endsWith('.pdf')) {
                count++;
              } else if (item.isDirectory()) {
                const subFolderPath = path.join(folderPath, item.name);
                count += countPDFsRecursively(subFolderPath);
              }
            }
          } catch (error) {
            console.warn(`Error reading folder ${folderPath}:`, error);
            // Continue processing other folders
          }
          
          return count;
        }
        
        const resourceCount = countPDFsRecursively(companyPath);

        return {
          name: config.displayName,
          slug: slug,
          description: config.description,
          logoPath: `/company-logos/${slug}.png`,
          resourceCount: resourceCount,
          // Internal metadata
          _folderName: config.folderName
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log(`Successfully loaded ${companies.length} companies`);
    
return NextResponse.json(companies);
  } catch (error) {
    console.error('Unexpected error in dream-company list API:', error);
    
    return NextResponse.json({ 
      error: 'Failed to load companies', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Company descriptions are now handled in the centralized COMPANY_CONFIG
