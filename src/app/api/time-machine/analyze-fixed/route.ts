/**
 * TIME MACHINE v4.0 - PRODUCTION-READY
 * =====================================
 * Resume-Aware • Confidence-Gated • Evidence-Driven • Non-Hallucinating
 * 
 * ABSOLUTE RULES:
 * 1. Never assume experience, projects, education, or skills not explicitly present
 * 2. If resume data is missing or weak, DOWNGRADE predictions
 * 3. Respect parsing_confidence as a HARD GATE
 * 4. Mark estimates as conservative if confidence < 60%
 * 5. Never hallucinate seniority, salary, or skills
 * 6. Internship ≠ 0 experience (treat as 0.5-1 year junior experience)
 * 7. Fresher profiles MUST have modest salary and growth predictions
 * 8. All outputs must be realistic for Indian job market (LPA)
 */

import { convertToLegacyFormat, deterministicParser } from '@/lib/pdf-parser-deterministic';
import { NextRequest, NextResponse } from 'next/server';


interface StrictPrediction {
  // REQUIRED FIELDS - All must be present
  confidence_level: 'LOW' | 'MEDIUM' | 'HIGH';
  data_warning: string | null;
  
  profile_summary: {
    career_stage: 'Fresher' | 'Intern' | 'Early Career' | 'Junior' | 'Mid-Level';
    resume_strength: 'Weak' | 'Moderate' | 'Strong';
    experience_years: number;
    reasoning: string;
  };
  
  skills_analysis: SkillAnalysis[];
  
  salary_prediction: {
    current_lpa: string;
    future_lpa: string;
    justification: string;
    is_conservative: boolean;
  };
  
  project_recommendations: ProjectRecommendation[];
  
  roadmap_30_60_90: {
    day_30: string[];
    day_60: string[];
    day_90: string[];
  };
  
  final_note: string;
  
  // Legacy compatibility fields
  targetRole: string;
  timeframe: string;
  confidence: number;
  skills: Record<string, SkillData>;
  projects: FutureProject[];
  jobRole: JobRolePrediction;
  salary: SalaryInfo;
  achievements: Achievement[];
  roadmap: RoadmapData;
  comparison: ComparisonData;
  futureResume: FutureResumeData;
  generatedAt: string;
  version: string;
}

interface SkillAnalysis {
  skill: string;
  current_level: number;
  future_level: number;
  improvement: number;
  note: 'existing' | 'new' | 'recommended';
  is_from_resume: boolean;
}

interface SkillData {
  current: number;
  future: number;
  improvement: number;
  marketRelevance: number;
  priority: string;
  reasoning: string;
}

interface ProjectRecommendation {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeline_days: number;
  why_this_project: string;
  tech_stack: string[];
}

interface FutureProject {
  title: string;
  techStack: string[];
  role: string;
  description: string;
  impact: string;
  reasoning: string;
  timeline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface JobRolePrediction {
  predictedRole: string;
  confidence: number;
  reasoning: string;
  requirements: string[];
  readinessScore: number;
}

interface SalaryInfo {
  estimate: string;
  range: { min: number; max: number };
  currency: string;
  timeline: string;
  growth?: string;
  reasoning: string;
  factors: string[];
}

interface Achievement {
  title: string;
  description: string;
  timeline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Technical' | 'Portfolio' | 'Career';
}

interface RoadmapData {
  day30?: PhaseData;
  day60?: PhaseData;
  day90?: PhaseData;
}

interface PhaseData {
  goals: string[];
  focusAreas: string[];
  weeklyMissions: WeeklyMission[];
  monthlyMilestones: string[];
}

interface WeeklyMission {
  week: number;
  title: string;
  objectives: string[];
  deliverables: string[];
  skillsToImprove: string[];
}

interface ComparisonData {
  current: MetricsSnapshot;
  future: MetricsSnapshot;
}

interface MetricsSnapshot {
  skills: Record<string, number>;
  confidence: number;
  technicalDepth: number;
  projects: number;
  readinessLevel: number;
}

interface FutureResumeData {
  personalInfo: any;
  skills: any;
  experience: any[];
  projects: any[];
  education: any[];
  certifications: string[];
  achievements: string[];
  atsScore: number;
  improvements: string[];
}

// ============================================================================
// SALARY CAPS - INDIAN MARKET (STRICT - NO EXCEPTIONS)
// ============================================================================

const SALARY_CAPS: Record<string, Record<number, { min: number; max: number }>> = {
  fresher: {
    30: { min: 3, max: 6 },   // 3-6 LPA
    60: { min: 4, max: 7 },   // 4-7 LPA
    90: { min: 5, max: 8 },   // 5-8 LPA
  },
  intern: {
    30: { min: 2.5, max: 5 },
    60: { min: 3, max: 6 },
    90: { min: 4, max: 7 },
  },
  junior: {  // 1-2 years
    30: { min: 5, max: 9 },
    60: { min: 6, max: 10 },
    90: { min: 7, max: 12 },  // ABSOLUTE MAX 12 LPA
  },
  early_career: {  // 2-4 years
    30: { min: 8, max: 14 },
    60: { min: 9, max: 16 },
    90: { min: 10, max: 18 },
  },
  mid_level: {  // 4+ years
    30: { min: 12, max: 22 },
    60: { min: 14, max: 25 },
    90: { min: 16, max: 30 },
  }
};

// ============================================================================
// SKILL PROGRESSION LIMITS (REALISTIC - NO MAGIC)
// ============================================================================

const SKILL_LIMITS: Record<string, Record<number, { max_improvement?: number; max_level?: number }>> = {
  existing_skill: {
    30: { max_improvement: 10 },  // Max +10% in 30 days
    60: { max_improvement: 18 },  // Max +18% in 60 days
    90: { max_improvement: 25 },  // Max +25% in 90 days
  },
  new_skill: {
    30: { max_level: 20 },   // New skill can reach max 20% in 30 days
    60: { max_level: 35 },   // Max 35% in 60 days
    90: { max_level: 50 },   // Max 50% in 90 days (still beginner-intermediate)
  }
};

// ============================================================================
// EXTRACTION FAILURE RESPONSE (CRITICAL - NEVER PROCEED TO AI)
// ============================================================================

function createExtractionFailureResponse(startTime: number, reason: string) {
  return NextResponse.json({
    success: false,
    errorCode: 'EXTRACTION_FAILED',
    message: 'Cannot generate predictions without valid resume data.',
    reason,
    prediction: null,
    solutions: [
      'Re-upload your resume using Word/Google Docs PDF export',
      'Use the "Paste Text Instead" option',
      'Ensure your PDF contains selectable text'
    ],
    processingTime: Date.now() - startTime
  }, { status: 422 });
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const { resumeText, targetRole, timeGoal = 90, extractionConfidence } = body;

    // =========================================================================
    // CRITICAL GATE 1: Check if resume text exists
    // =========================================================================
    if (!resumeText || !targetRole) {
      return NextResponse.json({
        success: false,
        errorCode: 'MISSING_FIELDS',
        message: 'Missing required fields: resumeText and targetRole are required',
        prediction: null,
        processingTime: Date.now() - startTime
      }, { status: 400 });
    }

    // =========================================================================
    // CRITICAL GATE 2: Check extraction quality (NEVER PROCEED IF FAILED)
    // =========================================================================
    const textLength = resumeText.trim().length;
    
    if (textLength < 50) {
      console.log(`🚫 BLOCKED: Resume text too short (${textLength} chars)`);

      return createExtractionFailureResponse(startTime, `Resume text is only ${textLength} characters. Minimum 50 required for analysis.`);
    }

    // Check for gibberish (CID fonts without Unicode mapping)
    const gibberishRatio = (resumeText.match(/[^\x20-\x7E\n\u00A0-\u024F]/g) || []).length / textLength;
    if (gibberishRatio > 0.4) {
      console.log(`🚫 BLOCKED: Resume text appears to be gibberish (${(gibberishRatio * 100).toFixed(1)}% non-printable)`);

      return createExtractionFailureResponse(startTime, 'Resume text appears corrupted or contains unsupported characters.');
    }

    // Check for minimum resume keywords
    const hasKeywords = /experience|education|skills?|projects?|work/i.test(resumeText);
    if (!hasKeywords && textLength < 200) {
      console.log(`🚫 BLOCKED: Resume text lacks basic keywords`);

      return createExtractionFailureResponse(startTime, 'Resume text does not contain expected sections (skills, experience, education).');
    }

    console.log('🔒 Starting STRICT Time Machine analysis...');
    console.log(`   Target Role: ${targetRole}`);
    console.log(`   Time Goal: ${timeGoal} days`);
    console.log(`   Resume Length: ${textLength} chars`);
    if (extractionConfidence !== undefined) {
      console.log(`   Extraction Confidence: ${(extractionConfidence * 100).toFixed(1)}%`);
    }

    // Generate evidence-driven prediction
    const prediction = generateStrictPrediction({
      resumeText,
      targetRole,
      timeGoal: Math.min(Math.max(timeGoal, 30), 90) // Clamp to 30-90
    });

    return NextResponse.json({
      success: true,
      prediction,
      processingTime: Date.now() - startTime,
    });

  } catch (error) {
    console.error('❌ Time Machine Error:', error);
    
    return NextResponse.json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Internal server error',
      prediction: null,
      processingTime: Date.now() - startTime
    }, { status: 500 });
  }
}

