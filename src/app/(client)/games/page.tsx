"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGames } from "@/contexts/GamesContext";
import { difficultyColors, difficultyLabels } from "@/data/games-data";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  Flame,
  Gamepad2,
  Layers,
  Link2,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 200,
    },
  },
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Animated counter

export default function GamesPage() {
  const router = useRouter();
  const { 
    gameProgress, 
    skillProgress, 
    dailyChallenge, 
    streak, 
    totalXp, 
    overallLevel,
    selectedDifficulty,
    setDifficulty,
    getOverallStats,
  } = useGames();

  const overallStats = getOverallStats();
  const xpPerLevel = 1000;
  const xpProgress = {
    current: totalXp % xpPerLevel,
    needed: xpPerLevel - (totalXp % xpPerLevel),
    percentage: ((totalXp % xpPerLevel) / xpPerLevel) * 100,
  };

  const games = [
    {
      id: "fix-bad-answer" as const,
      name: "Fix the Bad Answer",
      subtitle: "Correction Challenge",
      description: "Transform weak interview responses into professional, structured answers using STAR method.",
      icon: <Edit3 className="h-5 w-5" />,
      color: "indigo",
      skillType: "Communication",
      estimatedTime: "15 mins",
    },
    {
      id: "keyword-hunt" as const,
      name: "Keyword Hunt",
      subtitle: "Fast Technical Recall",
      description: "Test your technical vocabulary under pressure. Build strong conceptual memory.",
      icon: <Clock className="h-5 w-5" />,
      color: "purple",
      skillType: "Technical",
      estimatedTime: "5 mins",
    },
    {
      id: "rephrase-me" as const,
      name: "Rephrase Me",
      subtitle: "Vocabulary Builder",
      description: "Transform basic statements into polished, professional interview-ready language.",
      icon: <BookOpen className="h-5 w-5" />,
      color: "emerald",
      skillType: "Communication",
      estimatedTime: "10 mins",
    },
    {
      id: "answer-builder" as const,
      name: "Answer Builder",
      subtitle: "Sentence Blocks",
      description: "Arrange shuffled sentence blocks into the most professional and logical answer structure.",
      icon: <Layers className="h-5 w-5" />,
      color: "cyan",
      skillType: "Communication",
      estimatedTime: "10 mins",
    },
    {
      id: "keyword-mapping" as const,
      name: "Keyword Mapping",
      subtitle: "Concept Connector",
      description: "Match keywords to correct conceptual sentences. Identify misleading statements.",
      icon: <Link2 className="h-5 w-5" />,
      color: "orange",
      skillType: "Technical",
      estimatedTime: "8 mins",
    },
    {
      id: "truth-or-bluff" as const,
      name: "Truth or Bluff",
      subtitle: "Interview Edition",
      description: "Rapid-fire statements: identify what's correct, incorrect, or misleading.",
      icon: <Eye className="h-5 w-5" />,
      color: "violet",
      skillType: "Technical",
      estimatedTime: "5 mins",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; icon: string; btn: string; accent: string }> = {
      indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700", accent: "border-indigo-200" },
      purple: { bg: "bg-purple-50", icon: "text-purple-600", btn: "bg-purple-600 hover:bg-purple-700", accent: "border-purple-200" },
      emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700", accent: "border-emerald-200" },
      cyan: { bg: "bg-cyan-50", icon: "text-cyan-600", btn: "bg-cyan-600 hover:bg-cyan-700", accent: "border-cyan-200" },
      orange: { bg: "bg-orange-50", icon: "text-orange-600", btn: "bg-orange-600 hover:bg-orange-700", accent: "border-orange-200" },
      violet: { bg: "bg-violet-50", icon: "text-violet-600", btn: "bg-violet-600 hover:bg-violet-700", accent: "border-violet-200" },
    };
    
return colorMap[color] || colorMap.indigo;
  };

  const getColorHex = (color: string) => {
    const hexMap: Record<string, string> = {
      indigo: '#6366f1',
      purple: '#a855f7',
      emerald: '#10b981',
      cyan: '#06b6d4',
      orange: '#f97316',
      violet: '#8b5cf6',
    };
    
return hexMap[color] || '#6366f1';
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg relative overflow-hidden"
              animate={floatingAnimation}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <Gamepad2 className="h-7 w-7 text-white relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                Training Games
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎮
                </motion.span>
              </h1>
              <p className="text-gray-500 text-sm">Level up your interview skills through practice</p>
            </div>
          </div>
          
          {/* Level Badge */}
          <motion.div 
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="p-1.5 bg-amber-100 rounded-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-4 w-4 text-amber-600" />
              </motion.div>
              <div>
                <p className="text-xs text-gray-500">Level</p>
                <motion.p 
                  className="text-lg font-bold text-gray-900"
                  key={overallLevel}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {overallLevel}
                </motion.p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <motion.div 
                className="p-1.5 bg-purple-100 rounded-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="h-4 w-4 text-purple-600" />
              </motion.div>
              <div>
                <p className="text-xs text-gray-500">Total XP</p>
                <motion.p 
                  className="text-lg font-bold text-gray-900"
                  key={totalXp}
                  initial={{ scale: 1.3, color: "#7c3aed" }}
                  animate={{ scale: 1, color: "#111827" }}
                >
                  {totalXp.toLocaleString()}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Top Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Target, color: 'blue', bg: 'bg-blue-50', iconColor: 'text-blue-600', value: overallStats.totalAttempts, label: 'Total Attempts', emoji: '🎯' },
            { icon: Trophy, color: 'green', bg: 'bg-green-50', iconColor: 'text-green-600', value: overallStats.bestScore, label: 'Best Score', emoji: '🏆', format: (v: number) => v > 0 ? `${v.toFixed(1)}/10` : '--' },
            { icon: Star, color: 'amber', bg: 'bg-amber-50', iconColor: 'text-amber-600', value: overallStats.averageScore, label: 'Average Score', emoji: '⭐', format: (v: number) => v > 0 ? `${v}/10` : '--' },
            { icon: Flame, color: 'orange', bg: 'bg-orange-50', iconColor: 'text-orange-600', value: streak.currentStreak, label: 'Day Streak', emoji: '🔥' },
          ].map((stat, index) => {
            const IconComp = stat.icon;
            
return (
              <motion.div 
                key={stat.label} 
                variants={statVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-sm bg-white hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 relative">
                      <motion.div 
                        className={`p-2.5 ${stat.bg} rounded-xl`}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                      >
                        <IconComp className={`h-5 w-5 ${stat.iconColor}`} />
                      </motion.div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                          {stat.format ? stat.format(stat.value) : stat.value}
                          {stat.value > 0 && (
                            <motion.span
                              className="text-sm"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {stat.emoji}
                            </motion.span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Games & Skills */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Difficulty Selector */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-gray-700">Difficulty Level</span>
                  </div>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                      <button
                        key={diff}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedDifficulty === diff
                            ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                        onClick={() => setDifficulty(diff)}
                      >
                        {difficultyLabels[diff]}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Games Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {games.map((game, gameIndex) => {
                const progress = gameProgress?.[game.id] || {
                  totalAttempts: 0,
                  correctAttempts: 0,
                  bestScore: 0,
                  averageScore: 0,
                  lastPlayed: null,
                  streakDays: 0,
                  currentLevel: 1,
                  totalXp: 0,
                };
                const colors = getColorClasses(game.color);
                
                return (
                  <motion.div
                    key={game.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className={`border-2 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden h-full`}
                      style={{ borderColor: '#e5e7eb', borderTopWidth: '4px', borderTopColor: getColorHex(game.color) }}
                      onClick={() => router.push(`/games/${game.id}`)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = getColorHex(game.color);
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
                        (e.currentTarget as HTMLDivElement).style.borderTopColor = getColorHex(game.color);
                      }}
                    >
                      {/* Colored Header */}
                      <div className={`${colors.bg} p-4 border-b ${colors.accent} relative overflow-hidden`}>
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="flex items-center justify-between relative">
                          <motion.div 
                            className={`p-2 bg-white rounded-lg shadow-sm ${colors.icon}`}
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ 
                              y: { duration: 2, repeat: Infinity, delay: gameIndex * 0.1 },
                              scale: { type: "spring" }
                            }}
                          >
                            {game.icon}
                          </motion.div>
                          <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Badge variant="outline" className="bg-white/50 text-gray-600 border-gray-300 text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {game.estimatedTime}
                              </Badge>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Badge variant="outline" className={`${colors.bg} ${colors.icon} border-current text-xs`}>
                                {game.skillType}
                              </Badge>
                            </motion.div>
                        </div>
                      </div>
                      <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                        {game.name}
                        <motion.span
                          className="opacity-0 group-hover:opacity-100"
                          initial={{ x: -5 }}
                          whileHover={{ x: 0 }}
                        >
                          →
                        </motion.span>
                      </h3>
                      <p className="text-xs text-gray-500">{game.subtitle}</p>
                    </div>
                    
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {game.description}
                      </p>
                      
                      {/* Mini Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        {[
                          { label: 'Attempts', value: progress.totalAttempts },
                          { label: 'Best', value: progress.bestScore > 0 ? progress.bestScore.toFixed(1) : '--' },
                          { label: 'Level', value: progress.currentLevel },
                        ].map((stat) => (
                          <motion.div 
                            key={stat.label}
                            className="bg-gray-50 rounded-lg py-2 hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <motion.p 
                              className="font-semibold text-gray-900"
                              key={String(stat.value)}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                            >
                              {stat.value}
                            </motion.p>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* XP Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Game XP</span>
                          <span className="font-medium">{progress.totalXp} XP</span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={(progress.totalXp % 500) / 5} 
                            className="h-1.5" 
                          />
                          {progress.totalXp > 0 && (
                            <motion.div
                              className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
                              style={{ width: `${(progress.totalXp % 500) / 5}%` }}
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          className={`w-full ${colors.btn} text-white text-sm shadow-sm hover:shadow-lg transition-all`}
                          size="sm"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            🎮
                          </motion.span>
                          <span className="ml-1">Play Now</span>
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </motion.span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Skill Progress */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Skill Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Communication Skill */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">Communication</span>
                      <span className="text-sm text-gray-500">Level {skillProgress.communication.level}</span>
                    </div>
                    <Progress 
                      value={(skillProgress.communication.currentXp / 500) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {skillProgress.communication.currentXp} / 500 XP to next level
                    </p>
                  </div>
                </div>
                
                {/* Technical Skill */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">Technical</span>
                      <span className="text-sm text-gray-500">Level {skillProgress.technical.level}</span>
                    </div>
                    <Progress 
                      value={(skillProgress.technical.currentXp / 500) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {skillProgress.technical.currentXp} / 500 XP to next level
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Daily Challenge & Streak */}
          <div className="space-y-6">
            
            {/* Daily Challenge */}
            {dailyChallenge && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                    animate={{ 
                      backgroundPosition: ['0px 0px', '20px 20px'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <CardContent className="p-5 relative">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Calendar className="h-4 w-4" />
                      </motion.div>
                      <span className="text-sm font-medium opacity-90">Daily Challenge</span>
                      <motion.span
                        className="ml-auto"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1">{dailyChallenge.title}</h3>
                    <p className="text-sm opacity-80 mb-4">{dailyChallenge.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-white/20 text-white border-0">
                          {difficultyLabels[dailyChallenge.difficulty]}
                        </Badge>
                        <motion.span 
                          className="text-sm flex items-center gap-1"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Zap className="h-3 w-3" />
                          +{dailyChallenge.xpReward} XP
                        </motion.span>
                      </div>
                      
                      {dailyChallenge.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Badge className="bg-green-500 text-white border-0">
                            Completed ✓
                          </Badge>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            size="sm" 
                            className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                            onClick={() => router.push(`/games/${dailyChallenge.gameId}`)}
                          >
                            Start
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </motion.span>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Flame className="h-5 w-5 text-orange-500" />
                    </motion.div>
                    Activity Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <motion.div 
                      className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2"
                      animate={pulseAnimation}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Flame className="h-6 w-6 text-orange-500" />
                      </motion.div>
                      <motion.span 
                        className="text-3xl font-bold text-orange-600"
                        key={streak.currentStreak}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                      >
                        {streak.currentStreak}
                      </motion.span>
                      <span className="text-sm text-orange-600">day{streak.currentStreak !== 1 ? 's' : ''}</span>
                    </motion.div>
                    <p className="text-xs text-gray-500 mt-2">
                      Longest: {streak.longestStreak} days
                    </p>
                  </div>
                  
                  {/* Weekly Activity */}
                  <div className="flex justify-between gap-1">
                    {weekDays.map((day, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex-1 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.div 
                          className={`h-8 w-full rounded-md mb-1 flex items-center justify-center ${
                            streak.weeklyActivity[idx] 
                              ? 'bg-green-500' 
                              : 'bg-gray-100'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          animate={streak.weeklyActivity[idx] ? {
                            boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 8px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {streak.weeklyActivity[idx] && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Flame className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                        <span className="text-xs text-gray-500">{day}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="h-5 w-5 text-amber-500" />
                    </motion.div>
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <motion.div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg relative"
                      animate={{ 
                        boxShadow: [
                          '0 10px 25px rgba(251, 191, 36, 0.3)',
                          '0 10px 40px rgba(251, 191, 36, 0.5)',
                          '0 10px 25px rgba(251, 191, 36, 0.3)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {/* Rotating ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span 
                        className="text-3xl font-bold text-white"
                        key={overallLevel}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                      >
                        {overallLevel}
                      </motion.span>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress to Level {overallLevel + 1}</span>
                      <motion.span 
                        className="font-medium"
                        key={xpProgress.percentage}
                        initial={{ color: '#7c3aed' }}
                        animate={{ color: '#111827' }}
                      >
                        {Math.round(xpProgress.percentage)}%
                      </motion.span>
                    </div>
                    <div className="relative">
                      <Progress value={xpProgress.percentage} className="h-2" />
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                        style={{ width: `${xpProgress.percentage}%` }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {xpProgress.needed} XP needed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


          </div>
        </div>
      </div>
    </div>
  );
}
