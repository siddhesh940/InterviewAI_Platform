import { convertToLegacyFormat, deterministicParser } from '@/lib/pdf-parser-deterministic';
import { FuturePrediction } from '@/types/time-machine';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      resumeText,
      targetRole,
      timeGoal,
      interviewScores = {},
      strengths = [],
      weaknesses = [],
      technicalPatterns = [],
      communicationPatterns = {}
    } = body;

    // Validate required fields
    if (!resumeText || !targetRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: resumeText and targetRole are required' 
        },
        { status: 400 }
      );
    }

    console.log('🤖 Starting Time Machine analysis for:', { targetRole, timeGoal });

    // Generate enhanced prediction using ultimate parsing
    const prediction = await generateUltimateFuturePrediction({
      resumeText,
      targetRole,
      timeGoal: timeGoal || 90,
      interviewScores,
      strengths,
      weaknesses,
      technicalPatterns,
      communicationPatterns
    });

    return NextResponse.json({
      success: true,
      prediction,
      processingTime: Date.now(),
    });

  } catch (error) {
    console.error('❌ Error in time-machine analysis:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error during AI analysis' 
      },
      { status: 500 }
    );
  }
}

// Ultimate Future Prediction Generator
async function generateUltimateFuturePrediction(data: {
  resumeText: string;
  targetRole: string;
  timeGoal: number;
  interviewScores?: any;
  strengths?: string[];
  weaknesses?: string[];
  technicalPatterns?: any[];
  communicationPatterns?: any;
}): Promise<FuturePrediction> {
  
  const { resumeText, targetRole, timeGoal } = data;
  
  console.log('🚀 Starting ultimate Time Machine analysis...');
  
  // STEP 1: Parse resume with DETERMINISTIC parser - same resume = same result
  const rawResult = deterministicParser.parse(resumeText);
  const parsedResume = convertToLegacyFormat(rawResult);
  console.log(`📊 Parsing: ${(parsedResume.confidence.overall * 100).toFixed(1)}% confidence`);
  console.log(`🔑 Parse ID: ${rawResult.parseId} (same resume = same ID)`);
  
  // STEP 2: Calculate current metrics
  const currentExperience = calculateExperienceYears(parsedResume.extractedData.experience);
  const currentSalary = estimateCurrentSalaryInLPA(parsedResume, targetRole, currentExperience);
  
  console.log(`👤 Current: ${currentExperience}yr exp, ₹${currentSalary}L salary`);
  
  // STEP 3: Generate timeframe-specific predictions
  const futureSalary = predictFutureSalaryInLPA(currentSalary, currentExperience, targetRole, timeGoal);
  const skillProgression = generateTimeframedSkillProgression(parsedResume.extractedData.skills, targetRole, timeGoal);
  const futureProjects = generateTimeframedProjects(targetRole, skillProgression, timeGoal);
  const achievements = generateTimeframedAchievements(targetRole, timeGoal, futureSalary - currentSalary);
  const roadmap = generateTimeframedRoadmap(targetRole, timeGoal, skillProgression);
  
  // Calculate time-goal specific comparison values
  const currentSkillCount = Object.values(parsedResume.extractedData.skills).flat().length;
  const currentProjectCount = parsedResume.extractedData.projects.length;
  
  // Base current metrics on actual resume data
  const currentConfidence = Math.min(40 + (currentSkillCount * 2) + (currentProjectCount * 5) + (currentExperience * 8), 75);
  const currentTechnicalDepth = Math.min(35 + (currentSkillCount * 2.5) + (currentExperience * 6), 70);
  const currentReadiness = Math.min(30 + (currentSkillCount * 1.5) + (currentProjectCount * 8) + (currentExperience * 10), 65);
  
  // Future metrics scale with time goal
  const timeGrowthMultipliers: { [key: number]: { confidence: number; depth: number; readiness: number } } = {
    30: { confidence: 1.15, depth: 1.12, readiness: 1.20 },
    60: { confidence: 1.30, depth: 1.25, readiness: 1.40 },
    90: { confidence: 1.45, depth: 1.40, readiness: 1.55 }
  };
  const growthMult = timeGrowthMultipliers[timeGoal] || timeGrowthMultipliers[60];
  
  const futureConfidence = Math.min(Math.round(currentConfidence * growthMult.confidence), 95);
  const futureTechnicalDepth = Math.min(Math.round(currentTechnicalDepth * growthMult.depth), 90);
  const futureReadiness = Math.min(Math.round(currentReadiness * growthMult.readiness), 95);
  
  console.log('✅ Ultimate analysis complete');
  
  return {
    targetRole,
    timeframe: `${timeGoal} days`,
    confidence: Math.max(parsedResume.confidence.overall * 1.2, 0.8), // Boost for UX
    skills: skillProgression,
    projects: futureProjects,
    jobRole: {
      predictedRole: targetRole,
      confidence: 0.9,
      reasoning: `Achievable through ${timeGoal}-day focused development with ${currentExperience} years base experience`,
      requirements: getRoleRequirements(targetRole),
      readinessScore: calculateReadinessScore(parsedResume.extractedData, targetRole, timeGoal)
    },
    salary: {
      // Clean salary range format (₹X - ₹Y LPA)
      estimate: `₹${Math.round(futureSalary * 0.9)} - ₹${Math.round(futureSalary * 1.1)} LPA`,
      range: {
        min: Math.round(futureSalary * 0.85),
        max: Math.round(futureSalary * 1.15)
      },
      currency: 'INR',
      timeline: `After ${timeGoal} days of focused development`,
      growth: `₹${Math.round((futureSalary - currentSalary) * 0.8)} - ₹${Math.round((futureSalary - currentSalary) * 1.2)} LPA increase`,
      reasoning: `Based on ${currentExperience} years experience, skill development trajectory, and ${targetRole} market demand in India`,
      factors: [
        `${currentExperience > 1 ? 'Experience upgrade' : 'Fresher to experienced transition'}`,
        `${futureProjects.length} portfolio projects completion`,
        `${targetRole} market demand (${timeGoal <= 30 ? 'short-term' : timeGoal <= 60 ? 'medium-term' : 'long-term'} outlook)`,
        `${Object.keys(skillProgression).length} skills enhanced or acquired`
      ]
    },
    achievements,
    roadmap,
    comparison: {
      current: {
        // Deterministic skill levels based on skill name hash
        skills: Object.values(parsedResume.extractedData.skills).flat().reduce((acc: any, skill, index) => {
          const baseLevel = 50 + ((skill.charCodeAt(0) + index) % 20); // Deterministic based on skill name
          return { ...acc, [skill]: baseLevel };
        }, {}),
        confidence: Math.round(currentConfidence),
        technicalDepth: Math.round(currentTechnicalDepth),
        projects: currentProjectCount,
        readinessLevel: Math.round(currentReadiness)
      },
      future: {
        skills: skillProgression,
        confidence: futureConfidence,
        technicalDepth: futureTechnicalDepth,
        projects: currentProjectCount + futureProjects.length,
        readinessLevel: futureReadiness
      }
    },
    futureResume: generateFutureResume(parsedResume.extractedData, skillProgression, futureProjects, targetRole),
    generatedAt: new Date().toISOString(),
    version: '3.0-ultimate'
  };
}