// ============================================================================
// STRICT PREDICTION GENERATOR
// ============================================================================

function generateStrictPrediction(data: {
  resumeText: string;
  targetRole: string;
  timeGoal: number;
}): StrictPrediction {
  
  const { resumeText, targetRole, timeGoal } = data;
  
  // STEP 1: Parse resume with deterministic parser
  const rawResult = deterministicParser.parse(resumeText);
  const parsedResume = convertToLegacyFormat(rawResult);
  const parsingConfidence = parsedResume.confidence.overall * 100; // Convert to percentage
  
  console.log(`📊 Parsing Confidence: ${parsingConfidence.toFixed(1)}%`);
  
  // STEP 2: Apply CONFIDENCE GATE
  const confidenceGate = applyConfidenceGate(parsingConfidence);
  console.log(`🚦 Confidence Gate: ${confidenceGate.level} (${confidenceGate.behavior})`);
  
  // STEP 3: Extract ONLY what's in the resume (NO HALLUCINATION)
  const extractedSkills = extractVerifiedSkills(parsedResume.extractedData.skills);
  const experienceData = analyzeExperience(parsedResume.extractedData.experience);
  const projectCount = parsedResume.extractedData.projects?.length || 0;
  const educationCount = parsedResume.extractedData.education?.length || 0;
  
  console.log(`👤 Career Stage: ${experienceData.stage}`);
  console.log(`📋 Skills Found: ${extractedSkills.length}`);
  console.log(`💼 Experience: ${experienceData.years} years`);
  console.log(`🔨 Projects: ${projectCount}`);
  
  // STEP 4: Determine profile strength (HONEST assessment)
  const profileStrength = assessProfileStrength({
    skillCount: extractedSkills.length,
    experienceYears: experienceData.years,
    projectCount,
    educationCount,
    parsingConfidence
  });
  
  // STEP 5: Generate CONSERVATIVE predictions based on gate
  const skillsAnalysis = generateSkillsAnalysis({
    extractedSkills,
    targetRole,
    timeGoal,
    confidenceGate,
    profileStrength
  });
  
  const salaryPrediction = generateSalaryPrediction({
    experienceData,
    targetRole,
    timeGoal,
    confidenceGate,
    skillCount: extractedSkills.length,
    projectCount
  });
  
  const projectRecommendations = generateProjectRecommendations({
    existingProjects: projectCount,
    targetRole,
    timeGoal,
    extractedSkills
  });
  
  const roadmap = generateRoadmap({
    targetRole,
    timeGoal,
    extractedSkills,
    experienceData,
    confidenceGate
  });
  
  // STEP 6: Generate data warning if needed
  const dataWarning = generateDataWarning(parsingConfidence, extractedSkills.length, projectCount, experienceData);
  
  // STEP 7: Generate honest final note
  const finalNote = generateFinalNote(confidenceGate, profileStrength, experienceData.stage);
  
  // STEP 8: Build legacy-compatible output
  const legacySkills = buildLegacySkills(skillsAnalysis, targetRole, timeGoal);
  const legacyProjects = buildLegacyProjects(projectRecommendations, targetRole);
  const legacyComparison = buildLegacyComparison(skillsAnalysis, projectCount, projectRecommendations.length, confidenceGate);
  const legacyRoadmap = buildLegacyRoadmap(roadmap, targetRole, extractedSkills);
  const legacyAchievements = buildLegacyAchievements(targetRole, timeGoal, experienceData, confidenceGate);
  const legacyFutureResume = buildLegacyFutureResume(parsedResume.extractedData, skillsAnalysis, legacyProjects, targetRole, confidenceGate);
  
  return {
    // NEW STRICT FORMAT
    confidence_level: confidenceGate.level,
    data_warning: dataWarning,
    
    profile_summary: {
      career_stage: experienceData.stage,
      resume_strength: profileStrength,
      experience_years: experienceData.years,
      reasoning: generateProfileReasoning(experienceData, extractedSkills.length, projectCount, parsingConfidence)
    },
    
    skills_analysis: skillsAnalysis,
    
    salary_prediction: salaryPrediction,
    
    project_recommendations: projectRecommendations,
    
    roadmap_30_60_90: roadmap,
    
    final_note: finalNote,
    
    // LEGACY COMPATIBILITY
    targetRole,
    timeframe: `${timeGoal} days`,
    confidence: Math.min(parsingConfidence / 100, confidenceGate.maxConfidence),
    skills: legacySkills,
    projects: legacyProjects,
    jobRole: {
      predictedRole: targetRole,
      confidence: Math.min(0.5 + (parsingConfidence / 200), confidenceGate.maxConfidence),
      reasoning: `${confidenceGate.behavior === 'conservative' ? 'Conservative estimate: ' : ''}Achievable through ${timeGoal}-day focused development based on current ${experienceData.stage} profile`,
      requirements: getRoleRequirements(targetRole),
      readinessScore: calculateReadinessScore(extractedSkills.length, experienceData.years, projectCount, parsingConfidence)
    },
    salary: {
      estimate: salaryPrediction.future_lpa,
      range: parseSalaryRange(salaryPrediction.future_lpa),
      currency: 'INR',
      timeline: `After ${timeGoal} days of focused development`,
      growth: calculateSalaryGrowth(salaryPrediction.current_lpa, salaryPrediction.future_lpa),
      reasoning: salaryPrediction.justification,
      factors: getSalaryFactors(experienceData, extractedSkills.length, projectCount, confidenceGate)
    },
    achievements: legacyAchievements,
    roadmap: legacyRoadmap,
    comparison: legacyComparison,
    futureResume: legacyFutureResume,
    generatedAt: new Date().toISOString(),
    version: '4.0-strict-evidence-driven'
  };
}

