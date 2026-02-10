"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  Calculator,
  CheckCircle,
  Clock,
  Flame,
  MessageCircle,
  Puzzle,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

// Animated number counter
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

// Types for progress tracking
interface TopicProgress {
  attempted: number;
  correct: number;
}

interface CategoryProgress {
  [topicId: string]: TopicProgress;
}

interface AptitudeProgress {
  quantitative: CategoryProgress;
  "logical-reasoning": CategoryProgress;
  "verbal-ability": CategoryProgress;
}

export default function AptitudePage() {
  const router = useRouter();

  // Local progress state (simpler than full context for main page)
  const [progress, setProgress] = useState<AptitudeProgress>({
    quantitative: {},
    "logical-reasoning": {},
    "verbal-ability": {},
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aptitude-progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        // Keep default
      }
    }
    setIsLoaded(true);
  }, []);

  // Calculate stats
  const getTotalQuestionsAttempted = () => {
    let total = 0;
    Object.values(progress).forEach((category: CategoryProgress) => {
      (Object.values(category) as TopicProgress[]).forEach(topic => {
        total += topic.attempted;
      });
    });

    return total;
  };

  const getTotalCorrect = () => {
    let total = 0;
    Object.values(progress).forEach((category: CategoryProgress) => {
      (Object.values(category) as TopicProgress[]).forEach(topic => {
        total += topic.correct;
      });
    });

    return total;
  };

  const getAccuracy = () => {
    const attempted = getTotalQuestionsAttempted();
    if (attempted === 0) {
      return 0;
    }

    return Math.round((getTotalCorrect() / attempted) * 100);
  };

  const getWeakestArea = (): string => {
    type WeakestType = { topic: string; accuracy: number } | null;
    let weakest: WeakestType = null;

    Object.entries(progress).forEach(([, categoryData]) => {
      (Object.entries(categoryData) as [string, TopicProgress][]).forEach(
        ([topicId, topicData]) => {
          if (topicData.attempted >= 3) {
            const accuracy = (topicData.correct / topicData.attempted) * 100;
            if (!weakest || accuracy < weakest.accuracy) {
              weakest = { topic: formatTopicName(topicId), accuracy };
            }
          }
        }
      );
    });

    return (weakest as WeakestType)?.topic ?? "Practice more!";
  };

  const formatTopicName = (id: string) => {
    return id
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCategoryProgress = (categoryId: string) => {
    const categoryData = progress[categoryId as keyof AptitudeProgress] || {};
    let attempted = 0;
    let correct = 0;

    Object.values(categoryData).forEach(topic => {
      attempted += topic.attempted;
      correct += topic.correct;
    });

    return {
      attempted,
      correct,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    };
  };

  const availableModules = [
    {
      id: "quantitative",
      name: "Quantitative Ability",
      subtitle: "Numbers & Calculations",
      description:
        "Master mathematical concepts, arithmetic operations, percentages, ratios, and data interpretation.",
      icon: <Calculator className="h-6 w-6 text-blue-600" />,
      topicCount: 11,
      questionsPerTopic: 30,
      totalQuestions: 330,
      status: "Available",
      color: "blue",
      skillType: "Speed & Accuracy",
      skillIcon: <Zap className="h-3.5 w-3.5" />,
      interviewNote: "Most asked in TCS, Infosys, Wipro drives",
    },
    {
      id: "logical-reasoning",
      name: "Logical Reasoning",
      subtitle: "Pattern & Logic",
      description:
        "Develop critical thinking through puzzles, sequences, analogies, and logical deductions.",
      icon: <Puzzle className="h-6 w-6 text-purple-600" />,
      topicCount: 10,
      questionsPerTopic: 30,
      totalQuestions: 300,
      status: "Available",
      color: "purple",
      skillType: "Logic & Analysis",
      skillIcon: <Brain className="h-3.5 w-3.5" />,
      interviewNote: "Key for Accenture, Cognizant rounds",
    },
    {
      id: "verbal-ability",
      name: "Verbal Ability",
      subtitle: "Language & Communication",
      description:
        "Enhance vocabulary, grammar, reading comprehension, and verbal reasoning skills.",
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      topicCount: 6,
      questionsPerTopic: 10,
      totalQuestions: 60,
      status: "Available",
      color: "green",
      skillType: "Comprehension",
      skillIcon: <MessageCircle className="h-3.5 w-3.5" />,
      interviewNote: "Essential for HR & communication rounds",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      {
        bg: string;
        bgHover: string;
        button: string;
        buttonHover: string;
        border: string;
        text: string;
        light: string;
        progress: string;
      }
    > = {
      blue: {
        bg: "bg-blue-50",
        bgHover: "group-hover:bg-blue-100",
        button: "bg-blue-600",
        buttonHover: "hover:bg-blue-700",
        border: "border-blue-200",
        text: "text-blue-600",
        light: "bg-blue-100",
        progress: "bg-blue-500",
      },
      purple: {
        bg: "bg-purple-50",
        bgHover: "group-hover:bg-purple-100",
        button: "bg-purple-600",
        buttonHover: "hover:bg-purple-700",
        border: "border-purple-200",
        text: "text-purple-600",
        light: "bg-purple-100",
        progress: "bg-purple-500",
      },
      green: {
        bg: "bg-green-50",
        bgHover: "group-hover:bg-green-100",
        button: "bg-green-600",
        buttonHover: "hover:bg-green-700",
        border: "border-green-200",
        text: "text-green-600",
        light: "bg-green-100",
        progress: "bg-green-500",
      },
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* ═══════════════════════════════════════════════════════════════
            PHASE-1: HERO MOTIVATION STRIP
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 md:p-8">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left: Motivation Text */}
              <div className="flex-1">
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                    animate={floatingAnimation}
                  >
                    <Brain className="h-6 w-6 text-white" />
                  </motion.div>
                  <span className="text-white/80 text-sm font-medium">Aptitude Arena</span>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-lg"
                  >
                    🧠
                  </motion.span>
                </motion.div>
                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Crack Aptitude Faster. Not Harder.
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="text-white/80 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Built for placements, campus drives & competitive exams
                </motion.p>
              </div>

              {/* Right: Stats Cards */}
              {isLoaded && (
                <motion.div
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-4 min-w-[120px] hover:bg-white/25 transition-colors cursor-default"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </motion.div>
                      Solved
                    </div>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedNumber value={getTotalQuestionsAttempted()} />
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-4 min-w-[120px] hover:bg-white/25 transition-colors cursor-default"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="h-3.5 w-3.5" />
                      </motion.div>
                      Accuracy
                    </div>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedNumber value={getAccuracy()} />%
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-4 min-w-[140px] hover:bg-white/25 transition-colors cursor-default"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                      </motion.div>
                      Weak Area
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{getWeakestArea()}</p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            PHASE-3: MICRO CHALLENGE - 5 Questions / 3 Minutes
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-4 p-5">
                  <motion.div
                    className="p-3 bg-amber-100 rounded-xl relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="h-6 w-6 text-amber-600" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">Quick Challenge</h3>
                      <motion.span
                        className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-medium rounded-full"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⚡ 5 Questions • 3 Minutes
                      </motion.span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Test your speed with a rapid-fire aptitude round
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 md:pb-0 md:pr-5">
                  <motion.button
                    className="w-full md:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/aptitude/quick-challenge")}
                  >
                    Start Challenge
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            PHASE-1: CATEGORY CARDS - Made Alive
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </motion.div>
            <h2 className="text-lg font-semibold text-gray-900">Choose Your Arena</h2>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎯
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {availableModules.map((module, index) => {
            const colors = getColorClasses(module.color);
            const categoryProg = getCategoryProgress(module.id);
            const progressPercent = Math.min(
              100,
              Math.round((categoryProg.attempted / module.totalQuestions) * 100)
            );

            return (
              <motion.div
                key={module.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className={`group cursor-pointer border-2 ${colors.border} hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
                  style={{
                    border: `2px solid ${module.color === "blue" ? "#bfdbfe" : module.color === "purple" ? "#e9d5ff" : "#bbf7d0"}`,
                  }}
                  onClick={() => router.push(`/aptitude/${module.id}`)}
                >
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Top colored bar with animation */}
                  <motion.div
                    className={`h-1.5 ${colors.progress}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`p-3 ${colors.light} rounded-xl transition-all duration-300 group-hover:scale-110`}
                          animate={floatingAnimation}
                        >
                          {module.icon}
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {module.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{module.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Skill Type Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <motion.span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {module.skillIcon}
                        {module.skillType}
                      </motion.span>
                    </div>

                    {/* Interview Relevance */}
                    <div className="flex items-start gap-2 mb-4 p-2.5 bg-gray-50 rounded-lg">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {module.interviewNote}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {module.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Progress</span>
                        <motion.span
                          className={`font-medium ${colors.text}`}
                          key={categoryProg.attempted}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          {categoryProg.attempted}/{module.totalQuestions} solved
                        </motion.span>
                      </div>
                      <div className="relative">
                        <Progress value={progressPercent} className="h-2" />
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      {categoryProg.accuracy > 0 && (
                        <motion.div
                          className="flex items-center gap-1 mt-1.5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">
                            {categoryProg.accuracy}% accuracy
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs mb-4">
                      <motion.span
                        className="text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        📚 {module.topicCount} Topics
                      </motion.span>
                      <motion.span
                        className="text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        ❓ {module.totalQuestions} Questions
                      </motion.span>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className={`w-full py-2.5 px-4 ${colors.button} ${colors.buttonHover} text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                      whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Practice
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            PHASE-3: MINI PROGRESS TRACKING
        ═══════════════════════════════════════════════════════════════ */}
        {isLoaded && getTotalQuestionsAttempted() > 0 && (
          <Card className="mb-8 border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Your Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableModules.map(module => {
                  const colors = getColorClasses(module.color);
                  const categoryProg = getCategoryProgress(module.id);
                  const progressPercent = Math.min(
                    100,
                    Math.round((categoryProg.attempted / module.totalQuestions) * 100)
                  );

                  return (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 ${colors.light} rounded-lg`}>{module.icon}</div>
                          <span className="font-medium text-sm text-gray-700">
                            {module.name.split(" ")[0]}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 ${colors.progress} rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{categoryProg.attempted} solved</span>
                        {categoryProg.accuracy > 0 && (
                          <span className="text-green-600">{categoryProg.accuracy}% accurate</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weakest Topic Highlight */}
              {getWeakestArea() !== "Practice more!" && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">Focus Area</p>
                      <p className="text-xs text-red-600">
                        Weakest: <span className="font-semibold">{getWeakestArea()}</span> —
                        Practice more to improve!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            INFO CARD - Practice Without Pressure
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 overflow-hidden relative">
            {/* Animated background dots */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                  initial={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            <CardContent className="p-8 text-center relative">
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                animate={floatingAnimation}
              >
                <motion.div
                  className="p-3 bg-indigo-100 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Trophy className="h-6 w-6 text-indigo-600" />
                </motion.div>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Practice Without Pressure
                <motion.span
                  className="inline-block ml-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.span>
              </motion.h3>
              <motion.p
                className="text-gray-600 max-w-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                No timers, no scoring pressure. Focus on learning concepts and improving your
                aptitude skills at your own pace with unlimited practice sessions.
              </motion.p>

              {/* Quick stats */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-indigo-100"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex items-center gap-2"
                  variants={cardVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="h-4 w-4 text-indigo-600" />
                  </motion.div>
                  <span className="text-sm text-gray-600">Unlimited Practice</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  variants={cardVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="h-4 w-4 text-indigo-600" />
                  </motion.div>
                  <span className="text-sm text-gray-600">690+ Questions</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  variants={cardVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div animate={floatingAnimation}>
                    <Brain className="h-4 w-4 text-indigo-600" />
                  </motion.div>
                  <span className="text-sm text-gray-600">27 Topics</span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