// Helper functions for analysis
function calculateExperienceYears(experiences: any[]): number {
  if (!experiences || experiences.length === 0) {return 0.5;}
  
  let totalMonths = 0;
  const currentYear = new Date().getFullYear();
  
  for (const exp of experiences) {
    const startYear = parseInt(exp.startDate?.match(/\d{4}/)?.[0] || (currentYear - 1).toString());
    const endYear = exp.endDate?.toLowerCase().includes('present') || exp.endDate?.toLowerCase().includes('current')
      ? currentYear
      : parseInt(exp.endDate?.match(/\d{4}/)?.[0] || currentYear.toString());
    
    totalMonths += Math.max((endYear - startYear) * 12, 6);
  }
  
  return Math.max(totalMonths / 12, 0.5);
}

function estimateCurrentSalaryInLPA(parsedResume: any, targetRole: string, experience: number): number {
  const baseSalaries: { [key: string]: number } = {
    'Frontend Developer': 3.5,
    'Backend Developer': 4.5,
    'Full Stack Developer': 5.5,
    'Data Scientist': 6.5,
    'DevOps Engineer': 7,
    'Product Manager': 8,
    'UI/UX Designer': 4,
    'Mobile App Developer': 5,
    'QA Engineer': 3.5,
    'Software Engineer': 5
  };
  
  const baseSalary = baseSalaries[targetRole] || 5;
  const experienceMultiplier = 1 + (Math.min(experience, 10) * 0.6); // 60% per year, capped at 10 years
  const skillCount = Object.values(parsedResume.extractedData.skills).flat().length;
  const skillMultiplier = 1 + (Math.min(skillCount, 20) * 0.03); // 3% per skill, capped at 20
  
  return Math.round(baseSalary * experienceMultiplier * skillMultiplier * 100) / 100;
}

function predictFutureSalaryInLPA(currentSalary: number, experience: number, targetRole: string, timeGoal: number): number {
  // Time-goal specific growth rates (realistic scaling)
  const timeGrowthRates: { [key: number]: number } = {
    30: 0.08,  // 8% growth in 30 days (limited but focused improvement)
    60: 0.18,  // 18% growth in 60 days (moderate, visible improvement)
    90: 0.30   // 30% growth in 90 days (significant but achievable)
  };
  
  const growthRate = timeGrowthRates[timeGoal] || 0.15;
  
  // Role-specific multipliers
  const roleMultipliers: { [key: string]: number } = {
    'Frontend Developer': 1.15,
    'Backend Developer': 1.25,
    'Full Stack Developer': 1.35,
    'Data Scientist': 1.45,
    'DevOps Engineer': 1.4,
    'Product Manager': 1.3,
    'UI/UX Designer': 1.1
  };
  
  const roleMultiplier = roleMultipliers[targetRole] || 1.2;
  
  // Experience factor (faster growth for less experienced)
  const experienceFactor = experience < 2 ? 1.15 : experience < 5 ? 1.10 : 1.05;
  
  // Calculate future salary with clean rounding
  const futureSalary = currentSalary * (1 + growthRate) * roleMultiplier * experienceFactor;
  
  // Round to 2 decimal places for clean display (e.g., 15.52, not 15.519999...)
  return Math.round(futureSalary * 100) / 100;
}

