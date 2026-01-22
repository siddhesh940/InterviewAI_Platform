// src/data/soft-skills-data.ts
// Skill-based content structure for Soft Skills feature - Enterprise Grade

export interface SkillTip {
  id: string;
  text: string;
  category: 'actionable' | 'mindset' | 'practice';
}

export interface SkillVideo {
  id: string;
  title: string;
  src: string;
  duration: string;
  description: string;
}

export interface SkillImage {
  id: string;
  title: string;
  src: string;
  caption: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SkillChecklistItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  videos: SkillVideo[];
  tips: SkillTip[];
  images: SkillImage[];
  quiz: QuizQuestion[];
  checklist: SkillChecklistItem[];
}

// Progress weights for scoring
export const PROGRESS_WEIGHTS = {
  VIDEO_WATCHED: 10,      // +10% per video
  CHECKLIST_ITEM: 5,      // +5% per checklist item
  QUIZ_COMPLETED: 20,     // +20% for completing quiz
};

export const skills: Skill[] = [
  {
    id: 'communication',
    name: 'Communication',
    description: 'Master clear, confident verbal and written communication in interviews.',
    icon: 'MessageCircle',
    color: '#4f46e5',
    videos: [
      {
        id: 'comm-v1',
        title: 'Clarity in Communication',
        src: '/videos/clarity-communication.mp4',
        duration: '4:30',
        description: 'Learn how to structure your responses clearly and concisely.'
      },
      {
        id: 'comm-v2',
        title: 'Effective Communication Skills',
        src: '/videos/Communication2.mp4',
        duration: '5:00',
        description: 'Advanced techniques for clear and impactful communication.'
      }
    ],
    tips: [
      { id: 'comm-t1', text: 'Use the STAR method (Situation, Task, Action, Result) to structure your answers.', category: 'actionable' },
      { id: 'comm-t2', text: 'Pause for 2-3 seconds before answering to collect your thoughts.', category: 'practice' },
      { id: 'comm-t3', text: 'Avoid filler words like "um", "uh", "like" - practice replacing them with brief pauses.', category: 'actionable' }
    ],
    images: [
      {
        id: 'comm-i1',
        title: 'Communication Flow',
        src: '/images/communication.png',
        caption: 'The effective communication cycle in interviews'
      }
    ],
    quiz: [
      {
        id: 'comm-q1',
        question: 'What is the STAR method used for?',
        options: ['Structured responses', 'Time management', 'Salary negotiation', 'Resume building'],
        correctAnswer: 'Structured responses',
        explanation: 'STAR (Situation, Task, Action, Result) helps you give organized, impactful answers.'
      },
      {
        id: 'comm-q2',
        question: 'How should you answer questions in an interview?',
        options: ['With long stories', 'Very short yes/no', 'With clarity and structure', 'Ignoring details'],
        correctAnswer: 'With clarity and structure',
        explanation: 'Clear and structured answers help interviewers understand your value quickly.'
      },
      {
        id: 'comm-q3',
        question: 'What should you do when you don\'t understand a question?',
        options: ['Guess the answer', 'Ask for clarification politely', 'Stay silent', 'Change the topic'],
        correctAnswer: 'Ask for clarification politely',
        explanation: 'Asking for clarification shows engagement and prevents misunderstandings.'
      }
    ],
    checklist: [
      { id: 'comm-c1', text: 'Practice explaining a complex topic in 30 seconds', priority: 'high' },
      { id: 'comm-c2', text: 'Prepare 3 STAR method stories from your experience', priority: 'high' },
      { id: 'comm-c3', text: 'Record yourself answering a question and review', priority: 'medium' },
      { id: 'comm-c4', text: 'Prepare questions to ask the interviewer', priority: 'medium' }
    ]
  },
  {
    id: 'confidence',
    name: 'Confidence',
    description: 'Build genuine confidence through preparation and mindset techniques.',
    icon: 'Award',
    color: '#059669',
    videos: [
      {
        id: 'conf-v1',
        title: 'Building Confidence',
        src: '/videos/confidence2.mp4',
        duration: '5:15',
        description: 'Techniques to build genuine self-confidence for interviews.'
      },
      {
        id: 'conf-v2',
        title: 'Overcome Interview Nervousness',
        src: '/videos/OvercomeNervs.mp4',
        duration: '4:30',
        description: 'Practical strategies to overcome nervousness and project confidence.'
      }
    ],
    tips: [
      { id: 'conf-t1', text: 'Practice power posing for 2 minutes before your interview - it physiologically boosts confidence.', category: 'actionable' },
      { id: 'conf-t2', text: 'Remember: The interviewer wants you to succeed. They\'re looking for reasons to hire you.', category: 'mindset' },
      { id: 'conf-t3', text: 'Prepare thoroughly - 90% of confidence comes from knowing your material.', category: 'practice' }
    ],
    images: [
      {
        id: 'conf-i1',
        title: 'Confidence Booster',
        src: '/images/confidence.png.jpg',
        caption: 'Visual techniques to boost your interview confidence'
      }
    ],
    quiz: [
      {
        id: 'conf-q1',
        question: 'What is the biggest confidence booster in interviews?',
        options: ['Preparation', 'Luck', 'Guessing answers', 'Avoiding practice'],
        correctAnswer: 'Preparation',
        explanation: 'Thorough preparation is the foundation of genuine confidence.'
      },
      {
        id: 'conf-q2',
        question: 'Which tone is best in interviews?',
        options: ['Aggressive', 'Polite & confident', 'Casual slang', 'Monotone'],
        correctAnswer: 'Polite & confident',
        explanation: 'A polite and confident tone creates the best impression.'
      },
      {
        id: 'conf-q3',
        question: 'How should you handle silence in an interview?',
        options: ['Fill it with words quickly', 'Stay calm and composed', 'Change topic', 'Ask a random question'],
        correctAnswer: 'Stay calm and composed',
        explanation: 'Comfort with silence shows maturity and self-assurance.'
      }
    ],
    checklist: [
      { id: 'conf-c1', text: 'Research the company thoroughly (history, culture, recent news)', priority: 'high' },
      { id: 'conf-c2', text: 'Practice your self-introduction until it feels natural', priority: 'high' },
      { id: 'conf-c3', text: 'Prepare answers for 10 common interview questions', priority: 'high' },
      { id: 'conf-c4', text: 'Plan your outfit the night before', priority: 'medium' }
    ]
  },
  {
    id: 'body-language',
    name: 'Body Language',
    description: 'Communicate professionalism through posture, gestures, and facial expressions.',
    icon: 'User',
    color: '#dc2626',
    videos: [
      {
        id: 'bl-v1',
        title: 'Body Language Fundamentals',
        src: '/videos/body-language.mp4',
        duration: '5:15',
        description: 'Complete guide to non-verbal communication in interviews.'
      },
      {
        id: 'bl-v2',
        title: 'Advanced Body Language',
        src: '/videos/Bodylanguage2.mp4',
        duration: '4:30',
        description: 'Master subtle gestures and posture for maximum impact.'
      },
      {
        id: 'bl-v3',
        title: 'Body Language in Practice',
        src: '/videos/Bodylanguage3.mp4',
        duration: '4:00',
        description: 'Real-world examples and practice scenarios.'
      }
    ],
    tips: [
      { id: 'bl-t1', text: 'Sit with your back straight, shoulders relaxed - it projects confidence and engagement.', category: 'actionable' },
      { id: 'bl-t2', text: 'Mirror the interviewer\'s energy subtly - it builds rapport unconsciously.', category: 'practice' },
      { id: 'bl-t3', text: 'Use hand gestures sparingly to emphasize points, but avoid excessive movement.', category: 'actionable' }
    ],
    images: [
      {
        id: 'bl-i1',
        title: 'Body Language Essentials',
        src: '/images/confidencebooster.png.jpg',
        caption: 'Key body language cues for interview success'
      }
    ],
    quiz: [
      {
        id: 'bl-q1',
        question: 'What is the most important non-verbal skill in an interview?',
        options: ['Eye contact', 'Clothing', 'Handshake', 'Resume'],
        correctAnswer: 'Eye contact',
        explanation: 'Eye contact conveys confidence, honesty, and engagement.'
      },
      {
        id: 'bl-q2',
        question: 'What should you avoid in body language?',
        options: ['Smiling', 'Crossing arms', 'Leaning slightly forward', 'Open posture'],
        correctAnswer: 'Crossing arms',
        explanation: 'Crossed arms signal defensiveness and disengagement.'
      },
      {
        id: 'bl-q3',
        question: 'Why is smiling important?',
        options: ['It shows nervousness', 'It builds rapport', 'It wastes time', 'It distracts interviewer'],
        correctAnswer: 'It builds rapport',
        explanation: 'A genuine smile creates warmth and connection.'
      }
    ],
    checklist: [
      { id: 'bl-c1', text: 'Practice maintaining eye contact for 3-5 seconds at a time', priority: 'high' },
      { id: 'bl-c2', text: 'Record a mock interview to review your body language', priority: 'high' },
      { id: 'bl-c3', text: 'Practice a confident handshake with a friend', priority: 'medium' },
      { id: 'bl-c4', text: 'Check your camera angle and posture for virtual interviews', priority: 'medium' }
    ]
  },
  {
    id: 'active-listening',
    name: 'Active Listening',
    description: 'Show engagement and understanding through attentive listening techniques.',
    icon: 'Ear',
    color: '#7c3aed',
    videos: [
      {
        id: 'al-v1',
        title: 'Active Listening Techniques',
        src: '/videos/active-listening.mp4',
        duration: '4:00',
        description: 'Learn to listen effectively and respond thoughtfully.'
      }
    ],
    tips: [
      { id: 'al-t1', text: 'Nod occasionally and maintain eye contact to show you\'re engaged.', category: 'actionable' },
      { id: 'al-t2', text: 'Paraphrase the question briefly before answering to confirm understanding.', category: 'practice' },
      { id: 'al-t3', text: 'Never interrupt - wait for a clear pause before responding.', category: 'actionable' }
    ],
    images: [
      {
        id: 'al-i1',
        title: 'Effective Listening',
        src: '/images/communicationflow.png.jpg',
        caption: 'The feedback loop of active listening'
      }
    ],
    quiz: [
      {
        id: 'al-q1',
        question: 'Which of these improves active listening?',
        options: ['Interrupting', 'Nodding', 'Looking away', 'Multitasking'],
        correctAnswer: 'Nodding',
        explanation: 'Nodding shows engagement without interrupting the speaker.'
      },
      {
        id: 'al-q2',
        question: 'What is a good way to end an interview?',
        options: ['Walk out silently', 'Say "Thanks" and leave', 'Thank them & ask a question', 'Say nothing'],
        correctAnswer: 'Thank them & ask a question',
        explanation: 'This shows appreciation and genuine interest in the role.'
      }
    ],
    checklist: [
      { id: 'al-c1', text: 'Practice summarizing conversations in daily life', priority: 'medium' },
      { id: 'al-c2', text: 'Focus on understanding, not just waiting to speak', priority: 'high' },
      { id: 'al-c3', text: 'Prepare follow-up questions based on job description', priority: 'high' },
      { id: 'al-c4', text: 'Practice not interrupting for one full day', priority: 'low' }
    ]
  },
  {
    id: 'professional-etiquette',
    name: 'Professional Etiquette',
    description: 'Master the unwritten rules of professional conduct in interviews.',
    icon: 'Briefcase',
    color: '#0891b2',
    videos: [
      {
        id: 'pe-v1',
        title: 'Interview Etiquette Essentials',
        src: '/videos/Interview Etiquette.mp4',
        duration: '5:00',
        description: 'Professional conduct and etiquette for successful interviews.'
      }
    ],
    tips: [
      { id: 'pe-t1', text: 'Arrive 10-15 minutes early - it shows respect for the interviewer\'s time.', category: 'actionable' },
      { id: 'pe-t2', text: 'Send a thank-you email within 24 hours after the interview.', category: 'actionable' },
      { id: 'pe-t3', text: 'Turn off your phone completely - vibrations can be distracting.', category: 'actionable' }
    ],
    images: [
      {
        id: 'pe-i1',
        title: 'Common Interview Mistakes',
        src: '/images/TopMistakeInterview.png',
        caption: 'Avoid these common etiquette pitfalls'
      }
    ],
    quiz: [
      {
        id: 'pe-q1',
        question: 'What should you check before an online interview?',
        options: ['Internet & camera', 'Background noise', 'Lighting', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'Technical preparation is crucial for virtual professionalism.'
      },
      {
        id: 'pe-q2',
        question: 'When should you arrive for an in-person interview?',
        options: ['Exactly on time', '10-15 minutes early', '30 minutes early', '5 minutes late'],
        correctAnswer: '10-15 minutes early',
        explanation: 'Arriving early shows punctuality without being intrusive.'
      }
    ],
    checklist: [
      { id: 'pe-c1', text: 'Test your tech setup (camera, mic, internet) the day before', priority: 'high' },
      { id: 'pe-c2', text: 'Keep copies of your resume and documents ready', priority: 'high' },
      { id: 'pe-c3', text: 'Charge your devices fully before virtual interviews', priority: 'medium' },
      { id: 'pe-c4', text: 'Research appropriate dress code for the company', priority: 'medium' },
      { id: 'pe-c5', text: 'Prepare a professional background for video calls', priority: 'low' }
    ]
  },
  {
    id: 'stress-management',
    name: 'Stress Management',
    description: 'Learn to control interview anxiety, manage stress, and stay confident under pressure.',
    icon: 'Heart',
    color: '#e11d48',
    videos: [
      {
        id: 'sm-v1',
        title: 'Managing Interview Stress',
        src: '/videos/StressMang.mp4',
        duration: '5:30',
        description: 'Proven techniques to manage stress and anxiety before and during interviews.'
      }
    ],
    tips: [
      { id: 'sm-t1', text: 'Practice 4-7-8 breathing: Inhale 4 seconds, hold 7 seconds, exhale 8 seconds. Repeat 3 times.', category: 'actionable' },
      { id: 'sm-t2', text: 'Reframe nervousness as excitement - both feel similar but excitement is positive.', category: 'mindset' },
      { id: 'sm-t3', text: 'Prepare a "centering" routine: deep breaths, positive affirmation, power pose.', category: 'practice' },
      { id: 'sm-t4', text: 'Visualize success - mentally rehearse the interview going well before it starts.', category: 'mindset' }
    ],
    images: [
      {
        id: 'sm-i1',
        title: 'Stress Management Techniques',
        src: '/images/StressMang.png',
        caption: 'Calming techniques to use before your interview'
      }
    ],
    quiz: [
      {
        id: 'sm-q1',
        question: 'What is the 4-7-8 breathing technique?',
        options: ['Inhale 4s, hold 7s, exhale 8s', 'Breathe 4 times in 7 minutes', 'Hold breath for 478 seconds', 'Breathe quickly 4-7-8 times'],
        correctAnswer: 'Inhale 4s, hold 7s, exhale 8s',
        explanation: 'This technique activates your parasympathetic nervous system, reducing stress.'
      },
      {
        id: 'sm-q2',
        question: 'How can you reframe interview nervousness?',
        options: ['Ignore it completely', 'Think of it as excitement', 'Get angry instead', 'Cancel the interview'],
        correctAnswer: 'Think of it as excitement',
        explanation: 'Nervousness and excitement have similar physical symptoms - reframing helps channel the energy positively.'
      },
      {
        id: 'sm-q3',
        question: 'When should you start your calming routine?',
        options: ['During the interview', '15-30 minutes before', 'Only if you feel stressed', 'Never, just wing it'],
        correctAnswer: '15-30 minutes before',
        explanation: 'Starting early gives your body time to physically calm down and center.'
      }
    ],
    checklist: [
      { id: 'sm-c1', text: 'Practice 4-7-8 breathing technique daily for one week', priority: 'high' },
      { id: 'sm-c2', text: 'Create a personal centering routine (3-5 steps)', priority: 'high' },
      { id: 'sm-c3', text: 'Visualize a successful interview for 5 minutes', priority: 'medium' },
      { id: 'sm-c4', text: 'Identify your top 3 stress triggers and plan responses', priority: 'medium' },
      { id: 'sm-c5', text: 'Practice mock interviews to build comfort', priority: 'high' }
    ]
  }
];

// Helper function to get skill by ID
export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(skill => skill.id === id);
};