// ============================================================================
// CONFIDENCE GATE - CRITICAL LOGIC
// ============================================================================

interface ConfidenceGate {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  behavior: 'strict' | 'conservative' | 'normal';
  maxConfidence: number;
  salaryMultiplier: number;
  skillGrowthMultiplier: number;
  showWarning: boolean;
  warningMessage: string;
}

function applyConfidenceGate(parsingConfidence: number): ConfidenceGate {
  if (parsingConfidence >= 75) {
    return {
      level: 'HIGH',
      behavior: 'normal',
      maxConfidence: 0.85,
      salaryMultiplier: 1.0,
      skillGrowthMultiplier: 1.0,
      showWarning: false,
      warningMessage: ''
    };
  }
  
  if (parsingConfidence >= 50) {
    return {
      level: 'MEDIUM',
      behavior: 'conservative',
      maxConfidence: 0.70,
      salaryMultiplier: 0.85,
      skillGrowthMultiplier: 0.8,
      showWarning: true,
      warningMessage: 'Predictions are conservative due to partial resume data extraction.'
    };
  }
  
  // < 50% - STRICT MODE
  return {
    level: 'LOW',
    behavior: 'strict',
    maxConfidence: 0.50,
    salaryMultiplier: 0.7,
    skillGrowthMultiplier: 0.6,
    showWarning: true,
    warningMessage: 'Predictions are limited due to incomplete resume data. Consider improving your resume for better analysis.'
  };
}

// ============================================================================
// SKILL EXTRACTION - ONLY FROM RESUME (NO HALLUCINATION)
// ============================================================================

function extractVerifiedSkills(skillsData: any): string[] {
  if (!skillsData) {return [];}
  
  const allSkills: string[] = [];
  
  // Extract from all categories
  if (Array.isArray(skillsData)) {
    return skillsData.filter(s => typeof s === 'string' && s.trim().length > 0);
  }
  
  // Handle object format
  for (const category of Object.keys(skillsData)) {
    const categorySkills = skillsData[category];
    if (Array.isArray(categorySkills)) {
      for (const skill of categorySkills) {
        if (typeof skill === 'string' && skill.trim().length > 0) {
          allSkills.push(skill.trim());
        }
      }
    }
  }
  
  // Remove duplicates and return
  return Array.from(new Set(allSkills));
}

// ============================================================================
// EXPERIENCE ANALYSIS - INTERNSHIP = JUNIOR, NOT ZERO
// ============================================================================

interface ExperienceData {
  years: number;
  stage: 'Fresher' | 'Intern' | 'Early Career' | 'Junior' | 'Mid-Level';
  hasInternship: boolean;
  hasFullTime: boolean;
  salaryTier: string;
}

function analyzeExperience(experiences: any[]): ExperienceData {
  if (!experiences || experiences.length === 0) {
    return {
      years: 0,
      stage: 'Fresher',
      hasInternship: false,
      hasFullTime: false,
      salaryTier: 'fresher'
    };
  }
  
  let totalMonths = 0;
  let hasInternship = false;
  let hasFullTime = false;
  const currentYear = new Date().getFullYear();
  
  for (const exp of experiences) {
    const title = (exp.jobTitle || exp.title || '').toLowerCase();
    const isInternship = title.includes('intern') || title.includes('trainee') || title.includes('apprentice');
    
    if (isInternship) {
      hasInternship = true;
      // Internship = 6 months equivalent
      totalMonths += 6;
    } else {
      hasFullTime = true;
      
      // Calculate actual duration
      const startYear = parseInt(exp.startDate?.match(/\d{4}/)?.[0] || (currentYear - 1).toString());
      const endYear = exp.endDate?.toLowerCase().includes('present') || exp.endDate?.toLowerCase().includes('current')
        ? currentYear
        : parseInt(exp.endDate?.match(/\d{4}/)?.[0] || currentYear.toString());
      
      totalMonths += Math.max((endYear - startYear) * 12, 6);
    }
  }
  
  const years = Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal
  
  // Determine stage and salary tier
  if (years === 0 && !hasInternship) {
    return { years: 0, stage: 'Fresher', hasInternship, hasFullTime, salaryTier: 'fresher' };
  }
  
  if (hasInternship && !hasFullTime && years <= 0.5) {
    return { years: 0.5, stage: 'Intern', hasInternship, hasFullTime, salaryTier: 'intern' };
  }
  
  if (years < 1) {
    return { years, stage: 'Early Career', hasInternship, hasFullTime, salaryTier: 'fresher' };
  }
  
  if (years < 2) {
    return { years, stage: 'Junior', hasInternship, hasFullTime, salaryTier: 'junior' };
  }
  
  if (years < 4) {
    return { years, stage: 'Early Career', hasInternship, hasFullTime, salaryTier: 'early_career' };
  }
  
  return { years, stage: 'Mid-Level', hasInternship, hasFullTime, salaryTier: 'mid_level' };
}

// ============================================================================
// PROFILE STRENGTH ASSESSMENT
// ============================================================================

function assessProfileStrength(data: {
  skillCount: number;
  experienceYears: number;
  projectCount: number;
  educationCount: number;
  parsingConfidence: number;
}): 'Weak' | 'Moderate' | 'Strong' {
  const { skillCount, experienceYears, projectCount, educationCount, parsingConfidence } = data;
  
  let score = 0;
  
  // Skills (max 30 points)
  score += Math.min(skillCount * 3, 30);
  
  // Experience (max 30 points)
  score += Math.min(experienceYears * 10, 30);
  
  // Projects (max 20 points)
  score += Math.min(projectCount * 5, 20);
  
  // Education (max 10 points)
  score += Math.min(educationCount * 5, 10);
  
  // Parsing confidence impact (max 10 points)
  score += (parsingConfidence / 10);
  
  if (score >= 60) {return 'Strong';}
  if (score >= 30) {return 'Moderate';}
  
return 'Weak';
}

