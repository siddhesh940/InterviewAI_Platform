import { Achievement, Education, EnhancedExtractionData, ParseConfidence, ParsedResume, Project, ResumeSection, SkillCategories, WorkExperience } from '@/types/time-machine';

// Comprehensive Skill Dictionary (500+ skills)
const SKILL_DICTIONARY = {
  // Programming Languages
  programmingLanguages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'Swift',
    'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'Dart', 'Elixir', 'Haskell', 'Lua', 'Perl',
    'Shell Scripting', 'Bash', 'PowerShell', 'Assembly', 'MATLAB', 'VBA', 'SQL', 'PL/SQL',
    'T-SQL', 'Node.js', 'Deno', 'jQuery', 'Express.js', 'Koa', 'Fastify', 'Objective-C'
  ],
  
  // Web Technologies & Frameworks  
  webTechnologies: [
    'HTML5', 'CSS3', 'SASS', 'SCSS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material UI',
    'Chakra UI', 'Ant Design', 'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js',
    'Gatsby', 'Astro', 'Remix', 'SvelteKit', 'Vite', 'Webpack', 'Parcel', 'Rollup',
    'ESLint', 'Prettier', 'Babel', 'Jest', 'Cypress', 'Playwright', 'Storybook',
    'React Native', 'Expo', 'Flutter', 'Ionic', 'Cordova', 'PhoneGap', 'Redux', 'Zustand'
  ],
  
  // Backend & Server Technologies
  backend: [
    'Node.js', 'Express.js', 'Koa', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI',
    'Spring Boot', 'Spring Framework', 'ASP.NET', '.NET Core', 'Ruby on Rails', 'Laravel',
    'Symfony', 'CodeIgniter', 'Gin', 'Echo', 'Fiber', 'Phoenix', 'Sinatra', 'Tornado',
    'Strapi', 'Sanity', 'Contentful', 'Headless CMS', 'GraphQL', 'REST API', 'SOAP',
    'gRPC', 'WebSocket', 'Socket.io', 'WebRTC', 'OAuth', 'JWT', 'API Gateway', 'Microservices'
  ],
  
  // Databases
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Oracle',
    'SQL Server', 'MariaDB', 'CouchDB', 'Cassandra', 'Neo4j', 'DynamoDB', 'Firebase',
    'Supabase', 'PlanetScale', 'Neon', 'Prisma', 'TypeORM', 'Sequelize', 'Mongoose',
    'Knex.js', 'Drizzle', 'Hasura', 'Apache Spark', 'Hadoop', 'Hive', 'ClickHouse', 
    'TimescaleDB', 'InfluxDB', 'CockroachDB', 'FaunaDB', 'ArangoDB'
  ],
  
  // Cloud & DevOps
  cloudDevOps: [
    'AWS', 'Azure', 'Google Cloud', 'Digital Ocean', 'Heroku', 'Vercel', 'Netlify',
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI',
    'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Nginx',
    'Apache', 'Linux', 'Ubuntu', 'CentOS', 'Red Hat', 'Debian', 'Windows Server',
    'Monitoring', 'Prometheus', 'Grafana', 'ELK Stack', 'Splunk', 'New Relic', 
    'DataDog', 'CloudWatch', 'Istio', 'Consul', 'Vault'
  ],
  
  // AI/ML & Data Science
  aiMl: [
    'Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch',
    'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly',
    'Jupyter', 'OpenCV', 'NLTK', 'spaCy', 'Hugging Face', 'Transformers', 'BERT',
    'GPT', 'LangChain', 'Vector Databases', 'Pinecone', 'Weaviate', 'Chroma',
    'Computer Vision', 'Natural Language Processing', 'Reinforcement Learning',
    'Data Mining', 'Big Data', 'Apache Kafka', 'Airflow', 'MLflow', 'Weights & Biases'
  ],
  
  // Development Tools
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial', 'VS Code', 'IntelliJ',
    'Eclipse', 'Atom', 'Sublime Text', 'Vim', 'Emacs', 'Postman', 'Insomnia',
    'Swagger', 'JIRA', 'Confluence', 'Trello', 'Asana', 'Slack', 'Microsoft Teams',
    'Zoom', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Canva'
  ],
  
  // Soft Skills
  softSkills: [
    'Communication', 'Leadership', 'Team Management', 'Project Management', 'Problem Solving',
    'Critical Thinking', 'Analytical Skills', 'Creative Thinking', 'Adaptability',
    'Time Management', 'Organization', 'Collaboration', 'Mentoring', 'Training',
    'Presentation Skills', 'Public Speaking', 'Writing', 'Documentation', 'Research',
    'Client Relations', 'Stakeholder Management', 'Agile', 'Scrum', 'Kanban',
    'Waterfall', 'DevOps Culture', 'Cross-functional Collaboration', 'Innovation'
  ]
};

