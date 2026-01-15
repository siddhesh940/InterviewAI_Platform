import { parsePdfWithFallbacks } from './pdf-parser-robust';

// Comprehensive skill dictionary for accurate extraction
const SKILL_DICTIONARY = {
  programming: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'SCSS', 'Sass',
    'Node.js', 'Express', 'React', 'Vue', 'Angular', 'Svelte', 'jQuery', 'Bootstrap',
    'Tailwind', 'Next.js', 'Nuxt.js', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails'
  ],
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite',
    'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Elasticsearch'
  ],
  cloud: [
    'AWS', 'Azure', 'Google Cloud', 'GCP', 'Heroku', 'Netlify', 'Vercel', 'DigitalOcean',
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Trello', 'Slack', 'VS Code',
    'IntelliJ', 'Eclipse', 'Postman', 'Figma', 'Adobe XD', 'Photoshop', 'Sketch'
  ],
  frameworks: [
    'React Native', 'Flutter', 'Ionic', 'Unity', 'TensorFlow', 'PyTorch', 'Pandas',
    'NumPy', 'Scikit-learn', 'Keras', 'Apache Spark', 'Hadoop', 'Kafka'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management',
    'Agile', 'Scrum', 'Time Management', 'Critical Thinking', 'Mentoring', 'Public Speaking'
  ]
};

// Company dictionary for better experience extraction
const COMPANY_PATTERNS = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Facebook', 'Netflix', 'Tesla',
  'Uber', 'Airbnb', 'LinkedIn', 'Twitter', 'Spotify', 'Slack', 'Zoom', 'Adobe',
  'IBM', 'Intel', 'NVIDIA', 'Oracle', 'Salesforce', 'PayPal', 'eBay', 'Yahoo',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant', 'HCL', 'Tech Mahindra',
  'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'BYJU\'S', 'Ola', 'PhonePe', 'Razorpay'
];

// Job title patterns
const JOB_TITLE_PATTERNS = [
  'Software Engineer', 'Developer', 'Full Stack', 'Frontend', 'Backend', 'DevOps',
  'Data Scientist', 'Machine Learning', 'AI Engineer', 'Product Manager', 'UI/UX',
  'Quality Assurance', 'Tester', 'Architect', 'Lead', 'Senior', 'Junior', 'Intern',
  'Analyst', 'Consultant', 'Specialist', 'Manager', 'Director', 'CTO', 'VP'
];

export interface AdvancedParseResult {
  success: boolean;
  text?: string;
  error?: string;
  method?: string;
  extractedData: {
    skills: string[];
    experience: WorkExperience[];
    education: Education[];
    projects: Project[];
    achievements: string[];
    contact: ContactInfo;
    summary: string;
  };
  confidence: {
    overall: number;
    skills: number;
    experience: number;
    projects: number;
  };
}

interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
  startDate?: string;
  endDate?: string;
}

interface Education {
  degree: string;
  college: string;
  year: string;
  cgpa?: string;
  major?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  duration?: string;
}

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

// Advanced text cleaning and preprocessing
function advancedTextCleaning(text: string): string {
  return text
    // Remove PDF artifacts
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/\f/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Fix common OCR errors
    .replace(/\b0\b/g, 'O') // Zero to O
    .replace(/\bl\b/g, 'I') // lowercase l to I
    .replace(/\brn\b/g, 'm') // rn to m
    // Clean spacing
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Fix concatenated words
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d+)([a-zA-Z])/g, '$1 $2')
    .trim();
}

