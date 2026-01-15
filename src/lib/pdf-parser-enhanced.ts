import { , Education, Project, WorkExperience

export interface ParseConfidence {
  overall: number;
  skills: number;
  experience: number;
  projects: number;
  education: number;
  achievements: number;
  details: {
    sectionsFound: number;
    totalSections: number;
    textClarity: number;
    entityCount: number;
  };
}

export interface ParseResult {
  success: boolean;
  text: string;
  extractedData: ExtractedData;
  confidence: ParseConfidence;
  method: string;
  warnings: string[];
  error?: string;
}

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

// Multi-pass text extraction with fallback methods
async function extractText(file: File): Promise<{ text: string; method: string }> {
  let extractedText = '';
  let method = 'unknown';

  // Step 1: Try primary PDF parsing with pdf-parse
  if (file.type === 'application/pdf') {
    try {
      const { pdfParse } = await getParsingLibraries();
      if (pdfParse) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await pdfParse(new Uint8Array(arrayBuffer));
        extractedText = result.text;
        method = 'pdf-parse';
        console.log('✅ PDF extraction successful with pdf-parse');
      }
    } catch (error) {
      console.warn('pdf-parse failed, trying alternative method:', error);
    }
  }

  // Step 2: Try DOCX parsing with mammoth
  if (!extractedText && (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx'))) {
    try {
      const { mammoth } = await getParsingLibraries();
      if (mammoth) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
        method = 'mammoth';
        console.log('✅ DOCX extraction successful with mammoth');
      }
    } catch (error) {
      console.warn('Mammoth DOCX parsing failed:', error);
    }
  }

  // Step 3: Try PyMuPDF fallback (web-based implementation)
  if (!extractedText && file.type === 'application/pdf') {
    try {
      // Use pdfjs-dist as fallback
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // Limit to first 10 pages
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      extractedText = fullText;
      method = 'pdfjs-dist';
      console.log('✅ PDF extraction successful with pdfjs-dist fallback');
    } catch (error) {
      console.warn('pdfjs-dist fallback failed:', error);
    }
  }

  // Step 4: OCR fallback with Tesseract (for image-based PDFs)
  if (!extractedText || extractedText.length < 50) {
    try {
      // Note: Tesseract.js is available but may be resource intensive
      // Implementation would go here if needed
      console.warn('Text extraction yielded minimal content, OCR might be needed');
    } catch (error) {
      console.warn('OCR fallback failed:', error);
    }
  }

  return {
    text: cleanExtractedText(extractedText),
    method
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
    // Remove repeated symbols and cleanup
    .replace(/[-_=]{3,}/g, '') // Remove separator lines
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    .trim();
}

// Comprehensive skills extraction with enhanced dictionaries
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  // Comprehensive skill dictionaries (300+ skills)
  const skillDictionaries = {
    programming: [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 
      'scala', 'kotlin', 'swift', 'objective-c', 'dart', 'r', 'matlab', 'perl', 'shell', 'bash',
      'powershell', 'vba', 'cobol', 'fortran', 'assembly', 'lua', 'elixir', 'erlang', 'haskell', 'clojure'
    ],
    frontend: [
      'react', 'angular', 'vue.js', 'vue', 'svelte', 'html5', 'html', 'css3', 'css', 'sass', 'scss',
      'less', 'tailwind', 'bootstrap', 'material-ui', 'mui', 'chakra-ui', 'ant-design', 'semantic-ui',
      'jquery', 'backbone.js', 'ember.js', 'alpine.js', 'stimulus', 'lit', 'stencil', 'gatsby', 'next.js',
      'nuxt.js', 'gridsome', 'quasar', 'ionic', 'cordova', 'phonegap', 'react-native', 'flutter',
      'xamarin', 'progressive web app', 'pwa', 'single page application', 'spa', 'responsive design'
    ],
    backend: [
      'node.js', 'express.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
      'laravel', 'rails', 'ruby on rails', 'asp.net', 'asp.net core', '.net', 'nestjs', 'koa.js',
      'hapi.js', 'adonis.js', 'meteor.js', 'sails.js', 'strapi', 'firebase functions', 'serverless',
      'aws lambda', 'azure functions', 'google cloud functions', 'deno', 'bun', 'gin', 'echo',
      'fiber', 'beego', 'revel', 'iris', 'chi', 'gorilla', 'actix', 'rocket', 'warp', 'axum'
    ],
    database: [
      'mysql', 'postgresql', 'postgres', 'sqlite', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
      'dynamodb', 'couchdb', 'neo4j', 'influxdb', 'oracle', 'sql server', 'mariadb', 'firestore',
      'realm', 'couchbase', 'amazon rds', 'amazon aurora', 'google cloud sql', 'azure sql',
      'supabase', 'planetscale', 'fauna', 'upstash', 'prisma', 'typeorm', 'sequelize', 'mongoose',
      'knex.js', 'sql', 'nosql', 'acid', 'cap theorem', 'data modeling', 'database design'
    ],
    cloud: [
      'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud platform',
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'chef', 'puppet', 'vagrant',
      'jenkins', 'gitlab ci', 'github actions', 'circleci', 'travis ci', 'bamboo', 'teamcity',
      'ec2', 's3', 'rds', 'lambda', 'cloudformation', 'cloudwatch', 'route 53', 'cloudfront',
      'iam', 'vpc', 'elb', 'auto scaling', 'ecs', 'eks', 'fargate', 'azure devops', 'arm templates'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'jira', 'confluence', 'slack',
      'trello', 'asana', 'notion', 'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'postman',
      'insomnia', 'swagger', 'openapi', 'graphql', 'apollo', 'relay', 'prisma', 'hasura',
      'webpack', 'vite', 'parcel', 'rollup', 'babel', 'eslint', 'prettier', 'husky', 'lint-staged',
      'npm', 'yarn', 'pnpm', 'pip', 'conda', 'composer', 'maven', 'gradle', 'sbt', 'leiningen'
    ],
    testing: [
      'jest', 'mocha', 'chai', 'jasmine', 'karma', 'protractor', 'cypress', 'playwright', 'puppeteer',
      'selenium', 'webdriver', 'cucumber', 'behave', 'rspec', 'minitest', 'unittest', 'pytest',
      'nose', 'junit', 'testng', 'mockito', 'sinon', 'enzyme', 'react testing library',
      'vue test utils', 'angular testing utilities', 'storybook', 'chromatic', 'percy'
    ],
    methodologies: [
      'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'devops', 'ci/cd', 'continuous integration',
      'continuous deployment', 'test-driven development', 'tdd', 'behavior-driven development', 'bdd',
      'domain-driven design', 'ddd', 'microservices', 'monolithic', 'serverless', 'jamstack',
      'api-first', 'mobile-first', 'responsive design', 'progressive enhancement', 'graceful degradation'
    ],
    soft: [
      'leadership', 'team management', 'project management', 'communication', 'public speaking',
      'presentation', 'negotiation', 'problem solving', 'analytical thinking', 'critical thinking',
      'creativity', 'innovation', 'collaboration', 'teamwork', 'mentoring', 'coaching',
      'stakeholder management', 'client relations', 'customer service', 'time management',
      'prioritization', 'decision making', 'conflict resolution', 'adaptability', 'flexibility'
    ],
    specializations: [
      'machine learning', 'ml', 'artificial intelligence', 'ai', 'deep learning', 'neural networks',
      'computer vision', 'natural language processing', 'nlp', 'data science', 'data analysis',
      'data visualization', 'business intelligence', 'bi', 'big data', 'hadoop', 'spark', 'kafka',
      'cybersecurity', 'information security', 'penetration testing', 'ethical hacking',
      'blockchain', 'cryptocurrency', 'smart contracts', 'web3', 'defi', 'nft', 'solidity',
      'mobile development', 'ios development', 'android development', 'game development',
      'unity', 'unreal engine', 'ar', 'vr', 'augmented reality', 'virtual reality', 'iot'
    ]
  };

  // Extract skills from all categories
  Object.values(skillDictionaries).flat().forEach(skill => {
    const variations = [
      skill,
      skill.replace(/\./g, ''),
      skill.replace(/-/g, ' '),
      skill.replace(/\s+/g, ''),
      skill.replace(/js$/, 'javascript'),
      skill.replace(/\.js$/, ''),
    ];
    
    if (variations.some(variation => {
      const regex = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
return regex.test(lowerText);
    })) {
      // Properly capitalize skill names
      const capitalizedSkill = skill
        .split(/[-\s\.]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      foundSkills.add(capitalizedSkill);
    }
  });

  // Context-based skill detection
  const contextPatterns = [
    { pattern: /experience\s+(?:with|in)\s+([^,.\n]+)/gi, context: 'experience' },
    { pattern: /skilled?\s+(?:with|in)\s+([^,.\n]+)/gi, context: 'skill' },
    { pattern: /proficient\s+(?:with|in)\s+([^,.\n]+)/gi, context: 'proficiency' },
    { pattern: /familiar\s+(?:with|in)\s+([^,.\n]+)/gi, context: 'familiarity' },
    { pattern: /knowledge\s+(?:of|in)\s+([^,.\n]+)/gi, context: 'knowledge' },
    { pattern: /technologies?:\s*([^.\n]+)/gi, context: 'technologies' },
    { pattern: /stack:\s*([^.\n]+)/gi, context: 'tech-stack' },
    { pattern: /languages?:\s*([^.\n]+)/gi, context: 'languages' }
  ];

  contextPatterns.forEach(({ pattern }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const skillsText = match[1];
      const skillsArray = skillsText.split(/[,;|&]/).map(s => s.trim()).filter(s => s.length > 2);
      skillsArray.forEach(skill => {
        if (skill.length < 30 && !/^\d+$/.test(skill)) { // Filter out numbers and long descriptions
          foundSkills.add(skill);
        }
      });
    }
  });

  return Array.from(foundSkills).slice(0, 50); // Limit to prevent overwhelming
}