// Enhanced text cleaning and preprocessing
class TextProcessor {
  static cleanText(text: string): string {
    return text
      // Remove PDF artifacts and control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      // Fix encoding issues
      .replace(/â€™/g, "'")
      .replace(/â€œ|â€\u009d/g, '"')
      .replace(/â€¢/g, '•')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      // Clean bullet points
      .replace(/[•·∙‣⁃▪▫⬧⬦]/g, '• ')
      // Fix common OCR errors
      .replace(/\b([A-Z]{2,})\s+([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Remove excessive punctuation
      .replace(/\.{3,}/g, '...')
      .replace(/-{2,}/g, '--')
      .trim();
  }

  static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static detectLanguage(text: string): string {
    // Simple language detection
    const indicators = {
      english: /\b(experience|education|skills|projects|work|job|company|university|college|school)\b/gi,
      hindi: /\b(अनुभव|शिक्षा|कौशल|परियोजनाएं|काम|नौकरी|कंपनी|विश्वविद्यालय|कॉलेज|स्कूल)\b/gi,
    };
    
    const englishMatches = (text.match(indicators.english) || []).length;
    const hindiMatches = (text.match(indicators.hindi) || []).length;
    
    return englishMatches >= hindiMatches ? 'english' : 'hindi';
  }
}

// Section detection with improved patterns
class SectionDetector {
  private static sectionPatterns = {
    contact: [
      /^(contact|personal\s+information|contact\s+details|contact\s+info)/i,
      /@\w+\.\w+/,
      /\+?[\d\s\-\(\)]{10,}/,
      /linkedin\.com|github\.com/i
    ],
    summary: [
      /^(summary|profile|objective|career\s+objective|professional\s+summary|about)/i,
      /experienced\s+\w+\s+with/i,
      /seeking\s+(a\s+)?(position|role|opportunity)/i
    ],
    experience: [
      /^(experience|work\s+experience|employment|career|professional\s+experience|work\s+history)/i,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/i,
      /\d{4}\s*[-–—]\s*(\d{4}|present|current)/i,
      /\b(intern|developer|engineer|manager|analyst|consultant|specialist)\b/i
    ],
    education: [
      /^(education|academic|qualifications|educational\s+background)/i,
      /\b(bachelor|master|phd|btech|mtech|bsc|msc|ba|ma|mba|degree|diploma|certification)\b/i,
      /\b(university|college|institute|school)\b/i,
      /\b(cgpa|gpa|percentage|marks|score)\b/i
    ],
    skills: [
      /^(skills|technical\s+skills|technologies|tools|expertise|competencies|proficiencies)/i,
      /programming\s+languages/i,
      /frameworks?|libraries/i,
      /databases?/i
    ],
    projects: [
      /^(projects?|portfolio|personal\s+projects|academic\s+projects)/i,
      /\b(built|developed|created|designed|implemented)\b/i,
      /github\.com|gitlab\.com|bitbucket/i,
      /\b(features?|functionality|technologies|stack)\b/i
    ],
    achievements: [
      /^(achievements?|awards?|honors?|accomplishments?|recognitions?|certifications?)/i,
      /\b(won|achieved|received|awarded|certified|recognized)\b/i,
      /\b(first\s+place|winner|champion|certificate|certification)\b/i
    ]
  };

  static detectSections(text: string): ResumeSection[] {
    const lines = text.split('\n').filter(line => line.trim());
    const sections: ResumeSection[] = [];
    let currentSection: string | null = null;
    let sectionContent: string[] = [];
    let startIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {continue;}

      const detectedSection = this.classifyLine(line);
      
      if (detectedSection) {
        // Save previous section if it exists
        if (currentSection && sectionContent.length > 0) {
          sections.push({
            type: currentSection as any,
            content: sectionContent.join('\n'),
            confidence: this.calculateSectionConfidence(currentSection, sectionContent.join('\n')),
            startIndex,
            endIndex: startIndex + sectionContent.join('\n').length
          });
        }
        
        // Start new section
        currentSection = detectedSection;
        sectionContent = [line];
        startIndex = text.indexOf(line, startIndex);
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }

    // Add last section
    if (currentSection && sectionContent.length > 0) {
      sections.push({
        type: currentSection as any,
        content: sectionContent.join('\n'),
        confidence: this.calculateSectionConfidence(currentSection, sectionContent.join('\n')),
        startIndex,
        endIndex: startIndex + sectionContent.join('\n').length
      });
    }

    return sections;
  }

  private static classifyLine(line: string): string | null {
    for (const [sectionType, patterns] of Object.entries(this.sectionPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          return sectionType;
        }
      }
    }
    
return null;
  }

  private static calculateSectionConfidence(sectionType: string, content: string): number {
    const patterns = this.sectionPatterns[sectionType as keyof typeof this.sectionPatterns] || [];
    let matches = 0;
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        matches++;
      }
    }
    
    return Math.min(matches / patterns.length, 1);
  }
}