// Calculate skill progress based on weighted activities
export interface SkillProgressData {
  watchedVideos: string[];
  completedChecklist: string[];
  quizCompleted: boolean;
}

export const calculateSkillProgress = (
  skill: Skill,
  progressData: SkillProgressData
): number => {
  let progress = 0;
  const maxProgress = 100;

  // Videos: +10% each (max based on number of videos)
  const videoPoints = progressData.watchedVideos.length * PROGRESS_WEIGHTS.VIDEO_WATCHED;
  const maxVideoPoints = skill.videos.length * PROGRESS_WEIGHTS.VIDEO_WATCHED;

  // Checklist: +5% each
  const checklistPoints = progressData.completedChecklist.length * PROGRESS_WEIGHTS.CHECKLIST_ITEM;
  const maxChecklistPoints = skill.checklist.length * PROGRESS_WEIGHTS.CHECKLIST_ITEM;

  // Quiz: +20%
  const quizPoints = progressData.quizCompleted ? PROGRESS_WEIGHTS.QUIZ_COMPLETED : 0;

  const totalMaxPoints = maxVideoPoints + maxChecklistPoints + PROGRESS_WEIGHTS.QUIZ_COMPLETED;
  const totalEarnedPoints = videoPoints + checklistPoints + quizPoints;

  progress = Math.round((totalEarnedPoints / totalMaxPoints) * maxProgress);

  return Math.min(progress, maxProgress);
};

