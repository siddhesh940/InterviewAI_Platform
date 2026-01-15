"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calculator, Clock, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuantitativeAbilityPage() {
  const router = useRouter();
  
  const topics = [
    {
      id: "number-system",
      name: "Number System",
      description: "Basic concepts of numbers, types, properties, and operations with different number systems.",
      difficulty: "Easy",
      estimatedTime: "45 mins",
      questionsCount: 30,
      color: "blue"
    },
    {
      id: "percentages",
      name: "Percentages", 
      description: "Calculate percentages, percentage increase/decrease, and solve percentage-based problems.",
      difficulty: "Easy",
      estimatedTime: "40 mins",
      questionsCount: 30,
      color: "green"
    },
    {
      id: "profit-and-loss",
      name: "Profit and Loss",
      description: "Cost price, selling price, profit margins, discounts, and business mathematics concepts.",
      difficulty: "Medium", 
      estimatedTime: "50 mins",
      questionsCount: 30,
      color: "yellow"
    },
    {
      id: "ratio-and-proportion",
      name: "Ratio and Proportion",
      description: "Ratios, proportions, direct and inverse variations, and partnership problems.",
      difficulty: "Easy",
      estimatedTime: "35 mins",
      questionsCount: 30,
      color: "purple"
    },
    {
      id: "time-work-wages", 
      name: "Time, Work & Wages",
      description: "Work efficiency, time calculations, pipes and cisterns, and wage distribution problems.",
      difficulty: "Hard",
      estimatedTime: "60 mins",
      questionsCount: 30,
      color: "red"
    },
    {
      id: "time-speed-distance",
      name: "Time, Speed & Distance", 
      description: "Motion problems, relative speed, trains, boats and streams, and distance calculations.",
      difficulty: "Medium",
      estimatedTime: "50 mins",
      questionsCount: 30,
      color: "indigo"
    },
    {
      id: "averages-mixtures",
      name: "Averages & Mixtures",
      description: "Average calculations, weighted averages, alligation, and mixture-based problems.",
      difficulty: "Medium",
      estimatedTime: "45 mins", 
      questionsCount: 30,
      color: "orange"
    },
    {
      id: "geometry-mensuration",
      name: "Geometry & Mensuration",
      description: "Areas, volumes, perimeters of geometric shapes, coordinate geometry, and mensuration.", 
      difficulty: "Hard",
      estimatedTime: "55 mins",
      questionsCount: 30,
      color: "teal"
    },
    {
      id: "data-interpretation",
      name: "Data Interpretation", 
      description: "Charts, graphs, tables analysis, and data-based problem solving techniques.",
      difficulty: "Hard",
      estimatedTime: "60 mins",
      questionsCount: 30,
      color: "pink"
    },
    {
      id: "probability",
      name: "Probability",
      description: "Basic probability concepts, combinations, permutations, and probability distributions.",
      difficulty: "Hard", 
      estimatedTime: "50 mins",
      questionsCount: 30,
      color: "cyan"
    },
    {
      id: "algebra-basics",
      name: "Algebra Basics", 
      description: "Linear equations, quadratic equations, algebraic expressions, and basic algebraic operations.",
      difficulty: "Easy",
      estimatedTime: "40 mins",
      questionsCount: 30,
      color: "emerald"
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
      blue: { bg: "bg-blue-50", bgHover: "hover:bg-blue-100", border: "border-blue-200" },
      green: { bg: "bg-green-50", bgHover: "hover:bg-green-100", border: "border-green-200" },
      yellow: { bg: "bg-yellow-50", bgHover: "hover:bg-yellow-100", border: "border-yellow-200" },
      orange: { bg: "bg-orange-50", bgHover: "hover:bg-orange-100", border: "border-orange-200" },
      purple: { bg: "bg-purple-50", bgHover: "hover:bg-purple-100", border: "border-purple-200" },
      red: { bg: "bg-red-50", bgHover: "hover:bg-red-100", border: "border-red-200" },
      indigo: { bg: "bg-indigo-50", bgHover: "hover:bg-indigo-100", border: "border-indigo-200" },
      teal: { bg: "bg-teal-50", bgHover: "hover:bg-teal-100", border: "border-teal-200" },
      pink: { bg: "bg-pink-50", bgHover: "hover:bg-pink-100", border: "border-pink-200" },
      cyan: { bg: "bg-cyan-50", bgHover: "hover:bg-cyan-100", border: "border-cyan-200" },
      emerald: { bg: "bg-emerald-50", bgHover: "hover:bg-emerald-100", border: "border-emerald-200" }
    };
    
    return colorMap[color] || colorMap.blue;
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quantitative Ability</h1>
                <p className="text-gray-600 mt-1">
                  Master mathematical concepts and numerical problem-solving skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Topics</p>
                  <p className="text-xl font-semibold">{topics.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-xl font-semibold">{topics.length * 30}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Practice Mode</p>
                  <p className="text-xl font-semibold">Unlimited</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calculator className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="text-xl font-semibold">All Levels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className={`${getColorClasses(topic.color).bg} ${getColorClasses(topic.color).bgHover} ${getColorClasses(topic.color).border} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800">
                  {topic.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {topic.estimatedTime}
                  </span>
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
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    onClick={() => router.push(`/aptitude/quantitative/${topic.id}`)}
                  >
                    Start Practice
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Learn at Your Own Pace
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Each topic includes concept explanations, important formulas, and step-by-step solutions. 
              Practice without time pressure and master quantitative skills systematically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