// Enhanced data extraction with AI-like intelligence
class DataExtractor {
  static extractPersonalInfo(text: string): any {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi;
    const githubRegex = /github\.com\/([a-zA-Z0-9-]+)/gi;
    
    // Extract name (first capitalized words in document, usually at top)
    const namePattern = /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m;
    const nameMatch = text.match(namePattern);
    
    return {
      name: nameMatch ? nameMatch[1] : '',
      email: (text.match(emailRegex) || [])[0] || '',
      phone: (text.match(phoneRegex) || [])[0] || '',
      linkedin: (text.match(linkedinRegex) || [])[0] || '',
      github: (text.match(githubRegex) || [])[0] || '',
      location: this.extractLocation(text)
    };
  }

  static extractLocation(text: string): string {
    const locationPatterns = [
      /(?:address|location|based\s+in|residing\s+in)[:\s]*([^\n,]+(?:,\s*[^\n,]+)*)/i,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|\w+)\b/g,
      /\b(\w+,\s*\w+,\s*\d{5,6})\b/g
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    return '';
  }

  static extractWorkExperience(text: string): WorkExperience[] {
    const experiences: WorkExperience[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for experience patterns
    const datePattern = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\s*[-–—]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}|present|current)\b/gi;
    const yearPattern = /\b\d{4}\s*[-–—]\s*(?:\d{4}|present|current)\b/gi;
    const jobTitlePattern = /\b(intern|developer|engineer|manager|analyst|consultant|specialist|lead|senior|junior|associate|director|coordinator|administrator|designer|architect|scientist|researcher|officer|executive|assistant|supervisor|trainer|instructor)\b/gi;
    
    let currentExperience: Partial<WorkExperience> = {};
    let collectingResponsibilities = false;
    let responsibilities: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {continue;}
      
      // Check for date patterns
      const dateMatch = trimmedLine.match(datePattern) || trimmedLine.match(yearPattern);
      if (dateMatch) {
        // Save previous experience if exists
        if (currentExperience.jobTitle && currentExperience.companyName) {
          currentExperience.responsibilities = responsibilities;
          experiences.push(currentExperience as WorkExperience);
        }
        
        // Start new experience
        currentExperience = {
          duration: dateMatch[0],
          startDate: this.extractStartDate(dateMatch[0]),
          endDate: this.extractEndDate(dateMatch[0]),
          responsibilities: [],
          impactKeywords: [],
          technologies: []
        };
        responsibilities = [];
        collectingResponsibilities = true;
        
        // Try to extract job title and company from the same line
        const titleCompanyMatch = this.extractJobTitleAndCompany(trimmedLine.replace(dateMatch[0], ''));
        if (titleCompanyMatch) {
          currentExperience.jobTitle = titleCompanyMatch.jobTitle;
          currentExperience.companyName = titleCompanyMatch.companyName;
        }
        continue;
      }
      
      // Check for job title
      if (!currentExperience.jobTitle && jobTitlePattern.test(trimmedLine)) {
        const titleCompanyMatch = this.extractJobTitleAndCompany(trimmedLine);
        if (titleCompanyMatch) {
          currentExperience.jobTitle = titleCompanyMatch.jobTitle;
          currentExperience.companyName = titleCompanyMatch.companyName;
        }
        continue;
      }
      
