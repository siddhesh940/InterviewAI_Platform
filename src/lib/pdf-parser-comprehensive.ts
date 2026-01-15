import { EnhancedExtractionData, ParseConfidence, ParsedResume, ResumeSection } from '@/types/time-machine';

// Enhanced Skill Dictionary (300+ skills)
const SKILL_DICTIONARY = {
  // Programming Languages
  programmingLanguages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'Swift',
    'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'Dart', 'Elixir', 'Haskell', 'Lua', 'Perl',
    'Shell Scripting', 'Bash', 'PowerShell', 'Assembly', 'MATLAB', 'VBA', 'SQL', 'PL/SQL',
    'T-SQL', 'Node.js', 'Deno', 'jQuery', 'Express.js', 'Koa', 'Fastify'
  ],
  
  // Web Technologies & Frameworks
  webTechnologies: [
    'HTML5', 'CSS3', 'SASS', 'SCSS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material UI',
    'Chakra UI', 'Ant Design', 'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js',
    'Gatsby', 'Astro', 'Remix', 'SvelteKit', 'Vite', 'Webpack', 'Parcel', 'Rollup',
    'ESLint', 'Prettier', 'TypeScript', 'Babel', 'Jest', 'Cypress', 'Playwright',
    'React Native', 'Expo', 'Flutter', 'Ionic', 'Cordova', 'PhoneGap'
  ],
  
  // Backend & Server Technologies
  backend: [
    'Node.js', 'Express.js', 'Koa', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI',
    'Spring Boot', 'Spring Framework', 'ASP.NET', '.NET Core', 'Ruby on Rails', 'Laravel',
    'Symfony', 'CodeIgniter', 'Gin', 'Echo', 'Fiber', 'Phoenix', 'Sinatra', 'Tornado',
    'Strapi', 'Sanity', 'Contentful', 'Headless CMS', 'GraphQL', 'REST API', 'SOAP',
    'gRPC', 'WebSocket', 'Socket.io', 'WebRTC', 'OAuth', 'JWT', 'API Gateway'
  ],
  
  // Databases
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Oracle',
    'SQL Server', 'MariaDB', 'CouchDB', 'Cassandra', 'Neo4j', 'DynamoDB', 'Firebase',
    'Supabase', 'PlanetScale', 'Neon', 'Prisma', 'TypeORM', 'Sequelize', 'Mongoose',
    'Knex.js', 'Drizzle', 'Hasura', 'GraphQL', 'Apache Spark', 'Hadoop', 'Hive',
    'ClickHouse', 'TimescaleDB', 'InfluxDB', 'CockroachDB'
  ],
  
  // Cloud & DevOps
  cloudDevOps: [
    'AWS', 'Azure', 'Google Cloud', 'Digital Ocean', 'Heroku', 'Vercel', 'Netlify',
    'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI',
    'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant', 'Nginx',
    'Apache', 'Linux', 'Ubuntu', 'CentOS', 'Red Hat', 'Debian', 'Windows Server',
    'Shell Scripting', 'Bash', 'PowerShell', 'Monitoring', 'Prometheus', 'Grafana',
    'ELK Stack', 'Splunk', 'New Relic', 'DataDog', 'CloudWatch'
  ],
  
  // AI/ML & Data Science
  aiMl: [
    'Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch',
    'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly',
    'Jupyter', 'OpenCV', 'NLTK', 'spaCy', 'Hugging Face', 'Transformers', 'BERT',
    'GPT', 'LangChain', 'Vector Databases', 'Pinecone', 'Weaviate', 'Chroma',
    'Computer Vision', 'Natural Language Processing', 'Reinforcement Learning',
    'Data Mining', 'Big Data', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow'
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
    'Waterfall', 'DevOps Culture', 'Cross-functional Collaboration'
  ]
};

