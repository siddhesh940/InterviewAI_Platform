"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Brain, CheckCircle, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Completion Ring Component
function CompletionRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const getColor = () => {
    if (progress >= 80) return "#22c55e"; // green
    if (progress >= 50) return "#eab308"; // yellow
    if (progress > 0) return "#8b5cf6";   // purple
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

export default function LogicalReasoningPage() {
  const router = useRouter();
  const [topicProgress, setTopicProgress] = useState<Record<string, { attempted: number; correct: number }>>({});
  
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setTopicProgress(parsed["logical-reasoning"] || {});
    }
  }, []);
  
  const getTopicCompletion = (topicId: string, totalQuestions: number) => {
    const progress = topicProgress[topicId];
    if (!progress) return 0;
    return Math.min(100, Math.round((progress.attempted / totalQuestions) * 100));
  };
  
  const getTopicAccuracy = (topicId: string) => {
    const progress = topicProgress[topicId];
    if (!progress || progress.attempted === 0) return null;
    return Math.round((progress.correct / progress.attempted) * 100);
  };

  const getTotalProgress = () => {
    const totalAttempted = Object.values(topicProgress).reduce((sum, p) => sum + p.attempted, 0);
    const totalCorrect = Object.values(topicProgress).reduce((sum, p) => sum + p.correct, 0);
    const totalQuestions = topics.length * 30;
    return {
      attempted: totalAttempted,
      correct: totalCorrect,
      completion: Math.round((totalAttempted / totalQuestions) * 100),
      accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    };
  };
  
  const topics = [
    {
      id: "series-sequences",
      name: "Series & Sequences",
      description: "Number series, letter series, and pattern recognition in sequences. Master progression patterns.",
      questionsCount: 30,
      color: "purple"
    },
    {
      id: "analogies",
      name: "Analogies",
      description: "Word analogies, number analogies, and relationship patterns. Develop comparative thinking skills.",
      questionsCount: 30,
      color: "blue"
    },
    {
      id: "classification",
      name: "Classification",
      description: "Grouping items based on common properties, odd one out, and categorical thinking.",
      questionsCount: 30,
      color: "green"
    },
    {
      id: "coding-decoding",
      name: "Coding & Decoding",
      description: "Letter and number coding patterns, cipher techniques, and symbolic representations.",
      questionsCount: 30,
      color: "orange"
    },
    {
      id: "blood-relations",
      name: "Blood Relations",
      description: "Family relationship problems, genealogical charts, and kinship puzzles.",
      questionsCount: 30,
      color: "red"
    },
    {
      id: "direction-sense",
      name: "Direction Sense",
      description: "Navigation problems, compass directions, and spatial orientation challenges.",
      questionsCount: 30,
      color: "teal"
    },
    {
      id: "syllogism",
      name: "Syllogism",
      description: "Logical reasoning with premises and conclusions, Venn diagrams, and deductive reasoning.",
      questionsCount: 30,
      color: "violet"
    },
    {
      id: "arrangements",
      name: "Arrangements",
      description: "Seating arrangements, linear and circular arrangements, order-ranking, and structured positioning problems.",
      questionsCount: 30,
      color: "emerald"
    },
    {
      id: "data-sufficiency",
      name: "Data Sufficiency",
      description: "Determine whether the provided statements offer enough information to answer the question. Includes arithmetic, logical, and analytical sufficiency problems.",
      questionsCount: 30,
      color: "amber"
    },
    {
      id: "clock-and-calendar",
      name: "Clock & Calendar",
      description: "Problems based on clock angles, time gains/losses, leap year logic, weekdays, and recurring date sequences.",
      questionsCount: 30,
      color: "slate"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, bgHover: string, border: string }> = {
      purple: { bg: "bg-purple-50", bgHover: "hover:bg-purple-100", border: "border-purple-200" },
      blue: { bg: "bg-blue-50", bgHover: "hover:bg-blue-100", border: "border-blue-200" },
      green: { bg: "bg-green-50", bgHover: "hover:bg-green-100", border: "border-green-200" },
      orange: { bg: "bg-orange-50", bgHover: "hover:bg-orange-100", border: "border-orange-200" },
      red: { bg: "bg-red-50", bgHover: "hover:bg-red-100", border: "border-red-200" },
      teal: { bg: "bg-teal-50", bgHover: "hover:bg-teal-100", border: "border-teal-200" },
      indigo: { bg: "bg-indigo-50", bgHover: "hover:bg-indigo-100", border: "border-indigo-200" },
      violet: { bg: "bg-violet-50", bgHover: "hover:bg-violet-100", border: "border-violet-200" },
      pink: { bg: "bg-pink-50", bgHover: "hover:bg-pink-100", border: "border-pink-200" },
      cyan: { bg: "bg-cyan-50", bgHover: "hover:bg-cyan-100", border: "border-cyan-200" },
      emerald: { bg: "bg-emerald-50", bgHover: "hover:bg-emerald-100", border: "border-emerald-200" },
      amber: { bg: "bg-amber-50", bgHover: "hover:bg-amber-100", border: "border-amber-200" },
      slate: { bg: "bg-slate-50", bgHover: "hover:bg-slate-100", border: "border-slate-200" },
    };
    
    return colorMap[color] || colorMap.purple;
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Logical Reasoning</h1>
                <p className="text-gray-600 mt-1">
                  Develop critical thinking and analytical reasoning skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Updated with Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Topics</p>
                  <p className="text-xl font-semibold">{topics.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attempted</p>
                  <p className="text-xl font-semibold">{getTotalProgress().attempted}/{topics.length * 30}</p>
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
          
          <Card className="border-indigo-200 bg-indigo-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
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
                onClick={() => router.push(`/aptitude/logical-reasoning/${topic.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800">
                      {topic.name}
                    </CardTitle>
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
                      className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/aptitude/logical-reasoning/${topic.id}`);
                      }}
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
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sharpen Your Analytical Mind
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Practice logical reasoning with detailed explanations for each solution. 
              Build pattern recognition skills and master deductive reasoning techniques.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