      // Collect responsibilities (bullet points or descriptive lines)
      if (collectingResponsibilities && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*'))) {
        responsibilities.push(trimmedLine.replace(/^[•\-*]\s*/, ''));
      } else if (collectingResponsibilities && this.isDescriptiveLine(trimmedLine)) {
        responsibilities.push(trimmedLine);
      } else if (collectingResponsibilities && responsibilities.length > 0) {
        // End of responsibilities section
        collectingResponsibilities = false;
      }
    }
    
    // Add last experience
    if (currentExperience.jobTitle && currentExperience.companyName) {
      currentExperience.responsibilities = responsibilities;
      experiences.push(currentExperience as WorkExperience);
    }
    
    return experiences;
  }

  private static extractJobTitleAndCompany(text: string): { jobTitle: string; companyName: string } | null {
    // Pattern: "Job Title at Company Name"
    const atPattern = /(.+?)\s+at\s+(.+)/i;
    const atMatch = text.match(atPattern);
    if (atMatch) {
      return {
        jobTitle: atMatch[1].trim(),
        companyName: atMatch[2].trim()
      };
    }
    
    // Pattern: "Job Title - Company Name"
    const dashPattern = /(.+?)\s*[-–—]\s*(.+)/;
    const dashMatch = text.match(dashPattern);
    if (dashMatch) {
      return {
        jobTitle: dashMatch[1].trim(),
        companyName: dashMatch[2].trim()
      };
    }
    
    // Pattern: "Job Title | Company Name"
    const pipePattern = /(.+?)\s*\|\s*(.+)/;
    const pipeMatch = text.match(pipePattern);
    if (pipeMatch) {
      return {
        jobTitle: pipeMatch[1].trim(),
        companyName: pipeMatch[2].trim()
      };
    }
    
    return null;
  }

  private static extractStartDate(duration: string): string {
    const match = duration.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{4}|\d{4})/i);
    
    return match ? match[0] : '';
  }

  private static extractEndDate(duration: string): string {
    const match = duration.match(/[-–—]\s*(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{4}|\d{4}|present|current)\b)/i);
    
    return match ? match[1] : '';
  }

  private static isDescriptiveLine(line: string): boolean {
    const descriptivePatterns = [
      /\b(responsible|developed|implemented|managed|led|created|designed|built|maintained|improved|achieved)\b/i,
      /\b(experience|expertise|proficient|skilled|knowledge)\b/i,
      /\d+\%|\d+x|increase|decrease|improve/i
    ];
    
    return descriptivePatterns.some(pattern => pattern.test(line));
  }

  static extractEducation(_text: string): Education[] {
    const education: Education[] = [];
    
    const degreePattern = /\b(bachelor|master|phd|btech|mtech|bsc|msc|ba|ma|mba|degree|diploma|certification|b\.tech|m\.tech|b\.sc|m\.sc|b\.a|m\.a|m\.b\.a)\b/gi;
    const institutionPattern = /\b(university|college|institute|school|academy)\b/i;
    
    const lines = _text.split('\n').filter(line => line.trim());
    let currentEducation: Partial<Education> = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {continue;}
      
      if (degreePattern.test(trimmedLine)) {
        // Save previous education if exists
        if (currentEducation.degree && currentEducation.institution) {
          education.push(currentEducation as Education);
        }
        
        // Start new education
        currentEducation = {
          degree: this.extractDegree(trimmedLine),
          institution: this.extractInstitution(trimmedLine),
          year: this.extractYear(trimmedLine),
          cgpa: this.extractGPA(trimmedLine)
        };
      } else if (institutionPattern.test(trimmedLine) && !currentEducation.institution) {
        currentEducation.institution = trimmedLine;
        currentEducation.year = this.extractYear(trimmedLine);
      }
    }
    
    // Add last education
    if (currentEducation.degree && currentEducation.institution) {
      education.push(currentEducation as Education);
    }
    
    return education;
  }

  private static extractDegree(text: string): string {
    const degreeMatch = text.match(/\b(bachelor|master|phd|btech|mtech|bsc|msc|ba|ma|mba|b\.tech|m\.tech|b\.sc|m\.sc|b\.a|m\.a|m\.b\.a)[^,\n]*/gi);
    
return degreeMatch ? degreeMatch[0] : '';
  }

  private static extractInstitution(text: string): string {
    const institutionMatch = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(university|college|institute|school|academy)\b/gi);
    