// Enhanced work experience extraction
function extractExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  const lines = text.split('\n');
  
  // Pattern matching for experience sections
  const experiencePatterns = [
    /(?:work\s+)?experience/i,
    /employment\s+history/i,
    /professional\s+experience/i,
    /career\s+history/i,
    /work\s+history/i
  ];

  // Find experience section
  let experienceStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (experiencePatterns.some(pattern => pattern.test(lines[i]))) {
      experienceStartIndex = i + 1;
      break;
    }
  }

  if (experienceStartIndex === -1) {return experiences;}

  // Extract experience entries
  const datePattern = /(\d{4}|\d{1,2}\/\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i;
  const companyJobPattern = /^([^|•\-]+?)(?:\s*[\-|]\s*([^|•\-]+?))?(?:\s*[\-|]\s*(.*?))?$/;

  for (let i = experienceStartIndex; i < lines.length && i < experienceStartIndex + 50; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 10) {continue;}

    // Look for job title and company combinations
    if (companyJobPattern.test(line)) {
      const match = line.match(companyJobPattern);
      if (match) {
        const part1 = match[1]?.trim() || '';
        const part2 = match[2]?.trim() || '';
        const part3 = match[3]?.trim() || '';

        // Try to identify job title vs company
        const isJobTitle = (text: string) => {
          const jobTitleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant', 'specialist', 'lead', 'senior', 'junior', 'intern'];
          
return jobTitleKeywords.some(keyword => text.toLowerCase().includes(keyword));
        };

        let jobTitle = '';
        let companyName = '';
        
        if (isJobTitle(part1) && part2) {
          jobTitle = part1;
          companyName = part2;
        } else if (part2 && isJobTitle(part2)) {
          jobTitle = part2;
          companyName = part1;
        } else {
          jobTitle = part1;
          companyName = part2 || 'Company Name Not Specified';
        }

        // Extract dates and responsibilities from surrounding lines
        let startDate = 'Not Specified';
        let endDate = 'Not Specified';
        const responsibilities: string[] = [];

        // Look for dates in current and next few lines
        for (let j = i; j < Math.min(lines.length, i + 5); j++) {
          const dateLine = lines[j];
          const dateMatch = dateLine.match(datePattern);
          if (dateMatch) {
            const dates = dateLine.match(/(\d{4}|\d{1,2}\/\d{4})/g);
            if (dates && dates.length >= 2) {
              startDate = dates[0];
              endDate = dates[1];
            } else if (dates && dates.length === 1) {
              if (dateLine.toLowerCase().includes('present') || dateLine.toLowerCase().includes('current')) {
                startDate = dates[0];
                endDate = 'Present';
              }
            }
            break;
          }
        }

        // Extract responsibilities (bullets, achievements)
        for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
          const respLine = lines[j].trim();
          if (!respLine) {break;}
          if (respLine.match(/^[•\-\*]/)) {
            responsibilities.push(respLine.replace(/^[•\-\*]\s*/, ''));
          }
        }

        if (jobTitle && companyName) {
          experiences.push({
            jobTitle,
            companyName,
            startDate,
            endDate,
            responsibilities,
            impactKeywords: extractImpactKeywords(responsibilities.join(' ')),
            duration: calculateDuration(startDate, endDate)
          });
        }
      }
    }
  }

  return experiences;
}

