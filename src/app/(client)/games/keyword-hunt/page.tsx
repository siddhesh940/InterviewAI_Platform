'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import { 
  difficultyColors, 
  difficultyLabels, 
  getFilteredQuestions, 
  getRandomQuestion,
  keywordTopics
} from "@/data/games-data";
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Home, 
  Lightbulb, 
  Plus, 
  Sparkles, 
  Target, 
  Timer, 
  TrendingUp, 
  Trophy, 
  XCircle, 
  Zap 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from 'react';
import { toast } from "sonner";

interface EvaluationResult {
  score: number;
  correctKeywords: string[];
  missedKeywords: string[];
  bonusKeywords: string[];
  feedbackSummary: string;
  recruiterPerspective?: string;
  studyRecommendation?: string;
}

export default function KeywordHuntGame() {
  const router = useRouter();
  const { 
    selectedDifficulty, 
    setDifficulty, 
    recordAttempt, 
    gameProgress, 
    calculateXp,
    getDifficultyMultiplier 
  } = useGames();
  
  const progress = gameProgress['keyword-hunt'];
  
  const [currentTopic, setCurrentTopic] = useState<typeof keywordTopics[0] | null>(null);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [usedTopicIds, setUsedTopicIds] = useState<string[]>([]);

  // Get time limit based on difficulty
  const getTimeLimit = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'beginner': return 45;
      case 'intermediate': return 35;
      case 'advanced': return 30;
    }
  };

  // Initialize with a topic
  useEffect(() => {
    selectNewTopic();
  }, []);

  const selectNewTopic = useCallback(() => {
    const filtered = getFilteredQuestions(keywordTopics, selectedDifficulty);
    const topic = getRandomQuestion(filtered, usedTopicIds);
    
    if (topic) {
      setCurrentTopic(topic);
      setUsedTopicIds(prev => [...prev, topic.id].slice(-5));
    } else {
      const anyTopic = getRandomQuestion(filtered, []);
      setCurrentTopic(anyTopic);
      setUsedTopicIds([anyTopic?.id || '']);
    }
    
    setUserInput("");
    setTimeLeft(getTimeLimit(selectedDifficulty));
    setIsActive(false);
    setGameOver(false);
    setEvaluation(null);
  }, [selectedDifficulty, usedTopicIds]);

  // Handle difficulty change
  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setUsedTopicIds([]);
    const filtered = getFilteredQuestions(keywordTopics, diff);
    const topic = getRandomQuestion(filtered, []);
    setCurrentTopic(topic);
    setUserInput("");
    setTimeLeft(getTimeLimit(diff));
    setIsActive(false);
    setGameOver(false);
    setEvaluation(null);
  };

  const evaluateKeywords = useCallback((input: string): EvaluationResult => {
    if (!currentTopic) {
      return { score: 0, correctKeywords: [], missedKeywords: [], bonusKeywords: [], feedbackSummary: '' };
    }

    const userKeywords = input
      .toLowerCase()
      .split(/[,\n\r\t]+/)
      .map(kw => kw.trim())
      .filter(kw => kw.length > 0);

    const uniqueUserKeywords = Array.from(new Set(userKeywords));
    const topicKeywords = currentTopic.keywords.map(k => k.toLowerCase());
    
    const correctKeywords: string[] = [];
    const missedKeywords: string[] = [];
    const bonusKeywords: string[] = [];

    // Find correct keywords
    topicKeywords.forEach(correctKw => {
      const found = uniqueUserKeywords.find(userKw => 
        userKw === correctKw ||
        userKw.includes(correctKw) ||
        correctKw.includes(userKw) ||
        // Handle common variations
        (correctKw.includes('sort') && userKw.includes('sort'))
      );
      
      if (found) {
        correctKeywords.push(currentTopic.keywords.find(k => k.toLowerCase() === correctKw) || correctKw);
      } else {
        missedKeywords.push(currentTopic.keywords.find(k => k.toLowerCase() === correctKw) || correctKw);
      }
    });

    // Find bonus keywords
    if (currentTopic.bonusKeywords) {
      currentTopic.bonusKeywords.forEach(bonusKw => {
        if (uniqueUserKeywords.some(userKw => 
          userKw.includes(bonusKw.toLowerCase()) || bonusKw.toLowerCase().includes(userKw)
        )) {
          bonusKeywords.push(bonusKw);
        }
      });
    }

    // Calculate score with difficulty modifier
    const correctCount = correctKeywords.length;
    const totalPossible = currentTopic.keywords.length;
    const bonusCount = bonusKeywords.length;
    
    let score = (correctCount / totalPossible) * 8;
    score += Math.min(bonusCount * 0.5, 2);
    
    // Apply difficulty strictness
    const strictness = selectedDifficulty === 'advanced' ? 0.9 : selectedDifficulty === 'intermediate' ? 1.0 : 1.1;
    score = Math.min(10, Math.max(0, score * strictness));
    score = Math.round(score * 10) / 10;

    // Generate feedback
    const percentage = (correctCount / totalPossible) * 100;
    let feedbackSummary = '';
    let recruiterPerspective = '';
    
    if (percentage >= 80) {
      feedbackSummary = "Excellent recall! You have strong technical vocabulary.";
      recruiterPerspective = "Your technical depth would impress interviewers. You can confidently discuss this topic.";
    } else if (percentage >= 60) {
      feedbackSummary = `Good recall of ${currentTopic.title}. Review: ${missedKeywords.slice(0, 3).join(", ")}.`;
      recruiterPerspective = "You demonstrate solid foundational knowledge. Expanding vocabulary in weak areas will help.";
    } else if (percentage >= 40) {
      feedbackSummary = `Decent foundation. Focus on: ${missedKeywords.slice(0, 3).join(", ")}.`;
      recruiterPerspective = "More practice is recommended before technical interviews on this topic.";
    } else {
      feedbackSummary = `Study ${currentTopic.title} fundamentals. Key terms: ${missedKeywords.slice(0, 4).join(", ")}.`;
      recruiterPerspective = "Consider reviewing core concepts before discussing this topic in interviews.";
    }

    const studyRecommendation = `Study ${currentTopic.title} fundamentals. Key missing terms: ${missedKeywords.slice(0, 4).join(", ")}.`;

    return {
      score,
      correctKeywords,
      missedKeywords,
      bonusKeywords,
      feedbackSummary,
      recruiterPerspective,
      studyRecommendation,
    };
  }, [currentTopic, selectedDifficulty]);

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim() && isActive) {
      toast.error("Please enter some keywords before submitting.");
      return;
    }

    setIsActive(false);
    setGameOver(true);
    setIsLoading(true);

    try {
      const result = evaluateKeywords(userInput);
      setEvaluation(result);
      
      // Calculate XP
      const earnedXp = calculateXp(result.score, selectedDifficulty);
      setXpEarned(earnedXp);
      
      // Record attempt
      if (currentTopic) {
        recordAttempt('keyword-hunt', result.score, currentTopic.id, selectedDifficulty);
      }

      // Show toast
      if (result.score >= 8) {
        toast.success("🎯 Outstanding keyword recall!");
      } else if (result.score >= 6) {
        toast.success("👍 Great technical vocabulary!");
      } else {
        toast.success("💪 Keep practicing!");
      }

    } catch (error) {
      console.error("Error evaluating:", error);
      toast.error("Evaluation failed.");
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isActive, evaluateKeywords, calculateXp, selectedDifficulty, currentTopic, recordAttempt]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSubmit();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleSubmit]);

  const startGame = () => {
    setIsActive(true);
    setGameOver(false);
    setEvaluation(null);
    setUserInput("");
    setTimeLeft(getTimeLimit(selectedDifficulty));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-blue-600 bg-blue-50";
    if (score >= 4) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Outstanding";
    if (score >= 7) return "Great";
    if (score >= 5) return "Good";
    if (score >= 3) return "Fair";
    return "Needs Work";
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-600";
    if (timeLeft > 10) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        
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
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Hunt</h1>
              <p className="text-sm text-gray-500">Fast recall-based technical training</p>
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
                <Trophy className="h-4 w-4 text-green-600" />
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
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-700">Difficulty</span>
                <span className="text-xs text-gray-500">
                  (Time: {getTimeLimit(selectedDifficulty)}s)
                </span>
              </div>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    disabled={isActive}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Area */}
        {!gameOver ? (
          <div className="space-y-6">
            {/* Topic Challenge */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Topic Challenge</p>
                    <h2 className="text-2xl font-bold">{currentTopic?.title || 'Loading...'}</h2>
                    <Badge className="mt-2 bg-white/20 text-white border-0">
                      {currentTopic?.category}
                    </Badge>
                  </div>
                  
                  {/* Timer */}
                  <div className={`text-center ${isActive ? 'animate-pulse' : ''}`}>
                    <div className={`text-5xl font-bold ${getTimerColor()}`}>
                      {timeLeft}
                    </div>
                    <p className="text-xs opacity-80">seconds</p>
                  </div>
                </div>
                
                {!isActive && !gameOver && (
                  <p className="mt-4 text-sm opacity-80">
                    List as many relevant keywords as you can remember!
                  </p>
                )}
              </div>

              <CardContent className="p-6">
                {!isActive ? (
                  <div className="text-center py-8">
                    <Timer className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      You have {getTimeLimit(selectedDifficulty)} seconds to list keywords related to this topic.
                      <br />
                      <span className="text-sm text-gray-500">Separate keywords with commas or new lines.</span>
                    </p>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={startGame}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      Start Challenge
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Textarea
                      value={userInput}
                      placeholder="Type keywords separated by commas... e.g., ACID, transaction, commit, rollback"
                      className="min-h-[150px] border-2 focus:border-purple-400 resize-none text-lg"
                      onChange={(e) => setUserInput(e.target.value)}
                      autoFocus={true}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500">
                        {userInput.split(/[,\n]+/).filter(k => k.trim()).length} keywords entered
                      </p>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Evaluating...' : 'Submit'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-6">
            {/* XP Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">You earned</p>
                    <div className="flex items-center gap-2">
                      <Zap className="h-8 w-8 text-yellow-300" />
                      <span className="text-4xl font-bold">+{xpEarned} XP</span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">
                      {difficultyLabels[selectedDifficulty]} ({getDifficultyMultiplier(selectedDifficulty)}x)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-4 py-2 rounded-xl ${getScoreColor(evaluation?.score || 0)}`}>
                      <p className="text-3xl font-bold">{evaluation?.score.toFixed(1)}</p>
                      <p className="text-xs">{getScoreLabel(evaluation?.score || 0)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Correct Keywords */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Correct Keywords ({evaluation?.correctKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {evaluation?.correctKeywords.map((kw, i) => (
                      <Badge key={i} className="bg-green-100 text-green-700 border-green-200">
                        {kw}
                      </Badge>
                    ))}
                    {evaluation?.correctKeywords.length === 0 && (
                      <p className="text-sm text-gray-500">No correct keywords found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Missed Keywords */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Keywords Missed ({evaluation?.missedKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {evaluation?.missedKeywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-red-600 border-red-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Feedback & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recruiter Perspective */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 mb-1">👔 Recruiter Perspective</p>
                  <p className="text-sm text-gray-700">{evaluation?.recruiterPerspective}</p>
                </div>

                {/* Study Recommendation */}
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Study Recommendations
                  </p>
                  <p className="text-sm text-gray-700">{evaluation?.studyRecommendation}</p>
                </div>

                {/* Bonus Keywords */}
                {evaluation?.bonusKeywords && evaluation.bonusKeywords.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-medium text-purple-700 mb-2">
                      ⭐ Bonus Keywords Found
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.bonusKeywords.map((kw, i) => (
                        <Badge key={i} className="bg-purple-100 text-purple-700">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={selectNewTopic}
              >
                Next Topic
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGameOver(false);
                  setUserInput("");
                  setTimeLeft(getTimeLimit(selectedDifficulty));
                  setEvaluation(null);
                }}
              >
                Retry Topic
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/interview-resources')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Study Resources
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