// ============================================================================
// SKILLS ANALYSIS - STRICT LIMITS
// ============================================================================

function generateSkillsAnalysis(data: {
  extractedSkills: string[];
  targetRole: string;
  timeGoal: number;
  confidenceGate: ConfidenceGate;
  profileStrength: 'Weak' | 'Moderate' | 'Strong';
}): SkillAnalysis[] {
  const { extractedSkills, targetRole, timeGoal, confidenceGate, profileStrength } = data;
  const analysis: SkillAnalysis[] = [];
  
  const timeKey = timeGoal as 30 | 60 | 90;
  const limits = SKILL_LIMITS.existing_skill[timeKey] || SKILL_LIMITS.existing_skill[30];
  const newLimits = SKILL_LIMITS.new_skill[timeKey] || SKILL_LIMITS.new_skill[30];
  
  // Existing skills from resume - DETERMINISTIC levels based on skill name
  for (let i = 0; i < Math.min(extractedSkills.length, 10); i++) {
    const skill = extractedSkills[i];
    
    // Deterministic current level based on skill name (no randomness)
    const seedValue = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const currentLevel = 40 + (seedValue % 25); // 40-65 range for existing skills
    
    // Apply strict improvement limits
    const maxImprovement = (limits.max_improvement || 10) * confidenceGate.skillGrowthMultiplier;
    const improvement = Math.min(
      Math.round(5 + (seedValue % 5) * confidenceGate.skillGrowthMultiplier),
      maxImprovement
    );
    
    const futureLevel = Math.min(currentLevel + improvement, 85); // Cap at 85%
    
    analysis.push({
      skill,
      current_level: Math.round(currentLevel),
      future_level: Math.round(futureLevel),
      improvement: Math.round(improvement),
      note: 'existing',
      is_from_resume: true
    });
  }
  
  // Recommended NEW skills (NOT in resume) - these start at 0
  const targetSkills = getTargetSkillsForRole(targetRole);
  const missingSkills = targetSkills.filter(skill => 
    !extractedSkills.some(existing => 
      existing.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(existing.toLowerCase())
    )
  );
  
  // Limit new skills based on profile strength
  const maxNewSkills = profileStrength === 'Weak' ? 2 : profileStrength === 'Moderate' ? 3 : 4;
  
  for (let i = 0; i < Math.min(missingSkills.length, maxNewSkills); i++) {
    const skill = missingSkills[i];
    const seedValue = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // New skills start at 0, can only reach limited level
    const maxLevel = newLimits.max_level || 20;
    const futureLevel = Math.min(
      Math.round((10 + (seedValue % 10)) * confidenceGate.skillGrowthMultiplier),
      maxLevel
    );
    
    analysis.push({
      skill,
      current_level: 0,
      future_level: futureLevel,
      improvement: futureLevel,
      note: 'recommended',
      is_from_resume: false
    });
  }
  
  return analysis;
}

// ============================================================================
// SALARY PREDICTION - STRICT INDIAN MARKET CAPS
// ============================================================================

function generateSalaryPrediction(data: {
  experienceData: ExperienceData;
  targetRole: string;
  timeGoal: number;
  confidenceGate: ConfidenceGate;
  skillCount: number;
  projectCount: number;
}): { current_lpa: string; future_lpa: string; justification: string; is_conservative: boolean } {
  
  const { experienceData, targetRole, timeGoal, confidenceGate, skillCount, projectCount } = data;
  
  // Get strict salary caps based on experience tier
  const timeKey = timeGoal as 30 | 60 | 90;
  const tierCaps = SALARY_CAPS[experienceData.salaryTier];
  const caps = tierCaps ? tierCaps[timeKey] || tierCaps[30] : SALARY_CAPS.fresher[30];
  
  // Calculate current salary based on evidence
  let currentMin = caps.min * 0.8;
  let currentMax = caps.min * 1.1;
  
  // Slight boost for skills and projects (MODEST)
  const skillBoost = Math.min(skillCount * 0.05, 0.5); // Max 0.5 LPA boost
  const projectBoost = Math.min(projectCount * 0.1, 0.3); // Max 0.3 LPA boost
  
  currentMin += skillBoost;
  currentMax += skillBoost + projectBoost;
  
  // Apply confidence gate multiplier
  const futureMin = (caps.min + skillBoost) * confidenceGate.salaryMultiplier;
  const futureMax = Math.min(caps.max, (caps.max + projectBoost)) * confidenceGate.salaryMultiplier;
  
  // Round to 1 decimal
  const formatRange = (min: number, max: number): string => {
    return `₹${Math.round(min * 10) / 10} - ₹${Math.round(max * 10) / 10} LPA`;
  };
  
  const isConservative = confidenceGate.behavior !== 'normal';
  
  // Generate justification
  let justification = '';
  if (experienceData.stage === 'Fresher') {
    justification = `Entry-level prediction for ${targetRole} in Indian market. ${skillCount > 0 ? `Based on ${skillCount} verified skills from resume.` : 'Limited skills data available.'} ${isConservative ? 'Estimates are conservative due to incomplete data.' : ''}`;
  } else if (experienceData.stage === 'Intern') {
    justification = `Internship experience valued at 0.5 years. Salary reflects transition from intern to entry-level ${targetRole}. ${isConservative ? 'Conservative estimate.' : ''}`;
  } else {
    justification = `Based on ${experienceData.years} years of experience, ${skillCount} verified skills, and ${projectCount} projects. ${isConservative ? 'Conservative estimate due to data quality.' : 'Realistic Indian market projection.'}`;
  }
  
  return {
    current_lpa: formatRange(currentMin, currentMax),
    future_lpa: formatRange(futureMin, futureMax),
    justification,
    is_conservative: isConservative
  };
}

// ============================================================================
// PROJECT RECOMMENDATIONS
// ============================================================================

