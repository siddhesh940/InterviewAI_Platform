"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calculator, Clock, MessageCircle, Puzzle, Star, Target, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AptitudePage() {
  const router = useRouter();
  
  const availableModules = [
    {
      id: "quantitative",
      name: "Quantitative Ability",
      subtitle: "Numbers & Calculations",
      description: "Master mathematical concepts, arithmetic operations, percentages, ratios, and data interpretation. Build strong numerical problem-solving skills.",
      icon: <Calculator className="h-6 w-6 text-blue-600" />,
      topicCount: 11,
      questionsPerTopic: 30,
      status: "Available",
      color: "blue"
    },
    {
      id: "logical-reasoning",
      name: "Logical Reasoning",
      subtitle: "Pattern & Logic",
      description: "Develop critical thinking through puzzles, sequences, analogies, and logical deductions. Strengthen analytical reasoning abilities.",
      icon: <Puzzle className="h-6 w-6 text-purple-600" />,
      topicCount: 10,
      questionsPerTopic: 30,
      status: "Available",
      color: "purple"
    },
    {
      id: "verbal-ability",
      name: "Verbal Ability",
      subtitle: "Language & Communication",
      description: "Enhance vocabulary, grammar, reading comprehension, and verbal reasoning. Perfect your language skills for professional communication.",
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      topicCount: 6,
      questionsPerTopic: 10,
      status: "Available",
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, bgHover: string, button: string, buttonHover: string }> = {
      blue: { bg: "bg-blue-50", bgHover: "group-hover:bg-blue-100", button: "bg-blue-600", buttonHover: "hover:bg-blue-700" },
      purple: { bg: "bg-purple-50", bgHover: "group-hover:bg-purple-100", button: "bg-purple-600", buttonHover: "hover:bg-purple-700" },
      green: { bg: "bg-green-50", bgHover: "group-hover:bg-green-100", button: "bg-green-600", buttonHover: "hover:bg-green-700" },
    };
    
    return colorMap[color] || colorMap.blue;
  };

  const getTotalQuestions = () => {
    return availableModules.reduce((total, module) => total + (module.topicCount * module.questionsPerTopic), 0);
  };

  const getTotalTopics = () => {
    return availableModules.reduce((total, module) => total + module.topicCount, 0);
  };

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl section-icon">
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aptitude Arena</h1>
              <p className="text-gray-600 mt-1">
                Master quantitative, logical, and verbal skills through unlimited practice
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 grid-animate">
          <Card className="card-bordered hover:border-blue-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl icon-hover-scale">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Topics</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalTopics()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-green-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl icon-hover-scale">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalQuestions()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl icon-hover-scale">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Practice Time</p>
                  <p className="text-2xl font-bold text-gray-900">Unlimited</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-purple-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl icon-hover-scale">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Difficulty</p>
                  <p className="text-2xl font-bold text-gray-900">All Levels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-animate">
          {availableModules.map((module, index) => (
            <Card 
              key={module.id} 
              className="card-bordered group cursor-pointer hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${getColorClasses(module.color).bg} rounded-xl ${getColorClasses(module.color).bgHover} transition-all duration-300 icon-hover-scale`}>
                      {module.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">{module.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{module.subtitle}</p>
                      <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-200">
                        {module.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {module.description}
                </p>
                
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    {module.topicCount} Topics
                  </span>
                  <span className="text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    {module.topicCount * module.questionsPerTopic} Questions
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    className={`w-full py-2.5 px-4 ${getColorClasses(module.color).button} ${getColorClasses(module.color).buttonHover} text-white rounded-lg text-sm font-medium transition-all duration-200 btn-premium`}
                    onClick={() => router.push(`/aptitude/${module.id}`)}
                  >
                    Start Practice
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 animate-fade-in-up delay-300">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full icon-hover-float">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Practice Without Pressure
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              No timers, no scoring pressure. Focus on learning concepts and improving your aptitude skills 
              at your own pace with unlimited practice sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