function generateTimeframedSkillProgression(extractedSkills: any, targetRole: string, timeGoal: number): any {
  const allExtractedSkills = Object.values(extractedSkills).flat() as string[];
  const targetSkills = getTargetSkillsForRole(targetRole);
  const progression: any = {};
  
  // Time-goal specific growth rates
  const timeGrowthFactors: { [key: number]: { existing: number; new: number; maxNew: number } } = {
    30: { existing: 0.25, new: 0.5, maxNew: 50 },   // Limited growth in 30 days
    60: { existing: 0.35, new: 0.7, maxNew: 65 },   // Moderate growth in 60 days
    90: { existing: 0.45, new: 0.85, maxNew: 80 }   // Significant growth in 90 days
  };
  
  const growthFactor = timeGrowthFactors[timeGoal] || timeGrowthFactors[60];
  
  // Progress existing skills - limit based on time goal (DETERMINISTIC)
  const maxExistingSkills = Math.min(Math.ceil(timeGoal / 10), 10);
  for (let i = 0; i < Math.min(allExtractedSkills.length, maxExistingSkills); i++) {
    const skill = allExtractedSkills[i];
    // Deterministic current level based on skill name
    const seedValue = skill.charCodeAt(0) + (skill.length * 3) + i;
    const currentLevel = 55 + (seedValue % 20); // 55-75 range, deterministic
    const baseGrowth = (15 + (seedValue % 10)) * growthFactor.existing; // Deterministic growth
    const futureLevel = Math.min(currentLevel + baseGrowth, 95);
    
    progression[skill] = {
      current: Math.round(currentLevel),
      future: Math.round(futureLevel),
      improvement: Math.round(futureLevel - currentLevel),
      marketRelevance: getMarketRelevance(skill, targetRole),
      priority: 'High',
      reasoning: `Existing skill enhanced over ${timeGoal} days of focused practice`
    };
  }
  
  // Add new essential skills - number based on time goal (DETERMINISTIC)
  const newSkills = targetSkills.filter(skill => 
    !allExtractedSkills.some(existing => 
      existing.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(existing.toLowerCase())
    )
  );
  
  // Max new skills based on time goal: 30 days = 2, 60 days = 4, 90 days = 6
  const maxNewSkills = Math.min(Math.floor(timeGoal / 15), 6);
  for (let i = 0; i < Math.min(newSkills.length, maxNewSkills); i++) {
    const skill = newSkills[i];
    // Deterministic base level for new skills
    const seedValue = skill.charCodeAt(0) + (skill.length * 2) + i;
    const baseLevel = 20 + (seedValue % 15);
    const futureLevel = Math.min(baseLevel * growthFactor.new, growthFactor.maxNew);
    
    progression[skill] = {
      current: 0,
      future: Math.round(futureLevel),
      improvement: Math.round(futureLevel),
      marketRelevance: getMarketRelevance(skill, targetRole),
      priority: getSkillPriority(skill, targetRole),
      reasoning: `New skill acquired during ${timeGoal}-day intensive learning`
    };
  }
  
  return progression;
}

function calculateSkillGrowthRate(skill: string, timeGoal: number): number {
  const baseGrowthPerDay = 0.4; // 0.4 points per day
  const difficultyMultiplier = getSkillDifficultyMultiplier(skill);
  
return Math.round(baseGrowthPerDay * timeGoal * difficultyMultiplier);
}

function calculateNewSkillLevel(skill: string, timeGoal: number): number {
  const baseGrowthPerDay = 0.6; // Faster initial growth for new skills
  const difficultyMultiplier = getSkillDifficultyMultiplier(skill);
  
return Math.min(Math.round(baseGrowthPerDay * timeGoal * difficultyMultiplier), 80);
}

function getSkillDifficultyMultiplier(skill: string): number {
  const easySkills = ['HTML', 'CSS', 'Git', 'VS Code', 'Figma', 'Bootstrap'];
  const hardSkills = ['Machine Learning', 'Kubernetes', 'System Design', 'Blockchain', 'Deep Learning'];
  
  const skillLower = skill.toLowerCase();
  if (easySkills.some(s => skillLower.includes(s.toLowerCase()))) {return 1.3;}
  if (hardSkills.some(s => skillLower.includes(s.toLowerCase()))) {return 0.8;}
  
return 1.0;
}

function getTargetSkillsForRole(targetRole: string): string[] {
  const skillMap: { [key: string]: string[] } = {
    'Frontend Developer': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'JavaScript', 'Redux', 'GraphQL', 'Jest'],
    'Backend Developer': ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express.js', 'Docker', 'AWS', 'Redis'],
    'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'Docker', 'AWS', 'GraphQL'],
    'Data Scientist': ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'SQL', 'Jupyter', 'Machine Learning'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Linux', 'Python', 'Prometheus'],
    'Product Manager': ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'Agile', 'SQL', 'Analytics'],
    'UI/UX Designer': ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Wireframing', 'Usability Testing', 'Adobe Creative Suite', 'Sketch'],
    'Mobile App Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI', 'App Store Optimization', 'Push Notifications'],
    'QA Engineer': ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'Manual Testing', 'API Testing', 'Performance Testing', 'Bug Tracking']
  };
  
  return skillMap[targetRole] || skillMap['_targetRole Developer'];
}

