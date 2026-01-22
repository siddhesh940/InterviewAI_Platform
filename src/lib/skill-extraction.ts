/**
 * Skill Extraction Utilities
 * Pure frontend NLP logic for extracting skills from text
 * No database or external API dependencies
 */

import {
  CATEGORY_ORDER,
  CONTEXT_KEYWORDS,
  SKILL_SECTION_HEADERS,
  SkillCategory,
  SkillDefinition,
  SKILLS_DATABASE
} from '@/data/skills-database';

export type ConfidenceLevel = 'Low' | 'Medium' | 'High';
export type SkillSource = 'Resume' | 'JD' | 'Both';

export interface ExtractedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  confidence: ConfidenceLevel;
  source: SkillSource;
  frequency: number;
  inResume: boolean;
  inJD: boolean;
  isSelected: boolean;
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a skill exists in text
 */
function findSkillInText(skill: SkillDefinition, normalizedText: string): number {
  let frequency = 0;
  const textLower = normalizedText.toLowerCase();
  
  // Check main skill name
  const skillNameLower = skill.name.toLowerCase();
  const skillNameRegex = new RegExp(`\\b${escapeRegex(skillNameLower)}\\b`, 'gi');
  const mainMatches = normalizedText.match(skillNameRegex);
  if (mainMatches) {
    frequency += mainMatches.length;
  }
  
  // Check synonyms
  for (const synonym of skill.synonyms) {
    const synonymLower = synonym.toLowerCase();
    const synonymRegex = new RegExp(`\\b${escapeRegex(synonymLower)}\\b`, 'gi');
    const synonymMatches = normalizedText.match(synonymRegex);
    if (synonymMatches) {
      frequency += synonymMatches.length;
    }
  }
  
  // Check keywords
  for (const keyword of skill.keywords) {
    if (keyword && textLower.includes(keyword.toLowerCase())) {
      frequency += 1;
    }
  }
  
  return frequency;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate confidence based on frequency and context
 */
function calculateConfidence(frequency: number, hasContext: boolean): ConfidenceLevel {
  if (frequency >= 3 || (frequency >= 2 && hasContext)) {
    return 'High';
  } else if (frequency >= 2 || (frequency >= 1 && hasContext)) {
    return 'Medium';
  }
  
return 'Low';
}

/**
 * Check if skill has contextual support (near skill-related keywords)
 */
function hasSkillContext(text: string, skillName: string): boolean {
  const textLower = text.toLowerCase();
  const skillLower = skillName.toLowerCase();
  
  // Check if skill appears near context keywords
  for (const contextKeyword of CONTEXT_KEYWORDS) {
    const contextPattern = new RegExp(
      `(${escapeRegex(contextKeyword)}[\\s\\S]{0,50}${escapeRegex(skillLower)}|${escapeRegex(skillLower)}[\\s\\S]{0,50}${escapeRegex(contextKeyword)})`,
      'i'
    );
    if (contextPattern.test(textLower)) {
      return true;
    }
  }
  
  // Check if skill appears in skill-related sections
  for (const header of SKILL_SECTION_HEADERS) {
    const headerIndex = textLower.indexOf(header);
    if (headerIndex !== -1) {
      const skillIndex = textLower.indexOf(skillLower, headerIndex);
      if (skillIndex !== -1 && skillIndex - headerIndex < 500) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Extract skills from text (resume or JD)
 */
export function extractSkillsFromText(text: string): Map<string, { frequency: number; hasContext: boolean }> {
  const normalizedText = normalizeText(text);
  const foundSkills = new Map<string, { frequency: number; hasContext: boolean }>();
  
  for (const skill of SKILLS_DATABASE) {
    const frequency = findSkillInText(skill, normalizedText);
    
    if (frequency > 0) {
      const hasContext = hasSkillContext(text, skill.name);
      foundSkills.set(skill.name, { frequency, hasContext });
    }
  }
  
  return foundSkills;
}

/**
 * Main function to extract and process skills from resume and JD
 */
export function processSkillExtraction(
  resumeText: string,
  jdText: string = ''
): ExtractedSkill[] {
  const resumeSkills = extractSkillsFromText(resumeText);
  const jdSkills = jdText ? extractSkillsFromText(jdText) : new Map();
  
  const allSkillNames = new Set([...Array.from(resumeSkills.keys()), ...Array.from(jdSkills.keys())]);
  const extractedSkills: ExtractedSkill[] = [];
  
  allSkillNames.forEach(skillName => {
    const skillDef = SKILLS_DATABASE.find(s => s.name === skillName);
    if (!skillDef) {return;}
    
    const resumeData = resumeSkills.get(skillName);
    const jdData = jdSkills.get(skillName);
    
    const inResume = !!resumeData;
    const inJD = !!jdData;
    
    // Calculate combined frequency and context
    const totalFrequency = (resumeData?.frequency || 0) + (jdData?.frequency || 0);
    const hasContext = resumeData?.hasContext || jdData?.hasContext || false;
    
    // Determine source
    let source: SkillSource = 'Resume';
    if (inResume && inJD) {
      source = 'Both';
    } else if (inJD && !inResume) {
      source = 'JD';
    }
    
    // Calculate confidence
    const confidence = calculateConfidence(
      resumeData?.frequency || 0,
      hasContext
    );
    
    extractedSkills.push({
      id: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: skillName,
      category: skillDef.category,
      confidence,
      source,
      frequency: totalFrequency,
      inResume,
      inJD,
      isSelected: inResume, // Pre-select skills from resume
    });
  });
  
  // Sort by category order, then by confidence, then alphabetically
  return extractedSkills.sort((a, b) => {
    const categoryOrderA = CATEGORY_ORDER.indexOf(a.category);
    const categoryOrderB = CATEGORY_ORDER.indexOf(b.category);
    
    if (categoryOrderA !== categoryOrderB) {
      return categoryOrderA - categoryOrderB;
    }
    
    const confidenceOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    }
    
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group skills by category
 */
export function groupSkillsByCategory(
  skills: ExtractedSkill[]
): Record<SkillCategory, ExtractedSkill[]> {
  const grouped: Record<SkillCategory, ExtractedSkill[]> = {
    'Programming Languages': [],
    'Frameworks & Libraries': [],
    'Tools & Platforms': [],
    'Databases': [],
    'Core CS / Concepts': [],
    'Soft Skills': [],
  };
  
  skills.forEach(skill => {
    if (grouped[skill.category]) {
      grouped[skill.category].push(skill);
    }
  });
  
  return grouped;
}

/**
 * Find missing skills (in JD but not in resume)
 */
export function getMissingSkills(skills: ExtractedSkill[]): ExtractedSkill[] {
  return skills.filter(skill => skill.inJD && !skill.inResume);
}

/**
 * Get matching skills (in both resume and JD)
 */
export function getMatchingSkills(skills: ExtractedSkill[]): ExtractedSkill[] {
  return skills.filter(skill => skill.inResume && skill.inJD);
}

/**
 * Format skills for Resume Builder
 * Converts extracted skills to the format expected by Resume Builder
 */
export function formatSkillsForResumeBuilder(skills: ExtractedSkill[]): string {
  const grouped = groupSkillsByCategory(skills.filter(s => s.isSelected));
  const lines: string[] = [];
  
  // Format: "Category: Skill1, Skill2, Skill3"
  const categoryLabels: Record<SkillCategory, string> = {
    'Programming Languages': 'Languages',
    'Frameworks & Libraries': 'Frameworks & Libraries',
    'Tools & Platforms': 'Tools & Platforms',
    'Databases': 'Databases',
    'Core CS / Concepts': 'Concepts',
    'Soft Skills': 'Soft Skills',
  };
  
  CATEGORY_ORDER.forEach(category => {
    const categorySkills = grouped[category];
    if (categorySkills && categorySkills.length > 0) {
      const skillNames = categorySkills.map(s => s.name).join(', ');
      lines.push(`${categoryLabels[category]}: ${skillNames}`);
    }
  });
  
  return lines.join('\n');
}

/**
 * Extract text from PDF via API route (server-side)
 * This function calls the server API for PDF extraction
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/extract-pdf-text', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to extract text from PDF');
    }
    
    return data.text || '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please paste the resume text manually.');
  }
}

/**
 * Get skill statistics
 */
export function getSkillStats(skills: ExtractedSkill[]) {
  const total = skills.length;
  const fromResume = skills.filter(s => s.inResume).length;
  const fromJD = skills.filter(s => s.inJD).length;
  const matching = skills.filter(s => s.inResume && s.inJD).length;
  const missing = skills.filter(s => !s.inResume && s.inJD).length;
  const selected = skills.filter(s => s.isSelected).length;
  
  const byCategory: Record<SkillCategory, number> = {
    'Programming Languages': 0,
    'Frameworks & Libraries': 0,
    'Tools & Platforms': 0,
    'Databases': 0,
    'Core CS / Concepts': 0,
    'Soft Skills': 0,
  };
  
  skills.forEach(skill => {
    if (skill.isSelected) {
      byCategory[skill.category]++;
    }
  });
  
  return {
    total,
    fromResume,
    fromJD,
    matching,
    missing,
    selected,
    byCategory,
  };
}