// Extract impact keywords from job descriptions
function extractImpactKeywords(text: string): string[] {
  const impactWords = [
    'achieved', 'improved', 'increased', 'decreased', 'reduced', 'optimized', 'enhanced', 'developed',
    'implemented', 'designed', 'created', 'built', 'launched', 'delivered', 'managed', 'led',
    'collaborated', 'coordinated', 'streamlined', 'automated', 'scaled', 'migrated', 'transformed'
  ];

  const found: string[] = [];
  const lowerText = text.toLowerCase();
  
  impactWords.forEach(word => {
    if (lowerText.includes(word)) {
      found.push(word);
    }
  });

  return found;
}

// Calculate duration between dates
function calculateDuration(startDate: string, endDate: string): string {
  if (startDate === 'Not Specified' || endDate === 'Not Specified') {
    return 'Duration not specified';
  }

  // Simple duration calculation (can be enhanced)
  const startYear = parseInt(startDate.match(/\d{4}/)?.[0] || '0');
  const endYear = endDate === 'Present' ? new Date().getFullYear() : parseInt(endDate.match(/\d{4}/)?.[0] || '0');
  
  if (startYear && endYear) {
    const years = endYear - startYear;
    if (years === 0) {return 'Less than 1 year';}
    
return years === 1 ? '1 year' : `${years} years`;
  }

  return 'Duration not calculated';
}