// Enhanced skill extraction with improved accuracy
function extractSkillsAdvanced(text: string): string[] {
  const skills = new Set<string>();
  const textLower = text.toLowerCase();
  
  // Search for exact matches in skill dictionary with word boundaries
  Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
    const skillLower = skill.toLowerCase();
    const escapedSkill = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(textLower)) {
      skills.add(skill);
    }
  });
  
  // Enhanced section-aware skill extraction
  const skillSectionPatterns = [
    // Technical skills section
    /(?:technical\s+)?(?:skills?|technologies?|tools?|languages?|expertise|competencies)[\s:]*\n?([^]*?)(?:\n\s*\n|experience|education|projects|employment|work|achievements?|certifications?|$)/gi,
    // Programming languages section
    /(?:programming|coding)\s+(?:languages?|skills?)[\s:]*([^\n]+)/gi,
    // Frameworks section
    /(?:frameworks?|libraries|platforms?)[\s:]*([^\n]+)/gi,
    // Database section  
    /(?:databases?|dbms)[\s:]*([^\n]+)/gi,
    // Tools section
    /(?:tools?|software|applications?)[\s:]*([^\n]+)/gi,
  ];
  
  skillSectionPatterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const sectionContent = match[1];
      
      // Extract skills from section content
      const skillItems = sectionContent
        .split(/[,;|\n•·∙‣⁃-]/)
        .map(item => item.trim())
        .filter(item => item.length > 1 && item.length < 50);
      
      skillItems.forEach(item => {
        const cleanItem = item.replace(/^\W+|\W+$|[()]/g, '').trim();
        if (cleanItem.length < 2) return;
        
        // Check against skill dictionary
        Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
          const skillLower = skill.toLowerCase();
          const itemLower = cleanItem.toLowerCase();
          
          if (itemLower === skillLower || 
              itemLower.includes(skillLower) || 
              skillLower.includes(itemLower)) {
            skills.add(skill);
          }
        });
      });
    }
  });
  
  // Additional context-aware patterns
  const contextPatterns = [
    /(?:proficient|experienced?|familiar|skilled|expert)\s+(?:in|with|at)[\s:]*([^\n.;]+)/gi,
    /(?:worked\s+with|used|utilizing|implemented|developed\s+with)[\s:]*([^\n.;]+)/gi,
    /[•·∙‣⁃-]\s*([A-Za-z][A-Za-z0-9+#.\s/-]{2,25})(?:\s*[,;]|\s*$|\s*\n)/g,
  ];
  
  contextPatterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const content = match[1];
      
      // Process content for skills
      const potentialSkills = content.split(/[,;&|]/).map(s => s.trim());
      
      potentialSkills.forEach(potentialSkill => {
        const cleanSkill = potentialSkill.replace(/^\W+|\W+$/g, '').trim();
        
        Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
          if (cleanSkill.toLowerCase().includes(skill.toLowerCase())) {
            skills.add(skill);
          }
        });
      });
    }
  });
  
  // Add common abbreviations and variations
  const skillVariations = {
    'js': 'JavaScript',
    'ts': 'TypeScript', 
    'py': 'Python',
    'reactjs': 'React',
    'nodejs': 'Node.js',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'aws': 'AWS',
    'gcp': 'Google Cloud',
    'k8s': 'Kubernetes',
    'api': 'REST API'
  };
  
  Object.entries(skillVariations).forEach(([abbrev, fullName]) => {
    const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
    if (regex.test(textLower)) {
      skills.add(fullName);
    }
  });
  
  return Array.from(skills).slice(0, 50); // Limit to top 50 skills
}

// Enhanced experience extraction
function extractExperienceAdvanced(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  const lines = text.split('\n');
  
  // Look for date patterns
  const datePattern = /(\d{4}[-–/]\d{4}|\d{4}[-–/]present|present|\d{1,2}\/\d{4}\s*[-–]\s*\d{1,2}\/\d{4}|\w+\s+\d{4}\s*[-–]\s*\w+\s+\d{4})/gi;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const dateMatch = line.match(datePattern);
    
    if (dateMatch) {
      // Found a date, look for company/role nearby
      let role = '';
      let company = '';
      const bullets: string[] = [];
      
      // Check lines around for job titles and companies
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 3); j++) {
        const nearbyLine = lines[j].trim();
        
        // Check for company names
        COMPANY_PATTERNS.forEach(companyName => {
          if (nearbyLine.toLowerCase().includes(companyName.toLowerCase()) && !company) {
            company = companyName;
          }
        });
        
        // Check for job titles
        JOB_TITLE_PATTERNS.forEach(title => {
          if (nearbyLine.toLowerCase().includes(title.toLowerCase()) && !role) {
            role = nearbyLine;
          }
        });
      }
      
      // Extract bullet points (responsibilities)
      for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
        const bulletLine = lines[j].trim();
        if (bulletLine.match(/^[•·∙‣⁃-]/)) {
          bullets.push(bulletLine.replace(/^[•·∙‣⁃-]\s*/, ''));
        } else if (bulletLine.length > 20 && !bulletLine.match(datePattern)) {
          bullets.push(bulletLine);
        } else if (bulletLine.match(datePattern)) {
          break; // Next experience found
        }
      }
      
      if (role || company) {
        experiences.push({
          role: role || 'Professional Role',
          company: company || 'Technology Company',
          duration: dateMatch[0],
          bullets: bullets.slice(0, 5), // Limit bullets
        });
      }
    }
  }
  
  return experiences;
}

