'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Plus, Target, TrendingUp, Trophy, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from 'react';
import { toast } from "sonner";

// Predefined topics and their keyword sets
const KEYWORD_TOPICS = [
  {
    id: "dbms_transactions",
    title: "DBMS - Transactions",
    keywords: ["ACID", "Atomicity", "Consistency", "Isolation", "Durability", "Commit", "Rollback", "Savepoint", "Concurrency Control", "Locking", "Deadlock", "Recovery", "Transaction Log"]
  },
  {
    id: "os_deadlocks", 
    title: "Operating System - Deadlocks",
    keywords: ["Deadlock", "Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait", "Resource Allocation Graph", "Deadlock Detection", "Deadlock Prevention", "Deadlock Avoidance", "Banker's Algorithm"]
  },
  {
    id: "oop_concepts",
    title: "OOP Concepts", 
    keywords: ["Class", "Object", "Inheritance", "Encapsulation", "Abstraction", "Polymorphism", "Constructor", "Method Overriding", "Method Overloading", "Interface"]
  },
  {
    id: "networks_tcpip",
    title: "Computer Networks - TCP/IP",
    keywords: ["TCP", "UDP", "IP Address", "Subnet", "Routing", "Handshake", "Checksum", "OSI Model", "Transport Layer"]
  },
  {
    id: "dsa_sorting",
    title: "DSA - Sorting Algorithms", 
    keywords: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Insertion Sort", "Time Complexity", "Space Complexity", "Stable Sorting", "Divide and Conquer"]
  },
  {
    id: "security_auth",
    title: "Cybersecurity - Authentication",
    keywords: ["Authentication", "Authorization", "MFA", "OTP", "Biometrics", "Password Hashing", "Tokens", "Session Management", "OAuth", "SAML"]
  }
];

interface GameStats {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  totalScore: number;
}

interface EvaluationResult {
  score: number;
  correctKeywords: string[];
  missedKeywords: string[];
  bonusKeywords: string[];
  feedbackSummary: string;
}

// Evaluation logic moved outside component to avoid dependency issues
const evaluateKeywords = (input: string, topic: typeof KEYWORD_TOPICS[0]): EvaluationResult => {
  // Parse user input into keywords
  const userKeywords = input
    .toLowerCase()
    .split(/[,\n\r\t]+/)
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0)
    .map(keyword => keyword.replace(/[^\w\s]/g, '')) // Remove punctuation
    .filter(keyword => keyword.length > 0);

  // Remove duplicates
  const uniqueUserKeywords = Array.from(new Set(userKeywords));

  const topicKeywords = topic.keywords.map(k => k.toLowerCase());
  
  const correctKeywords: string[] = [];
  const missedKeywords: string[] = [];
  const bonusKeywords: string[] = [];

  // Find correct keywords (exact matches or close matches)
  topicKeywords.forEach(correctKeyword => {
    const found = uniqueUserKeywords.find(userKeyword => 
      userKeyword === correctKeyword.toLowerCase() ||
      userKeyword.includes(correctKeyword.toLowerCase()) ||
      correctKeyword.toLowerCase().includes(userKeyword) ||
      // Handle common synonyms/abbreviations
      (correctKeyword.toLowerCase() === 'atomicity' && userKeyword.includes('atomic')) ||
      (correctKeyword.toLowerCase() === 'consistency' && userKeyword.includes('consistent')) ||
      (correctKeyword.toLowerCase() === 'isolation' && userKeyword.includes('isolat')) ||
      (correctKeyword.toLowerCase() === 'durability' && userKeyword.includes('durable')) ||
      (correctKeyword.toLowerCase() === 'object-oriented' && (userKeyword.includes('oop') || userKeyword.includes('object oriented'))) ||
      (correctKeyword.toLowerCase().includes('sort') && userKeyword.includes('sort')) ||
      (correctKeyword.toLowerCase() === 'tcp' && userKeyword === 'transmission control protocol') ||
      (correctKeyword.toLowerCase() === 'udp' && userKeyword === 'user datagram protocol')
    );
    
    if (found) {
      correctKeywords.push(topic.keywords.find(k => k.toLowerCase() === correctKeyword) || correctKeyword);
    } else {
      missedKeywords.push(topic.keywords.find(k => k.toLowerCase() === correctKeyword) || correctKeyword);
    }
  });

  // Find bonus keywords (relevant but not in the predefined list)
  uniqueUserKeywords.forEach(userKeyword => {
    const isCorrect = topicKeywords.some(correctKeyword => 
      userKeyword === correctKeyword ||
      userKeyword.includes(correctKeyword) ||
      correctKeyword.includes(userKeyword)
    );
    
    if (!isCorrect && isRelevantKeyword(userKeyword, topic.id)) {
      bonusKeywords.push(userKeyword);
    }
  });

  // Calculate score
  const correctCount = correctKeywords.length;
  const totalPossible = topic.keywords.length;
  const bonusCount = bonusKeywords.length;
  
  let score = (correctCount / totalPossible) * 8; // Base score out of 8
  score += Math.min(bonusCount * 0.5, 2); // Bonus points up to 2
  score = Math.min(10, Math.max(0, score)); // Cap between 0-10
  score = Math.round(score * 10) / 10;

  // Generate feedback
  const feedbackSummary = generateFeedback(correctCount, totalPossible, missedKeywords, topic.title);

  return {
    score,
    correctKeywords,
    missedKeywords,
    bonusKeywords,
    feedbackSummary
  };
};

