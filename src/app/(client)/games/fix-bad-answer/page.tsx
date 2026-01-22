"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import {
    badAnswerQuestions,
    difficultyColors,
    difficultyLabels,
    getFilteredQuestions,
    getRandomQuestion
} from "@/data/games-data";
import {
    ArrowRight,
    Award,
    Brain,
    ChevronRight,
    Edit3,
    FileText,
    Home,
    Lightbulb,
    RotateCcw,
    Sparkles,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface GameScore {
  clarity: number;
  grammar: number;
  professionalTone: number;
  relevance: number;
  completeness: number;
  finalScore: number;
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
  recruiterPerspective?: string;
  improvementFromLast?: string;
  structuredSuggestion?: string;
}

interface PreviousAttempt {
  score: number;
  questionId: string;
}

export default function FixBadAnswerGame() {
  const router = useRouter();
  const { 
    selectedDifficulty, 
    setDifficulty, 
    recordAttempt, 
    gameProgress, 
    calculateXp,
    getDifficultyMultiplier 
  } = useGames();
  
  const progress = gameProgress['fix-bad-answer'];
  
  const [currentQuestion, setCurrentQuestion] = useState<typeof badAnswerQuestions[0] | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [previousAttempt, setPreviousAttempt] = useState<PreviousAttempt | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  // Get next question based on difficulty
  const getNextQuestion = useCallback(() => {
    const filtered = getFilteredQuestions(badAnswerQuestions, selectedDifficulty);
    const question = getRandomQuestion(filtered, usedQuestionIds);
    
    if (question) {
      setCurrentQuestion(question);
      setUsedQuestionIds(prev => [...prev, question.id].slice(-5)); // Keep last 5
    } else {
      // Reset if all questions used
      const anyQuestion = getRandomQuestion(filtered, []);
      setCurrentQuestion(anyQuestion);
      setUsedQuestionIds([anyQuestion?.id || '']);
    }
    
    setUserAnswer("");
    setGameScore(null);
    setShowCompletion(false);
  }, [selectedDifficulty, usedQuestionIds]);

  // Initialize with a question
  useEffect(() => {
    getNextQuestion();
  }, []);

  // Handle difficulty change
  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setUsedQuestionIds([]);
    const filtered = getFilteredQuestions(badAnswerQuestions, diff);
    const question = getRandomQuestion(filtered, []);
    setCurrentQuestion(question);
    setUserAnswer("");
    setGameScore(null);
    setShowCompletion(false);
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) {
      toast.error("Please write your corrected answer before submitting.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/games/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badAnswer: currentQuestion.badAnswer,
          userAnswer: userAnswer.trim(),
          difficulty: selectedDifficulty,
          context: currentQuestion.context,
          keywords: currentQuestion.keywords,
        })
      });

      let result: GameScore;
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      result = await response.json();
      
      // Validate response
      if (!result || typeof result.finalScore !== 'number') {
        throw new Error("Invalid evaluation response format");
      }

      // Apply difficulty modifier to scoring strictness
      const multiplier = getDifficultyMultiplier(selectedDifficulty);
      
      // Add enhanced feedback
      result.recruiterPerspective = generateRecruiterPerspective(result.finalScore, result.strengths);
      result.improvementFromLast = previousAttempt 
        ? generateImprovementFeedback(previousAttempt.score, result.finalScore)
        : "First attempt - keep practicing to track improvement!";
      result.structuredSuggestion = generateSTARSuggestion(currentQuestion.badAnswer, result.finalScore);
      
      setGameScore(result);
      
      // Calculate and record XP
      const earnedXp = calculateXp(result.finalScore, selectedDifficulty);
      setXpEarned(earnedXp);
      
      // Record the attempt
      recordAttempt('fix-bad-answer', result.finalScore, currentQuestion.id, selectedDifficulty);
      
      // Store for comparison
      setPreviousAttempt({ score: result.finalScore, questionId: currentQuestion.id });
      
      // Show completion screen
      setShowCompletion(true);

      // Success toast
      if (result.finalScore >= 8) {
        toast.success("🎉 Excellent! Outstanding improvement!");
      } else if (result.finalScore >= 6) {
        toast.success("👍 Great job! Solid improvement.");
      } else {
        toast.success("💪 Keep practicing to improve!");
      }

    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast.error("Evaluation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecruiterPerspective = (score: number, strengths: string[]): string => {
    if (score >= 8) {
      return "A recruiter would view this response favorably. It demonstrates professional communication, clear structure, and confidence.";
    } else if (score >= 6) {
      return "A recruiter would see potential in this response. Adding more specific examples or quantifiable achievements would make it stronger.";
    } else if (score >= 4) {
      return "This response needs more development to impress recruiters. Focus on being specific, using professional language, and highlighting your unique value.";
    }
    return "This response may raise concerns with recruiters. Consider restructuring using the STAR method and focusing on concrete accomplishments.";
  };

  const generateImprovementFeedback = (lastScore: number, currentScore: number): string => {
    const diff = currentScore - lastScore;
    if (diff > 1.5) {
      return `📈 Excellent progress! You improved by ${diff.toFixed(1)} points from your last attempt!`;
    } else if (diff > 0) {
      return `📊 Good improvement! You're ${diff.toFixed(1)} points higher than before.`;
    } else if (diff === 0) {
      return "📋 Consistent performance. Try incorporating new techniques for further improvement.";
    }
    return `📉 This score is ${Math.abs(diff).toFixed(1)} points lower. Review the feedback and try again!`;
  };

  const generateSTARSuggestion = (badAnswer: string, score: number): string => {
    if (score >= 7) {
      return "✨ Good structure! To enhance further, ensure each part of your answer follows STAR: Situation → Task → Action → Result with specific examples.";
    }
    return "💡 Try using the STAR method:\n• Situation: Set the context\n• Task: Describe your responsibility\n• Action: Explain what YOU did specifically\n• Result: Share the measurable outcome";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-blue-600 bg-blue-50";
    if (score >= 4) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Outstanding";
    if (score >= 8) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 6) return "Fair";
    if (score >= 4) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/games')}
              className="text-gray-500"
            >
              <Home className="h-4 w-4 mr-1" />
              Back to Games
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <Edit3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fix the Bad Answer</h1>
              <p className="text-sm text-gray-500">Correction Challenge</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Attempts</p>
                  <p className="text-lg font-bold">{progress.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Best Score</p>
                  <p className="text-lg font-bold">{progress.bestScore > 0 ? progress.bestScore.toFixed(1) : '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Average</p>
                  <p className="text-lg font-bold">{progress.averageScore > 0 ? progress.averageScore : '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-lg font-bold">{progress.currentLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Selector */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-gray-700">Difficulty</span>
              </div>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Interface */}
        {!showCompletion ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bad Answer Panel */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-red-600 text-lg">
                  <Edit3 className="h-5 w-5" />
                  Bad Answer to Fix
                </CardTitle>
                {currentQuestion?.context && (
                  <p className="text-sm text-gray-500 mt-1">
                    Question: &quot;{currentQuestion.context}&quot;
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 text-lg leading-relaxed font-medium">
                    &quot;{currentQuestion?.badAnswer || 'Loading...'}&quot;
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Transform this into a professional, structured answer demonstrating confidence.
                </p>
                
                {/* Hint Keywords */}
                {currentQuestion?.keywords && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      Consider including:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {currentQuestion.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Input Panel */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-600 text-lg">
                  <Edit3 className="h-5 w-5" />
                  Your Improved Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={userAnswer}
                  placeholder="Rewrite the bad answer in a more professional, clear, and structured way using the STAR method..."
                  className="min-h-[180px] border-2 focus:border-green-400 resize-none"
                  disabled={isLoading}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    disabled={isLoading || !userAnswer.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={evaluateAnswer}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        Submit Correction
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => {
                      setUserAnswer("");
                      setGameScore(null);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Completion Screen with Results */
          <div className="space-y-6">
            {/* XP Earned Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">You earned</p>
                    <div className="flex items-center gap-2">
                      <Zap className="h-8 w-8 text-yellow-300" />
                      <span className="text-4xl font-bold">+{xpEarned} XP</span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">
                      {difficultyLabels[selectedDifficulty]} difficulty ({getDifficultyMultiplier(selectedDifficulty)}x multiplier)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Score</p>
                    <p className="text-5xl font-bold">{gameScore?.finalScore.toFixed(1)}</p>
                    <p className="text-sm">{getScoreLabel(gameScore?.finalScore || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Breakdown */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    AI Evaluation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(gameScore?.finalScore || 0)}`}>
                      {gameScore?.finalScore.toFixed(1)}/10
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{getScoreLabel(gameScore?.finalScore || 0)}</p>
                      <p className="text-sm text-gray-500">Overall Score</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Clarity', value: gameScore?.clarity },
                      { label: 'Grammar', value: gameScore?.grammar },
                      { label: 'Professional Tone', value: gameScore?.professionalTone },
                      { label: 'Relevance', value: gameScore?.relevance },
                      { label: 'Completeness', value: gameScore?.completeness },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{metric.label}</span>
                          <span className="text-gray-600">{metric.value?.toFixed(1)}/10</span>
                        </div>
                        <Progress value={(metric.value || 0) * 10} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Feedback & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recruiter Perspective */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-medium text-blue-700 mb-1">👔 Recruiter Perspective</p>
                    <p className="text-sm text-gray-700">{gameScore?.recruiterPerspective}</p>
                  </div>

                  {/* Improvement from Last */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-medium text-purple-700 mb-1">📊 Progress</p>
                    <p className="text-sm text-gray-700">{gameScore?.improvementFromLast}</p>
                  </div>

                  {/* Strengths */}
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">✓ Strengths</p>
                    <ul className="space-y-1">
                      {gameScore?.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas to Improve */}
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">△ Areas for Improvement</p>
                    <ul className="space-y-1">
                      {gameScore?.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-gray-700">• {w}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* STAR Suggestion */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Structured Suggestion (STAR Method)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{gameScore?.structuredSuggestion}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ideal Answer */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Suggested Ideal Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed">{gameScore?.idealAnswer}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={getNextQuestion}
              >
                Next Bad Answer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
