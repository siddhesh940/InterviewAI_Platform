"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Brain, Target, } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogicalReasoningPage() {
  const router = useRouter();
  
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600" />
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
                  <Brain className="h-5 w-5 text-yellow-600" />
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
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Brain className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">All Topics</p>
                  <p className="text-xl font-semibold">Practice</p>
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
              onClick={() => router.push(`/aptitude/logical-reasoning/${topic.id}`)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800">
                  {topic.name}
                </CardTitle>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/aptitude/logical-reasoning/${topic.id}`);
                    }}
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