const isRelevantKeyword = (keyword: string, topicId: string): boolean => {
  const relevantTerms: Record<string, string[]> = {
    'dbms_transactions': ['database', 'sql', 'commit', 'abort', 'two-phase', 'serializable', 'dirty read', 'phantom read'],
    'os_deadlocks': ['process', 'thread', 'semaphore', 'mutex', 'starvation', 'resource', 'preemption'],
    'oop_concepts': ['inheritance', 'override', 'overload', 'virtual', 'abstract', 'static', 'private', 'public'],
    'networks_tcpip': ['protocol', 'packet', 'header', 'port', 'socket', 'network', 'internet'],
    'dsa_sorting': ['algorithm', 'complexity', 'recursive', 'iterative', 'comparison', 'swap', 'pivot'],
    'security_auth': ['security', 'encryption', 'hash', 'salt', 'credential', 'verification', 'certificate']
  };
  
  const relevant = relevantTerms[topicId] || [];
  
  return relevant.some(term => keyword.includes(term) || term.includes(keyword));
};

const generateFeedback = (correct: number, total: number, missed: string[], topicTitle: string): string => {
  const percentage = (correct / total) * 100;
  
  if (percentage >= 90) {
    return "Excellent keyword recall! You have strong conceptual knowledge.";
  } else if (percentage >= 70) {
    return `Good recall of ${topicTitle} concepts. Review: ${missed.slice(0, 3).join(", ")}.`;
  } else if (percentage >= 50) {
    return `Decent foundation in ${topicTitle}. Focus on: ${missed.slice(0, 3).join(", ")}.`;
  } else {
    return `Study ${topicTitle} fundamentals. Key missing terms: ${missed.slice(0, 4).join(", ")}.`;
  }
};