// Extract projects with comprehensive parsing
function extractProjects(text: string): Project[] {
  const projects: Project[] = [];
  const lines = text.split('\n');
  
  // Find projects section
  const projectPatterns = [
    /projects?/i,
    /personal\s+projects?/i,
    /side\s+projects?/i,
    /portfolio/i,
    /key\s+projects?/i
  ];

  let projectStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (projectPatterns.some(pattern => pattern.test(lines[i]))) {
      projectStartIndex = i + 1;
      break;
    }
  }

  if (projectStartIndex === -1) {return projects;}

  // Extract project entries
  for (let i = projectStartIndex; i < lines.length && i < projectStartIndex + 30; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 5) {continue;}

    // Look for project names (usually bold or emphasized)
    const projectNamePattern = /^([^•\-\*\n]+?)(?:\s*[\-|:]\s*(.*))?$/;
    const match = line.match(projectNamePattern);
    
    if (match) {
      const projectName = match[1].trim();
      
      if (projectName && projectName.length > 3) {
        const techStack: string[] = [];
        const outcomes: string[] = [];
        const metrics: string[] = [];
        let description = match[2] || '';

        // Extract tech stack and details from following lines
        for (let j = i + 1; j < Math.min(lines.length, i + 8); j++) {
          const detailLine = lines[j].trim();
          if (!detailLine) {break;}

          // Tech stack detection
          if (detailLine.toLowerCase().includes('tech') || 
              detailLine.toLowerCase().includes('stack') ||
              detailLine.toLowerCase().includes('built with') ||
              detailLine.toLowerCase().includes('technologies')) {
            const techMatch = detailLine.match(/(?:tech|stack|built\s+with|technologies?):\s*(.+)/i);
            if (techMatch) {
              techStack.push(...techMatch[1].split(/[,;|]/).map(tech => tech.trim()).filter(t => t));
            }
          }

          // Outcome detection
          if (detailLine.match(/^[•\-\*]/)) {
            const outcome = detailLine.replace(/^[•\-\*]\s*/, '');
            outcomes.push(outcome);
            
            // Extract metrics from outcomes
            const metricMatch = outcome.match(/(\d+(?:\.\d+)?%?|\d+\+?\s*(?:users?|customers?|requests?|mb|gb|ms|seconds?))/gi);
            if (metricMatch) {
              metrics.push(...metricMatch);
            }
          }

          // Description continuation
          if (!detailLine.match(/^[•\-\*]/) && detailLine.length > 10) {
            description += ' ' + detailLine;
          }
        }

        projects.push({
          projectName,
          techStack: techStack.length > 0 ? techStack : ['Technology not specified'],
          outcomes,
          metrics,
          description: description.trim() || 'Description not provided',
          link: extractProjectLink(description)
        });
      }
    }
  }

  return projects;
}