return institutionMatch ? institutionMatch[0] : '';
  }

  private static extractYear(text: string): string {
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    
return yearMatch ? yearMatch[0] : '';
  }

  private static extractGPA(text: string): string {
    const gpaMatch = text.match(/\b(?:cgpa|gpa|percentage|marks|score)[:\s]*(\d+\.?\d*)\b/i);
    
return gpaMatch ? gpaMatch[1] : '';
  }

  static extractSkills(text: string): SkillCategories {
    const skills: SkillCategories = {
      technical: [],
      softSkills: [],
      tools: [],
      languages: [],
      frameworks: [],
      databases: []
    };

    const normalizedText = TextProcessor.normalizeText(text);
    
    // Extract skills from all categories
    for (const [, skillList] of Object.entries(SKILL_DICTIONARY)) {
      for (const skill of skillList) {
        const skillVariations = this.generateSkillVariations(skill);
        
        if (skillVariations.some(variation => normalizedText.includes(variation.toLowerCase()))) {
          this.categorizeSkill(skill, skills);
        }
      }
    }
    
    // Extract additional skills from skill sections using patterns
    const skillSections = this.extractSkillSections(text);
    for (const section of skillSections) {
      const extractedSkills = this.parseSkillSection(section);
      for (const skill of extractedSkills) {
        this.categorizeSkill(skill, skills);
      }
    }
    
    return skills;
  }

  private static generateSkillVariations(skill: string): string[] {
    const variations = [skill];
    
    // Add variations without special characters
    variations.push(skill.replace(/[.\-]/g, ''));
    variations.push(skill.replace(/[.\-]/g, ' '));
    
    // Add common abbreviations
    const abbreviations: { [key: string]: string[] } = {
      'JavaScript': ['JS', 'Javascript'],
      'TypeScript': ['TS', 'Typescript'],
      'Python': ['Py'],
      'PostgreSQL': ['Postgres', 'PGSQL'],
      'MongoDB': ['Mongo'],
      'React Native': ['RN'],
      'Node.js': ['NodeJS', 'Node'],
      'Express.js': ['Express', 'ExpressJS']
    };
    
    if (abbreviations[skill]) {
      variations.push(...abbreviations[skill]);
    }
    
    return variations;
  }

  private static extractSkillSections(text: string): string[] {
    const skillSectionPattern = /(?:skills?|technologies?|tools?|expertise|competencies)[:\s]*([^\n]+(?:\n[^\n]*)*?)(?=\n\s*[A-Z]|\n\s*$)/gi;
    const matches = text.match(skillSectionPattern);
    
return matches || [];
  }

  private static parseSkillSection(section: string): string[] {
    const skills: string[] = [];
    
    // Split by common delimiters
    const delimiters = [',', '|', '•', '-', '*', '/', ';'];
    let items = [section];
    
    for (const delimiter of delimiters) {
      const newItems: string[] = [];
      for (const item of items) {
        newItems.push(...item.split(delimiter));
      }
      items = newItems;
    }
    
    for (const item of items) {
      const cleaned = item.trim().replace(/^\W+|\W+$/g, '');
      if (cleaned && cleaned.length > 1 && cleaned.length < 30) {
        skills.push(cleaned);
      }
    }
    
    return skills;
  }

  private static categorizeSkill(skill: string, skills: SkillCategories): void {
    const skillLower = skill.toLowerCase();
    
    // Categorize based on predefined categories
    if (SKILL_DICTIONARY.programmingLanguages.some(s => s.toLowerCase() === skillLower)) {
      if (!skills.languages.includes(skill)) {skills.languages.push(skill);}
    } else if (SKILL_DICTIONARY.webTechnologies.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('angular') || s.toLowerCase().includes('vue'))) {
      if (skillLower.includes('react') || skillLower.includes('angular') || skillLower.includes('vue') || skillLower.includes('svelte')) {
        if (!skills.frameworks.includes(skill)) {skills.frameworks.push(skill);}
      }
    } else if (SKILL_DICTIONARY.databases.some(s => s.toLowerCase() === skillLower)) {
      if (!skills.databases.includes(skill)) {skills.databases.push(skill);}
    } else if (SKILL_DICTIONARY.softSkills.some(s => s.toLowerCase() === skillLower)) {
      if (!skills.softSkills.includes(skill)) {skills.softSkills.push(skill);}
    } else if (SKILL_DICTIONARY.tools.some(s => s.toLowerCase() === skillLower)) {
      if (!skills.tools.includes(skill)) {skills.tools.push(skill);}
    } else {
      // Default to technical skills
      if (!skills.technical.includes(skill)) {skills.technical.push(skill);}
    }
  }

  static extractProjects(text: string): Project[] {
    const projects: Project[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentProject: Partial<Project> = {};
    let collectingDetails = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {continue;}
      
      // Check for project indicators
      if (this.isProjectTitle(trimmedLine)) {
        // Save previous project if exists
        if (currentProject.name && currentProject.description) {
          projects.push(currentProject as Project);
        }
        
        // Start new project
        currentProject = {
          name: this.extractProjectName(trimmedLine),
          description: '',
          techStack: [],
          outcomes: [],
          metrics: [],
          link: this.extractLink(trimmedLine)
        };
        collectingDetails = true;
      } else if (collectingDetails) {
        // Extract project details
        if (this.isTechStack(trimmedLine)) {
          currentProject.techStack = this.extractTechStack(trimmedLine);
        } else if (this.isProjectDescription(trimmedLine)) {
          if (currentProject.description) {
            currentProject.description += ' ' + trimmedLine;
          } else {
            currentProject.description = trimmedLine;
          }
        } else if (this.isOutcome(trimmedLine)) {
          currentProject.outcomes?.push(trimmedLine);
        }
      }
    }
    
    // Add last project
    if (currentProject.name && currentProject.description) {
      projects.push(currentProject as Project);
    }
    
    return projects;
  }

  private static isProjectTitle(line: string): boolean {
    const patterns = [
      /^[A-Z][a-zA-Z\s]+(?:\s*[-–—]\s*[A-Z])/,
      /\b(built|developed|created|designed|implemented)\b.*\b(app|application|website|system|tool|platform)\b/i,
      /github\.com|gitlab\.com|bitbucket/i
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static extractProjectName(line: string): string {
    // Remove common prefixes and clean up
    return line
      .replace(/^[•\-*]\s*/, '')
      .replace(/\s*[-–—].*$/, '')
      .replace(/\s*\(.*\).*$/, '')
      .trim();
  }

  private static isTechStack(line: string): boolean {
    const patterns = [
      /\b(tech|technology|technologies|stack|built\s+with|using|tools|languages|frameworks)\b/i,
      /\b(react|angular|vue|node|python|java|javascript|typescript)\b/i
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static extractTechStack(line: string): string[] {
    const techs: string[] = [];
    const techSection = line.replace(/^.*(?:tech|stack|using|built\s+with)[:\s]*/i, '');
    
    // Split by common delimiters
    const items = techSection.split(/[,|;·•]/).map(item => item.trim());
    
    for (const item of items) {
      if (item && item.length > 1 && item.length < 25) {
        techs.push(item);
      }
    }
    
    return techs;
  }

  private static isProjectDescription(line: string): boolean {
    const patterns = [
      /\b(features?|functionality|description|overview|purpose|goal|objective)\b/i,
      /\b(allows?|enables?|provides?|includes?|supports?)\b/i,
      /^[a-z]/  // Lines starting with lowercase (likely continuation)
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static isOutcome(line: string): boolean {
    const patterns = [
      /\b(achieved|resulted|improved|increased|decreased|saved|generated)\b/i,
      /\d+%|\d+x|million|thousand/i,
      /\b(users?|customers?|clients?|performance|efficiency|revenue)\b/i
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static extractLink(line: string): string {
    const linkMatch = line.match(/(https?:\/\/[^\s]+|github\.com\/[^\s]+|gitlab\.com\/[^\s]+)/i);
    
return linkMatch ? linkMatch[0] : '';
  }

  static extractAchievements(text: string): Achievement[] {
    const achievements: Achievement[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {continue;}
      
      if (this.isAchievement(trimmedLine)) {
        achievements.push({
          title: this.extractAchievementTitle(trimmedLine),
          description: trimmedLine,
          category: this.categorizeAchievement(trimmedLine),
          date: this.extractAchievementDate(trimmedLine)
        });
      }
    }
    
    return achievements;
  }

  private static isAchievement(line: string): boolean {
    const patterns = [
      /\b(won|achieved|received|awarded|certified|recognized|selected|nominated)\b/i,
      /\b(first|second|third|winner|champion|certificate|certification|award|honor)\b/i,
      /\b(scholarship|medal|prize|recognition|achievement)\b/i,
      /\d+%\s+(improvement|increase|growth)/i
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static extractAchievementTitle(line: string): string {
    return line.replace(/^[•\-*]\s*/, '').split('.')[0].trim();
  }

  private static categorizeAchievement(line: string): 'academic' | 'professional' | 'personal' | 'certification' {
    if (/\b(certificate|certification|certified|licensed)\b/i.test(line)) {
      return 'certification';
    } else if (/\b(scholarship|dean|academic|gpa|cgpa|university|college)\b/i.test(line)) {
      return 'academic';
    } else if (/\b(work|job|company|project|team|leadership)\b/i.test(line)) {
      return 'professional';
    } else {
      return 'personal';
    }
  }

  private static extractAchievementDate(line: string): string {
    const dateMatch = line.match(/\b(19|20)\d{2}\b/);
    
return dateMatch ? dateMatch[0] : '';
  }
}

// Main enhanced parser class
export class EnhancedPDFParser {
  private confidenceWeights = {
    textClarity: 0.2,
    structureDetection: 0.25,
    entityCount: 0.25,
    sectionCompleteness: 0.3
  };

  async parseResume(rawText: string): Promise<ParsedResume> {
    console.log('🔍 Starting enhanced resume parsing...');
    
    // Step 1: Clean and preprocess text
    const cleanedText = TextProcessor.cleanText(rawText);
    console.log(`📄 Text cleaned: ${cleanedText.length} characters`);
    
    // Step 2: Detect sections
    const sections = SectionDetector.detectSections(cleanedText);
    console.log(`📑 Sections detected: ${sections.length} sections`);
    
    // Step 3: Extract structured data from each section
    const extractedData = await this.extractStructuredData(cleanedText, sections);
    console.log(`📊 Data extracted: ${JSON.stringify(Object.keys(extractedData))}`);
    
    // Step 4: Calculate confidence scores
    const confidence = this.calculateConfidence(cleanedText, sections, extractedData);
    console.log(`🎯 Overall confidence: ${(confidence.overall * 100).toFixed(1)}%`);
    
    // Step 5: Generate warnings for low-confidence sections
    const warnings = this.generateWarnings(confidence, extractedData);
    
    return {
      rawText: cleanedText,
      sections,
      extractedData,
      confidence,
      parseMethod: 'hybrid',
      warnings
    };
  }

  private async extractStructuredData(text: string, sections: ResumeSection[]): Promise<EnhancedExtractionData> {
    console.log('🧠 Extracting structured data...');
    
    // Get section content by type
    const getSectionContent = (type: string) => {
      const section = sections.find(s => s.type === type);
      
return section ? section.content : text; // Fallback to full text
    };

    // Extract personal information
    const personalInfo = DataExtractor.extractPersonalInfo(text);
    
    // Extract summary (look for summary section or first paragraph)
    const summarySection = getSectionContent('summary');
    const summary = this.extractSummary(summarySection || text);
    
    // Extract work experience
    const experienceSection = getSectionContent('experience');
    const experience = DataExtractor.extractWorkExperience(experienceSection);
    
    // Extract education
    const educationSection = getSectionContent('education');
    const education = DataExtractor.extractEducation(educationSection);
    
    // Extract skills
    const skillsSection = getSectionContent('skills');
    const skills = DataExtractor.extractSkills(skillsSection || text);
    
    // Extract projects
    const projectsSection = getSectionContent('projects');
    const projects = DataExtractor.extractProjects(projectsSection || text);
    
    // Extract achievements
    const achievementsSection = getSectionContent('achievements');
    const achievements = DataExtractor.extractAchievements(achievementsSection || text);
    
    // Extract certifications (simple string extraction)
    const certifications = this.extractCertifications(text);
    
    console.log(`✅ Extraction complete:`, {
      personalInfo: !!personalInfo.name,
      experience: experience.length,
      education: education.length,
      skills: Object.values(skills).flat().length,
      projects: projects.length,
      achievements: achievements.length,
      certifications: certifications.length
    });
    
    return {
      personalInfo,
      summary,
      experience,
      education,
      skills,
      projects,
      achievements,
      certifications
    };
  }

  private extractSummary(text: string): string {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for summary indicators
    const summaryPatterns = [
      /^(summary|profile|objective|about|career\s+objective)/i,
      /experienced\s+\w+\s+with/i,
      /seeking\s+(a\s+)?(position|role|opportunity)/i
    ];
    
    let summaryLines: string[] = [];
    let inSummary = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (summaryPatterns.some(pattern => pattern.test(trimmed))) {
        inSummary = true;
        if (!summaryPatterns[0].test(trimmed)) {
          // If line is not just a header, include it
          summaryLines.push(trimmed);
        }
        continue;
      }
      
      if (inSummary) {
        if (this.isNewSection(trimmed)) {
          break;
        }
        summaryLines.push(trimmed);
      }
    }
    
    if (summaryLines.length === 0) {
      // Take first few non-header lines as summary
      summaryLines = lines
        .filter(line => !this.isHeaderLine(line))
        .slice(0, 3);
    }
    
    return summaryLines.join(' ').trim();
  }

  private extractCertifications(text: string): string[] {
    const certifications: string[] = [];
    const certPatterns = [
      /\b(certified|certification|certificate|licensed|credential)\s+[^\n]*/gi,
      /\b(aws|azure|google cloud|oracle|microsoft|cisco|comptia|pmp|agile|scrum)\s+certified\b[^\n]*/gi,
      /\b[A-Z]{2,}\s+certification\b/gi
    ];
    
    for (const pattern of certPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        certifications.push(...matches.map(match => match.trim()));
      }
    }
    
    return Array.from(new Set(certifications)); // Remove duplicates
  }

  private isNewSection(line: string): boolean {
    const sectionHeaders = [
      'experience', 'education', 'skills', 'projects', 'achievements', 
      'certifications', 'awards', 'honors', 'publications'
    ];
    
    return sectionHeaders.some(header => 
      new RegExp(`^${header}`, 'i').test(line.trim())
    );
  }

  private isHeaderLine(line: string): boolean {
    const headerPatterns = [
      /^[A-Z\s]+$/,  // All caps
      /^\w+:?\s*$/,   // Single word with optional colon
      /^[A-Z][A-Z\s]*[A-Z]$/  // Title case headers
    ];
    
    return headerPatterns.some(pattern => pattern.test(line.trim()));
  }

  private calculateConfidence(text: string, sections: ResumeSection[], extractedData: EnhancedExtractionData): ParseConfidence {
    // Text clarity (based on length and readability)
    const textClarity = Math.min(text.length / 1000, 1) * 
                       (text.split(' ').length > 50 ? 1 : text.split(' ').length / 50);
    
    // Structure detection (based on detected sections)
    const expectedSections = ['contact', 'experience', 'education', 'skills'];
    const detectedSections = sections.map(s => s.type);
    const structureDetection = expectedSections.filter(s => 
      detectedSections.includes(s as any)
    ).length / expectedSections.length;
    
    // Entity count (based on extracted entities)
    const entityCounts = {
      experience: extractedData.experience.length,
      education: extractedData.education.length,
      skills: Object.values(extractedData.skills).flat().length,
      projects: extractedData.projects.length
    };
    const entityCount = Math.min((entityCounts.experience * 0.3 + 
                                 entityCounts.education * 0.2 + 
                                 entityCounts.skills * 0.01 + 
                                 entityCounts.projects * 0.2) / 3, 1);
    
    // Section-specific confidence
    const sectionConfidences = {
      contact: extractedData.personalInfo.name ? 0.8 : 0.2,
      experience: Math.min(extractedData.experience.length / 2, 1),
      education: Math.min(extractedData.education.length / 1, 1),
      skills: Math.min(Object.values(extractedData.skills).flat().length / 10, 1),
      projects: Math.min(extractedData.projects.length / 2, 1),
      achievements: Math.min(extractedData.achievements.length / 3, 1)
    };
    
    // Overall confidence
    const overall = (textClarity * this.confidenceWeights.textClarity +
                    structureDetection * this.confidenceWeights.structureDetection +
                    entityCount * this.confidenceWeights.entityCount +
                    (Object.values(sectionConfidences).reduce((a, b) => a + b, 0) / Object.keys(sectionConfidences).length) * this.confidenceWeights.sectionCompleteness);
    
    return {
      overall: Math.max(overall, 0.1), // Minimum 10% confidence
      sections: sectionConfidences,
      textClarity,
      structureDetection,
      entityCount
    };
  }

  private generateWarnings(confidence: ParseConfidence, extractedData: EnhancedExtractionData): string[] {
    const warnings: string[] = [];
    
    if (confidence.overall < 0.5) {
      warnings.push('Low overall parsing confidence. Results may be incomplete.');
    }
    
    if (confidence.textClarity < 0.3) {
      warnings.push('Text quality is poor. Consider using a higher quality PDF or OCR.');
    }
    
    if (extractedData.experience.length === 0) {
      warnings.push('No work experience detected. Please verify the resume contains employment history.');
    }
    
    if (Object.values(extractedData.skills).flat().length < 3) {
      warnings.push('Very few skills detected. Skills section may be missing or unclear.');
    }
    
    if (!extractedData.personalInfo.name) {
      warnings.push('Name could not be extracted. Please verify the resume format.');
    }
    
    if (!extractedData.personalInfo.email) {
      warnings.push('Email address not found. Contact information may be missing.');
    }
    
    return warnings;
  }
}

// Export singleton instance
export const enhancedPDFParser = new EnhancedPDFParser();