// Enhanced education extraction
function extractEducationAdvanced(text: string): Education[] {
  const education: Education[] = [];
  const lines = text.split('\n');
  
  const degreePatterns = [
    /\b(?:bachelor|master|phd|doctorate|bs|ba|ms|ma|mba|btech|mtech|be|me|bsc|msc|phd|b\.tech|m\.tech|b\.e|m\.e|b\.sc|m\.sc)\b/gi,
    /\b(?:degree|graduation|undergraduate|postgraduate|diploma|certificate)\b/gi
  ];
  
  const institutionPatterns = [
    /\b(?:university|college|institute|school)\b/gi,
    /\b(?:iit|nit|bits|vit|srm|mit|stanford|harvard|berkeley)\b/gi
  ];
  
  lines.forEach((line, index) => {
    const lineLower = line.toLowerCase();
    
    // Check for degree patterns
    degreePatterns.forEach(pattern => {
      if (pattern.test(lineLower)) {
        let degree = line.trim();
        let college = '';
        let year = '';
        let cgpa = '';
        
        // Look for institution in nearby lines
        for (let i = Math.max(0, index - 2); i < Math.min(lines.length, index + 3); i++) {
          const nearbyLine = lines[i].trim();
          institutionPatterns.forEach(instPattern => {
            if (instPattern.test(nearbyLine.toLowerCase()) && !college) {
              college = nearbyLine;
            }
          });
          
          // Look for year
          const yearMatch = nearbyLine.match(/\b(19|20)\d{2}\b/);
          if (yearMatch && !year) {
            year = yearMatch[0];
          }
          
          // Look for CGPA/GPA
          const cgpaMatch = nearbyLine.match(/(?:cgpa|gpa)[\s:]*(\d+\.?\d*)/i);
          if (cgpaMatch && !cgpa) {
            cgpa = cgpaMatch[1];
          }
        }
        
        if (degree && (college || year)) {
          education.push({
            degree,
            college: college || 'Educational Institution',
            year: year || 'Recent',
            cgpa
          });
        }
      }
    });
  });
  
  return education.slice(0, 3); // Limit to 3 entries
}

// Enhanced project extraction
function extractProjectsAdvanced(text: string): Project[] {
  const projects: Project[] = [];
  const lines = text.split('\n');
  
  const projectKeywords = ['project', 'built', 'developed', 'created', 'designed', 'implemented', 'application', 'website', 'system'];
  
  lines.forEach((line, index) => {
    const lineLower = line.toLowerCase();
    
    // Check if line contains project keywords
    if (projectKeywords.some(keyword => lineLower.includes(keyword))) {
      let title = line.trim();
      let description = '';
      const technologies: string[] = [];
      let link = '';
      
      // Look for description and technologies in nearby lines
      for (let i = index; i < Math.min(lines.length, index + 5); i++) {
        const nearbyLine = lines[i].trim();
        
        // Extract technologies
        Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
          if (nearbyLine.toLowerCase().includes(skill.toLowerCase()) && !technologies.includes(skill)) {
            technologies.push(skill);
          }
        });
        
        // Look for links
        const linkMatch = nearbyLine.match(/(https?:\/\/[^\s]+|github\.com\/[^\s]+)/i);
        if (linkMatch && !link) {
          link = linkMatch[0];
        }
        
        // Build description
        if (nearbyLine.length > 30 && nearbyLine.toLowerCase().includes('project')) {
          description = nearbyLine;
        }
      }
      
      if (title && (technologies.length > 0 || description)) {
        projects.push({
          title,
          description: description || 'Technology project showcasing skills',
          technologies: technologies.slice(0, 5),
          link
        });
      }
    }
  });
  
  return projects.slice(0, 5); // Limit to 5 projects
}

