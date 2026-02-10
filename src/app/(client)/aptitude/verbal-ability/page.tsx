"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle, Clock, MessageCircle, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Completion Ring Component
function CompletionRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const getColor = () => {
    if (progress >= 80) {
      return "#22c55e"; // green
    }
    if (progress >= 50) {
      return "#eab308"; // yellow
    }
    if (progress > 0) {
      return "#22c55e"; // green (theme)
    }

    return "#e5e7eb"; // gray
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700">{progress}%</span>
      </div>
    </div>
  );
}

export default function VerbalAbilityPage() {
  const router = useRouter();
  const [topicProgress, setTopicProgress] = useState<Record<string, { attempted: number; correct: number }>>({});
  
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setTopicProgress(parsed["verbal-ability"] || {});
    }
  }, []);
  
  const getTopicCompletion = (topicId: string, totalQuestions: number) => {
    const progress = topicProgress[topicId];
    if (!progress) {
      return 0;
    }

    return Math.min(100, Math.round((progress.attempted / totalQuestions) * 100));
  };
  
  const getTopicAccuracy = (topicId: string) => {
    const progress = topicProgress[topicId];
    if (!progress || progress.attempted === 0) {
      return null;
    }

    return Math.round((progress.correct / progress.attempted) * 100);
  };

  const getTotalProgress = () => {
    const totalQuestions = topics.reduce((sum, t) => sum + t.questionsCount, 0);
    const totalAttempted = Object.values(topicProgress).reduce((sum, p) => sum + p.attempted, 0);
    const totalCorrect = Object.values(topicProgress).reduce((sum, p) => sum + p.correct, 0);
    return {
      attempted: totalAttempted,
      correct: totalCorrect,
      completion: totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 100) : 0,
      accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    };
  };
  
  const topics = [
    {
      id: "reading-comprehension",
      name: "Reading Comprehension",
      description: "Understand passages, analyze content, and answer inference-based questions.",
      difficulty: "Hard",
      estimatedTime: "20 mins",
      questionsCount: 10,
      color: "purple"
    },
    {
      id: "sentence-completion",
      name: "Sentence Completion",
      description: "Fill in blanks with appropriate words based on context and meaning.",
      difficulty: "Medium",
      estimatedTime: "15 mins",
      questionsCount: 10,
      color: "orange"
    },
    {
      id: "para-jumbles",
      name: "Para Jumbles",
      description: "Arrange jumbled sentences to form coherent and logical paragraphs.",
      difficulty: "Hard",
      estimatedTime: "18 mins",
      questionsCount: 10,
      color: "red"
    },
    {
      id: "error-spotting",
      name: "Error Spotting",
      description: "Identify grammatical, spelling, and structural errors in sentences.",
      difficulty: "Medium",
      estimatedTime: "12 mins",
      questionsCount: 10,
      color: "yellow"
    },
    {
      id: "idioms-phrases",
      name: "Idioms & Phrases",
      description: "Master common idioms, phrases, and their contextual applications.",
      difficulty: "Easy",
      estimatedTime: "15 mins",
      questionsCount: 10,
      color: "teal"
    },
    {
      id: "verbal-analogies",
      name: "Verbal Analogies",
      description: "Find relationships between words and complete analogical patterns.",
      difficulty: "Medium",
      estimatedTime: "18 mins",
      questionsCount: 10,
      color: "indigo"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, bgHover: string, border: string }> = {
      green: { bg: "bg-green-50", bgHover: "hover:bg-green-100", border: "border-green-200" },
      blue: { bg: "bg-blue-50", bgHover: "hover:bg-blue-100", border: "border-blue-200" },
      purple: { bg: "bg-purple-50", bgHover: "hover:bg-purple-100", border: "border-purple-200" },
      orange: { bg: "bg-orange-50", bgHover: "hover:bg-orange-100", border: "border-orange-200" },
      red: { bg: "bg-red-50", bgHover: "hover:bg-red-100", border: "border-red-200" },
      yellow: { bg: "bg-yellow-50", bgHover: "hover:bg-yellow-100", border: "border-yellow-200" },
      teal: { bg: "bg-teal-50", bgHover: "hover:bg-teal-100", border: "border-teal-200" },
      indigo: { bg: "bg-indigo-50", bgHover: "hover:bg-indigo-100", border: "border-indigo-200" },
    };
    
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.push('/aptitude')}
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Verbal Ability</h1>
                <p className="text-gray-600 mt-1">
                  Enhance language skills and communication proficiency
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Updated with Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Topics</p>
                  <p className="text-xl font-semibold">{topics.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attempted</p>
                  <p className="text-xl font-semibold">{getTotalProgress().attempted}/{topics.reduce((s,t) => s+t.questionsCount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-xl font-semibold">{getTotalProgress().accuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-xl font-semibold">{getTotalProgress().completion}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid - Updated with Completion Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const completion = getTopicCompletion(topic.id, topic.questionsCount);
            const accuracy = getTopicAccuracy(topic.id);
            
            return (
              <Card 
                key={topic.id} 
                className={`${getColorClasses(topic.color).bg} ${getColorClasses(topic.color).bgHover} ${getColorClasses(topic.color).border} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800">
                        {topic.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {topic.estimatedTime}
                        </span>
                      </div>
                    </div>
                    {/* Completion Ring */}
                    <CompletionRing progress={completion} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="text-gray-500">
                      {topic.questionsCount} Practice Questions
                    </span>
                    {accuracy !== null && (
                      <span className={`font-medium ${accuracy >= 70 ? "text-green-600" : accuracy >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {accuracy}% accuracy
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={() => router.push(`/aptitude/verbal-ability/${topic.id}`)}
                    >
                      {completion > 0 ? "Continue Practice" : "Start Practice"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-green-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Master Professional Communication
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Improve vocabulary, grammar, and comprehension skills. Each topic includes detailed explanations 
              and contextual examples to enhance your verbal proficiency.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
