"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import {
  allQuestionsUsed,
  difficultyColors,
  difficultyLabels,
  getFilteredQuestionsExpanded,
  getRandomQuestionExpanded,
  getRemainingQuestionCount,
  getTotalQuestionCount,
  keywordMappingQuestionsExpanded,
} from "@/data/games-questions-expanded";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  CheckCircle,
  Home,
  Key, Link2,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  X,
  XCircle,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";


interface EvaluationResult {
  score: number;
  scoreLabel: string;
  correctSelections: number;
  incorrectSelections: number;
  missedCorrect: number;
  accuracy: number;
  feedback: string[];
  sentenceResults: {
    id: string;
    text: string;
    wasCorrect: boolean;
    userSelected: boolean;
    explanation: string;
  }[];
}

export default function KeywordMappingGame() {
  const router = useRouter();
  const {
    selectedDifficulty,
    setDifficulty,
    recordAttempt,
    gameProgress,
    calculateXp,
    getDifficultyMultiplier,
  } = useGames();

  const progress = gameProgress["keyword-mapping"];

  const [currentQuestion, setCurrentQuestion] = useState<typeof keywordMappingQuestionsExpanded[0] | null>(null);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [, setQuestionNumber] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to load a question
  const loadQuestion = useCallback((difficulty: DifficultyLevel, excludeIds: string[]) => {
    const filtered = getFilteredQuestionsExpanded(keywordMappingQuestionsExpanded, difficulty);
    const question = getRandomQuestionExpanded(filtered, excludeIds);

    if (question) {
      setCurrentQuestion(question);
      
      // Reset selections
      const initialSelections: Record<string, boolean> = {};
      question.sentences.forEach((s: { id: string }) => {
        initialSelections[s.id] = false;
      });
      setSelections(initialSelections);
      // eslint-disable-next-line newline-before-return
      return question.id;
    }
    // eslint-disable-next-line newline-before-return
    return null;
  }, []);

  const selectNewQuestion = useCallback(() => {
    // Check if all questions for this difficulty have been used
    if (allQuestionsUsed(keywordMappingQuestionsExpanded, selectedDifficulty, usedQuestionIds)) {
      setLevelCompleted(true);
      toast.success(`🎉 You've completed all ${selectedDifficulty} questions!`);
      // eslint-disable-next-line newline-before-return
      return;
    }

    const questionId = loadQuestion(selectedDifficulty, usedQuestionIds);
    if (questionId) {
      setUsedQuestionIds((prev) => [...prev, questionId]);
    }

    setEvaluation(null);
    setShowResults(false);
    setQuestionNumber((prev) => prev + 1);
  }, [selectedDifficulty, usedQuestionIds, loadQuestion]);

  // Initialize game only once on mount
  useEffect(() => {
    if (!isInitialized) {
      const questionId = loadQuestion(selectedDifficulty, []);
      if (questionId) {
        setUsedQuestionIds([questionId]);
      }
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setUsedQuestionIds([]);
    setLevelCompleted(false);
    setQuestionNumber(1);
    const filtered = getFilteredQuestionsExpanded(keywordMappingQuestionsExpanded, diff);
    const question = getRandomQuestionExpanded(filtered, []);
    if (question) {
      setCurrentQuestion(question);
      setUsedQuestionIds([question.id]);
      const initialSelections: Record<string, boolean> = {};
      question.sentences.forEach((s) => {
        initialSelections[s.id] = false;
      });
      setSelections(initialSelections);
    }
    setEvaluation(null);
    setShowResults(false);
  };

  const resetLevel = () => {
    setUsedQuestionIds([]);
    setLevelCompleted(false);
    setQuestionNumber(1);
    selectNewQuestion();
  };

  // Calculate progress tracking
  const totalQuestions = getTotalQuestionCount(keywordMappingQuestionsExpanded, selectedDifficulty);
  const remainingQuestions = getRemainingQuestionCount(keywordMappingQuestionsExpanded, selectedDifficulty, usedQuestionIds);

  const toggleSelection = (sentenceId: string) => {
    setSelections((prev) => ({
      ...prev,
      [sentenceId]: !prev[sentenceId],
    }));
  };

  const evaluateAnswer = useCallback(() => {
    if (!currentQuestion) {return;}

    const sentenceResults: EvaluationResult["sentenceResults"] = [];
    let correctSelections = 0;
    let incorrectSelections = 0;
    let missedCorrect = 0;

    currentQuestion.sentences.forEach((sentence) => {
      const userSelected = selections[sentence.id];
      const wasCorrect = sentence.isCorrect;

      if (userSelected && wasCorrect) {
        correctSelections++;
      } else if (userSelected && !wasCorrect) {
        incorrectSelections++;
      } else if (!userSelected && wasCorrect) {
        missedCorrect++;
      }

      sentenceResults.push({
        id: sentence.id,
        text: sentence.text,
        wasCorrect,
        userSelected,
        explanation: sentence.explanation,
      });
    });

    const totalCorrect = currentQuestion.sentences.filter((s) => s.isCorrect).length;
    
    // Calculate score
    // Correct selections: +2 points each
    // Incorrect selections (false positives): -1 point each
    // Missed correct: -0.5 points each
    const rawScore = (correctSelections * 2) - (incorrectSelections * 1) - (missedCorrect * 0.5);
    const maxScore = totalCorrect * 2;
    const normalizedScore = Math.max(0, (rawScore / maxScore) * 10);
    
    // Apply difficulty modifier
    const difficultyMod = selectedDifficulty === "advanced" ? 0.9 : selectedDifficulty === "intermediate" ? 1.0 : 1.1;
    let finalScore = Math.min(10, normalizedScore * difficultyMod);
    finalScore = Math.round(finalScore * 10) / 10;

    const accuracy = totalCorrect > 0 
      ? Math.round((correctSelections / totalCorrect) * 100) 
      : 0;

    const feedback: string[] = [];
    if (correctSelections === totalCorrect && incorrectSelections === 0) {
      feedback.push("✅ Perfect! You identified all correct uses of the keywords.");
    } else {
      if (incorrectSelections > 0) {
        feedback.push(`⚠️ ${incorrectSelections} false positive(s) - be careful of misleading statements.`);
      }
      if (missedCorrect > 0) {
        feedback.push(`💡 You missed ${missedCorrect} correct sentence(s). Review keyword context more carefully.`);
      }
      if (accuracy >= 70) {
        feedback.push("👍 Good conceptual understanding overall!");
      }
    }

    let scoreLabel = "Poor";
    if (finalScore >= 9) {scoreLabel = "Outstanding";}
    else if (finalScore >= 8) {scoreLabel = "Excellent";}
    else if (finalScore >= 7) {scoreLabel = "Good";}
    else if (finalScore >= 5) {scoreLabel = "Fair";}
    else if (finalScore >= 3) {scoreLabel = "Needs Work";}

    const result: EvaluationResult = {
      score: finalScore,
      scoreLabel,
      correctSelections,
      incorrectSelections,
      missedCorrect,
      accuracy,
      feedback,
      sentenceResults,
    };

    setEvaluation(result);
    setShowResults(true);

    // Calculate XP
    const earnedXp = calculateXp(finalScore, selectedDifficulty);
    setXpEarned(earnedXp);

    // Record attempt
    recordAttempt("keyword-mapping", finalScore, currentQuestion.id, selectedDifficulty);

    if (correctSelections === totalCorrect && incorrectSelections === 0) {
      toast.success("🎯 Perfect mapping!");
    } else if (finalScore >= 7) {
      toast.success("👍 Good keyword understanding!");
    } else {
      toast.info("💪 Keep practicing!");
    }
  }, [selections, currentQuestion, selectedDifficulty, calculateXp, recordAttempt]);

  const getSelectedCount = () => {
    return Object.values(selections).filter(Boolean).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
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
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Link2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Mapping</h1>
              <p className="text-sm text-gray-500">Concept Connector</p>
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
                <TrendingUp className="h-4 w-4 text-orange-600" />
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
                <Sparkles className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-gray-700">Difficulty</span>
              </div>
              <div className="flex gap-2">
                {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
                  <button
                    key={diff}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                        : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                    }`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Interface */}
        {levelCompleted ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Level Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                You&apos;ve completed all {totalQuestions} {selectedDifficulty} questions in Keyword Mapping!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={resetLevel}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button 
                  variant="outline" 
                  disabled={selectedDifficulty === 'advanced'}
                  onClick={() => {
                    const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
                    const currentIndex = difficulties.indexOf(selectedDifficulty);
                    if (currentIndex < difficulties.length - 1) {
                      handleDifficultyChange(difficulties[currentIndex + 1]);
                    }
                  }}
                >
                  Try {selectedDifficulty === 'beginner' ? 'Intermediate' : 'Advanced'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !showResults ? (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <span className="text-sm text-gray-600">
                Question {usedQuestionIds.length} of {totalQuestions}
              </span>
              <Progress 
                value={(usedQuestionIds.length / totalQuestions) * 100} 
                className="w-32 h-2" 
              />
              <span className="text-sm text-orange-600 font-medium">
                {remainingQuestions} remaining
              </span>
            </div>

            {/* Topic & Keywords */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
                  <Key className="h-5 w-5" />
                  Topic #{usedQuestionIds.length}: {currentQuestion?.topic}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-3">
                  Select sentences that correctly use these keywords conceptually:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion?.keywords.map((keyword) => (
                    <Badge key={keyword} className="bg-orange-100 text-orange-700 border-orange-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sentences */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Select Correct Statements
                  </CardTitle>
                  <Badge variant="outline">
                    {getSelectedCount()} selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Click on sentences that correctly use the keywords. Some sentences may be misleading!
                </p>
                <div className="space-y-3">
                  {currentQuestion?.sentences.map((sentence) => (
                    <button
                      key={sentence.id}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selections[sentence.id]
                          ? "border-orange-400 bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-orange-200"
                      }`}
                      onClick={() => toggleSelection(sentence.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selections[sentence.id]
                              ? "border-orange-500 bg-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selections[sentence.id] && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <p className="text-gray-700">{sentence.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                  onClick={evaluateAnswer}
                >
                  Submit Selection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-6">
            {/* XP Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white">
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
                      <p className="text-4xl font-bold">{evaluation?.score}/10</p>
                      <p className="text-sm">{evaluation?.scoreLabel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{evaluation?.correctSelections}</p>
                  <p className="text-sm text-gray-500">Correct Picks</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{evaluation?.incorrectSelections}</p>
                  <p className="text-sm text-gray-500">False Positives</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-600">{evaluation?.missedCorrect}</p>
                  <p className="text-sm text-gray-500">Missed</p>
                </CardContent>
              </Card>
            </div>

            {/* Accuracy */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Concept Accuracy</span>
                  <span>{evaluation?.accuracy}%</span>
                </div>
                <Progress value={evaluation?.accuracy || 0} className="h-2" />
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {evaluation?.feedback.map((item) => (
                    <li key={item} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {evaluation?.sentenceResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-4 rounded-lg border ${
                      result.wasCorrect && result.userSelected
                        ? "bg-green-50 border-green-200"
                        : !result.wasCorrect && result.userSelected
                        ? "bg-red-50 border-red-200"
                        : result.wasCorrect && !result.userSelected
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {result.wasCorrect && result.userSelected && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {!result.wasCorrect && result.userSelected && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        {result.wasCorrect && !result.userSelected && (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                        {!result.wasCorrect && !result.userSelected && (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{result.text}</p>
                        <p className="text-sm text-gray-600 mt-1">{result.explanation}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={result.wasCorrect ? "text-green-600" : "text-red-600"}
                          >
                            {result.wasCorrect ? "Correct Statement" : "Incorrect/Misleading"}
                          </Badge>
                          <Badge variant="outline" className="text-gray-500">
                            You: {result.userSelected ? "Selected" : "Not Selected"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={selectNewQuestion}>
                Next Topic
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setEvaluation(null);
                  if (currentQuestion) {
                    const resetSelections: Record<string, boolean> = {};
                    currentQuestion.sentences.forEach((s) => {
                      resetSelections[s.id] = false;
                    });
                    setSelections(resetSelections);
                  }
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