// Pattern matching for skill extraction
const SKILL_PATTERNS = {
  sectionHeaders: /^(skills|technical\s+skills|programming\s+languages?|technologies|tools|expertise|competencies|proficiencies|technical\s+competencies)/i,
  bulletPoints: /^[\s]*[•\-\*\+]\s*/,
  commaDelimited: /,\s*/,
  pipeDelimited: /\|\s*/,
  colonSeparated: /:\s*/,
  proficiencyLevels: /(beginner|intermediate|advanced|expert|proficient|familiar)/i,
  yearsExperience: /(\d+[\+]?)\s*(years?|yrs?|y)\s*(of\s+)?(experience|exp)?/i
};

// Enhanced extraction methods
class EnhancedPDFParser {
  private confidenceWeights = {
    textClarity: 0.2,
    structureDetection: 0.25,
    entityCount: 0.25,
    sectionCompleteness: 0.3
  };

  async parseResume(pdfText: string): Promise<ParsedResume> {
    const sections = this.detectSections(pdfText);
    const extractedData = this.extractData(pdfText, sections);
    const confidence = this.calculateConfidence(pdfText, sections, extractedData);
    
    return {
      rawText: pdfText,
      sections,
      extractedData,
      confidence,
      parseMethod: 'hybrid',
      warnings: this.generateWarnings(confidence, extractedData)
    };
  }

  private detectSections(text: string): ResumeSection[] {
    const sections: ResumeSection[] = [];
    const lines = text.split('\n');
    
    const sectionPatterns = {
      contact: /^(contact|personal\s+information|details)/i,
      summary: /^(summary|profile|objective|about|overview)/i,
      experience: /^(experience|work\s+experience|employment|professional\s+experience|career)/i,
      education: /^(education|academic|qualification|degree)/i,
      skills: /^(skills|technical\s+skills|competencies|expertise|technologies)/i,
      projects: /^(projects?|portfolio|work|implementations?)/i,
      achievements: /^(achievements?|accomplishments?|awards?|honors?|recognition)/i,
      certifications: /^(certifications?|certificates?|training|courses?)/i
    };

    let currentSection: ResumeSection | null = null;
    let currentContent = '';
    let startIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      let foundSection = false;

      // Check if this line is a section header
      for (const [sectionType, pattern] of Object.entries(sectionPatterns)) {
        if (pattern.test(line)) {
          // Save previous section
          if (currentSection) {
            currentSection.content = currentContent.trim();
            currentSection.endIndex = startIndex + currentContent.length;
            sections.push(currentSection);
          }

          // Start new section
          currentSection = {
            type: sectionType as any,
            content: '',
            confidence: this.calculateSectionConfidence(line, sectionType),
            startIndex: text.indexOf(line, startIndex),
            endIndex: 0
          };
          currentContent = '';
          foundSection = true;
          break;
        }
      }

      if (!foundSection && currentSection) {
        currentContent += line + '\n';
      }
    }

    // Add final section
    if (currentSection) {
      currentSection.content = currentContent.trim();
      currentSection.endIndex = startIndex + currentContent.length;
      sections.push(currentSection);
    }