function generateProjectRecommendations(data: {
  existingProjects: number;
  targetRole: string;
  timeGoal: number;
  extractedSkills: string[];
}): ProjectRecommendation[] {
  const { existingProjects, targetRole, timeGoal, extractedSkills } = data;
  const recommendations: ProjectRecommendation[] = [];
  
  // If projects < 2, MUST recommend projects
  const projectsNeeded = Math.max(2 - existingProjects, 1);
  const maxProjects = Math.min(Math.floor(timeGoal / 25), 3);
  const projectCount = Math.max(projectsNeeded, Math.min(maxProjects, 3));
  
  const templates = getProjectTemplatesForRole(targetRole);
  
  for (let i = 0; i < Math.min(templates.length, projectCount); i++) {
    const template = templates[i];
    
    // Determine difficulty based on skills and timeline
    let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (extractedSkills.length >= 5 && timeGoal >= 60) {
      difficulty = 'Intermediate';
    }
    if (extractedSkills.length >= 10 && timeGoal >= 90) {
      difficulty = i === 0 ? 'Intermediate' : 'Beginner';
    }
    
    // Calculate timeline
    const timelineDays = Math.floor(timeGoal / projectCount);
    
    // Generate reason - address resume gaps
    let reason = '';
    if (existingProjects < 2) {
      reason = `SUGGESTED PROJECT: Your resume shows ${existingProjects} project${existingProjects === 1 ? '' : 's'}. This project will strengthen your portfolio and demonstrate practical ${targetRole} skills.`;
    } else {
      reason = `Enhances your existing portfolio with ${targetRole}-specific skills and modern tech stack.`;
    }
    
    recommendations.push({
      title: template.title,
      difficulty,
      timeline_days: timelineDays,
      why_this_project: reason,
      tech_stack: template.techStack.filter((tech: string) => 
        extractedSkills.some(skill => 
          skill.toLowerCase().includes(tech.toLowerCase()) ||
          tech.toLowerCase().includes(skill.toLowerCase())
        ) || i === 0 // Include all tech for first project
      ).slice(0, 5)
    });
  }
  
  return recommendations;
}

// ============================================================================
// ROADMAP GENERATION
// ============================================================================

function generateRoadmap(data: {
  targetRole: string;
  timeGoal: number;
  extractedSkills: string[];
  experienceData: ExperienceData;
  confidenceGate: ConfidenceGate;
}): { day_30: string[]; day_60: string[]; day_90: string[] } {
  const { targetRole, timeGoal, extractedSkills, experienceData, confidenceGate } = data;
  
  const isFresher = experienceData.stage === 'Fresher' || experienceData.stage === 'Intern';
  const hasWeakProfile = confidenceGate.level === 'LOW';
  
  const day_30: string[] = [];
  const day_60: string[] = [];
  const day_90: string[] = [];
  
  // Day 30 actions - ALWAYS applicable
  if (hasWeakProfile) {
    day_30.push('📝 PRIORITY: Improve resume with detailed skill descriptions');
  }
  
  if (extractedSkills.length < 5) {
    day_30.push(`Learn core ${targetRole} fundamentals (focus on 2-3 essential skills)`);
  } else {
    day_30.push(`Strengthen existing ${extractedSkills.slice(0, 3).join(', ')} skills`);
  }
  
  day_30.push('Build 1 small portfolio project demonstrating core skills');
  day_30.push('Set up professional GitHub profile and LinkedIn');
  
  if (isFresher) {
    day_30.push('Research entry-level job requirements in your target companies');
  }
  
  // Day 60 actions
  if (timeGoal >= 60) {
    if (hasWeakProfile) {
      day_60.push('Complete resume enhancement with quantified achievements');
    }
    
    day_60.push(`Build intermediate project using ${targetRole} best practices`);
    day_60.push('Contribute to 1 open source project (even documentation)');
    day_60.push('Practice 10+ technical interview questions weekly');
    
    if (isFresher) {
      day_60.push('Apply to 5-10 relevant internship/fresher positions');
    } else {
      day_60.push('Network with professionals in target companies');
    }
  }
  
  // Day 90 actions
  if (timeGoal >= 90) {
    day_90.push('Complete capstone project demonstrating full-stack capability');
    day_90.push('Prepare case studies from your projects for interviews');
    day_90.push('Conduct mock interviews and refine responses');
    day_90.push('Apply actively to target positions with tailored applications');
    
    if (experienceData.stage === 'Junior' || experienceData.stage === 'Early Career') {
      day_90.push('Target mid-level positions or companies with growth potential');
    }
  }
  
  return { day_30, day_60, day_90 };
}

// ============================================================================
// WARNING & NOTE GENERATORS
// ============================================================================

function generateDataWarning(
  parsingConfidence: number,
  skillCount: number,
  projectCount: number,
  experienceData: ExperienceData
): string | null {
  const warnings: string[] = [];
  
  if (parsingConfidence < 40) {
    warnings.push('Predictions are LIMITED due to incomplete resume data.');
  } else if (parsingConfidence < 50) {
    warnings.push('Resume parsing had low confidence. Some sections may be missing.');
  }
  
  if (skillCount < 3) {
    warnings.push('Few skills detected. Consider adding more technical skills to your resume.');
  }
  
  if (projectCount < 2) {
    warnings.push('Limited projects found. Portfolio projects are essential for job applications.');
  }
  
  if (experienceData.stage === 'Fresher' && experienceData.years === 0) {
    warnings.push('No experience detected. Internships and personal projects can strengthen your profile.');
  }
  
  return warnings.length > 0 ? warnings.join(' ') : null;
}

function generateFinalNote(
  confidenceGate: ConfidenceGate,
  profileStrength: 'Weak' | 'Moderate' | 'Strong',
  careerStage: string
): string {
  if (confidenceGate.level === 'LOW') {
    return `⚠️ This analysis is based on limited resume data (${confidenceGate.level} confidence). Predictions are intentionally conservative. To get more accurate predictions, please ensure your resume includes: detailed skills section, work experience with dates, project descriptions, and education details. Focus on resume improvement before job applications.`;
  }
  
  if (confidenceGate.level === 'MEDIUM') {
    return `📊 This analysis is based on partial resume data. Predictions are conservative to ensure accuracy. Your ${profileStrength.toLowerCase()} profile as a ${careerStage} shows potential for growth. Consider adding more details to your resume for a more comprehensive analysis.`;
  }
  
  if (profileStrength === 'Weak') {
    return `📈 Based on your current ${careerStage} profile, predictions are modest but achievable. Focus on building your skills and portfolio to unlock higher growth potential. The roadmap prioritizes foundational improvements.`;
  }
  
  return `✅ Analysis based on verified resume data. Predictions are realistic for the Indian job market. Your ${profileStrength.toLowerCase()} profile provides a solid foundation for achieving the outlined goals within the specified timeframe.`;
}

function generateProfileReasoning(
  experienceData: ExperienceData,
  skillCount: number,
  projectCount: number,
  parsingConfidence: number
): string {
  const parts: string[] = [];
  
  parts.push(`${experienceData.years > 0 ? experienceData.years + ' years experience' : 'No prior experience detected'}`);
  parts.push(`${skillCount} skills verified from resume`);
  parts.push(`${projectCount} project${projectCount !== 1 ? 's' : ''} documented`);
  
  if (experienceData.hasInternship) {
    parts.push('internship experience counted as junior experience');
  }
  
  if (parsingConfidence < 60) {
    parts.push(`parsing confidence: ${parsingConfidence.toFixed(0)}% (some data may be missing)`);
  }
  
  return parts.join(', ') + '.';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTargetSkillsForRole(targetRole: string): string[] {
  const skillMap: Record<string, string[]> = {
    'Frontend Developer': ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Next.js', 'Tailwind CSS', 'Redux'],
    'Backend Developer': ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express.js', 'Docker', 'REST API', 'SQL'],
    'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'Docker', 'AWS', 'MongoDB'],
    'Data Scientist': ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'TensorFlow', 'Machine Learning', 'Statistics'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Terraform', 'Jenkins', 'Python'],
    'Product Manager': ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Agile', 'SQL', 'Stakeholder Management'],
    'UI/UX Designer': ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems', 'Adobe XD', 'Usability Testing'],
    'Mobile App Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI', 'REST API'],
    'QA Engineer': ['Test Automation', 'Selenium', 'Manual Testing', 'API Testing', 'JIRA', 'Agile', 'Bug Tracking'],
    'Software Engineer': ['JavaScript', 'Python', 'Java', 'SQL', 'Git', 'Data Structures', 'Algorithms', 'System Design']
  };
  
  return skillMap[targetRole] || skillMap['Software Engineer'];
}

