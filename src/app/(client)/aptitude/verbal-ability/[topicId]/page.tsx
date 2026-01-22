"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVerbalAbilityQuestions } from "@/data/verbal-ability-questions";
import { AlertTriangle, ArrowLeft, Brain, CheckCircle, Eye, Filter, RefreshCw, RotateCcw, Target, XCircle, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  paragraph?: string; // For Reading Comprehension
  question: string;
  sentences?: string[]; // For Para Jumbles
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface SessionState {
  currentQuestion: number;
  answers: Record<number, string>;
  score: number;
  showResult: boolean;
  timeSpent: number;
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

const topicNames = {
  "reading-comprehension": "Reading Comprehension",
  "sentence-completion": "Sentence Completion",
  "para-jumbles": "Para Jumbles",
  "error-spotting": "Error Spotting",
  "idioms-phrases": "Idioms & Phrases",
  "verbal-analogies": "Verbal Analogies"
};

const topicDescriptions = {
  "reading-comprehension": "Read passages carefully and answer questions based on comprehension, inference, and analysis.",
  "sentence-completion": "Complete sentences by choosing the most appropriate word or phrase from the given options.",
  "para-jumbles": "Arrange jumbled sentences in the correct logical sequence to form coherent paragraphs.",
  "error-spotting": "Identify grammatical errors, subject-verb disagreements, and other language mistakes in sentences.",
  "idioms-phrases": "Understand the meaning and usage of common idioms, phrases, and figurative expressions.",
  "verbal-analogies": "Identify relationships between word pairs and find analogous relationships in given options."
};

const topicInsights = {
  "reading-comprehension": {
    trap: "Don't assume answers from prior knowledge. The answer must be supported by the passage text only.",
    interviewer: "Tests your ability to quickly extract relevant information and make logical inferences.",
    pattern: "Main idea questions, inference questions, and vocabulary-in-context follow predictable structures."
  },
  "sentence-completion": {
    trap: "Don't pick the first option that 'sounds right'. Check if it fits grammatically AND contextually.",
    interviewer: "Evaluates vocabulary range and understanding of sentence structure and tone.",
    pattern: "Look for transition words and context clues that hint at the missing word's meaning."
  },
  "para-jumbles": {
    trap: "Starting with the longest sentence isn't always correct. Focus on logical flow and connectors.",
    interviewer: "Tests logical thinking and ability to understand coherent argument structure.",
    pattern: "Find the independent sentence first, then link sentences using pronouns and connectors."
  },
  "error-spotting": {
    trap: "Not all sentences have errors. Sometimes 'No Error' is the correct answer.",
    interviewer: "Assesses grammar knowledge and attention to detail in written communication.",
    pattern: "Check subject-verb agreement, tense consistency, and pronoun references first."
  },
  "idioms-phrases": {
    trap: "Don't take idioms literally. 'Break the ice' doesn't involve actual ice!",
    interviewer: "Tests cultural and linguistic awareness for professional communication.",
    pattern: "Context clues in the sentence often hint at whether the idiom is positive or negative."
  },
  "verbal-analogies": {
    trap: "The relationship must be identical, not just similar. 'Cat:Kitten' is not like 'Dog:Puppy'.",
    interviewer: "Evaluates ability to identify precise relationships and logical reasoning.",
    pattern: "Identify the relationship type first: synonyms, antonyms, function, degree, etc."
  }
};

export default function VerbalAbilityTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const [sessionState, setSessionState] = useState<SessionState>({
    currentQuestion: 0,
    answers: {},
    score: 0,
    showResult: false,
    timeSpent: 0
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startTime] = useState(Date.now());
  const [practiceStarted, setPracticeStarted] = useState(false);
  
  // PHASE-2: Practice Controls State
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [repeatWeak, setRepeatWeak] = useState(false);
  const [weakQuestionIds, setWeakQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    const topicQuestions = getVerbalAbilityQuestions(topicId);
    if (topicQuestions && topicQuestions.length > 0) {
      setQuestions(topicQuestions);
    }
  }, [topicId]);

  // Load weak questions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`weak-questions-verbal-${topicId}`);
    if (saved) {
      setWeakQuestionIds(JSON.parse(saved));
    }
  }, [topicId]);

  // Save progress to localStorage
  const saveProgressToLocalStorage = (attempted: number, correct: number) => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    
    if (!progress["verbal-ability"]) {
      progress["verbal-ability"] = {};
    }
    
    progress["verbal-ability"][topicId] = {
      attempted: attempted,
      correct: correct
    };
    
    localStorage.setItem("aptitude-progress", JSON.stringify(progress));
    console.log("Verbal Progress saved:", progress);
  };

  // Save/Remove weak questions
  const saveWeakQuestion = (questionId: number) => {
    if (!weakQuestionIds.includes(questionId)) {
      const updated = [...weakQuestionIds, questionId];
      setWeakQuestionIds(updated);
      localStorage.setItem(`weak-questions-verbal-${topicId}`, JSON.stringify(updated));
    }
  };

  const removeWeakQuestion = (questionId: number) => {
    const updated = weakQuestionIds.filter(id => id !== questionId);
    setWeakQuestionIds(updated);
    localStorage.setItem(`weak-questions-verbal-${topicId}`, JSON.stringify(updated));
  };

  // Filter questions based on settings
  const getFilteredQuestions = () => {
    if (!questions || questions.length === 0) return [];
    
    let filtered = [...questions];
    
    // Filter by weak questions if enabled
    if (repeatWeak && weakQuestionIds.length > 0) {
      filtered = filtered.filter(q => weakQuestionIds.includes(q.id));
    }
    
    // Filter by difficulty if not 'all'
    if (difficulty !== 'all') {
      filtered = filtered.filter((q: any) => 
        q.difficulty?.toLowerCase() === difficulty
      );
    }
    
    return filtered.length > 0 ? filtered : questions;
  };

  const filteredQuestions = getFilteredQuestions();

  const currentQuestion = filteredQuestions[sessionState.currentQuestion];
  const currentInsights = topicInsights[topicId as keyof typeof topicInsights];

  const handleAnswerSelect = (key: string) => {
    setSelectedAnswer(key.toUpperCase());
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {return;}

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Save wrong answers as weak questions
    if (!isCorrect) {
      saveWeakQuestion(currentQuestion.id);
    } else {
      removeWeakQuestion(currentQuestion.id);
    }
    
    setSessionState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: selectedAnswer },
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (sessionState.currentQuestion < filteredQuestions.length - 1) {
      setSessionState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      // Complete the session - SAVE PROGRESS!
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const totalAttempted = Object.keys(sessionState.answers).length + 1; // +1 for current
      const totalCorrect = sessionState.score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
      
      saveProgressToLocalStorage(totalAttempted, totalCorrect);
      
      setSessionState(prev => ({
        ...prev,
        showResult: true,
        timeSpent
      }));
    }
  };

  const handleRetryTopic = () => {
    setSessionState({
      currentQuestion: 0,
      answers: {},
      score: 0,
      showResult: false,
      timeSpent: 0
    });
    setSelectedAnswer("");
    setShowFeedback(false);
    setPracticeStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!practiceStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/aptitude/verbal-ability')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 border-l border-gray-300" />
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Verbal Ability</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {topicNames[topicId as keyof typeof topicNames]}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {topicDescriptions[topicId as keyof typeof topicDescriptions]}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15-20</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Mixed</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Instructions:</h3>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Read each question carefully before selecting an answer</li>
                  <li>For Reading Comprehension, read the passage thoroughly before answering</li>
                  <li>For Para Jumbles, identify logical connections between sentences</li>
                  <li>For Error Spotting, check grammar, syntax, and word usage</li>
                  <li>You can review your answer before moving to the next question</li>
                  <li>Complete all questions to see your final score</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* PHASE-2: Mini Insight Cards */}
          {currentInsights && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                  icon={AlertTriangle}
                  title="🎯 Common Trap"
                  content={currentInsights.trap}
                  bgColor="bg-red-50"
                  iconColor="text-red-600"
                  borderColor="border-red-200"
                />
                <InsightCard
                  icon={Eye}
                  title="👀 Interviewer's View"
                  content={currentInsights.interviewer}
                  bgColor="bg-purple-50"
                  iconColor="text-purple-600"
                  borderColor="border-purple-200"
                />
                <InsightCard
                  icon={Brain}
                  title="💡 Pattern Tip"
                  content={currentInsights.pattern}
                  bgColor="bg-blue-50"
                  iconColor="text-blue-600"
                  borderColor="border-blue-200"
                />
              </div>
            </div>
          )}

          {/* PHASE-2: Practice Controls */}
          <Card className="mb-6 border-2 border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
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
                        onClick={() => setDifficulty(level)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                          difficulty === level
                            ? level === 'easy' ? 'bg-green-500 text-white' :
                              level === 'medium' ? 'bg-yellow-500 text-white' :
                              level === 'hard' ? 'bg-red-500 text-white' :
                              'bg-green-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
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
                    onClick={() => setRepeatWeak(!repeatWeak)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      repeatWeak
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
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
                <p className="mt-3 text-sm text-green-600 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {filteredQuestions.length} questions selected based on your settings
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => setPracticeStarted(true)}
            >
              Start Practice ({filteredQuestions.length} Questions)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState.showResult) {
    const percentage = Math.round((sessionState.score / filteredQuestions.length) * 100);
    let performanceLevel = "Keep Practicing";
    let performanceColor = "text-red-600";
    
    if (percentage >= 80) {
      performanceLevel = "Excellent";
      performanceColor = "text-green-600";
    } else if (percentage >= 60) {
      performanceLevel = "Good";
      performanceColor = "text-blue-600";
    } else if (percentage >= 40) {
      performanceLevel = "Average";
      performanceColor = "text-yellow-600";
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/aptitude/verbal-ability')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Topics
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">Practice Complete!</CardTitle>
              <p className="text-gray-600 mt-2">
                {topicNames[topicId as keyof typeof topicNames]} - Results
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${performanceColor} mb-2`}>
                  {percentage}%
                </div>
                <div className={`text-xl font-semibold ${performanceColor} mb-4`}>
                  {performanceLevel}
                </div>
                <div className="text-gray-600">
                  You scored {sessionState.score} out of {questions.length} questions correctly
                  <br />
                  Time taken: {formatTime(sessionState.timeSpent)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{sessionState.score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{questions.length - sessionState.score}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleRetryTopic}
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push('/aptitude/verbal-ability')}
                >
                  Back to Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setPracticeStarted(false)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-6 border-l border-gray-300" />
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">
                {topicNames[topicId as keyof typeof topicNames]}
              </span>
            </div>
          </div>
          <Badge variant="outline">
            Question {sessionState.currentQuestion + 1} of {filteredQuestions.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Reading Comprehension - Show paragraph first */}
            {currentQuestion?.paragraph && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-gray-900 mb-3">Passage:</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {currentQuestion?.paragraph}
                </p>
              </div>
            )}

            {/* Para Jumbles - Show sentences list */}
            {currentQuestion?.sentences && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sentences to arrange:</h3>
                <div className="space-y-2">
                  {currentQuestion.sentences.map((sentence, index) => {
                    const sentenceKey = `${String.fromCharCode(65 + index)}-${sentence.substring(0, 10)}`;
                    
return (
                      <div key={sentenceKey} className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                        <span className="font-medium text-gray-600">{String.fromCharCode(65 + index)}.</span> {sentence}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion?.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion && Object.entries(currentQuestion.options).map(([key, option]) => (
                  <div
                    key={key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedAnswer === key
                        ? showFeedback
                          ? selectedAnswer === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-blue-500 bg-blue-50"
                        : showFeedback && key === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => !showFeedback && handleAnswerSelect(key)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[24px]">
                        {key}.
                      </span>
                      <span className="text-gray-800">{option}</span>
                      {showFeedback && key === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                      {showFeedback && selectedAnswer === key && key !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showFeedback && currentQuestion && (
              <div className="mb-6">
                <div className={`p-4 rounded-lg border-l-4 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-800">Incorrect!</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <div className="text-sm text-gray-500">
                Progress: {sessionState.currentQuestion + 1} / {filteredQuestions.length}
              </div>
              <div className="flex gap-3">
                {!showFeedback ? (
                  <Button
                    disabled={!selectedAnswer}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmitAnswer}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleNextQuestion}
                  >
                    {sessionState.currentQuestion === filteredQuestions.length - 1 ? "View Results" : "Next Question"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
