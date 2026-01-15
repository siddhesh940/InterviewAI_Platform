"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Edit3, Gamepad2, Plus, Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GamesPage() {
  const router = useRouter();
  
  const availableGames = [
    {
      id: "fix-bad-answer",
      name: "Fix the Bad Answer",
      subtitle: "Correction Challenge",
      description: "Transform weak interview responses into professional, structured answers. Practice improving communication skills by correcting poor examples.",
      icon: <Edit3 className="h-6 w-6 text-indigo-600" />,
      difficulty: "Medium",
      estimatedTime: "15 mins",
      status: "Available",
      color: "indigo"
    },
    {
      id: "keyword-hunt",
      name: "Keyword Hunt",
      subtitle: "Fast Technical Recall",
      description: "Test your technical vocabulary under pressure. Recall essential keywords for various CS topics within 30 seconds to build strong conceptual memory.",
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      difficulty: "Hard",
      estimatedTime: "5 mins",
      status: "Available", 
      color: "purple"
    },
    {
      id: "rephrase-me",
      name: "Rephrase Me",
      subtitle: "Vocabulary Builder",
      description: "Transform basic, weak, or informal sentences into polished, professional statements. Master corporate communication and interview-ready language.",
      icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
      difficulty: "Medium",
      estimatedTime: "10 mins",
      status: "Available",
      color: "emerald"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-50 border border-green-200";
      case "Medium": return "text-amber-600 bg-amber-50 border border-amber-200";
      case "Hard": return "text-red-600 bg-red-50 border border-red-200";
      default: return "text-gray-600 bg-gray-50 border border-gray-200";
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, bgHover: string, icon: string, btn: string }> = {
      indigo: { bg: "bg-indigo-50", bgHover: "group-hover:bg-indigo-100", icon: "text-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700" },
      purple: { bg: "bg-purple-50", bgHover: "group-hover:bg-purple-100", icon: "text-purple-600", btn: "bg-purple-600 hover:bg-purple-700" },
      blue: { bg: "bg-blue-50", bgHover: "group-hover:bg-blue-100", icon: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700" },
      green: { bg: "bg-green-50", bgHover: "group-hover:bg-green-100", icon: "text-green-600", btn: "bg-green-600 hover:bg-green-700" },
      emerald: { bg: "bg-emerald-50", bgHover: "group-hover:bg-emerald-100", icon: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700" },
      red: { bg: "bg-red-50", bgHover: "group-hover:bg-red-100", icon: "text-red-600", btn: "bg-red-600 hover:bg-red-700" },
    };
    
    return colorMap[color] || colorMap.indigo;
  };

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl section-icon">
              <Gamepad2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Training Games</h1>
              <p className="text-gray-600 mt-1">
                Enhance your professional skills through interactive gaming experiences
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
                  <Gamepad2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Games</p>
                  <p className="text-2xl font-bold text-gray-900">{availableGames.length}</p>
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
                  <p className="text-sm text-gray-500 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
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
                  <p className="text-sm text-gray-500 font-medium">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900">10 min</p>
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
                  <p className="text-sm text-gray-500 font-medium">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-animate">
          {availableGames.map((game, index) => (
            <Card 
              key={game.id} 
              className="card-bordered group cursor-pointer hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${getColorClasses(game.color).bg} rounded-xl ${getColorClasses(game.color).bgHover} transition-all duration-300 icon-hover-scale`}>
                      {game.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">{game.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{game.subtitle}</p>
                      <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-200">
                        {game.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className={`px-3 py-1.5 rounded-full font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Clock className="h-3 w-3" />
                    {game.estimatedTime}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    className={`w-full py-2.5 px-4 ${getColorClasses(game.color).btn} text-white rounded-lg text-sm font-medium transition-all duration-200 btn-premium`}
                    onClick={() => router.push(`/games/${game.id}`)}
                  >
                    Start Game
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-10 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 animate-fade-in-up delay-300">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-full icon-hover-float">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              More Games Coming Soon!
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              We are working hard to bring you engaging training games that will help you develop 
              essential professional skills. Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
