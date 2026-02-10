"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLogicalReasoningQuestions } from "@/data/logical-reasoning-questions";
import { AlertTriangle, ArrowLeft, BookOpen, Brain, CheckCircle, Eye, Filter, Lightbulb, Play, RefreshCw, Target, XCircle, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PracticeSession {
  currentQuestion: number;
  answers: { questionId: number; selectedAnswer: string; isCorrect: boolean }[];
  score: number;
  isComplete: boolean;
}

// Mini Insight Card Component
function InsightCard({ 
  icon: Icon, 
  title, 
  content, 
  bgColor, 
  iconColor, 
  borderColor 
}: { 
  icon: React.ElementType; 
  title: string; 
  content: string; 
  bgColor: string; 
  iconColor: string; 
  borderColor: string;
}) {
  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${iconColor.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export default function LogicalReasoningTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [mode, setMode] = useState<'intro' | 'practice' | 'result'>('intro');
  const [session, setSession] = useState<PracticeSession>({
    currentQuestion: 0,
    answers: [],
    score: 0,
    isComplete: false
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [, setShowExplanation] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // PHASE-2: Practice Controls State
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [repeatWeak, setRepeatWeak] = useState(false);
  const [weakQuestionIds, setWeakQuestionIds] = useState<number[]>([]);

  // Load weak questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`weak-questions-logical-${topicId}`);
    if (saved) {
      setWeakQuestionIds(JSON.parse(saved));
    }
  }, [topicId]);

  // Save progress to localStorage
  const saveProgressToLocalStorage = (attempted: number, correct: number) => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    
    if (!progress["logical-reasoning"]) {
      progress["logical-reasoning"] = {};
    }
    
    progress["logical-reasoning"][topicId] = {
      attempted: attempted,
      correct: correct
    };
    
    localStorage.setItem("aptitude-progress", JSON.stringify(progress));
    console.log("Logical Progress saved:", progress);
  };

  // Save weak question
  const saveWeakQuestion = (questionId: number) => {
    if (!weakQuestionIds.includes(questionId)) {
      const updated = [...weakQuestionIds, questionId];
      setWeakQuestionIds(updated);
      localStorage.setItem(`weak-questions-logical-${topicId}`, JSON.stringify(updated));
    }
  };

  const removeWeakQuestion = (questionId: number) => {
    const updated = weakQuestionIds.filter(id => id !== questionId);
    setWeakQuestionIds(updated);
    localStorage.setItem(`weak-questions-logical-${topicId}`, JSON.stringify(updated));
  };

  const questions = getLogicalReasoningQuestions(topicId);

  // Filter questions based on settings
  const getFilteredQuestions = () => {
    if (!questions || questions.length === 0) {
      return [];
    }
    
    let filtered = [...questions];
    
    // Filter by weak questions if enabled
    if (repeatWeak && weakQuestionIds.length > 0) {
      filtered = filtered.filter(q => weakQuestionIds.includes(q.id));
    }
    
    // Filter by difficulty if not 'all'
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => 
        q.difficulty?.toLowerCase() === difficulty
      );
    }
    
    return filtered.length > 0 ? filtered : questions;
  };

  const filteredQuestions = getFilteredQuestions();

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Topic Not Found</h2>
            <p className="text-gray-600 mb-4">The requested topic could not be found.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/aptitude/logical-reasoning')}
            >
              Back to Topics
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topicInfo: Record<string, any> = {
    'series-sequences': {
      name: 'Series & Sequences',
      description: 'Master pattern recognition in number series, letter series, and logical progressions.',
      concepts: [
        'Arithmetic Progression (AP): a, a+d, a+2d, ...',
        'Geometric Progression (GP): a, ar, ar², ...',
        'Square Series: 1², 2², 3², 4², ...',
        'Prime Number Series: 2, 3, 5, 7, 11, ...',
        'Fibonacci Series: 0, 1, 1, 2, 3, 5, 8, ...'
      ],
      importance: 'Essential for competitive exams, logical thinking, and pattern recognition skills in data analysis.',
      shortcuts: [
        'Look for differences between consecutive terms',
        'Check for multiplication/division patterns',  
        'Identify geometric or algebraic relationships'
      ],
      mistakes: [
        'Missing alternating patterns in series',
        'Not considering multiple operations in complex series',
        'Overlooking position-based relationships'
      ]
    },
    'analogies': {
      name: 'Analogies',
      description: 'Develop comparative reasoning skills through word and number analogies.',
      concepts: [
        'Word Analogies: CAT : KITTEN :: DOG : PUPPY',
        'Number Analogies: 2 : 8 :: 3 : 27 (x³ relationship)',
        'Letter Analogies: A : Z :: B : Y (reverse order)',
        'Classification: Fruit : Apple :: Vehicle : Car',
        'Function: Doctor : Hospital :: Teacher : School'
      ],
      importance: 'Builds logical connections, improves vocabulary, and enhances pattern recognition abilities.',
      shortcuts: [
        'Identify the relationship in the first pair',
        'Apply same relationship to find the answer',
        'Consider synonyms, antonyms, and classifications'
      ],
      mistakes: [
        'Confusing the direction of relationships',
        'Not considering multiple possible relationships',
        'Missing contextual meanings of words'
      ]
    },
    'classification': {
      name: 'Classification',
      description: 'Group items based on common properties and identify odd ones out.',
      concepts: [
        'Grouping by Category: Animals, Plants, Objects',
        'Classification by Properties: Size, Color, Shape',
        'Functional Classification: Tools, Vehicles, Food',
        'Odd One Out: Find the different item',
        'Multiple Classifications: Items with dual properties'
      ],
      importance: 'Develops categorical thinking and systematic organization of information.',
      shortcuts: [
        'Look for obvious categories first',
        'Consider multiple classification criteria',
        'Use elimination method for odd one out'
      ],
      mistakes: [
        'Missing subtle classification criteria',
        'Not considering multiple valid groupings',
        'Overlooking exception cases'
      ]
    },
    'coding-decoding': {
      name: 'Coding & Decoding',
      description: 'Decode patterns in letters, numbers, and symbols to crack the code.',
      concepts: [
        'Letter Coding: A=1, B=2, C=3, ... Z=26',
        'Reverse Coding: A=Z, B=Y, C=X, ...',
        'Number Coding: Position-based substitutions',
        'Symbol Coding: Special character replacements',
        'Mixed Coding: Combination of multiple methods'
      ],
      importance: 'Enhances logical thinking and problem-solving abilities for cryptographic challenges.',
      shortcuts: [
        'Find the pattern in given examples',
        'Use alphabetical positions for letter codes',
        'Look for consistent transformation rules'
      ],
      mistakes: [
        'Missing position-based relationships',
        'Not identifying the coding pattern',
        'Confusing encoding with decoding process'
      ]
    },
    'blood-relations': {
      name: 'Blood Relations',
      description: 'Solve family relationship problems using logical connections.',
      concepts: [
        'Direct Relations: Father, Mother, Son, Daughter',
        'Extended Relations: Uncle, Aunt, Cousin, Nephew',
        'In-law Relations: Father-in-law, Sister-in-law',
        'Generation Relations: Grandfather, Grandson',
        'Complex Chains: Multiple relationship connections'
      ],
      importance: 'Builds logical reasoning and helps understand complex relationship networks.',
      shortcuts: [
        'Draw family trees for complex problems',
        'Use gender indicators carefully',
        'Work step by step through relationships'
      ],
      mistakes: [
        'Confusing gender in relationships',
        'Missing generation differences',
        'Not considering marriage relationships'
      ]
    },
    'direction-sense': {
      name: 'Direction Sense',
      description: 'Navigate through direction problems using compass knowledge.',
      concepts: [
        'Basic Directions: North, South, East, West',
        'Diagonal Directions: Northeast, Northwest, Southeast, Southwest',
        'Left and Right Turns: Clockwise and Anti-clockwise',
        'Distance Calculations: Pythagoras theorem',
        'Shadow Problems: Sun position and shadow direction'
      ],
      importance: 'Essential for spatial reasoning and navigation-based logical problems.',
      shortcuts: [
        'Draw diagrams for complex movements',
        'Remember: Morning shadow falls westward',
        'Use right-hand rule for direction changes'
      ],
      mistakes: [
        'Confusing left and right turns',
        'Not tracking cumulative direction changes',
        'Missing final position calculations'
      ]
    },
    'syllogism': {
      name: 'Syllogism',
      description: 'Master deductive reasoning with logical statements and conclusions.',
      concepts: [
        'All A are B: Universal Positive statements',
        'No A are B: Universal Negative statements', 
        'Some A are B: Particular Positive statements',
        'Some A are not B: Particular Negative statements',
        'Venn Diagrams: Visual representation of logic'
      ],
      importance: 'Fundamental for logical reasoning and analytical thinking in various competitive exams.',
      shortcuts: [
        'Use Venn diagrams for visualization',
        'Apply rules of deductive reasoning',
        'Check for logical consistency'
      ],
      mistakes: [
        'Confusing "some" with "all" statements',
        'Invalid conclusion from premises',
        'Missing possible logical combinations'
      ]
    },
    'arrangements': {
      name: 'Arrangements',
      description: 'Solve seating arrangement and position-based logical puzzles.',
      concepts: [
        'Linear Arrangements: Single row seating',
        'Circular Arrangements: Round table problems',
        'Complex Arrangements: Multiple constraints',
        'Ranking Problems: Position-based ordering',
        'Grid Arrangements: Multiple rows and columns'
      ],
      importance: 'Develops systematic thinking and constraint-based problem solving.',
      shortcuts: [
        'List all given constraints clearly',
        'Use elimination method systematically',
        'Draw diagrams for complex arrangements'
      ],
      mistakes: [
        'Missing constraint combinations',
        'Not considering all possible arrangements',
        'Confusing relative positions'
      ]
    },
    'data-sufficiency': {
      name: 'Data Sufficiency',
      description: 'Determine if given information is sufficient to answer questions.',
      concepts: [
        'Statement Analysis: Individual statement sufficiency',
        'Combined Analysis: Both statements together',
        'Insufficient Data: Cannot be determined',
        'Redundant Information: More than needed',
        'Critical Information: Minimum required data'
      ],
      importance: 'Essential for analytical reasoning and decision-making in business scenarios.',
      shortcuts: [
        'Check each statement independently first',
        'Then check combined sufficiency',
        'Look for hidden relationships in data'
      ],
      mistakes: [
        'Assuming information not given',
        'Not checking combined sufficiency',
        'Missing indirect data relationships'
      ]
    },
    'clock-and-calendar': {
      name: 'Clock & Calendar',
      description: 'Solve problems related to time, dates, and calendar calculations.',
      concepts: [
        'Clock Angles: Hour and minute hand positions',
        'Time Gains/Losses: Fast and slow clocks',
        'Calendar Logic: Leap years and weekdays',
        'Date Calculations: Days between dates',
        'Recurring Patterns: Weekly and monthly cycles'
      ],
      importance: 'Practical problem-solving skills for time management and scheduling.',
      shortcuts: [
        'Remember: 360° in 12 hours = 30°/hour',
        'Minute hand moves 6°/minute',
        'Use modular arithmetic for calendar problems'
      ],
      mistakes: [
        'Confusing AM/PM calculations',
        'Not accounting for leap years',
        'Missing angle direction in clock problems'
      ]
    }
  };

  const currentTopicInfo = topicInfo[topicId];
  const topicName = currentTopicInfo?.name || 'Unknown Topic';
  const currentQuestion = filteredQuestions[session.currentQuestion];

  const handleStartPractice = () => {
    setMode('practice');
    setSession({
      currentQuestion: 0,
      answers: [],
      score: 0,
      isComplete: false
    });
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || hasAnswered) {
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...session.answers, {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    }];

    const newScore = session.score + (isCorrect ? 1 : 0);

    setSession({
      ...session,
      answers: newAnswers,
      score: newScore
    });

    // Save wrong answers as weak questions
    if (!isCorrect) {
      saveWeakQuestion(currentQuestion.id);
    } else {
      removeWeakQuestion(currentQuestion.id);
    }

    setHasAnswered(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = session.currentQuestion + 1;
    
    if (nextQuestionIndex >= filteredQuestions.length) {
      // Session complete - SAVE PROGRESS!
      const totalAttempted = session.answers.length;
      const totalCorrect = session.score;
      saveProgressToLocalStorage(totalAttempted, totalCorrect);
      
      setSession({
        ...session,
        isComplete: true
      });
      setMode('result');
    } else {
      setSession({
        ...session,
        currentQuestion: nextQuestionIndex
      });
      setSelectedAnswer('');
      setShowExplanation(false);
      setHasAnswered(false);
    }
  };

  const handleRestartPractice = () => {
    setMode('intro');
    setSession({
      currentQuestion: 0,
      answers: [],
      score: 0,
      isComplete: false
    });
    setSelectedAnswer('');
    setShowExplanation(false);
    setHasAnswered(false);
  };

  // Intro Mode - matches Quantitative exactly
  if (mode === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.push('/aptitude/logical-reasoning')}
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{topicName}</h1>
              <p className="text-gray-600 mt-2">{currentTopicInfo?.description}</p>
            </div>
          </div>

          {/* What is this topic? */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-blue-600" />
                What is {topicName}?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {currentTopicInfo?.description}
              </p>
            </CardContent>
          </Card>

          {/* Why is it Important? */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Why is it Important?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {currentTopicInfo?.importance}
              </p>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Key Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {currentTopicInfo?.concepts?.map((concept: string) => (
                  <div key={concept} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <code className="text-blue-800 text-sm">{concept}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shortcuts & Tricks */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Shortcuts & Tricks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentTopicInfo?.shortcuts?.map((shortcut: string) => (
                  <li key={shortcut} className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span className="text-gray-700">{shortcut}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <XCircle className="h-5 w-5 text-red-600" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentTopicInfo?.mistakes?.map((mistake: string) => (
                  <li key={mistake} className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span className="text-gray-700">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* PHASE-2: Mini Insight Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InsightCard
                icon={AlertTriangle}
                title="🎯 Common Trap"
                content={`In ${topicName}, students often rush and miss subtle patterns. Always double-check your reasoning before selecting the answer.`}
                bgColor="bg-red-50"
                iconColor="text-red-600"
                borderColor="border-red-200"
              />
              <InsightCard
                icon={Eye}
                title="👀 Interviewer's View"
                content={`Interviewers use ${topicName.toLowerCase()} to test analytical thinking. They want to see systematic approach and clear logic.`}
                bgColor="bg-purple-50"
                iconColor="text-purple-600"
                borderColor="border-purple-200"
              />
              <InsightCard
                icon={Brain}
                title="💡 Pattern Tip"
                content={`${topicName} problems follow predictable patterns. Master 3-4 core patterns to solve 80% of questions quickly.`}
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
                borderColor="border-blue-200"
              />
            </div>
          </div>

          {/* PHASE-2: Practice Controls */}
          <Card className="mb-6 border-2 border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Filter className="h-5 w-5" />
                Practice Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {/* Difficulty Selector */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2">
                    {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                          difficulty === level
                            ? level === 'easy' ? 'bg-green-500 text-white' :
                              level === 'medium' ? 'bg-yellow-500 text-white' :
                              level === 'hard' ? 'bg-red-500 text-white' :
                              'bg-purple-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setDifficulty(level)}
                      >
                        {level === 'all' ? 'Mix' : level}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Repeat Weak Toggle */}
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Focus Mode
                  </label>
                  <button
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      repeatWeak
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setRepeatWeak(!repeatWeak)}
                  >
                    <RefreshCw className={`h-4 w-4 ${repeatWeak ? 'animate-spin' : ''}`} />
                    Repeat Weak Questions
                    {weakQuestionIds.length > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${repeatWeak ? 'bg-white/20' : 'bg-orange-100 text-orange-600'}`}>
                        {weakQuestionIds.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              {repeatWeak && weakQuestionIds.length === 0 && (
                <p className="mt-3 text-sm text-orange-600 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  No weak questions yet. Practice first to identify them!
                </p>
              )}
              
              {/* Show filtered question count */}
              {(repeatWeak || difficulty !== 'all') && filteredQuestions.length > 0 && (
                <p className="mt-3 text-sm text-purple-600 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {filteredQuestions.length} questions selected based on your settings
                </p>
              )}
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-lg transition-colors"
              onClick={handleStartPractice}
            >
              <Play className="h-5 w-5" />
              Start Practice ({filteredQuestions.length} Questions)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice Mode - matches Quantitative exactly
  if (mode === 'practice') {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header with Back Button and Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMode('intro')}
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="text-center">
                <h1 className="text-xl font-semibold">{topicName} Practice</h1>
                <p className="text-sm text-gray-600">
                  Question {session.currentQuestion + 1} of {filteredQuestions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-lg font-semibold">{session.score}/{session.currentQuestion + (hasAnswered ? 1 : 0)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((session.currentQuestion + (hasAnswered ? 1 : 0)) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Q{session.currentQuestion + 1}. {currentQuestion?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion && Object.entries(currentQuestion.options).map(([key, option]) => (
                  <button
                    key={key}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedAnswer === key.toUpperCase()
                        ? hasAnswered
                          ? key.toUpperCase() === currentQuestion.correctAnswer
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-blue-100 border-blue-500 text-blue-800'
                        : key.toUpperCase() === currentQuestion.correctAnswer && hasAnswered
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                    }`}
                    disabled={hasAnswered}
                    onClick={() => {
                      if (!hasAnswered) {
                        setSelectedAnswer(key.toUpperCase());
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{key.toUpperCase()}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit/Next Button */}
              {!hasAnswered ? (
                <button
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedAnswer}
                  onClick={handleAnswerSubmit}
                >
                  Submit Answer
                </button>
              ) : (
                <div>
                  {/* Correct/Incorrect Feedback */}
                  <div className={`p-4 rounded-lg mb-4 ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                      </span>
                    </div>
                    {selectedAnswer !== currentQuestion.correctAnswer && (
                      <p className="text-sm text-red-700 mb-2">
                        The correct answer is <strong>{currentQuestion.correctAnswer}</strong>
                      </p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* Next Question Button */}
                  <button
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    onClick={handleNextQuestion}
                  >
                    {session.currentQuestion + 1 >= questions.length ? 'View Results' : 'Next Question'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Result Mode - matches Quantitative exactly
  if (mode === 'result') {
    const percentage = Math.round((session.score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.push('/aptitude/logical-reasoning')}
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Complete!</h1>
              <p className="text-gray-600 mt-1">{topicName} Results</p>
            </div>
          </div>

          {/* Score Card */}
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-3xl font-bold ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {percentage}%
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Score: {session.score}/{questions.length}
              </h2>
              <p className={`text-lg font-semibold mb-4 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {passed ? 'Great Job!' : 'Keep Practicing!'}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">Correct</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{session.score}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-600">Incorrect</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{questions.length - session.score}</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={handleRestartPractice}
            >
              Practice Again
            </button>
            <button
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => router.push('/aptitude/logical-reasoning')}
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