function getProjectTemplatesForRole(targetRole: string): Array<{ title: string; techStack: string[]; description: string }> {
  const templates: Record<string, Array<{ title: string; techStack: string[]; description: string }>> = {
    'Frontend Developer': [
      { title: 'Personal Portfolio Website', techStack: ['React', 'TypeScript', 'Tailwind CSS'], description: 'Responsive portfolio showcasing projects' },
      { title: 'E-commerce Product Page', techStack: ['React', 'Redux', 'CSS'], description: 'Interactive product listing with cart' },
      { title: 'Dashboard UI', techStack: ['Next.js', 'Chart.js', 'TypeScript'], description: 'Data visualization dashboard' }
    ],
    'Backend Developer': [
      { title: 'REST API Service', techStack: ['Node.js', 'Express', 'MongoDB'], description: 'CRUD API with authentication' },
      { title: 'Task Management API', techStack: ['Python', 'FastAPI', 'PostgreSQL'], description: 'RESTful task management backend' },
      { title: 'Real-time Chat Backend', techStack: ['Node.js', 'Socket.io', 'Redis'], description: 'WebSocket-based chat server' }
    ],
    'Full Stack Developer': [
      { title: 'Blog Platform', techStack: ['Next.js', 'Node.js', 'MongoDB'], description: 'Full-stack blog with CMS' },
      { title: 'Task Tracker App', techStack: ['React', 'Express', 'PostgreSQL'], description: 'Complete task management application' },
      { title: 'Social Feed Clone', techStack: ['React', 'Node.js', 'MongoDB'], description: 'Social media feed with posts and comments' }
    ],
    'Data Scientist': [
      { title: 'Data Analysis Dashboard', techStack: ['Python', 'Pandas', 'Streamlit'], description: 'Interactive data exploration tool' },
      { title: 'ML Prediction Model', techStack: ['Python', 'Scikit-learn', 'Jupyter'], description: 'Predictive model with evaluation' },
      { title: 'Data Visualization Project', techStack: ['Python', 'Matplotlib', 'Seaborn'], description: 'Comprehensive data storytelling' }
    ],
    'DevOps Engineer': [
      { title: 'CI/CD Pipeline', techStack: ['Docker', 'GitHub Actions', 'AWS'], description: 'Automated deployment pipeline' },
      { title: 'Infrastructure as Code', techStack: ['Terraform', 'AWS', 'Linux'], description: 'Cloud infrastructure automation' },
      { title: 'Monitoring Dashboard', techStack: ['Prometheus', 'Grafana', 'Docker'], description: 'System monitoring solution' }
    ],
    'Mobile App Developer': [
      { title: 'Todo App', techStack: ['React Native', 'Firebase'], description: 'Cross-platform task manager' },
      { title: 'Weather App', techStack: ['Flutter', 'REST API'], description: 'Weather forecast application' },
      { title: 'Expense Tracker', techStack: ['React Native', 'SQLite'], description: 'Personal finance tracking app' }
    ],
    'QA Engineer': [
      { title: 'Test Automation Suite', techStack: ['Selenium', 'Python', 'pytest'], description: 'Automated UI testing framework' },
      { title: 'API Testing Project', techStack: ['Postman', 'Newman', 'JavaScript'], description: 'Comprehensive API test collection' },
      { title: 'Performance Testing', techStack: ['JMeter', 'Grafana'], description: 'Load testing and monitoring' }
    ],
    'UI/UX Designer': [
      { title: 'Mobile App Redesign', techStack: ['Figma', 'Prototyping'], description: 'Complete app redesign case study' },
      { title: 'Design System', techStack: ['Figma', 'Design Tokens'], description: 'Reusable component library' },
      { title: 'User Research Study', techStack: ['User Interviews', 'Usability Testing'], description: 'End-to-end UX research project' }
    ],
    'Product Manager': [
      { title: 'Product Roadmap', techStack: ['Notion', 'Miro', 'Analytics'], description: 'Strategic product planning document' },
      { title: 'Feature Specification', techStack: ['PRD', 'User Stories', 'Wireframes'], description: 'Complete feature documentation' },
      { title: 'Market Analysis', techStack: ['Research', 'Competitive Analysis', 'SQL'], description: 'Market opportunity assessment' }
    ]
  };
  
  return templates[targetRole] || templates['Full Stack Developer'];
}

function getRoleRequirements(targetRole: string): string[] {
  const requirements: Record<string, string[]> = {
    'Frontend Developer': [
      'Proficiency in React/Vue/Angular',
      'Strong HTML, CSS, JavaScript fundamentals',
      'Responsive design and cross-browser compatibility',
      'State management understanding',
      'Basic understanding of REST APIs'
    ],
    'Backend Developer': [
      'Server-side language proficiency (Node.js/Python/Java)',
      'Database design and SQL knowledge',
      'API development experience',
      'Understanding of authentication and security',
      'Basic DevOps and deployment knowledge'
    ],
    'Full Stack Developer': [
      'Frontend and backend development skills',
      'Database management experience',
      'API integration capabilities',
      'Understanding of full application lifecycle',
      'Version control and collaboration tools'
    ],
    'Data Scientist': [
      'Strong Python programming skills',
      'Statistical analysis knowledge',
      'Machine learning fundamentals',
      'Data manipulation and cleaning abilities',
      'Visualization and communication skills'
    ],
    'DevOps Engineer': [
      'Container orchestration (Docker, Kubernetes)',
      'Cloud platform experience (AWS/GCP/Azure)',
      'CI/CD pipeline implementation',
      'Infrastructure as Code (Terraform/Ansible)',
      'Monitoring and logging solutions'
    ],
    'Mobile App Developer': [
      'React Native or Flutter proficiency',
      'Native development basics (Swift/Kotlin)',
      'Mobile UI/UX best practices',
      'App store deployment experience',
      'API integration and state management'
    ],
    'QA Engineer': [
      'Test automation frameworks',
      'Manual testing methodologies',
      'API testing experience',
      'Bug tracking and documentation',
      'Performance testing basics'
    ],
    'UI/UX Designer': [
      'Figma/Sketch proficiency',
      'User research methodologies',
      'Wireframing and prototyping',
      'Design system creation',
      'Usability testing experience'
    ],
    'Product Manager': [
      'Product strategy and roadmapping',
      'User research and analytics',
      'Stakeholder management',
      'Agile/Scrum methodologies',
      'Technical understanding and communication'
    ]
  };
  
  return requirements[targetRole] || requirements['Full Stack Developer'];
}