    return sections;
  }

  private extractData(text: string, sections: ResumeSection[]): EnhancedExtractionData {
    return {
      personalInfo: this.extractPersonalInfo(text),
      summary: this.extractSummary(sections),
      experience: this.extractExperience(sections),
      education: this.extractEducation(sections),
      skills: this.extractSkillsAdvanced(sections, text),
      projects: this.extractProjects(sections),
      achievements: this.extractAchievements(sections),
      certifications: this.extractCertifications(sections)
    };
  }

  private extractPersonalInfo(text: string): any {
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      linkedin: this.extractLinkedIn(text),
      github: this.extractGitHub(text),
      location: this.extractLocation(text)
    };
  }

  private extractName(text: string): string {
    const lines = text.split('\n').slice(0, 5);
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.length > 2 && cleaned.length < 50 && 
          /^[A-Za-z\s\.]+$/.test(cleaned) && 
          !/@/.test(cleaned) && 
          !/\d/.test(cleaned)) {
        return cleaned;
      }
    }
    return '';
  }

  private extractEmail(text: string): string {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailPattern);
    return match ? match[0] : '';
  }

  private extractPhone(text: string): string {
    const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
    const match = text.match(phonePattern);
    return match ? match[0] : '';
  }

  private extractLinkedIn(text: string): string {
    const linkedInPattern = /(linkedin\.com\/in\/[A-Za-z0-9-]+)/;
    const match = text.match(linkedInPattern);
    return match ? `https://${match[1]}` : '';
  }

  private extractGitHub(text: string): string {
    const githubPattern = /(github\.com\/[A-Za-z0-9-]+)/;
    const match = text.match(githubPattern);
    return match ? `https://${match[1]}` : '';
  }

  private extractLocation(text: string): string {
    const locationPattern = /([A-Za-z\s]+,\s*[A-Za-z\s]+,?\s*\d{5,6}?)/;
    const match = text.match(locationPattern);
    return match ? match[1] : '';
  }

  private extractSummary(sections: ResumeSection[]): string {
    const summarySection = sections.find(s => s.type === 'summary');
    return summarySection ? summarySection.content : '';
  }

  private extractSkillsAdvanced(sections: ResumeSection[], fullText: string): any {
    const skillsSection = sections.find(s => s.type === 'skills');
    const skillText = skillsSection ? skillsSection.content : fullText;
    
    const extractedSkills = {
      technical: [],
      softSkills: [],
      tools: [],
      languages: [],
      frameworks: [],
      databases: []
    };

    // Flatten all skills for matching
    const allSkills = Object.values(SKILL_DICTIONARY).flat();
    
    // Extract skills using multiple methods
    const foundSkills = new Set<string>();
    
    // Method 1: Exact matches
    for (const skill of allSkills) {
      const pattern = new RegExp(`\\b${this.escapeRegex(skill)}\\b`, 'gi');
      if (pattern.test(skillText)) {
        foundSkills.add(skill);
      }
    }

    // Method 2: Partial matches for common abbreviations
    const abbreviations = {
      'JS': 'JavaScript',
      'TS': 'TypeScript',
      'SQL': 'SQL',
      'ML': 'Machine Learning',
      'AI': 'Artificial Intelligence',
      'AWS': 'Amazon Web Services',
      'GCP': 'Google Cloud Platform',
      'CSS': 'CSS3',
      'HTML': 'HTML5'
    };

    for (const [abbr, fullName] of Object.entries(abbreviations)) {
      const pattern = new RegExp(`\\b${abbr}\\b`, 'gi');
      if (pattern.test(skillText)) {
        foundSkills.add(fullName);
      }
    }

    // Categorize skills
    const categorizeSkills = (skills: string[]) => {
      for (const skill of skills) {
        if (SKILL_DICTIONARY.programmingLanguages.includes(skill)) {
          extractedSkills.languages.push(skill);
        } else if (SKILL_DICTIONARY.webTechnologies.includes(skill)) {
          extractedSkills.frameworks.push(skill);
        } else if (SKILL_DICTIONARY.databases.includes(skill)) {
          extractedSkills.databases.push(skill);
        } else if (SKILL_DICTIONARY.tools.includes(skill)) {
          extractedSkills.tools.push(skill);
        } else if (SKILL_DICTIONARY.softSkills.includes(skill)) {
          extractedSkills.softSkills.push(skill);
        } else {
          extractedSkills.technical.push(skill);
        }
      }
    };

    categorizeSkills(Array.from(foundSkills));

    return extractedSkills;
  }

  private extractExperience(sections: ResumeSection[]): any[] {
    const experienceSection = sections.find(s => s.type === 'experience');
    if (!experienceSection) return [];

    const experiences = [];
    const lines = experienceSection.content.split('\n');
    let currentExp: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if this is a job title line
      if (this.isJobTitleLine(trimmed)) {
        if (currentExp) experiences.push(currentExp);
        
        currentExp = {
          jobTitle: this.extractJobTitle(trimmed),
          companyName: this.extractCompanyName(trimmed),
          startDate: this.extractDate(trimmed, 'start'),
          endDate: this.extractDate(trimmed, 'end'),
          duration: '',
          responsibilities: [],
          impactKeywords: [],
          technologies: []
        };
      } else if (currentExp && this.isResponsibilityLine(trimmed)) {
        currentExp.responsibilities.push(trimmed);
        currentExp.impactKeywords.push(...this.extractImpactKeywords(trimmed));
        currentExp.technologies.push(...this.extractTechnologies(trimmed));
      }
    }

    if (currentExp) experiences.push(currentExp);
    return experiences;
  }

  private extractEducation(sections: ResumeSection[]): any[] {
    const educationSection = sections.find(s => s.type === 'education');
    if (!educationSection) return [];

    const education = [];
    const lines = educationSection.content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (this.isEducationLine(trimmed)) {
        education.push({
          degree: this.extractDegree(trimmed),
          institution: this.extractInstitution(trimmed),
          year: this.extractYear(trimmed),
          cgpa: this.extractCGPA(trimmed),
          location: this.extractLocation(trimmed)
        });
      }
    }

    return education;
  }

  private extractProjects(sections: ResumeSection[]): any[] {
    const projectsSection = sections.find(s => s.type === 'projects');
    if (!projectsSection) return [];

    const projects = [];
    const lines = projectsSection.content.split('\n');
    let currentProject: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (this.isProjectTitleLine(trimmed)) {
        if (currentProject) projects.push(currentProject);
        
        currentProject = {
          name: this.extractProjectName(trimmed),
          description: '',
          techStack: [],
          outcomes: [],
          metrics: [],
          link: this.extractLink(trimmed)
        };
      } else if (currentProject) {
        if (!currentProject.description) {
          currentProject.description = trimmed;
        } else {
          currentProject.outcomes.push(trimmed);
        }
        currentProject.techStack.push(...this.extractTechnologies(trimmed));
        currentProject.metrics.push(...this.extractMetrics(trimmed));
      }
    }

    if (currentProject) projects.push(currentProject);
    return projects;
  }

  private extractAchievements(sections: ResumeSection[]): any[] {
    const achievementsSection = sections.find(s => s.type === 'achievements');
    if (!achievementsSection) return [];

    const achievements = [];
    const lines = achievementsSection.content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      achievements.push({
        title: this.extractAchievementTitle(trimmed),
        description: trimmed,
        category: this.categorizeAchievement(trimmed),
        date: this.extractDate(trimmed)
      });
    }

    return achievements;
  }

  private extractCertifications(sections: ResumeSection[]): string[] {
    const certificationsSection = sections.find(s => s.type === 'certifications');
    if (!certificationsSection) return [];

    return certificationsSection.content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  // Helper methods
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private isJobTitleLine(line: string): boolean {
    return /^[A-Za-z\s]+(Developer|Engineer|Manager|Analyst|Consultant|Intern|Lead|Senior|Junior)/i.test(line) ||
           /\d{4}\s*-\s*\d{4}/.test(line);
  }

  private isResponsibilityLine(line: string): boolean {
    return /^[\s]*[•\-\*\+]/.test(line) || /^[A-Z]/.test(line);
  }

  private isEducationLine(line: string): boolean {
    return /(Bachelor|Master|PhD|Degree|University|College|Institute)/i.test(line);
  }

  private isProjectTitleLine(line: string): boolean {
    return /^[A-Za-z\s\-]+(:|\||–)/.test(line) || 
           (line.length < 100 && !/^[•\-\*]/.test(line) && /[A-Z]/.test(line[0]));
  }

  private extractJobTitle(line: string): string {
    const match = line.match(/^([^|@\-–]+)[\s|@\-–]/);
    return match ? match[1].trim() : line.split(' ').slice(0, 3).join(' ');
  }

  private extractCompanyName(line: string): string {
    const patterns = [
      /@\s*([^|\-–]+)/,
      /\|\s*([^|\-–]+)/,
      /–\s*([^|\-–]+)/,
      /-\s*([^|\-–]+)/
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  private extractDate(line: string, type: 'start' | 'end' = 'start'): string {
    const datePattern = /\b(\d{1,2}\/\d{4}|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g;
    const matches = line.match(datePattern);
    
    if (!matches) return '';
    
    return type === 'start' ? matches[0] : matches[matches.length - 1];
  }

  private extractImpactKeywords(line: string): string[] {
    const impactWords = ['increased', 'improved', 'reduced', 'achieved', 'implemented', 'developed', 'created', 'optimized', 'enhanced', 'delivered'];
    return impactWords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(line));
  }

  private extractTechnologies(line: string): string[] {
    const technologies: string[] = [];
    const allSkills = Object.values(SKILL_DICTIONARY).flat();
    
    for (const skill of allSkills) {
      if (new RegExp(`\\b${this.escapeRegex(skill)}\\b`, 'i').test(line)) {
        technologies.push(skill);
      }
    }
    
    return technologies;
  }

  private extractMetrics(line: string): string[] {
    const metricPatterns = [
      /\d+%/g,
      /\$\d+/g,
      /\d+k/gi,
      /\d+\s*(users?|customers?|clients?)/gi,
      /\d+\s*(hours?|days?|weeks?|months?)/gi
    ];
    
    const metrics: string[] = [];
    for (const pattern of metricPatterns) {
      const matches = line.match(pattern);
      if (matches) metrics.push(...matches);
    }
    
    return metrics;
  }

  private extractDegree(line: string): string {
    const degreePattern = /(Bachelor|Master|PhD|B\.Tech|M\.Tech|B\.E|M\.E|B\.Sc|M\.Sc|MBA|BCA|MCA)[^,|]*/i;
    const match = line.match(degreePattern);
    return match ? match[0].trim() : '';
  }

  private extractInstitution(line: string): string {
    const parts = line.split(/[,|–\-]/);
    return parts.length > 1 ? parts[1].trim() : '';
  }

  private extractYear(line: string): string {
    const yearPattern = /\b(19|20)\d{2}\b/;
    const match = line.match(yearPattern);
    return match ? match[0] : '';
  }

  private extractCGPA(line: string): string {
    const cgpaPattern = /\b\d\.\d{1,2}\b/;
    const match = line.match(cgpaPattern);
    return match ? match[0] : '';
  }

  private extractProjectName(line: string): string {
    const colonIndex = line.indexOf(':');
    const pipeIndex = line.indexOf('|');
    const dashIndex = line.indexOf('–');
    
    const endIndex = Math.min(
      ...[colonIndex, pipeIndex, dashIndex].filter(i => i !== -1)
    );
    
    return endIndex !== Infinity ? line.substring(0, endIndex).trim() : line.trim();
  }

  private extractLink(line: string): string {
    const linkPattern = /(https?:\/\/[^\s]+)/;
    const match = line.match(linkPattern);
    return match ? match[0] : '';
  }

  private extractAchievementTitle(line: string): string {
    return line.split(/[:\-–]/)[0].trim();
  }

  private categorizeAchievement(line: string): 'academic' | 'professional' | 'personal' | 'certification' {
    if (/certified?|certification|course/i.test(line)) return 'certification';
    if (/academic|school|university|college|grade|cgpa/i.test(line)) return 'academic';
    if (/work|professional|company|project|team/i.test(line)) return 'professional';
    return 'personal';
  }

  private calculateSectionConfidence(line: string, sectionType: string): number {
    const exactMatch = new RegExp(`^${sectionType}$`, 'i').test(line.trim());
    const partialMatch = new RegExp(sectionType, 'i').test(line);
    
    if (exactMatch) return 0.95;
    if (partialMatch) return 0.75;
    return 0.5;
  }

  private calculateConfidence(text: string, sections: ResumeSection[], data: EnhancedExtractionData): ParseConfidence {
    const textClarity = this.calculateTextClarity(text);
    const structureDetection = this.calculateStructureScore(sections);
    const entityCount = this.calculateEntityScore(data);
    const sectionCompleteness = this.calculateSectionCompleteness(sections);
    
    const overall = (
      textClarity * this.confidenceWeights.textClarity +
      structureDetection * this.confidenceWeights.structureDetection +
      entityCount * this.confidenceWeights.entityCount +
      sectionCompleteness * this.confidenceWeights.sectionCompleteness
    );

    return {
      overall,
      sections: {
        contact: data.personalInfo.name ? 0.9 : 0.3,
        experience: data.experience.length > 0 ? 0.8 : 0.2,
        education: data.education.length > 0 ? 0.8 : 0.2,
        skills: Object.values(data.skills).flat().length > 0 ? 0.7 : 0.1,
        projects: data.projects.length > 0 ? 0.7 : 0.3,
        achievements: data.achievements.length > 0 ? 0.6 : 0.4
      },
      textClarity,
      structureDetection,
      entityCount
    };
  }

  private calculateTextClarity(text: string): number {
    const totalChars = text.length;
    const printableChars = text.replace(/[^\x20-\x7E]/g, '').length;
    const wordCount = text.split(/\s+/).length;
    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;
    
    const printableRatio = printableChars / totalChars;
    const readabilityScore = Math.min(avgWordLength / 6, 1);
    
    return (printableRatio * 0.7 + readabilityScore * 0.3);
  }

  private calculateStructureScore(sections: ResumeSection[]): number {
    const expectedSections = ['contact', 'experience', 'education', 'skills'];
    const foundSections = sections.map(s => s.type);
    const foundExpected = expectedSections.filter(s => foundSections.includes(s as any));
    
    return foundExpected.length / expectedSections.length;
  }

  private calculateEntityScore(data: EnhancedExtractionData): number {
    const entityCounts = {
      contact: Object.values(data.personalInfo).filter(v => v && v.length > 0).length,
      experience: data.experience.length,
      education: data.education.length,
      skills: Object.values(data.skills).flat().length,
      projects: data.projects.length,
      achievements: data.achievements.length
    };

    const totalEntities = Object.values(entityCounts).reduce((sum, count) => sum + count, 0);
    return Math.min(totalEntities / 20, 1); // Normalize against expected 20 entities
  }

  private calculateSectionCompleteness(sections: ResumeSection[]): number {
    const completenessScores = sections.map(section => {
      const wordCount = section.content.split(/\s+/).length;
      const minWords = { contact: 3, experience: 20, education: 5, skills: 5, projects: 10, achievements: 5 };
      const expected = minWords[section.type as keyof typeof minWords] || 5;
      
      return Math.min(wordCount / expected, 1);
    });

    return completenessScores.reduce((sum, score) => sum + score, 0) / completenessScores.length;
  }

  private generateWarnings(confidence: ParseConfidence, data: EnhancedExtractionData): string[] {
    const warnings: string[] = [];

    if (confidence.overall < 0.6) {
      warnings.push('Low parsing confidence - results may be inaccurate');
    }

    if (confidence.textClarity < 0.5) {
      warnings.push('Poor text quality detected - consider using a higher quality PDF');
    }

    if (!data.personalInfo.email) {
      warnings.push('Email not found - this may affect contact information accuracy');
    }

    if (data.experience.length === 0) {
      warnings.push('No work experience detected - this will limit career progression predictions');
    }

    if (Object.values(data.skills).flat().length < 5) {
      warnings.push('Few skills detected - consider adding more technical skills to your resume');
    }

    return warnings;
  }
}

export const enhancedPDFParser = new EnhancedPDFParser();