// Extract contact information
function extractContactInfo(text: string): ContactInfo {
  const contact: ContactInfo = {};
  
  // Name (usually at the top)
  const nameMatch = text.match(/^([A-Z][a-zA-Z\s]{2,30})\n/);
  if (nameMatch) {
    contact.name = nameMatch[1].trim();
  }
  
  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    contact.email = emailMatch[1];
  }
  
  // Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) {
    contact.phone = phoneMatch[1];
  }
  
  // LinkedIn
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[^\s]+)/i);
  if (linkedinMatch) {
    contact.linkedin = linkedinMatch[1];
  }
  
  // GitHub
  const githubMatch = text.match(/(github\.com\/[^\s]+)/i);
  if (githubMatch) {
    contact.github = githubMatch[1];
  }
  
  // Location
  const locationMatch = text.match(/([A-Z][a-z]+,?\s+[A-Z]{2,}|[A-Z][a-z]+,?\s+India)/);
  if (locationMatch) {
    contact.location = locationMatch[1];
  }
  
  return contact;
}

// Extract professional summary
function extractSummary(text: string): string {
  const summaryPatterns = [
    /(?:summary|profile|about|objective)[\s:]*([^]*?)(?:\n\n|experience|education|skills)/gi,
    /^([^]*?)(?:\n\n|experience|education|skills)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 50 && match[1].length < 500) {
      return match[1].trim();
    }
  }
  
  return 'Experienced professional with strong technical skills and passion for innovation.';
}

// Calculate confidence scores
function calculateConfidence(extractedData: any): { overall: number; skills: number; experience: number; projects: number } {
  const skillsConf = Math.min(extractedData.skills.length / 10, 1);
  const expConf = Math.min(extractedData.experience.length / 3, 1);
  const projConf = Math.min(extractedData.projects.length / 2, 1);
  const overall = (skillsConf + expConf + projConf) / 3;
  
  return {
    overall,
    skills: skillsConf,
    experience: expConf,
    projects: projConf
  };
}

// Main advanced parsing function
export async function parseResumeAdvanced(file: File): Promise<AdvancedParseResult> {
  console.log(`🚀 Starting advanced parsing for: ${file.name}`);
  
  try {
    // First get basic text extraction
    const basicResult = await parsePdfWithFallbacks(file);
    
    if (!basicResult.success || !basicResult.text) {
      return {
        success: false,
        error: basicResult.error || 'Failed to extract text',
        extractedData: {
          skills: [],
          experience: [],
          education: [],
          projects: [],
          achievements: [],
          contact: {},
          summary: ''
        },
        confidence: { overall: 0, skills: 0, experience: 0, projects: 0 }
      };
    }
    
    // Advanced text cleaning
    const cleanedText = advancedTextCleaning(basicResult.text);
    
    // Advanced extraction
    const skills = extractSkillsAdvanced(cleanedText);
    const experience = extractExperienceAdvanced(cleanedText);
    const education = extractEducationAdvanced(cleanedText);
    const projects = extractProjectsAdvanced(cleanedText);
    const achievements = basicResult.extractedData?.achievements || [];
    const contact = extractContactInfo(cleanedText);
    const summary = extractSummary(cleanedText);
    
    const extractedData = {
      skills,
      experience,
      education,
      projects,
      achievements,
      contact,
      summary
    };
    
    const confidence = calculateConfidence(extractedData);
    
    console.log(`✅ Advanced parsing complete:`);
    console.log(`   Skills: ${skills.length}`);
    console.log(`   Experience: ${experience.length}`);
    console.log(`   Projects: ${projects.length}`);
    console.log(`   Education: ${education.length}`);
    console.log(`   Overall confidence: ${Math.round(confidence.overall * 100)}%`);
    
    return {
      success: true,
      text: cleanedText,
      method: `advanced-parsing (${basicResult.method})`,
      extractedData,
      confidence
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Advanced parsing failed:', errorMsg);
    
    return {
      success: false,
      error: errorMsg,
      extractedData: {
        skills: [],
        experience: [],
        education: [],
        projects: [],
        achievements: [],
        contact: {},
        summary: ''
      },
      confidence: { overall: 0, skills: 0, experience: 0, projects: 0 }
    };
  }
}