// Extract project links (GitHub, live demo, etc.)
function extractProjectLink(text: string): string | undefined {
  const linkPattern = /(https?:\/\/[^\s]+|github\.com\/[^\s]+|gitlab\.com\/[^\s]+|bitbucket\.org\/[^\s]+)/gi;
  const match = text.match(linkPattern);
  
return match ? match[0] : undefined;
}

// Extract education information
function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const lines = text.split('\n');
  
  // Find education section
  const educationPatterns = [
    /education/i,
    /academic/i,
    /qualification/i,
    /degree/i
  ];

  let educationStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (educationPatterns.some(pattern => pattern.test(lines[i]))) {
      educationStartIndex = i + 1;
      break;
    }
  }

  if (educationStartIndex === -1) {return education;}

  // Common degree patterns
  const degreePatterns = [
    /bachelor(?:'?s)?|b\.?(?:tech|sc|com|a|e|s)?/i,
    /master(?:'?s)?|m\.?(?:tech|sc|com|a|e|s|ba)?/i,
    /phd|doctorate|ph\.?d/i,
    /diploma/i,
    /certificate/i
  ];

  for (let i = educationStartIndex; i < lines.length && i < educationStartIndex + 20; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 10) {continue;}

    // Check if line contains degree information
    if (degreePatterns.some(pattern => pattern.test(line))) {
      let degree = '';
      let college = '';
      let year = '';
      let cgpa = '';

      // Extract degree
      const degreeMatch = line.match(/(bachelor(?:'?s)?.*?|master(?:'?s)?.*?|phd.*?|diploma.*?|certificate.*?)(?:\s+(?:in|of)\s+([^,\-\n]+))?/i);
      if (degreeMatch) {
        degree = degreeMatch[0];
      }

      // Extract year
      const yearMatch = line.match(/(?:19|20)\d{2}/);
      if (yearMatch) {
        year = yearMatch[0];
      }

      // Extract CGPA/GPA
      const cgpaMatch = line.match(/(?:cgpa|gpa):\s*(\d+(?:\.\d+)?)/i) || line.match(/(\d+\.\d+)\s*\/\s*(?:4|10)/);
      if (cgpaMatch) {
        cgpa = cgpaMatch[1];
      }

      // Extract college/university (usually on next line or same line after dash)
      if (line.includes('-') || line.includes('|')) {
        const parts = line.split(/[\-|]/);
        if (parts.length > 1) {
          college = parts[1].trim();
        }
      } else {
        // Look in next line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !degreePatterns.some(pattern => pattern.test(nextLine))) {
            college = nextLine;
          }
        }
      }

      education.push({
        degree: degree || 'Degree not specified',
        college: college || 'Institution not specified',
        year: year || 'Year not specified',
        cgpa
      });
    }
  }

  return education;
}

