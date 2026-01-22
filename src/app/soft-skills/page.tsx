"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSoftSkills } from '@/contexts/SoftSkillsContext';
import { PROGRESS_WEIGHTS, skillLevelConfig, skills } from '@/data/soft-skills-data';
import { motion, useInView } from 'framer-motion';
import { Award, Briefcase, CheckCircle2, ChevronRight, Ear, Heart, MessageCircle, PlayCircle, Target, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardHoverVariants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  },
};

// Animated Counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

// Animated Progress Bar component
function AnimatedProgress({ value, className }: { value: number; className?: string }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <Progress 
        value={animatedValue} 
        className={`${className} transition-all duration-700 ease-out`} 
      />
    </div>
  );
}

// Floating animation for icons
const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Pulse animation

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  MessageCircle,
  Award,
  User,
  Ear,
  Briefcase,
  Heart,
};

// Breadcrumb component
function Breadcrumb() {
  return (
    <motion.nav 
      className="flex items-center text-sm text-gray-500 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="text-gray-900 font-medium">Soft Skills</span>
    </motion.nav>
  );
}

// Overall score card
function OverallScoreCard({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) {return 'text-green-600';}
    if (s >= 60) {return 'text-blue-600';}
    if (s >= 40) {return 'text-yellow-600';}

    return 'text-gray-600';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) {return 'Interview Ready';}
    if (s >= 60) {return 'Good Progress';}
    if (s >= 40) {return 'Building Skills';}

    return 'Getting Started';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-100 overflow-hidden relative">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 opacity-0"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <motion.div animate={floatingAnimation}>
              <Target className="w-5 h-5 text-indigo-600" />
            </motion.div>
            Overall Soft Skills Score
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-4">
            <motion.div 
              className={`text-5xl font-bold ${getScoreColor(score)}`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <AnimatedCounter value={score} />%
            </motion.div>
            <motion.span 
              className="text-gray-500 mb-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {getScoreLabel(score)}
            </motion.span>
          </div>
          <AnimatedProgress value={score} className="mt-4 h-3" />
          <motion.div 
            className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="flex items-center gap-1">
              <PlayCircle className="w-3 h-3" /> Videos: +{PROGRESS_WEIGHTS.VIDEO_WATCHED}%
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Checklist: +{PROGRESS_WEIGHTS.CHECKLIST_ITEM}%
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" /> Quiz: +{PROGRESS_WEIGHTS.QUIZ_COMPLETED}%
            </span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Individual skill card
function SkillCard({ 
  skill, 
  progress, 
  quizLevel 
}: { 
  skill: typeof skills[0]; 
  progress: number;
  quizLevel: string | null;
}) {
  const IconComponent = iconMap[skill.icon] || MessageCircle;
  const levelConfig = quizLevel ? skillLevelConfig[quizLevel as keyof typeof skillLevelConfig] : null;

  return (
    <Link href={`/soft-skills/${skill.id}`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        className="h-full"
      >
        <Card className="h-full cursor-pointer group border-gray-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden relative">
          {/* Animated gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500" />
          
          <CardHeader className="pb-3 relative">
            <div className="flex items-start justify-between">
              <motion.div 
                className="p-2.5 rounded-xl relative overflow-hidden" 
                style={{ backgroundColor: `${skill.color}15` }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ backgroundColor: skill.color }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.15 }}
                />
                <IconComponent 
                  className="w-5 h-5 relative z-10" 
                  style={{ color: skill.color }} 
                />
              </motion.div>
              {levelConfig && (
                <motion.span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${levelConfig.color}15`,
                    color: levelConfig.color 
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {levelConfig.label}
                </motion.span>
              )}
            </div>
            <CardTitle className="text-base font-semibold mt-3 group-hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2">
              {skill.name}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="text-indigo-500"
              >
                →
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 relative">
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {skill.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <motion.span 
                  className="font-semibold"
                  style={{ color: progress >= 70 ? '#22c55e' : progress >= 40 ? '#f59e0b' : '#6366f1' }}
                  key={progress}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  {progress}%
                  {progress >= 80 && " 🎉"}
                </motion.span>
              </div>
              <div className="relative">
                <AnimatedProgress value={progress} className="h-2.5 rounded-full" />
                {progress > 0 && (
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full bg-white/30"
                    style={{ width: `${progress}%` }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm text-gray-500">
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1, color: '#6366f1' }}
              >
                📹 {skill.videos.length}
              </motion.span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1, color: '#6366f1' }}
              >
                💡 {skill.tips.length}
              </motion.span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1, color: '#6366f1' }}
              >
                ❓ {skill.quiz.length}
              </motion.span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// Quick stats
function QuickStats({ completedItems, quizCount }: { completedItems: number; quizCount: number }) {
  const statsData = [
    { icon: CheckCircle2, color: 'green', value: completedItems, label: 'Tasks Done' },
    { icon: TrendingUp, color: 'blue', value: quizCount, label: 'Quizzes Taken' },
    { icon: Target, color: 'purple', value: skills.length, label: 'Skills to Master' },
    { icon: Award, color: 'orange', value: skills.reduce((sum, s) => sum + s.videos.length, 0), label: 'Training Videos' },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statsData.map((stat) => {
        const IconComponent = stat.icon;

        return (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={`p-2 rounded-lg`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    animate={floatingAnimation}
                    style={{ backgroundColor: `${stat.color === 'green' ? '#dcfce7' : stat.color === 'blue' ? '#dbeafe' : stat.color === 'purple' ? '#f3e8ff' : '#ffedd5'}` }}
                  >
                    <IconComponent className={`w-5 h-5`} style={{ color: stat.color === 'green' ? '#16a34a' : stat.color === 'blue' ? '#2563eb' : stat.color === 'purple' ? '#9333ea' : '#ea580c' }} />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={stat.value} duration={1} />
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function SoftSkillsPage() {
  const { 
    overallScore, 
    skillScores, 
    completedChecklist, 
    quizResults,
    getQuizResult 
  } = useSoftSkills();

  const totalCompletedItems = Object.values(completedChecklist).reduce(
    (sum, items) => sum + items.length, 
    0
  );
  const quizCount = Object.keys(quizResults).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <motion.span
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎯
            </motion.span>
            Soft Skills Training
            <motion.span
              className="inline-block text-sm font-normal bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(99, 102, 241, 0.4)",
                  "0 0 0 10px rgba(99, 102, 241, 0)",
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Pro
            </motion.span>
          </h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Build interview-winning soft skills through structured learning and practice.
          </motion.p>
        </motion.div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <OverallScoreCard score={overallScore} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-transparent to-purple-50/50 animate-shimmer" />
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    ✨
                  </motion.span>
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 relative">
                {[
                  { num: 1, text: "Choose a skill to focus on", emoji: "🎯" },
                  { num: 2, text: "Watch videos & apply tips", emoji: "📺" },
                  { num: 3, text: "Complete checklist items", emoji: "✅" },
                  { num: 4, text: "Take quiz to test yourself", emoji: "🧠" }
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    className="flex items-start gap-2 group cursor-default"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <motion.span 
                      className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.num}
                    </motion.span>
                    <span className="group-hover:text-indigo-600 transition-colors duration-200">
                      {step.text}
                    </span>
                    <motion.span
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {step.emoji}
                    </motion.span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <QuickStats completedItems={totalCompletedItems} quizCount={quizCount} />

        {/* Skills Grid */}
        <div className="mb-6">
          <motion.h2 
            className="text-lg font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Skills to Master
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skills.map(skill => {
              const quizResult = getQuizResult(skill.id);

              return (
                <motion.div key={skill.id} variants={itemVariants}>
                  <SkillCard
                    skill={skill}
                    progress={skillScores[skill.id] || 0}
                    quizLevel={quizResult?.level || null}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                📚 Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.a 
                  href="/pdfs/SoftSkill.pdf" 
                  target="_blank" 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Soft Skills PDF</p>
                    <p className="text-xs text-gray-500">Comprehensive guide</p>
                  </div>
                </motion.a>
                <motion.a 
                  href="/pdfs/InterviewGuide.pdf" 
                  target="_blank" 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Interview Guide</p>
                    <p className="text-xs text-gray-500">Complete preparation</p>
                  </div>
                </motion.a>
                <motion.a 
                  href="/pdfs/SoftskillsWorkbook.pdf" 
                  target="_blank" 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Skills Workbook</p>
                    <p className="text-xs text-gray-500">Practice exercises</p>
                  </div>
                </motion.a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


