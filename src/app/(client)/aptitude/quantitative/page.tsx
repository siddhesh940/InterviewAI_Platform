"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calculator, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const floatingAnimation = {
  y: [0, -6, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

// Completion Ring Component
function CompletionRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const getColor = () => {
    if (progress >= 80) return "#22c55e"; // green
    if (progress >= 50) return "#eab308"; // yellow
    if (progress > 0) return "#3b82f6";   // blue
    return "#e5e7eb"; // gray
  };

  return (
    <motion.div 
      className="relative" 
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-xs font-semibold text-gray-700"
          key={progress}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {progress}%
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function QuantitativeAbilityPage() {
  const router = useRouter();
  const [topicProgress, setTopicProgress] = useState<Record<string, { attempted: number; correct: number }>>({});
  
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("aptitude-progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setTopicProgress(parsed.quantitative || {});
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
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.push('/aptitude')}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-blue-100 rounded-lg"
                animate={floatingAnimation}
              >
                <Calculator className="h-8 w-8 text-blue-600" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Quantitative Ability
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔢
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-gray-600 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Master mathematical concepts and numerical problem-solving skills
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Updated with Progress */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
            <Card className="border-blue-200 bg-blue-50/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-blue-100 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-600">Topics</p>
                    <motion.p 
                      className="text-xl font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      {topics.length}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
            <Card className="border-green-200 bg-green-50/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-green-100 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-600">Attempted</p>
                    <motion.p 
                      className="text-xl font-semibold"
                      key={getTotalProgress().attempted}
                      initial={{ color: "#22c55e" }}
                      animate={{ color: "#111827" }}
                    >
                      {getTotalProgress().attempted}/{topics.length * 30}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
            <Card className="border-yellow-200 bg-yellow-50/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-yellow-100 rounded-full"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                    <motion.p 
                      className="text-xl font-semibold"
                      key={getTotalProgress().accuracy}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {getTotalProgress().accuracy}%
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }}>
            <Card className="border-purple-200 bg-purple-50/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-purple-100 rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <motion.p 
                      className="text-xl font-semibold"
                      key={getTotalProgress().completion}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {getTotalProgress().completion}%
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Topics Grid - Updated with Completion Rings */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topics.map((topic, index) => {
            const completion = getTopicCompletion(topic.id, topic.questionsCount);
            const accuracy = getTopicAccuracy(topic.id);
            
            return (
              <motion.div
                key={topic.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card 
                  className={`${getColorClasses(topic.color).bg} ${getColorClasses(topic.color).bgHover} ${getColorClasses(topic.color).border} border-2 hover:shadow-xl transition-all duration-200 cursor-pointer group relative overflow-hidden`}
                  style={{ border: `2px solid ${topic.color === 'blue' ? '#bfdbfe' : topic.color === 'green' ? '#bbf7d0' : topic.color === 'yellow' ? '#fef08a' : topic.color === 'purple' ? '#e9d5ff' : topic.color === 'red' ? '#fecaca' : topic.color === 'orange' ? '#fed7aa' : '#e5e7eb'}` }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800">
                          {topic.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <motion.span 
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(topic.difficulty)}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {topic.difficulty}
                          </motion.span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                              <Clock className="h-3 w-3" />
                            </motion.div>
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
                        📝 {topic.questionsCount} Practice Questions
                      </span>
                      {accuracy !== null && (
                        <motion.span 
                          className={`font-medium ${accuracy >= 70 ? "text-green-600" : accuracy >= 50 ? "text-yellow-600" : "text-red-600"}`}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          {accuracy}% accuracy
                        </motion.span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <motion.button
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        onClick={() => router.push(`/aptitude/quantitative/${topic.id}`)}
                        whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(59, 130, 246, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {completion > 0 ? "Continue Practice" : "Start Practice"}
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden relative">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            />
            
            <CardContent className="p-6 text-center relative">
              <motion.div 
                className="flex items-center justify-center gap-3 mb-3"
                animate={floatingAnimation}
              >
                <motion.div 
                  className="p-3 bg-blue-100 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Calculator className="h-6 w-6 text-blue-600" />
                </motion.div>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-gray-900 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Learn at Your Own Pace 
                <motion.span
                  className="inline-block ml-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📚
                </motion.span>
              </motion.h3>
              <motion.p 
                className="text-gray-600 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Each topic includes concept explanations, important formulas, and step-by-step solutions. 
                Practice without time pressure and master quantitative skills systematically.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