// Extract achievements and certifications
function extractAchievements(text: string): string[] {
  const achievements: string[] = [];
  const lines = text.split('\n');
  
  const achievementPatterns = [
    /achievements?/i,
    /accomplishments?/i,
    /awards?/i,
    /honors?/i,
    /recognition/i
  ];

  let achievementStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (achievementPatterns.some(pattern => pattern.test(lines[i]))) {
      achievementStartIndex = i + 1;
      break;
    }
  }

  if (achievementStartIndex === -1) {return achievements;}

  for (let i = achievementStartIndex; i < lines.length && i < achievementStartIndex + 15; i++) {
    const line = lines[i].trim();
    if (!line) {continue;}

    if (line.match(/^[•\-\*]/) || line.length > 10) {
      const achievement = line.replace(/^[•\-\*]\s*/, '');
      if (achievement.length > 5) {
        achievements.push(achievement);
      }
    }
  }

  return achievements;
}

// Extract certifications
function extractCertifications(text: string): string[] {
  const certifications: string[] = [];
  const lines = text.split('\n');
  
  const certificationPatterns = [
    /certifications?/i,
    /certificates?/i,
    /licenses?/i,
    /credentials?/i
  ];

  let certificationStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (certificationPatterns.some(pattern => pattern.test(lines[i]))) {
      certificationStartIndex = i + 1;
      break;
    }
  }

  if (certificationStartIndex === -1) {return certifications;}

  for (let i = certificationStartIndex; i < lines.length && i < certificationStartIndex + 15; i++) {
    const line = lines[i].trim();
    if (!line) {continue;}

    certifications.push(line.replace(/^[•\-\*]\s*/, ''));
  }

  return certifications;
}

// Extract contact information
function extractContactInfo(text: string): ContactInfo {
  const contact: ContactInfo = {};
  
  // Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {contact.email = emailMatch[0];}

  // Phone extraction
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?(?:\d{3})\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {contact.phone = phoneMatch[0];}

  // LinkedIn extraction
  const linkedinMatch = text.match(/linkedin\.com\/in\/[^\s]+/i);
  if (linkedinMatch) {contact.linkedin = linkedinMatch[0];}

  // GitHub extraction  
  const githubMatch = text.match(/github\.com\/[^\s]+/i);
  if (githubMatch) {contact.github = githubMatch[0];}

  // Name extraction (first non-empty line or line before email)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  if (lines.length > 0 && lines[0].length < 50 && !lines[0].includes('@')) {
    contact.name = lines[0];
  }

  return contact;
}

// Extract summary/objective
function extractSummary(text: string): string {
  const summaryPatterns = [
    /(?:professional\s+)?summary/i,
    /objective/i,
    /profile/i,
    /about(?:\s+me)?/i
  ];

  const lines = text.split('\n');
  let summaryStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (summaryPatterns.some(pattern => pattern.test(lines[i]))) {
      summaryStartIndex = i + 1;
      break;
    }
  }

  if (summaryStartIndex === -1) {
    // Use first few meaningful lines as summary
    const meaningfulLines = lines.slice(0, 10).filter(line => 
      line.trim().length > 50 && 
      !line.includes('@') && 
      !line.match(/\d{4}/)
    );
    
return meaningfulLines.slice(0, 3).join(' ').substring(0, 300) + '...';
  }

  let summary = '';
  for (let i = summaryStartIndex; i < lines.length && i < summaryStartIndex + 10; i++) {
    const line = lines[i].trim();
    if (!line) {break;}
    summary += line + ' ';
  }

  return summary.trim();
}

