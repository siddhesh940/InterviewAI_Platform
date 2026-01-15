"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Award, ChevronRight, Clock, Edit3, RotateCcw, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Predefined bad answers
const BAD_ANSWERS = [
  "I don't know much about it, honestly.",
  "I just did whatever my friend told me during the project.",
  "I'm not sure why I applied, just trying things.",
  "I get bored easily, so I switch things a lot.",
  "I didn't really practice anything, just came here.",
  "I know basics only, nothing advanced.",
  "I'm not great at teamwork, I prefer being alone.",
  "My communication isn't good, but I try.",
  "I'm not sure what skills I have exactly.",
  "I can work only when someone pushes me.",
  "I don't handle pressure well, I get stressed.",
  "I learned coding from YouTube, so I'm not perfect.",
  "I don't like deadlines, they stress me out.",
  "I don't think I'm the best for this job.",
  "I didn't understand the question properly.",
  "I just tried something in college. Not sure.",
  "I am average at problem-solving.",
  "I don't have leadership qualities.",
  "I only work well when tasks are simple.",
  "I don't take initiative unless asked."
];

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
}

export default function FixBadAnswerGame() {
  const [currentBadAnswer, setCurrentBadAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [gameStats, setGameStats] = useState({
    totalAttempts: 0,
    totalScore: 0,
    bestScore: 0,
    averageScore: 0
  });

  // Initialize with a random bad answer
  useEffect(() => {
    getRandomBadAnswer();
  }, []);

  const getRandomBadAnswer = () => {
    const randomIndex = Math.floor(Math.random() * BAD_ANSWERS.length);
    setCurrentBadAnswer(BAD_ANSWERS[randomIndex]);
    setUserAnswer("");
    setGameScore(null);
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please write your corrected answer before submitting.");
      
return;
    }

    setIsLoading(true);
    console.log("Starting evaluation...", { badAnswer: currentBadAnswer, userAnswer: userAnswer.trim() });
    
    try {
      const response = await fetch("/api/games/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          badAnswer: currentBadAnswer,
          userAnswer: userAnswer.trim()
        })
      });

      let result: GameScore;
      
      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText);
        const errorData = await response.json().catch(() => null);
        console.error("Error details:", errorData);
        throw new Error(`Server responded with ${response.status}: ${errorData?.error || response.statusText}`);
      }

      result = await response.json();
      
      // Validate that we received a proper GameScore
      if (!result || typeof result.finalScore !== 'number' || !Array.isArray(result.strengths) || !Array.isArray(result.weaknesses)) {
        console.error("Invalid response format:", result);
        throw new Error("Invalid evaluation response format");
      }
      
      console.log("Evaluation successful:", result);
      setGameScore(result);
      
      // Update game statistics
      const newTotalAttempts = gameStats.totalAttempts + 1;
      const newTotalScore = gameStats.totalScore + result.finalScore;
      const newAverageScore = newTotalScore / newTotalAttempts;
      const newBestScore = Math.max(gameStats.bestScore, result.finalScore);
      
      setGameStats({
        totalAttempts: newTotalAttempts,
        totalScore: newTotalScore,
        averageScore: Math.round(newAverageScore * 10) / 10,
        bestScore: newBestScore
      });

      // Show success message
      if (result.finalScore >= 8) {
        toast.success("Excellent work! Outstanding improvement!");
      } else if (result.finalScore >= 6) {
        toast.success("Great job! Your answer shows good improvement.");
      } else if (result.finalScore >= 4) {
        toast.success("Good effort! Keep practicing to improve further.");
      } else {
        toast.success("Keep trying! Every attempt helps you improve.");
      }

    } catch (error) {
      console.error("Error evaluating answer:", error);
      
      // Show more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Server responded with")) {
          toast.error(`Evaluation service error: ${error.message}`);
        } else if (error.message.includes("Invalid evaluation response")) {
          toast.error("Received invalid response from evaluation service. Please try again.");
        } else if (error.message.includes("Failed to fetch")) {
          toast.error("Network error: Unable to connect to evaluation service. Please check your connection and try again.");
        } else {
          toast.error(`Evaluation failed: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred while evaluating your answer. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryCurrentAnswer = () => {
    setUserAnswer("");
    setGameScore(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) {return "text-green-600 bg-green-100";}
    if (score >= 6) {return "text-blue-600 bg-blue-100";}
    if (score >= 4) {return "text-yellow-600 bg-yellow-100";}
    
return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) {return "Excellent";}
    if (score >= 6) {return "Good";}
    if (score >= 4) {return "Fair";}
    
return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Edit3 className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fix the Bad Answer</h1>
            <p className="text-gray-600">Correction Challenge</p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Attempts</p>
                  <p className="text-xl font-semibold">{gameStats.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Best Score</p>
                  <p className="text-xl font-semibold">{gameStats.bestScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-xl font-semibold">{gameStats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Edit3 className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-semibold">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Game Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bad Answer Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Edit3 className="h-5 w-5" />
                Bad Answer to Fix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-gray-800 text-lg leading-relaxed font-medium">
                  &quot;{currentBadAnswer}&quot;
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Transform this weak response into a professional, structured answer that demonstrates confidence and competence.
              </p>
            </CardContent>
          </Card>

          {/* User Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Edit3 className="h-5 w-5" />
                Your Improved Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={userAnswer}
                placeholder="Rewrite the bad answer in a more professional, clear, and structured way..."
                className="min-h-[150px] border-2 focus:border-green-400 resize-none"
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
                    "Submit Correction"
                  )}
                </Button>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="px-4"
                  onClick={retryCurrentAnswer}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Results */}
        {gameScore && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                AI Evaluation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Breakdown */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(gameScore.finalScore)}`}>
                      {gameScore.finalScore.toFixed(1)}/10
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{getScoreLabel(gameScore.finalScore)}</p>
                      <p className="text-sm text-gray-600">Overall Score</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Clarity</span>
                      <span className="text-sm text-gray-600">{gameScore.clarity.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grammar</span>
                      <span className="text-sm text-gray-600">{gameScore.grammar.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Professional Tone</span>
                      <span className="text-sm text-gray-600">{gameScore.professionalTone.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Relevance</span>
                      <span className="text-sm text-gray-600">{gameScore.relevance.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completeness</span>
                      <span className="text-sm text-gray-600">{gameScore.completeness.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {gameScore.strengths.map((strength) => (
                        <li key={strength} className="text-sm text-gray-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-red-600 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {gameScore.weaknesses.map((weakness) => (
                        <li key={weakness} className="text-sm text-gray-700">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ideal Answer */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-indigo-600 mb-3">Suggested Ideal Answer</h4>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {gameScore.idealAnswer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 px-8"
            onClick={getRandomBadAnswer}
          >
            Next Bad Answer
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