// Calculate overall progress across all skills
export const calculateOverallProgress = (
  completedItems: Record<string, string[]>,
  watchedVideos?: Record<string, string[]>,
  completedQuizzes?: Record<string, boolean>
): number => {
  // Simple fallback for backward compatibility
  if (!watchedVideos && !completedQuizzes) {
    const totalItems = skills.reduce((sum, skill) => sum + skill.checklist.length, 0);
    const completedCount = Object.values(completedItems).reduce((sum, items) => sum + items.length, 0);

    return totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  }

  let totalProgress = 0;

  skills.forEach(skill => {
    const progressData: SkillProgressData = {
      watchedVideos: watchedVideos?.[skill.id] || [],
      completedChecklist: completedItems[skill.id] || [],
      quizCompleted: completedQuizzes?.[skill.id] || false,
    };
    totalProgress += calculateSkillProgress(skill, progressData);
  });

  return Math.round(totalProgress / skills.length);
};

// Legacy function for backward compatibility
export const getSkillProgress = (skillId: string, completedItems: string[]): number => {
  const skill = getSkillById(skillId);
  if (!skill) {return 0;}

  const totalItems = skill.checklist.length;

  return totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;
};

// Determine skill level based on quiz score
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const getSkillLevel = (score: number, total: number): SkillLevel => {
  const percentage = (score / total) * 100;
  if (percentage >= 90) {return 'expert';}
  if (percentage >= 70) {return 'advanced';}
  if (percentage >= 50) {return 'intermediate';}

  return 'beginner';
};

export const skillLevelConfig: Record<SkillLevel, { label: string; color: string; description: string }> = {
  beginner: {
    label: 'Beginner',
    color: '#f59e0b',
    description: 'Just starting out. Focus on fundamentals.'
  },
  intermediate: {
    label: 'Intermediate',
    color: '#3b82f6',
    description: 'Making progress. Keep practicing!'
  },
  advanced: {
    label: 'Advanced',
    color: '#22c55e',
    description: 'Strong skills. Fine-tune your approach.'
  },
  expert: {
    label: 'Expert',
    color: '#8b5cf6',
    description: 'Excellent! You\'re interview-ready.'
  }
};