export default function KeywordHuntGame() {
  const [currentTopic, setCurrentTopic] = useState(KEYWORD_TOPICS[0]);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [gameStats, setGameStats] = useState<GameStats>({
    totalAttempts: 0,
    bestScore: 0,
    averageScore: 0,
    totalScore: 0
  });

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim() && isActive) {
      toast.error("Please enter some keywords before submitting.");
      
      return;
    }

    setIsActive(false);
    setGameOver(true);
    setIsLoading(true);

    try {
      const result = evaluateKeywords(userInput, currentTopic);
      setEvaluation(result);
      
      // Update game statistics
      const newTotalAttempts = gameStats.totalAttempts + 1;
      const newTotalScore = gameStats.totalScore + result.score;
      const newAverageScore = newTotalScore / newTotalAttempts;
      const newBestScore = Math.max(gameStats.bestScore, result.score);
      
      setGameStats({
        totalAttempts: newTotalAttempts,
        totalScore: newTotalScore,
        averageScore: Math.round(newAverageScore * 10) / 10,
        bestScore: newBestScore
      });

      // Show appropriate toast message
      if (result.score >= 9) {
        toast.success("Outstanding keyword recall! Excellent technical vocabulary!");
      } else if (result.score >= 7) {
        toast.success("Great job! Strong keyword knowledge with room to grow.");
      } else if (result.score >= 5) {
        toast.success("Good effort! Focus on expanding your technical vocabulary.");
      } else {
        toast.success("Keep practicing! Every attempt improves your recall.");
      }

    } catch (error) {
      console.error("Error evaluating keywords:", error);
      toast.error("Failed to evaluate keywords. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userInput, currentTopic, gameStats, isActive]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setGameOver(true);
      if (userInput.trim()) {
        handleSubmit();
      } else {
        toast.error("Time's up! You didn't enter any keywords.");
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, userInput, handleSubmit]);

  const startGame = () => {
    setIsActive(true);
    setGameOver(false);
    setEvaluation(null);
    setUserInput("");
    setTimeLeft(30);
  };

  const selectNewTopic = () => {
    const randomIndex = Math.floor(Math.random() * KEYWORD_TOPICS.length);
    setCurrentTopic(KEYWORD_TOPICS[randomIndex]);
    setEvaluation(null);
    setUserInput("");
    setTimeLeft(30);
    setIsActive(false);
    setGameOver(false);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) {
      return "text-green-600 bg-green-100";
    }
    if (score >= 6) {
      return "text-blue-600 bg-blue-100";
    }
    if (score >= 4) {
      return "text-yellow-600 bg-yellow-100";
    }
    
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) {
      return "Outstanding";
    }
    if (score >= 7) {
      return "Great";
    }
    if (score >= 5) {
      return "Good";
    }
    if (score >= 3) {
      return "Fair";
    }
    
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Keyword Hunt</h1>
          </div>
          <p className="text-gray-600">Fast recall-based technical training - List essential keywords under time pressure!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{gameStats.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">{gameStats.bestScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Average</p>
                  <p className="text-2xl font-bold text-gray-900">{gameStats.averageScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : gameOver ? 'bg-red-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isActive ? 'Active' : gameOver ? 'Completed' : 'Ready'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Interface */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Topic Challenge</span>
                {timeLeft > 0 && isActive && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Display */}
              <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentTopic.title}</h3>
                <p className="text-gray-600">List as many relevant keywords as you can remember!</p>
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <Textarea
                  value={userInput}
                  placeholder="Enter keywords separated by commas or new lines..."
                  className="min-h-[150px] text-base"
                  disabled={!isActive && !gameOver}
                  onChange={(e) => setUserInput(e.target.value)}
                />

                {/* Game Controls */}
                <div className="flex gap-3">
                  {!isActive && !gameOver && (
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      size="lg"
                      onClick={startGame}
                    >
                      Start Hunt (30s)
                    </Button>
                  )}
                  
                  {isActive && (
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={isLoading}
                      onClick={handleSubmit}
                    >
                      {isLoading ? "Evaluating..." : "Submit Keywords"}
                    </Button>
                  )}
                  
                  {gameOver && (
                    <>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={selectNewTopic}
                      >
                        Next Topic
                      </Button>
                      <Button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        size="lg"
                        onClick={startGame}
                      >
                        Retry Topic
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {evaluation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  Keyword Evaluation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score.toFixed(1)}
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-semibold text-gray-900">{getScoreLabel(evaluation.score)}</p>
                    <p className="text-sm text-gray-500">Overall Score</p>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  {/* Correct Keywords */}
                  {evaluation.correctKeywords.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-semibold text-green-700 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Correct Keywords Found ({evaluation.correctKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.correctKeywords.map(keyword => (
                          <Badge key={keyword} variant="secondary" className="bg-green-100 text-green-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missed Keywords */}
                  {evaluation.missedKeywords.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-semibold text-red-700 mb-2">
                        <XCircle className="h-4 w-4" />
                        Keywords Missed ({evaluation.missedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.missedKeywords.map(keyword => (
                          <Badge key={keyword} variant="secondary" className="bg-red-100 text-red-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bonus Keywords */}
                  {evaluation.bonusKeywords.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                        <Plus className="h-4 w-4" />
                        Additional Relevant Terms (+{evaluation.bonusKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.bonusKeywords.map(keyword => (
                          <Badge key={keyword} variant="secondary" className="bg-blue-100 text-blue-800">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Study Recommendations</h4>
                    <p className="text-sm text-gray-700">{evaluation.feedbackSummary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
