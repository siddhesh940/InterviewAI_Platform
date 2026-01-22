"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import {
    difficultyColors,
    difficultyLabels,
    getFilteredQuestionsExpanded,
    getTotalQuestionCount,
    truthOrBluffStatementsExpanded,
} from "@/data/games-questions-expanded";
import {
    AlertTriangle,
    ArrowRight,
    Award,
    Check,
    CheckCircle,
    Clock,
    Eye,
    Flame,
    Home,
    Lightbulb,
    RotateCcw,
    Shield,
    Sparkles,
    Target,
    TrendingUp,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type AnswerType = "correct" | "incorrect" | "misleading";

interface StatementResult {
  statement: string;
  category: string;
  correctAnswer: AnswerType;
  userAnswer: AnswerType | null;
  isCorrect: boolean;
  explanation: string;
  timeBonus: number;
}

interface GameResult {
  score: number;
  scoreLabel: string;
  totalCorrect: number;
  totalStatements: number;
  accuracy: number;
  streakBonus: number;
  timeBonus: number;
  results: StatementResult[];
}

const TIME_PER_STATEMENT = {
  beginner: 20,
  intermediate: 15,
  advanced: 10,
};

export default function TruthOrBluffGame() {
  const router = useRouter();
  const {
    selectedDifficulty,
    setDifficulty,
    recordAttempt,
    gameProgress,
    calculateXp,
    getDifficultyMultiplier,
  } = useGames();

  const progress = gameProgress["truth-or-bluff"];

  const [statements, setStatements] = useState<typeof truthOrBluffStatementsExpanded>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<StatementResult[]>([]);
  const [gamePhase, setGamePhase] = useState<"intro" | "playing" | "results">("intro");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_STATEMENT[selectedDifficulty]);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [usedStatementIds, setUsedStatementIds] = useState<string[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const STATEMENTS_PER_ROUND = 10;

  const currentStatement = statements[currentIndex];

  // Shuffle and select statements (avoiding recently used ones)
  const initializeGame = useCallback((resetUsed = false) => {
    const filtered = getFilteredQuestionsExpanded(truthOrBluffStatementsExpanded, selectedDifficulty);
    
    // Get current used IDs or reset
    const currentUsedIds = resetUsed ? [] : usedStatementIds;
    
    // Filter out recently used statements
    let available = filtered.filter((s: { id: string }) => !currentUsedIds.includes(s.id));
    
    // If not enough new statements, reset the used list
    if (available.length < STATEMENTS_PER_ROUND) {
      available = filtered;
      setUsedStatementIds([]);
    }
    
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, STATEMENTS_PER_ROUND);
    
    // Track used statement IDs
    const newUsedIds = selected.map((s: { id: string }) => s.id);
    setUsedStatementIds(prev => resetUsed ? newUsedIds : [...prev, ...newUsedIds]);
    
    setStatements(selected);
    setCurrentIndex(0);
    setResults([]);
    setStreak(0);
    setTimeLeft(TIME_PER_STATEMENT[selectedDifficulty]);
    setGameResult(null);
  }, [selectedDifficulty, usedStatementIds]);

  // Initialize game only once on mount
  useEffect(() => {
    const filtered = getFilteredQuestionsExpanded(truthOrBluffStatementsExpanded, selectedDifficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, STATEMENTS_PER_ROUND);
    setStatements(selected);
    setUsedStatementIds(selected.map((s: { id: string }) => s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic
  useEffect(() => {
    if (gamePhase !== "playing" || isTransitioning) {return;}

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null); // Time's up
          
return TIME_PER_STATEMENT[selectedDifficulty];
        }
        
return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {clearInterval(timerRef.current);}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, currentIndex, isTransitioning, selectedDifficulty]);

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setGamePhase("intro");
    // Reset used statements when difficulty changes
    setUsedStatementIds([]);
    setRoundNumber(1);
    const filtered = getFilteredQuestionsExpanded(truthOrBluffStatementsExpanded, diff);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setStatements(shuffled.slice(0, STATEMENTS_PER_ROUND));
    setCurrentIndex(0);
    setResults([]);
    setStreak(0);
    setTimeLeft(TIME_PER_STATEMENT[diff]);
    setGameResult(null);
  };

  // Calculate total questions available for the difficulty
  const totalQuestions = getTotalQuestionCount(truthOrBluffStatementsExpanded, selectedDifficulty);
  const maxRounds = Math.floor(totalQuestions / STATEMENTS_PER_ROUND);

  const startGame = () => {
    setRoundNumber(prev => prev + 1);
    initializeGame();
    setGamePhase("playing");
    setTimeLeft(TIME_PER_STATEMENT[selectedDifficulty]);
  };

  const handleAnswer = useCallback(
    (answer: AnswerType | null) => {
      if (!currentStatement || isTransitioning) {return;}

      setIsTransitioning(true);
      if (timerRef.current) {clearInterval(timerRef.current);}
      const isCorrect = answer === currentStatement.answer;
      const timeBonus = answer !== null ? Math.max(0, Math.round((timeLeft / TIME_PER_STATEMENT[selectedDifficulty]) * 2)) : 0;

      const result: StatementResult = {
        statement: currentStatement.statement,
        category: currentStatement.category,
        correctAnswer: currentStatement.answer,
        userAnswer: answer,
        isCorrect,
        explanation: currentStatement.explanation,
        timeBonus,
      };

      setResults((prev) => [...prev, result]);

      if (isCorrect) {
        setStreak((prev) => prev + 1);
        toast.success("✓ Correct!", { duration: 1000 });
      } else if (answer === null) {
        setStreak(0);
        toast.error("⏱ Time's up!", { duration: 1000 });
      } else {
        setStreak(0);
        toast.error("✗ Wrong!", { duration: 1000 });
      }

      // Move to next or finish
      setTimeout(() => {
        if (currentIndex + 1 >= statements.length) {
          finishGame([...results, result]);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setTimeLeft(TIME_PER_STATEMENT[selectedDifficulty]);
        }
        setIsTransitioning(false);
      }, 800);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStatement, currentIndex, statements, results, timeLeft, selectedDifficulty, isTransitioning]
  );

  const finishGame = useCallback(
    (finalResults: StatementResult[]) => {
      const totalCorrect = finalResults.filter((r) => r.isCorrect).length;
      const totalStatements = finalResults.length;
      const accuracy = Math.round((totalCorrect / totalStatements) * 100);

      // Calculate score
      const baseScore = (totalCorrect / totalStatements) * 10;
      const streakBonus = Math.min(streak * 0.2, 1); // Max 1 point streak bonus
      const totalTimeBonus = finalResults.reduce((sum, r) => sum + r.timeBonus, 0) / totalStatements / 2;
      
      let finalScore = Math.min(10, baseScore + streakBonus + totalTimeBonus);
      finalScore = Math.round(finalScore * 10) / 10;

      let scoreLabel = "Poor";
      if (finalScore >= 9) {scoreLabel = "Outstanding";}
      else if (finalScore >= 8) {scoreLabel = "Excellent";}
      else if (finalScore >= 7) {scoreLabel = "Good";}
      else if (finalScore >= 5) {scoreLabel = "Fair";}
      else if (finalScore >= 3) {scoreLabel = "Needs Work";}

      const result: GameResult = {
        score: finalScore,
        scoreLabel,
        totalCorrect,
        totalStatements,
        accuracy,
        streakBonus: Math.round(streakBonus * 10) / 10,
        timeBonus: Math.round(totalTimeBonus * 10) / 10,
        results: finalResults,
      };

      setGameResult(result);
      setGamePhase("results");

      // Calculate XP
      const earnedXp = calculateXp(finalScore, selectedDifficulty);
      setXpEarned(earnedXp);

      // Record attempt
      recordAttempt("truth-or-bluff", finalScore, `round-${Date.now()}`, selectedDifficulty);

      if (finalScore >= 9) {
        toast.success("🏆 Outstanding performance!");
      } else if (finalScore >= 7) {
        toast.success("👍 Great job!");
      }
    },
    [streak, calculateXp, recordAttempt, selectedDifficulty]
  );

  const getAnswerButtonStyle = (type: AnswerType) => {
    const styles = {
      correct: "bg-green-100 hover:bg-green-200 border-green-300 text-green-700",
      incorrect: "bg-red-100 hover:bg-red-200 border-red-300 text-red-700",
      misleading: "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-700",
    };
    
return styles[type];
  };

  const getAnswerIcon = (type: AnswerType) => {
    const icons = {
      correct: <CheckCircle className="h-5 w-5" />,
      incorrect: <XCircle className="h-5 w-5" />,
      misleading: <AlertTriangle className="h-5 w-5" />,
    };
    
return icons[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 w-fit"
            onClick={() => router.push("/games")}
          >
            <Home className="h-4 w-4 mr-1" />
            Back to Games
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <Eye className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Truth or Bluff</h1>
              <p className="text-sm text-gray-500">Interview Edition</p>
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
                  <p className="text-lg font-bold">{progress.bestScore > 0 ? progress.bestScore.toFixed(1) : "--"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-600" />
                <div>
                  <p className="text-xs text-gray-500">Average</p>
                  <p className="text-lg font-bold">{progress.averageScore > 0 ? progress.averageScore : "--"}</p>
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
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span className="font-medium text-gray-700">Difficulty</span>
              </div>
              <div className="flex gap-2">
                {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
                  <button
                    key={diff}
                    disabled={gamePhase === "playing"}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                        : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                    } ${gamePhase === "playing" ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Phases */}
        {gamePhase === "intro" && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              {/* Round indicator */}
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className="text-violet-600 px-3 py-1">
                  Round {roundNumber} of {maxRounds}
                </Badge>
              </div>
              <div className="p-4 bg-violet-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-10 w-10 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Test Your Knowledge?</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You&apos;ll see {STATEMENTS_PER_ROUND} interview-related statements. For each one, decide if it&apos;s:
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Correct</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-700">Incorrect</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-700">Misleading</span>
                </div>
              </div>
              <div className="bg-violet-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-violet-700">
                  <Clock className="h-4 w-4 inline mr-1" />
                  <strong>{TIME_PER_STATEMENT[selectedDifficulty]} seconds</strong> per statement. 
                  Build streaks for bonus points!
                </p>
              </div>
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700" onClick={startGame}>
                Start Game
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {gamePhase === "playing" && currentStatement && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    Question {currentIndex + 1} of {statements.length}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <Flame className="h-4 w-4" />
                    Streak: {streak}
                  </span>
                </div>
                <Progress value={((currentIndex + 1) / statements.length) * 100} className="h-2" />
              </div>
            </div>

            {/* Timer */}
            <Card className={`border-0 shadow-sm ${timeLeft <= 5 ? "animate-pulse" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`h-5 w-5 ${timeLeft <= 5 ? "text-red-600" : "text-violet-600"}`} />
                    <span className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-gray-900"}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <Badge variant="outline" className="text-violet-600">
                    {currentStatement.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Statement */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                    &quot;{currentStatement.statement}&quot;
                  </p>
                </div>

                {/* Answer Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["correct", "incorrect", "misleading"] as const).map((type) => (
                    <button
                      key={type}
                      disabled={isTransitioning}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${getAnswerButtonStyle(type)} ${
                        isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                      }`}
                      onClick={() => handleAnswer(type)}
                    >
                      {getAnswerIcon(type)}
                      <span className="font-semibold capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gamePhase === "results" && gameResult && (
          <div className="space-y-6">
            {/* XP Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white">
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
                    <div className="inline-block px-4 py-3 rounded-xl bg-white/20">
                      <p className="text-4xl font-bold">{gameResult.score}/10</p>
                      <p className="text-sm">{gameResult.scoreLabel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {gameResult.totalCorrect}/{gameResult.totalStatements}
                  </p>
                  <p className="text-sm text-gray-500">Correct</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{gameResult.accuracy}%</p>
                  <p className="text-sm text-gray-500">Accuracy</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-600">+{gameResult.streakBonus}</p>
                  <p className="text-sm text-gray-500">Streak Bonus</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-violet-600">+{gameResult.timeBonus}</p>
                  <p className="text-sm text-gray-500">Time Bonus</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Review Your Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gameResult.results.map((result) => (
                  <div
                    key={result.statement}
                    className={`p-4 rounded-lg border ${
                      result.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {result.isCorrect ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-gray-800 font-medium mb-2">&quot;{result.statement}&quot;</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={`${
                            result.correctAnswer === "correct"
                              ? "bg-green-500"
                              : result.correctAnswer === "incorrect"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          } text-white`}>
                            Answer: {result.correctAnswer}
                          </Badge>
                          {result.userAnswer && result.userAnswer !== result.correctAnswer && (
                            <Badge variant="outline" className="text-gray-500">
                              You said: {result.userAnswer}
                            </Badge>
                          )}
                          {!result.userAnswer && (
                            <Badge variant="outline" className="text-gray-500">
                              Time expired
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{result.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-violet-600 hover:bg-violet-700" onClick={startGame}>
                Play Again
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setGamePhase("intro")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Change Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