// Calculate comprehensive parsing confidence
function calculateParseConfidence(extractedData: ExtractedData, text: string): ParseConfidence {
  const sectionsFound = [
    extractedData.skills.length > 0,
    extractedData.experience.length > 0,
    extractedData.education.length > 0,
    extractedData.projects.length > 0,
    extractedData.achievements.length > 0,
    extractedData.contact.email !== undefined
  ].filter(Boolean).length;

  const totalSections = 6;
  const entityCount = extractedData.skills.length + 
                     extractedData.experience.length + 
                     extractedData.education.length + 
                     extractedData.projects.length + 
                     extractedData.achievements.length;

  const textClarity = Math.min(100, (text.length / 1000) * 20); // Text length indicator
  const sectionCompleteness = (sectionsFound / totalSections) * 100;
  
  const skillsConfidence = Math.min(100, (extractedData.skills.length / 10) * 100);
  const experienceConfidence = Math.min(100, (extractedData.experience.length / 3) * 100);
  const projectsConfidence = Math.min(100, (extractedData.projects.length / 2) * 100);
  const educationConfidence = extractedData.education.length > 0 ? 100 : 0;
  const achievementsConfidence = Math.min(100, (extractedData.achievements.length / 3) * 100);

  const overall = (
    skillsConfidence * 0.3 + 
    experienceConfidence * 0.25 + 
    projectsConfidence * 0.2 + 
    educationConfidence * 0.15 + 
    achievementsConfidence * 0.1
  );

  return {
    overall: Math.round(overall),
    skills: Math.round(skillsConfidence),
    experience: Math.round(experienceConfidence),
    projects: Math.round(projectsConfidence),
    education: Math.round(educationConfidence),
    achievements: Math.round(achievementsConfidence),
    details: {
      sectionsFound,
      totalSections,
      textClarity: Math.round(textClarity),
      entityCount
    }
  };
}

// Main parsing function
export async function parseResumeEnhanced(file: File): Promise<ParseResult> {
  const warnings: string[] = [];
  
  try {
    // Step 1: Extract text using multi-pass approach
    const { text, method } = await extractText(file);
    
    if (!text || text.length < 100) {
      return {
        success: false,
        text: '',
        extractedData: getEmptyExtractedData(),
        confidence: getZeroConfidence(),
        method,
        warnings: ['Text extraction failed or yielded minimal content'],
        error: 'Unable to extract readable text from the document'
      };
    }

    // Step 2: Extract all data components
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);
    const projects = extractProjects(text);
    const achievements = extractAchievements(text);
    const certifications = extractCertifications(text);
    const contact = extractContactInfo(text);
    const summary = extractSummary(text);

    const extractedData: ExtractedData = {
      skills,
      experience,
      education,
      projects,
      achievements,
      certifications,
      contact,
      summary
    };

    // Step 3: Calculate confidence
    const confidence = calculateParseConfidence(extractedData, text);

    // Step 4: Add warnings based on confidence
    if (confidence.overall < 30) {
      warnings.push('Low parsing confidence. Consider uploading a clearer document.');
    }
    if (skills.length === 0) {
      warnings.push('No skills detected. Ensure your resume clearly lists your technical skills.');
    }
    if (experience.length === 0) {
      warnings.push('No work experience detected. Check if your experience section is clearly formatted.');
    }

    return {
      success: true,
      text,
      extractedData,
      confidence,
      method,
      warnings
    };

  } catch (error) {
    console.error('Enhanced parsing failed:', error);
    
return {
      success: false,
      text: '',
      extractedData: getEmptyExtractedData(),
      confidence: getZeroConfidence(),
      method: 'error',
      warnings: [],
      error: error instanceof Error ? error.message : 'Unknown parsing error'
    };
  }
}

// Helper functions for empty states
function getEmptyExtractedData(): ExtractedData {
  return {
    skills: [],
    experience: [],
    education: [],
    projects: [],
    achievements: [],
    certifications: [],
    contact: {},
    summary: ''
  };
}

function getZeroConfidence(): ParseConfidence {
  return {
    overall: 0,
    skills: 0,
    experience: 0,
    projects: 0,
    education: 0,
    achievements: 0,
    details: {
      sectionsFound: 0,
      totalSections: 6,
      textClarity: 0,
      entityCount: 0
    }
  };
}