function calculateReadinessScore(
  skillCount: number,
  experienceYears: number,
  projectCount: number,
  parsingConfidence: number
): number {
  let score = 0;
  
  // Skills contribution (max 30)
  score += Math.min(skillCount * 3, 30);
  
  // Experience contribution (max 30)
  score += Math.min(experienceYears * 10, 30);
  
  // Projects contribution (max 25)
  score += Math.min(projectCount * 8, 25);
  
  // Confidence penalty for low parsing
  const confidencePenalty = parsingConfidence < 50 ? 15 : parsingConfidence < 75 ? 5 : 0;
  score -= confidencePenalty;
  
  return Math.max(10, Math.min(score, 85)); // Cap between 10-85
}

function parseSalaryRange(salaryString: string): { min: number; max: number } {
  const matches = salaryString.match(/₹([\d.]+)\s*-\s*₹([\d.]+)/);
  if (matches) {
    return {
      min: parseFloat(matches[1]),
      max: parseFloat(matches[2])
    };
  }
  
return { min: 4, max: 8 }; // Default fallback
}

function calculateSalaryGrowth(current: string, future: string): string {
  const currentRange = parseSalaryRange(current);
  const futureRange = parseSalaryRange(future);
  
  const growthMin = Math.round((futureRange.min - currentRange.min) * 10) / 10;
  const growthMax = Math.round((futureRange.max - currentRange.max) * 10) / 10;
  
  if (growthMin <= 0 && growthMax <= 0) {
    return 'Focus on skill building before salary growth';
  }
  
  return `₹${Math.max(0, growthMin)} - ₹${Math.max(0, growthMax)} LPA potential growth`;
}

function getSalaryFactors(
  experienceData: ExperienceData,
  skillCount: number,
  projectCount: number,
  confidenceGate: ConfidenceGate
): string[] {
  const factors: string[] = [];
  
  factors.push(`${experienceData.years > 0 ? experienceData.years + ' years' : 'Entry-level'} experience`);
  factors.push(`${skillCount} verified technical skills`);
  factors.push(`${projectCount} portfolio project${projectCount !== 1 ? 's' : ''}`);
  
  if (confidenceGate.behavior !== 'normal') {
    factors.push('Conservative estimate due to data quality');
  }
  
  factors.push('Indian job market salary ranges');
  
  return factors;
}

// ============================================================================
// LEGACY FORMAT BUILDERS (for backward compatibility)
// ============================================================================

function buildLegacySkills(
  skillsAnalysis: SkillAnalysis[],
  targetRole: string,
  timeGoal: number
): Record<string, SkillData> {
  const skills: Record<string, SkillData> = {};
  
  for (const skill of skillsAnalysis) {
    skills[skill.skill] = {
      current: skill.current_level,
      future: skill.future_level,
      improvement: skill.improvement,
      marketRelevance: skill.is_from_resume ? 8 : 6,
      priority: skill.is_from_resume ? 'High' : 'Medium',
      reasoning: skill.is_from_resume 
        ? `Existing skill from resume - enhanced over ${timeGoal} days`
        : `Recommended skill for ${targetRole} - learning curve applied`
    };
  }
  
  return skills;
}

function buildLegacyProjects(
  recommendations: ProjectRecommendation[],
  targetRole: string
): FutureProject[] {
  return recommendations.map(rec => ({
    title: rec.title,
    techStack: rec.tech_stack,
    role: targetRole,
    description: rec.why_this_project,
    impact: `Demonstrates ${targetRole} capabilities`,
    reasoning: rec.why_this_project,
    timeline: `${rec.timeline_days} days`,
    difficulty: rec.difficulty
  }));
}

function buildLegacyComparison(
  skillsAnalysis: SkillAnalysis[],
  currentProjects: number,
  newProjects: number,
  confidenceGate: ConfidenceGate
): ComparisonData {
  const currentSkills: Record<string, number> = {};
  const futureSkills: Record<string, number> = {};
  
  for (const skill of skillsAnalysis) {
    if (skill.current_level > 0) {
      currentSkills[skill.skill] = skill.current_level;
    }
    futureSkills[skill.skill] = skill.future_level;
  }
  
  const existingSkillsCount = skillsAnalysis.filter(s => s.is_from_resume).length;
  
  return {
    current: {
      skills: currentSkills,
      confidence: Math.round(30 + (existingSkillsCount * 3)),
      technicalDepth: Math.round(25 + (existingSkillsCount * 4)),
      projects: currentProjects,
      readinessLevel: Math.round(20 + (existingSkillsCount * 3) + (currentProjects * 5))
    },
    future: {
      skills: futureSkills,
      confidence: Math.round(Math.min(50 + (skillsAnalysis.length * 4), 85) * confidenceGate.maxConfidence),
      technicalDepth: Math.round(Math.min(40 + (skillsAnalysis.length * 5), 80) * confidenceGate.maxConfidence),
      projects: currentProjects + newProjects,
      readinessLevel: Math.round(Math.min(40 + (skillsAnalysis.length * 4) + (newProjects * 8), 85) * confidenceGate.maxConfidence)
    }
  };
}

