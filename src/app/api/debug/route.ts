import { getAvailableCompanySlugs, getCompanyConfig } from '@/lib/company-config';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public');
    const cognizantPath = path.join(publicPath, 'COGNIZANT');
    
    const debug = {
      publicPath,
      cognizantPath,
      publicExists: fs.existsSync(publicPath),
      cognizantExists: fs.existsSync(cognizantPath),
      availableSlugs: getAvailableCompanySlugs(),
      cognizantConfig: getCompanyConfig('cognizant'),
      publicContents: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
      cognizantContents: fs.existsSync(cognizantPath) ? fs.readdirSync(cognizantPath).slice(0, 5) : []
    };
    
    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
