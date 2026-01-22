"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import {
  allQuestionsUsed,
  answerBuilderQuestionsExpanded,
  difficultyColors,
  difficultyLabels,
  getFilteredQuestionsExpanded,
  getRandomQuestionExpanded,
  getRemainingQuestionCount,
  getTotalQuestionCount,
} from "@/data/games-questions-expanded";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  GripVertical,
  Home,
  Layers,
  Lightbulb,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface BlockItem {
  id: number;
  text: string;
  originalIndex: number;
}

interface EvaluationResult {
  score: number;
  scoreLabel: string;
  correctPositions: number;
  totalBlocks: number;
  isPerfect: boolean;
  feedback: string[];
  structureAnalysis: string;
}

export default function AnswerBuilderGame() {
  const router = useRouter();
  const {
    selectedDifficulty,
    setDifficulty,
    recordAttempt,
    gameProgress,
    calculateXp,
    getDifficultyMultiplier,
  } = useGames();

  const progress = gameProgress["answer-builder"];

  const [currentQuestion, setCurrentQuestion] = useState<typeof answerBuilderQuestionsExpanded[0] | null>(null);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [, setQuestionNumber] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to load a question
  const loadQuestion = useCallback((difficulty: DifficultyLevel, excludeIds: string[]) => {
    const filtered = getFilteredQuestionsExpanded(answerBuilderQuestionsExpanded, difficulty);
    const question = getRandomQuestionExpanded(filtered, excludeIds);

    if (question) {
      setCurrentQuestion(question);
      
      // Shuffle blocks
      const shuffledBlocks = question.blocks.map((text: string, index: number) => ({
        id: index,
        text,
        originalIndex: index,
      }));
      
      // Fisher-Yates shuffle
      for (let i = shuffledBlocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledBlocks[i], shuffledBlocks[j]] = [shuffledBlocks[j], shuffledBlocks[i]];
      }
      
      setBlocks(shuffledBlocks);
      // eslint-disable-next-line newline-before-return
      return question.id;
    }
    // eslint-disable-next-line newline-before-return
    return null;
  }, []);

  const selectNewQuestion = useCallback(() => {
    // Check if all questions for this difficulty have been used
    if (allQuestionsUsed(answerBuilderQuestionsExpanded, selectedDifficulty, usedQuestionIds)) {
      setLevelCompleted(true);
      toast.success(`🎉 You've completed all ${selectedDifficulty} questions!`);
      
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
    const filtered = getFilteredQuestionsExpanded(answerBuilderQuestionsExpanded, diff);
    const question = getRandomQuestionExpanded(filtered, []);
    if (question) {
      setCurrentQuestion(question);
      setUsedQuestionIds([question.id]);
      const shuffledBlocks = question.blocks.map((text, index) => ({
        id: index,
        text,
        originalIndex: index,
      }));
      for (let i = shuffledBlocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledBlocks[i], shuffledBlocks[j]] = [shuffledBlocks[j], shuffledBlocks[i]];
      }
      setBlocks(shuffledBlocks);
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
  const totalQuestions = getTotalQuestionCount(answerBuilderQuestionsExpanded, selectedDifficulty);
  const remainingQuestions = getRemainingQuestionCount(answerBuilderQuestionsExpanded, selectedDifficulty, usedQuestionIds);

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedBlock(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBlock === null || draggedBlock === index) {return;}

    const newBlocks = [...blocks];
    const draggedItem = newBlocks[draggedBlock];
    newBlocks.splice(draggedBlock, 1);
    newBlocks.splice(index, 0, draggedItem);
    setBlocks(newBlocks);
    setDraggedBlock(index);
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const moveBlock = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= blocks.length) {return;}

    const newBlocks = [...blocks];
    [newBlocks[fromIndex], newBlocks[toIndex]] = [newBlocks[toIndex], newBlocks[fromIndex]];
    setBlocks(newBlocks);
  };

  const shuffleBlocks = () => {
    const shuffled = [...blocks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setBlocks(shuffled);
  };

  const evaluateAnswer = useCallback(() => {
    if (!currentQuestion) {return;}

    const userOrder = blocks.map((b) => b.originalIndex);
    const correctOrder = currentQuestion.correctOrder;
    
    let correctPositions = 0;
    for (let i = 0; i < userOrder.length; i++) {
      if (userOrder[i] === correctOrder[i]) {
        correctPositions++;
      }
    }

    const isPerfect = correctPositions === correctOrder.length;
    const baseScore = (correctPositions / correctOrder.length) * 10;
    
    // Apply difficulty modifier
    const difficultyMod = selectedDifficulty === "advanced" ? 0.9 : selectedDifficulty === "intermediate" ? 1.0 : 1.1;
    let finalScore = Math.min(10, baseScore * difficultyMod);
    
    // Perfect order bonus
    if (isPerfect) {
      finalScore = 10;
    }

    finalScore = Math.round(finalScore * 10) / 10;

    const feedback: string[] = [];
    if (isPerfect) {
      feedback.push("✅ Perfect structure! Your answer flows logically.");
    } else {
      if (userOrder[0] !== correctOrder[0]) {
        feedback.push("⚠️ Opening statement could be stronger. Lead with context.");
      }
      if (userOrder[userOrder.length - 1] !== correctOrder[correctOrder.length - 1]) {
        feedback.push("⚠️ Closing statement needs work. End with impact or learning.");
      }
      if (correctPositions < correctOrder.length / 2) {
        feedback.push("💡 Focus on the STAR method: Situation → Task → Action → Result");
      }
    }

    let scoreLabel = "Poor";
    if (finalScore >= 9) {scoreLabel = "Outstanding";}
    else if (finalScore >= 8) {scoreLabel = "Excellent";}
    else if (finalScore >= 7) {scoreLabel = "Good";}
    else if (finalScore >= 5) {scoreLabel = "Fair";}
    else if (finalScore >= 3) {scoreLabel = "Needs Work";}

    const structureAnalysis = isPerfect
      ? "Your answer follows a professional structure that would impress interviewers."
      : `${correctPositions} of ${correctOrder.length} blocks are in optimal positions. Review the ideal order to understand the flow.`;

    const result: EvaluationResult = {
      score: finalScore,
      scoreLabel,
      correctPositions,
      totalBlocks: correctOrder.length,
      isPerfect,
      feedback,
      structureAnalysis,
    };

    setEvaluation(result);
    setShowResults(true);

    // Calculate XP
    const earnedXp = calculateXp(finalScore, selectedDifficulty);
    setXpEarned(earnedXp);

    // Record attempt
    recordAttempt("answer-builder", finalScore, currentQuestion.id, selectedDifficulty);

    if (isPerfect) {
      toast.success("🎯 Perfect structure!");
    } else if (finalScore >= 7) {
      toast.success("👍 Good answer structure!");
    } else {
      toast.info("💪 Keep practicing structure!");
    }
  }, [blocks, currentQuestion, selectedDifficulty, calculateXp, recordAttempt]);

  const getAssembledAnswer = () => {
    return blocks.map((b) => b.text).join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 md:p-6">
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
            <div className="p-2.5 bg-cyan-100 rounded-xl">
              <Layers className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Answer Builder</h1>
              <p className="text-sm text-gray-500">Sentence Blocks</p>
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
                <TrendingUp className="h-4 w-4 text-cyan-600" />
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
                <Sparkles className="h-4 w-4 text-cyan-600" />
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
                You&apos;ve completed all {totalQuestions} {selectedDifficulty} questions in Answer Builder!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={resetLevel}>
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
              <span className="text-sm text-cyan-600 font-medium">
                {remainingQuestions} remaining
              </span>
            </div>

            {/* Interview Question */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-cyan-700">
                  <AlertCircle className="h-5 w-5" />
                  Interview Question #{usedQuestionIds.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 text-lg font-medium">
                    &quot;{currentQuestion?.interviewQuestion}&quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sentence Blocks */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5 text-cyan-600" />
                    Arrange the Answer Blocks
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={shuffleBlocks}>
                    <Shuffle className="h-4 w-4 mr-1" />
                    Shuffle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Drag blocks or use arrows to arrange them in the most professional order.
                </p>
                <div className="space-y-2">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg cursor-move transition-all ${
                        draggedBlock === index
                          ? "border-cyan-400 shadow-lg scale-[1.02]"
                          : "border-gray-200 hover:border-cyan-300"
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-gray-800">{block.text}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                          onClick={() => moveBlock(index, "up")}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === blocks.length - 1}
                          className="h-8 w-8 p-0"
                          onClick={() => moveBlock(index, "down")}
                        >
                          ↓
                        </Button>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Assembled Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 leading-relaxed">{getAssembledAnswer()}</p>
                </div>
                <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700" onClick={evaluateAnswer}>
                  Submit Answer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-6">
            {/* XP Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
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

            {/* Structure Analysis */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-cyan-600" />
                  Structure Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Blocks in correct position</span>
                    <span className="font-medium">
                      {evaluation?.correctPositions}/{evaluation?.totalBlocks}
                    </span>
                  </div>
                  <Progress
                    value={((evaluation?.correctPositions || 0) / (evaluation?.totalBlocks || 1)) * 100}
                    className="h-2"
                  />
                </div>
                {evaluation?.isPerfect && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Perfect Structure Bonus Applied!</span>
                  </div>
                )}
                <p className="text-gray-700 mt-3">{evaluation?.structureAnalysis}</p>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Feedback
                </CardTitle>
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

            {/* Ideal Answer */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Ideal Answer Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
                  <p className="text-gray-800 leading-relaxed">{currentQuestion?.idealAnswer}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Why this works:</strong> {currentQuestion?.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={selectNewQuestion}>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setEvaluation(null);
                  shuffleBlocks();
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