function buildLegacyRoadmap(
  roadmap: { day_30: string[]; day_60: string[]; day_90: string[] },
  targetRole: string,
  extractedSkills: string[]
): RoadmapData {
  const result: RoadmapData = {};
  
  result.day30 = {
    goals: roadmap.day_30,
    focusAreas: extractedSkills.slice(0, 4),
    weeklyMissions: [
      {
        week: 1,
        title: 'Foundation Setup',
        objectives: ['Environment setup', 'Core concepts review'],
        deliverables: ['Development environment ready', 'Learning plan created'],
        skillsToImprove: extractedSkills.slice(0, 2)
      },
      {
        week: 2,
        title: 'Skill Building',
        objectives: ['Hands-on practice', 'First mini-project'],
        deliverables: ['Completed tutorials', 'Working prototype'],
        skillsToImprove: extractedSkills.slice(1, 3)
      },
      {
        week: 3,
        title: 'Project Development',
        objectives: ['Build portfolio project', 'Code review practices'],
        deliverables: ['MVP completed', 'Clean codebase'],
        skillsToImprove: extractedSkills.slice(2, 4)
      },
      {
        week: 4,
        title: 'Polish & Deploy',
        objectives: ['Testing', 'Deployment', 'Documentation'],
        deliverables: ['Deployed project', 'README documentation'],
        skillsToImprove: ['Git', 'Deployment']
      }
    ],
    monthlyMilestones: roadmap.day_30.slice(0, 3)
  };
  
  if (roadmap.day_60.length > 0) {
    result.day60 = {
      goals: roadmap.day_60,
      focusAreas: [...extractedSkills.slice(0, 3), ...getTargetSkillsForRole(targetRole).slice(0, 2)],
      weeklyMissions: [
        {
          week: 5,
          title: 'Intermediate Development',
          objectives: ['Build portfolio project', 'Practice interviews'],
          deliverables: ['Deployed project', 'Interview preparation notes'],
          skillsToImprove: extractedSkills.slice(2, 5)
        },
        {
          week: 6,
          title: 'Advanced Concepts',
          objectives: ['Learn advanced patterns', 'Code optimization'],
          deliverables: ['Refactored code', 'Performance improvements'],
          skillsToImprove: getTargetSkillsForRole(targetRole).slice(0, 3)
        },
        {
          week: 7,
          title: 'Open Source Contribution',
          objectives: ['Find suitable projects', 'Make first contribution'],
          deliverables: ['PR submitted', 'Community engagement'],
          skillsToImprove: ['Git', 'Collaboration']
        },
        {
          week: 8,
          title: 'Interview Preparation',
          objectives: ['Technical interviews', 'Behavioral questions'],
          deliverables: ['Mock interview sessions', 'Problem-solving practice'],
          skillsToImprove: ['Problem Solving', 'Communication']
        }
      ],
      monthlyMilestones: roadmap.day_60.slice(0, 3)
    };
  }
  
  if (roadmap.day_90.length > 0) {
    result.day90 = {
      goals: roadmap.day_90,
      focusAreas: [...extractedSkills, ...getTargetSkillsForRole(targetRole).slice(0, 3)].slice(0, 8),
      weeklyMissions: [
        {
          week: 9,
          title: 'Capstone Project Start',
          objectives: ['Plan comprehensive project', 'Set up architecture'],
          deliverables: ['Project plan', 'Initial setup'],
          skillsToImprove: getTargetSkillsForRole(targetRole).slice(0, 4)
        },
        {
          week: 10,
          title: 'Capstone Development',
          objectives: ['Core features implementation', 'Testing'],
          deliverables: ['Working features', 'Test coverage'],
          skillsToImprove: ['Testing', 'Architecture']
        },
        {
          week: 11,
          title: 'Portfolio Finalization',
          objectives: ['Polish all projects', 'Create case studies'],
          deliverables: ['Updated portfolio', 'Project documentation'],
          skillsToImprove: ['Documentation', 'Presentation']
        },
        {
          week: 12,
          title: 'Job Application Sprint',
          objectives: ['Apply to target companies', 'Network actively'],
          deliverables: ['Applications submitted', 'Interview scheduled'],
          skillsToImprove: ['Interview Skills', 'Networking']
        }
      ],
      monthlyMilestones: roadmap.day_90.slice(0, 3)
    };
  }
  
  return result;
}

function buildLegacyAchievements(
  targetRole: string,
  timeGoal: number,
  experienceData: ExperienceData,
  confidenceGate: ConfidenceGate
): Achievement[] {
  const achievements: Achievement[] = [];
  
  // Only include realistic achievements based on profile
  if (experienceData.stage === 'Fresher' || experienceData.stage === 'Intern') {
    achievements.push({
      title: 'Portfolio Development',
      description: `Build ${timeGoal <= 30 ? '1' : timeGoal <= 60 ? '1-2' : '2-3'} quality project${timeGoal > 30 ? 's' : ''} for ${targetRole} role`,
      timeline: `${timeGoal} days`,
      difficulty: timeGoal <= 30 ? 'Easy' : 'Medium',
      category: 'Portfolio'
    });
    
    achievements.push({
      title: 'Skill Foundation',
      description: `Develop foundational ${targetRole} skills through consistent practice`,
      timeline: `${Math.floor(timeGoal * 0.7)} days`,
      difficulty: 'Medium',
      category: 'Technical'
    });
  } else {
    achievements.push({
      title: 'Skill Enhancement',
      description: `Strengthen ${targetRole} expertise and learn 2-3 new technologies`,
      timeline: `${timeGoal} days`,
      difficulty: confidenceGate.level === 'HIGH' ? 'Medium' : 'Easy',
      category: 'Technical'
    });
  }
  
  achievements.push({
    title: 'Professional Presence',
    description: 'Establish or improve LinkedIn profile and GitHub contributions',
    timeline: `${Math.floor(timeGoal * 0.5)} days`,
    difficulty: 'Easy',
    category: 'Career'
  });
  
  return achievements;
}

function buildLegacyFutureResume(
  extractedData: any,
  skillsAnalysis: SkillAnalysis[],
  projects: FutureProject[],
  targetRole: string,
  confidenceGate: ConfidenceGate
): FutureResumeData {
  const enhancedSkills = skillsAnalysis
    .filter(s => s.future_level >= 50)
    .map(s => s.skill);
  
  const recommendedCerts = confidenceGate.level === 'HIGH' 
    ? [`${targetRole} Fundamentals Certification`, 'Professional Development Course']
    : [`${targetRole} Beginner Course`];
  
  return {
    personalInfo: {
      name: extractedData.personalInfo?.name || 'Your Name',
      jobTitle: `${targetRole}`,
      email: extractedData.personalInfo?.email || 'your.email@example.com',
      phone: extractedData.personalInfo?.phone || '+91-XXXXXXXXXX',
      linkedin: extractedData.personalInfo?.linkedin || 'linkedin.com/in/yourprofile',
      github: extractedData.personalInfo?.github || 'github.com/yourusername',
      location: extractedData.personalInfo?.location || 'India',
      summary: `Aspiring ${targetRole} with skills in ${enhancedSkills.slice(0, 4).join(', ')}. ${projects.length > 0 ? `Completed ${projects.length} portfolio project${projects.length > 1 ? 's' : ''}.` : 'Building portfolio projects.'}`
    },
    skills: {
      technical: enhancedSkills.slice(0, 10),
      soft: ['Problem Solving', 'Communication', 'Team Collaboration'],
      tools: ['Git', 'VS Code']
    },
    experience: extractedData.experience || [],
    projects: projects.map(p => ({
      title: p.title,
      techStack: p.techStack,
      description: p.description,
      githubLink: `github.com/yourusername/${p.title.toLowerCase().replace(/\s+/g, '-')}`
    })),
    education: extractedData.education || [],
    certifications: [
      ...(extractedData.certifications || []),
      ...recommendedCerts
    ],
    achievements: [
      `Developed ${projects.length} portfolio project${projects.length > 1 ? 's' : ''}`,
      `Enhanced ${enhancedSkills.length} technical skills`
    ],
    atsScore: Math.round(50 + (enhancedSkills.length * 3) + (projects.length * 5)),
    improvements: [
      `Added ${enhancedSkills.length} verified skills`,
      `Built ${projects.length} portfolio project${projects.length > 1 ? 's' : ''}`,
      'Improved resume structure and content'
    ]
  };
}