function getMarketRelevance(skill: string, targetRole: string): number {
  const highDemandSkills = ['React', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Node.js', 'SQL'];
  const mediumDemandSkills = ['Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Kubernetes'];
  
  const skillLower = skill.toLowerCase();
  if (highDemandSkills.some(s => skillLower.includes(s.toLowerCase()))) {return 9;}
  if (mediumDemandSkills.some(s => skillLower.includes(s.toLowerCase()))) {return 7;}
  
return 6;
}

function getSkillPriority(skill: string, targetRole: string): 'High' | 'Medium' | 'Low' {
  const coreSkills = getTargetSkillsForRole(targetRole).slice(0, 5);
  const skillLower = skill.toLowerCase();
  
  if (coreSkills.some(core => skillLower.includes(core.toLowerCase()) || core.toLowerCase().includes(skillLower))) {
    return 'High';
  }
  
return 'Medium';
}

function generateTimeframedProjects(targetRole: string, skillProgression: any, timeGoal: number): any[] {
  // Time-goal specific project counts: 30 days = 2, 60 days = 3, 90 days = 4
  const projectCounts: { [key: number]: number } = {
    30: 2,
    60: 3,
    90: 4
  };
  const projectCount = projectCounts[timeGoal] || Math.min(Math.max(Math.floor(timeGoal / 25), 2), 4);
  const availableSkills = Object.keys(skillProgression).filter(skill => skillProgression[skill].future > 40);
  const missingSkills = Object.keys(skillProgression).filter(skill => skillProgression[skill].current === 0);
  
  const projectTemplates = getProjectTemplatesForRole(targetRole);
  
  return projectTemplates.slice(0, projectCount).map((template, index) => {
    // Filter tech stack based on available skills
    const relevantTechStack = template.techStack.filter((tech: string) => 
      availableSkills.some(skill => 
        skill.toLowerCase().includes(tech.toLowerCase()) ||
        tech.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 6);

    // Determine which gaps this project addresses
    const addressesGaps = missingSkills.filter(skill =>
      template.techStack.some((tech: string) =>
        skill.toLowerCase().includes(tech.toLowerCase()) ||
        tech.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 3);

    return {
      title: template.title,
      techStack: relevantTechStack.length > 0 ? relevantTechStack : template.techStack.slice(0, 4),
      role: targetRole,
      description: template.description,
      impact: template.impact,
      reasoning: `Project designed for ${targetRole} skill development within ${timeGoal}-day timeline`,
      timeline: getProjectTimeline(timeGoal, index + 1, projectCount),
      difficulty: getProjectDifficulty(timeGoal, index + 1, projectCount),
      // Enhanced project details
      whatYouWillBuild: template.whatYouWillBuild || generateWhatYouWillBuild(template.title, template.techStack),
      whyThisMatters: template.whyThisMatters || generateWhyThisMatters(targetRole, template.title, timeGoal),
      whatRecruiterLearns: template.whatRecruiterLearns || generateWhatRecruiterLearns(targetRole, template.techStack, template.difficulty || 'Intermediate'),
      resumeImpact: template.resumeImpact || generateResumeImpact(targetRole, template.title, index + 1),
      addressesSkillGaps: addressesGaps,
      learningOutcomes: template.learningOutcomes || generateLearningOutcomes(template.techStack, targetRole)
    };
  });
}

// Helper functions for enhanced project details
function generateWhatYouWillBuild(title: string, techStack: string[]): string[] {
  const buildItems: { [key: string]: string[] } = {
    'E-commerce Platform UI': [
      'Responsive product catalog with grid/list views',
      'Advanced filtering and search functionality',
      'Shopping cart with persistent state',
      'Checkout flow with form validation',
      'User authentication and profile pages'
    ],
    'Real-time Analytics Dashboard': [
      'Interactive charts with Chart.js/D3.js',
      'Real-time data updates via WebSocket',
      'Customizable widget layout system',
      'Data export functionality (CSV, PDF)',
      'Role-based access control'
    ],
    'Progressive Web App': [
      'Offline-first architecture with service workers',
      'Push notification system',
      'Background sync for data persistence',
      'App installation prompts',
      'Responsive mobile-first design'
    ],
    'Microservices API Gateway': [
      'JWT-based authentication middleware',
      'Rate limiting and request throttling',
      'API versioning and documentation',
      'Load balancing across services',
      'Centralized logging and monitoring'
    ],
    'Social Media Platform': [
      'User registration and authentication',
      'Post creation with media uploads',
      'Real-time notifications and messaging',
      'Follow/friend system with feeds',
      'Search and discovery features'
    ],
    'Project Management SaaS': [
      'Kanban board with drag-and-drop',
      'Team collaboration features',
      'Task assignment and deadlines',
      'File attachments and comments',
      'Project analytics and reporting'
    ]
  };

  return buildItems[title] || [
    `Core ${techStack[0] || 'application'} functionality`,
    'User authentication system',
    'RESTful API integration',
    'Responsive UI components',
    'Error handling and validation'
  ];
}

function generateWhyThisMatters(targetRole: string, projectTitle: string, timeGoal: number): string {
  const intensity = timeGoal <= 30 ? 'foundational' : timeGoal <= 60 ? 'solid' : 'comprehensive';

  return `This project demonstrates ${intensity} ${targetRole} capabilities that hiring managers actively seek. Building ${projectTitle} shows you can handle real-world challenges, work with production-grade tools, and deliver complete solutions within ${timeGoal} days.`;
}

function generateWhatRecruiterLearns(targetRole: string, techStack: string[], difficulty: string): string[] {
  const basePoints = [
    `Proficient in ${techStack.slice(0, 3).join(', ')}`,
    `Can build ${difficulty.toLowerCase()}-level applications`,
    `Understands ${targetRole} best practices`
  ];
  
  const roleSpecific: { [key: string]: string[] } = {
    'Frontend Developer': ['UI/UX implementation skills', 'State management expertise', 'Performance optimization awareness'],
    'Backend Developer': ['API design capabilities', 'Database optimization skills', 'Security-conscious development'],
    'Full Stack Developer': ['End-to-end development ability', 'System architecture understanding', 'DevOps familiarity']
  };
  
  return [...basePoints, ...(roleSpecific[targetRole] || ['Problem-solving abilities', 'Code quality focus'])];
}

function generateResumeImpact(targetRole: string, projectTitle: string, projectNumber: number): string {
  const impacts = [
    `Adds a standout portfolio piece demonstrating ${targetRole} expertise`,
    `Shows practical experience with industry-standard tools and workflows`,
    `Provides concrete talking points for technical interviews`,
    `Demonstrates ability to complete projects from concept to deployment`
  ];

  return impacts[projectNumber - 1] || impacts[0];
}

function generateLearningOutcomes(techStack: string[], targetRole: string): string[] {
  return [
    `Master ${techStack[0] || 'core technology'} patterns and best practices`,
    'Implement production-ready architecture',
    'Handle real-world edge cases and error scenarios',
    `Apply ${targetRole} industry standards`,
    'Build deployable, maintainable code'
  ];
}

function getProjectTemplatesForRole(targetRole: string): any[] {
  const templates: { [key: string]: any[] } = {
    'Frontend Developer': [
      { 
        title: 'E-commerce Platform UI', 
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'React Query'], 
        description: 'Modern responsive e-commerce interface with advanced filtering, search, and shopping cart functionality',
        impact: 'Enhanced user experience with 40% better conversion rates',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Real-time Analytics Dashboard', 
        techStack: ['Next.js', 'Chart.js', 'WebSocket', 'TypeScript', 'Recharts'], 
        description: 'Interactive dashboard with real-time data visualization, customizable widgets, and export features',
        impact: 'Improved data insights accessibility for business teams',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Progressive Web App', 
        techStack: ['React', 'PWA', 'Service Workers', 'IndexedDB', 'Workbox'], 
        description: 'Offline-capable productivity app with push notifications and background sync',
        impact: 'Increased user engagement through seamless offline experience',
        difficulty: 'Advanced'
      },
      { 
        title: 'Design System Library', 
        techStack: ['React', 'Storybook', 'TypeScript', 'CSS-in-JS', 'Jest'], 
        description: 'Reusable component library with documentation, theming, and accessibility support',
        impact: 'Reduced development time by 30% through component reusability',
        difficulty: 'Advanced'
      }
    ],
    'Backend Developer': [
      { 
        title: 'Microservices API Gateway', 
        techStack: ['Node.js', 'Express', 'Docker', 'Redis', 'JWT'], 
        description: 'Scalable API gateway with authentication, rate limiting, and load balancing',
        impact: 'Reduced response times by 50% and improved system reliability',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Real-time Messaging System', 
        techStack: ['Socket.io', 'MongoDB', 'JWT', 'Redis', 'Node.js'], 
        description: 'High-performance chat system supporting thousands of concurrent users with message persistence',
        impact: 'Enabled real-time communication for 10,000+ concurrent users',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Data Processing Pipeline', 
        techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Celery', 'RabbitMQ'], 
        description: 'Automated ETL pipeline with background job processing, error handling, and monitoring',
        impact: 'Processed 1M+ records daily with 99.9% reliability',
        difficulty: 'Advanced'
      },
      { 
        title: 'RESTful API with GraphQL', 
        techStack: ['Node.js', 'GraphQL', 'PostgreSQL', 'Prisma', 'Apollo'], 
        description: 'Flexible API layer supporting both REST and GraphQL with automatic documentation',
        impact: 'Improved developer experience and reduced API response payload by 60%',
        difficulty: 'Advanced'
      }
    ],
    'Full Stack Developer': [
      { 
        title: 'Social Media Platform', 
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Socket.io'], 
        description: 'Complete social networking platform with real-time features, posts, and messaging',
        impact: 'Built scalable platform supporting 50K+ active users',
        difficulty: 'Advanced'
      },
      { 
        title: 'Project Management SaaS', 
        techStack: ['React', 'Express', 'MongoDB', 'Socket.io', 'Stripe'], 
        description: 'Collaborative project management tool with real-time updates and subscription billing',
        impact: 'Improved team productivity by 35% through better collaboration',
        difficulty: 'Intermediate'
      },
      { 
        title: 'E-learning Marketplace', 
        techStack: ['Vue.js', 'Django', 'PostgreSQL', 'AWS S3', 'Stripe'], 
        description: 'Online education platform with video streaming, payment integration, and progress tracking',
        impact: 'Enabled 5,000+ students to access quality education online',
        difficulty: 'Advanced'
      },
      { 
        title: 'Job Board Platform', 
        techStack: ['Next.js', 'Node.js', 'MongoDB', 'Elasticsearch', 'Redis'], 
        description: 'Full-featured job posting and application platform with search and recommendations',
        impact: 'Connected 1,000+ job seekers with relevant opportunities',
        difficulty: 'Intermediate'
      }
    ],
    'Data Scientist': [
      { 
        title: 'ML Pipeline Dashboard', 
        techStack: ['Python', 'Streamlit', 'scikit-learn', 'Pandas', 'Plotly'], 
        description: 'Interactive ML model training and evaluation dashboard with visualization',
        impact: 'Reduced model iteration time by 40% through streamlined workflow',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Predictive Analytics System', 
        techStack: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Docker'], 
        description: 'End-to-end ML system with data preprocessing, model serving, and monitoring',
        impact: 'Achieved 85% prediction accuracy for business forecasting',
        difficulty: 'Advanced'
      },
      { 
        title: 'NLP Text Analysis Tool', 
        techStack: ['Python', 'spaCy', 'Hugging Face', 'Flask', 'Redis'], 
        description: 'Text classification and sentiment analysis tool with API endpoints',
        impact: 'Automated document classification with 90% accuracy',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Data Visualization Portfolio', 
        techStack: ['Python', 'D3.js', 'Jupyter', 'Seaborn', 'Dash'], 
        description: 'Interactive data storytelling platform with advanced visualizations',
        impact: 'Communicated complex insights to non-technical stakeholders',
        difficulty: 'Beginner'
      }
    ],
    'DevOps Engineer': [
      { 
        title: 'CI/CD Pipeline System', 
        techStack: ['GitHub Actions', 'Docker', 'Kubernetes', 'Terraform', 'ArgoCD'], 
        description: 'Automated deployment pipeline with testing, staging, and production environments',
        impact: 'Reduced deployment time from hours to minutes',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Infrastructure Monitoring Dashboard', 
        techStack: ['Prometheus', 'Grafana', 'Docker', 'Alertmanager', 'Node Exporter'], 
        description: 'Comprehensive monitoring solution with alerting and visualization',
        impact: 'Achieved 99.9% uptime through proactive monitoring',
        difficulty: 'Intermediate'
      },
      { 
        title: 'Container Orchestration Platform', 
        techStack: ['Kubernetes', 'Helm', 'Docker', 'Istio', 'Terraform'], 
        description: 'Production-ready Kubernetes cluster with service mesh and auto-scaling',
        impact: 'Scaled applications seamlessly during 10x traffic spikes',
        difficulty: 'Advanced'
      },
      { 
        title: 'GitOps Workflow System', 
        techStack: ['ArgoCD', 'Git', 'Kubernetes', 'Kustomize', 'Sealed Secrets'], 
        description: 'GitOps-based deployment system with automated rollbacks and secret management',
        impact: 'Enabled self-service deployments for development teams',
        difficulty: 'Advanced'
      }
    ]
  };
  
  return templates[targetRole] || templates['Full Stack Developer'];
}

function getProjectTimeline(totalDays: number, projectNumber: number, totalProjects: number): string {
  const daysPerProject = Math.floor(totalDays / totalProjects);
  const overlap = Math.floor(daysPerProject * 0.2); // 20% overlap
  const startDay = Math.max(1, (projectNumber - 1) * (daysPerProject - overlap) + 1);
  const duration = Math.min(daysPerProject, totalDays - startDay + 1);
  
  return `${duration} days (Starting day ${startDay})`;
}

function getProjectDifficulty(timeGoal: number, projectNumber: number, totalProjects: number): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (timeGoal <= 30) {return 'Beginner';}
  if (timeGoal <= 60) {return projectNumber <= totalProjects / 2 ? 'Beginner' : 'Intermediate';}
  
return projectNumber <= totalProjects / 3 ? 'Beginner' : projectNumber <= (2 * totalProjects) / 3 ? 'Intermediate' : 'Advanced';
}

function generateTimeframedAchievements(targetRole: string, timeGoal: number, salaryIncrease: number): any[] {
  return [
    {
      title: `${targetRole} Skill Mastery`,
      description: `Achieved proficiency in 8+ core ${targetRole} technologies and frameworks`,
      timeline: `${Math.floor(timeGoal * 0.7)} days`,
      difficulty: timeGoal > 60 ? 'Medium' : 'Easy' as 'Easy' | 'Medium' | 'Hard',
      category: 'Technical' as 'Technical' | 'Portfolio' | 'Career'
    },
    {
      title: 'Portfolio Development',
      description: `Built ${Math.min(Math.floor(timeGoal / 20), 5)} production-quality projects showcasing expertise`,
      timeline: `${timeGoal} days`,
      difficulty: (timeGoal <= 30 ? 'Easy' : timeGoal <= 60 ? 'Medium' : 'Hard') as 'Easy' | 'Medium' | 'Hard',
      category: 'Portfolio' as 'Technical' | 'Portfolio' | 'Career'
    },
    {
      title: `Salary Growth: ₹${salaryIncrease.toFixed(1)}L`,
      description: `Achieved significant salary increase through targeted skill development and market positioning`,
      timeline: `${timeGoal} days`,
      difficulty: (salaryIncrease > 2 ? 'Hard' : salaryIncrease > 1 ? 'Medium' : 'Easy') as 'Easy' | 'Medium' | 'Hard',
      category: 'Career' as 'Technical' | 'Portfolio' | 'Career'
    }
  ];
}

function generateTimeframedRoadmap(targetRole: string, timeGoal: number, skillProgression: any): any {
  const roadmap: any = {};
  const phases = Math.ceil(timeGoal / 30);
  
  // 30-day foundation phase
  roadmap.day30 = {
    goals: [
      `Master ${targetRole} fundamentals`,
      'Build first portfolio project',
      'Establish 3-hour daily learning routine',
      'Join relevant tech communities'
    ],
    dailyPlan: [
      { day: 1, activities: ['Environment setup', 'Core concepts study', 'First project planning'], timeCommitment: '3-4 hours', priority: 'High' },
      { day: 7, activities: ['Skill practice', 'Project development', 'Community engagement'], timeCommitment: '3-4 hours', priority: 'High' },
      { day: 14, activities: ['Advanced concepts', 'Project features', 'Code review'], timeCommitment: '3-4 hours', priority: 'Medium' },
      { day: 21, activities: ['Testing & deployment', 'Portfolio polish', 'Networking'], timeCommitment: '3-4 hours', priority: 'Medium' },
      { day: 30, activities: ['Project completion', 'Skill assessment', 'Next phase planning'], timeCommitment: '3-4 hours', priority: 'High' }
    ],
    weeklyMissions: [
      {
        week: 1,
        title: 'Foundation & Setup',
        objectives: ['Environment configuration', 'Core concept mastery', 'First project initiation'],
        deliverables: ['Configured development environment', 'Completed fundamental tutorials', 'Project repository created'],
        skillsToImprove: Object.keys(skillProgression).slice(0, 3)
      },
      {
        week: 2,
        title: 'Skill Development',
        objectives: ['Hands-on practice', 'Project feature development', 'Best practices adoption'],
        deliverables: ['Working project prototype', '10+ code commits', 'Documentation started'],
        skillsToImprove: Object.keys(skillProgression).slice(2, 5)
      },
      {
        week: 3,
        title: 'Advanced Implementation',
        objectives: ['Complex features', 'Testing implementation', 'Performance optimization'],
        deliverables: ['Feature-complete application', 'Test coverage >70%', 'Performance optimized'],
        skillsToImprove: Object.keys(skillProgression).slice(4, 6)
      },
      {
        week: 4,
        title: 'Polish & Deploy',
        objectives: ['Production readiness', 'Portfolio creation', 'Community engagement'],
        deliverables: ['Deployed application', 'Updated portfolio', 'Professional network growth'],
        skillsToImprove: ['Communication', 'Professional Development']
      }
    ],
    monthlyMilestones: [
      'Complete first major project',
      'Master 5+ core technologies',
      'Build professional online presence',
      'Establish learning routine'
    ],
    focusAreas: Object.keys(skillProgression).slice(0, 6)
  };
  
  if (phases >= 2) {
    roadmap.day60 = {
      goals: [
        `Achieve intermediate ${targetRole} proficiency`,
        'Complete 2-3 portfolio projects',
        'Contribute to open source',
        'Build industry connections'
      ],
      dailyPlan: [
        { day: 31, activities: ['Advanced concepts', 'Second project start', 'Open source exploration'], timeCommitment: '3-4 hours', priority: 'High' }
      ],
      weeklyMissions: [
        {
          week: 5,
          title: 'Intermediate Development',
          objectives: ['Advanced patterns', 'Second project', 'Open source contributions'],
          deliverables: ['Advanced features implemented', 'Open source PR submitted', 'Second project started'],
          skillsToImprove: Object.keys(skillProgression).slice(4, 8)
        }
      ],
      monthlyMilestones: [
        'Complete second major project',
        'Make meaningful open source contribution',
        'Attend tech meetups/conferences',
        'Mentor junior developers'
      ],
      focusAreas: Object.keys(skillProgression).slice(3, 10)
    };
  }
  
  if (phases >= 3) {
    roadmap.day90 = {
      goals: [
        `Achieve advanced ${targetRole} competency`,
        'Lead collaborative projects',
        'Establish thought leadership',
        'Prepare for role transition'
      ],
      dailyPlan: [
        { day: 61, activities: ['Leadership projects', 'Content creation', 'Interview preparation'], timeCommitment: '4-5 hours', priority: 'High' }
      ],
      weeklyMissions: [
        {
          week: 9,
          title: 'Leadership & Expertise',
          objectives: ['Lead team projects', 'Create educational content', 'Industry engagement'],
          deliverables: ['Team project leadership', 'Technical blog posts', 'Speaking engagements'],
          skillsToImprove: ['Leadership', 'Communication', 'Strategic Thinking']
        }
      ],
      monthlyMilestones: [
        'Complete capstone project',
        'Establish thought leadership',
        'Build strong professional network',
        'Successfully interview for target role'
      ],
      focusAreas: Object.keys(skillProgression)
    };
  }
  
  return roadmap;
}

function getRoleRequirements(targetRole: string): string[] {
  const requirements: { [key: string]: string[] } = {
    'Frontend Developer': [
      'Proficiency in modern JavaScript frameworks (React/Vue/Angular)',
      'Strong understanding of HTML5, CSS3, and responsive design',
      'Experience with state management and component architecture',
      'Knowledge of build tools and development workflows',
      'Understanding of web performance optimization'
    ],
    'Backend Developer': [
      'Expertise in server-side programming languages',
      'Database design and optimization skills',
      'API development and integration experience',
      'Understanding of cloud services and deployment',
      'Security best practices and implementation'
    ],
    'Full Stack Developer': [
      'Frontend and backend development proficiency',
      'Full application lifecycle experience',
      'Database management and API integration',
      'Modern development practices and DevOps',
      'System architecture and scalability knowledge'
    ],
    'Data Scientist': [
      'Strong programming skills in Python/R',
      'Statistical analysis and machine learning expertise',
      'Data manipulation and visualization proficiency',
      'Experience with ML frameworks and tools',
      'Domain knowledge and business acumen'
    ]
  };
  
  return requirements[targetRole] || requirements['Full Stack Developer'];
}

function calculateReadinessScore(extractedData: any, targetRole: string, timeGoal: number): number {
  const skillCount = Object.values(extractedData.skills).flat().length;
  const experienceYears = calculateExperienceYears(extractedData.experience);
  const projectCount = extractedData.projects.length;
  const educationCount = extractedData.education.length;
  
  // Base scores from current resume
  const skillScore = Math.min(skillCount * 3, 25);
  const experienceScore = Math.min(experienceYears * 10, 20);
  const projectScore = Math.min(projectCount * 6, 15);
  const educationScore = Math.min(educationCount * 5, 10);
  
  // Time-goal specific bonus: more time = more readiness improvement
  const timeBonus: { [key: number]: number } = {
    30: 10,  // 30 days adds limited readiness
    60: 20,  // 60 days adds moderate readiness
    90: 30   // 90 days adds significant readiness
  };
  const timeScore = timeBonus[timeGoal] || 15;
  
  const totalScore = skillScore + experienceScore + projectScore + educationScore + timeScore;

  return Math.min(Math.round(totalScore), 100);
}

function generateFutureResume(extractedData: any, skillProgression: any, futureProjects: any[], targetRole: string): any {
  return {
    personalInfo: {
      name: extractedData.personalInfo.name || 'Professional',
      jobTitle: `Senior ${targetRole}`,
      email: extractedData.personalInfo.email || 'professional@email.com',
      phone: extractedData.personalInfo.phone || '+91-XXXXXXXXXX',
      linkedin: extractedData.personalInfo.linkedin || 'linkedin.com/in/professional',
      github: extractedData.personalInfo.github || 'github.com/professional',
      location: extractedData.personalInfo.location || 'India',
      summary: `Experienced ${targetRole} with enhanced expertise in ${Object.keys(skillProgression).slice(0, 6).join(', ')}. Proven track record of delivering high-quality solutions and leading technical initiatives.`
    },
    skills: {
      technical: Object.keys(skillProgression).filter(skill => skillProgression[skill].future > 70).slice(0, 12),
      soft: ['Problem Solving', 'Leadership', 'Team Collaboration', 'Communication', 'Critical Thinking'],
      tools: ['Git', 'Docker', 'VS Code', 'AWS', 'Jenkins', 'Jira']
    },
    experience: [
      ...extractedData.experience.map((exp: any) => ({
        role: exp.jobTitle,
        company: exp.companyName,
        duration: `${exp.startDate} - ${exp.endDate}`,
        description: exp.responsibilities?.join('. ') || `${exp.jobTitle} responsibilities at ${exp.companyName}`
      })),
      {
        role: `Senior ${targetRole}`,
        company: 'Future Growth Position',
        duration: `${new Date().getFullYear()} - Present`,
        description: `Leading ${targetRole} initiatives with focus on ${Object.keys(skillProgression).slice(0, 3).join(', ')}. Delivered ${futureProjects.length} major projects with significant business impact.`
      }
    ],
    projects: futureProjects.map(project => ({
      title: project.title,
      techStack: project.techStack,
      description: project.description,
      githubLink: `https://github.com/professional/${project.title.toLowerCase().replace(/\s+/g, '-')}`
    })),
    education: extractedData.education.map((edu: any) => ({
      degree: edu.degree,
      college: edu.institution,
      year: edu.year,
      cgpa: edu.cgpa || 'N/A'
    })),
    certifications: [
      ...extractedData.certifications,
      `${targetRole} Professional Certification`,
      'Cloud Architecture Certification',
      'Agile/Scrum Master Certification'
    ],
    achievements: [
      `Completed intensive ${targetRole} skill development program`,
      `Built ${futureProjects.length} production-quality applications`,
      'Achieved significant salary growth through skill enhancement',
      'Established strong professional network in tech industry'
    ],
    atsScore: 92,
    improvements: [
      `Enhanced ${Object.keys(skillProgression).length} core technical skills`,
      `Completed ${futureProjects.length} portfolio projects`,
      'Improved market readiness by 35%',
      'Gained industry-relevant certifications and recognition'
    ]
  };
}
