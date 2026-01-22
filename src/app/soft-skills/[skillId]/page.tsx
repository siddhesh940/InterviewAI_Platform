/* eslint-disable newline-before-return */
"use client";

/* eslint-disable @next/next/no-img-element */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSoftSkills } from '@/contexts/SoftSkillsContext';
import { getSkillById, Skill, skillLevelConfig } from '@/data/soft-skills-data';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Ear,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Lightbulb,
  MessageCircle,
  Play,
  PlayCircle,
  RotateCcw,
  User,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Confetti burst animation for checkbox

// Shimmer effect for cards
const shimmerVariants = {
  hidden: { x: '-100%' },
  visible: { 
    x: '100%',
    transition: { 
      repeat: Infinity, 
      duration: 2, 
      ease: "linear",
      repeatDelay: 3
    }
  }
};

// Animated Progress component
function AnimatedProgress({ value, className, delay = 0 }: { value: number; className?: string; delay?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <div ref={ref}>
      <Progress 
        value={animatedValue} 
        className={`${className} transition-all duration-700 ease-out`} 
      />
    </div>
  );
}

// Animated Counter component
function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
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

// Helper function to format seconds to mm:ss
const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) {
    return '--:--';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

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
function Breadcrumb({ skillName }: { skillName: string }) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <Link href="/soft-skills" className="hover:text-indigo-600 transition-colors">
        Soft Skills
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="text-gray-900 font-medium">{skillName}</span>
    </nav>
  );
}

// Video section with progress tracking
function VideoSection({ videos, skillId }: { videos: Skill['videos']; skillId: string }) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoDurations, setVideoDurations] = useState<Record<string, number>>({});
  const { markVideoWatched, isVideoWatched } = useSoftSkills();
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Mark video as watched when it's played
  const handleVideoPlay = (videoId: string) => {
    markVideoWatched(skillId, videoId);
  };

  // Handle metadata loaded for main video
  const handleLoadedMetadata = useCallback((videoId: string, duration: number) => {
    setVideoDurations(prev => ({
      ...prev,
      [videoId]: duration
    }));
  }, []);

  if (videos.length === 0) {return null;}

  const watchedCount = videos.filter(v => isVideoWatched(skillId, v.id)).length;

  // Get duration for a video (from metadata or show loading)
  const getDuration = (videoId: string): string => {
    const duration = videoDurations[videoId];
    return duration ? formatDuration(duration) : '--:--';
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                Training Videos
              </CardTitle>
              <CardDescription>Watch and learn key techniques</CardDescription>
            </div>
            <Badge variant={watchedCount === videos.length ? "default" : "secondary"} className="text-xs">
              {watchedCount}/{videos.length} watched
            </Badge>
          </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hidden video elements to preload metadata for all videos */}
          <div className="hidden">
            {videos.map((video) => (
              <video
                key={`meta-${video.id}`}
                src={video.src}
                preload="metadata"
                ref={(el) => { hiddenVideoRefs.current[video.id] = el; }}
                onLoadedMetadata={(e) => {
                  const target = e.target as HTMLVideoElement;
                  handleLoadedMetadata(video.id, target.duration);
                }}
              />
            ))}
          </div>

          {/* Main video player */}
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            <video 
              ref={mainVideoRef}
              src={videos[activeVideo].src} 
              className="w-full h-full object-contain"
              preload="metadata"
              controls={true}
              onPlay={() => handleVideoPlay(videos[activeVideo].id)}
              onLoadedMetadata={(e) => {
                const target = e.target as HTMLVideoElement;
                handleLoadedMetadata(videos[activeVideo].id, target.duration);
              }}
            />
          </div>
          
          {/* Video info */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                {videos[activeVideo].title}
                {isVideoWatched(skillId, videos[activeVideo].id) && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{videos[activeVideo].description}</p>
            </div>
            <Badge variant="secondary">{getDuration(videos[activeVideo].id)}</Badge>
          </div>

          {/* Video list */}
          {videos.length > 1 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">More Videos</p>
              <div className="space-y-2">
                {videos.map((video, index) => {
                  const watched = isVideoWatched(skillId, video.id);

                  return (
                    <button
                      key={video.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeVideo === index
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => setActiveVideo(index)}
                    >
                      <div className={`p-2 rounded-full ${
                        watched ? 'bg-green-100' : activeVideo === index ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        {watched ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Play className={`w-4 h-4 ${activeVideo === index ? 'text-indigo-600' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          watched ? 'text-green-600' : activeVideo === index ? 'text-indigo-600' : 'text-gray-900'
                        }`}>
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500">{getDuration(video.id)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

// Tips section with actionable buttons
function TipsSection({ tips }: { tips: Skill['tips']; skillId: string }) {
  const { markTipApplied, saveTipForLater, isTipApplied, isTipSaved } = useSoftSkills();

  const categoryColors = {
    actionable: 'bg-green-100 text-green-700',
    mindset: 'bg-purple-100 text-purple-700',
    practice: 'bg-blue-100 text-blue-700',
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Actionable Tips
          </CardTitle>
          <CardDescription>Apply these in your next interview</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tips.map((tip) => {
              const applied = isTipApplied(tip.id);
              const saved = isTipSaved(tip.id);

              return (
                <motion.div
                  key={tip.id}
                  variants={itemVariants}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    applied ? 'bg-green-50 border-green-200' : 'bg-white hover:border-gray-300'
                  }`}
                  layout
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[tip.category]}`}>
                          {tip.category}
                        </span>
                        <AnimatePresence>
                          {applied && (
                            <motion.span 
                              className="text-xs font-medium text-green-600 flex items-center gap-1"
                              initial={{ opacity: 0, scale: 0.8, x: -10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8, x: 10 }}
                              transition={{ duration: 0.3, type: "spring" }}
                            >
                              <motion.span
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 0.5 }}
                              >
                                <Check className="w-3 h-3" />
                              </motion.span>
                              Applied
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className={`text-gray-700 transition-all duration-300 ${applied ? 'line-through opacity-70' : ''}`}>
                        {tip.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="relative"
                    >
                      <Button
                        variant={applied ? "secondary" : "default"}
                        size="sm"
                        className={`text-xs transition-all duration-300 ${!applied ? 'shadow-md hover:shadow-lg' : ''}`}
                        onClick={() => markTipApplied(tip.id)}
                      >
                        {applied ? (
                          <>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                            </motion.div>
                            Applied
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Circle className="w-3 h-3 mr-1" />
                            </motion.div>
                            Mark Applied
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs transition-all duration-200"
                        onClick={() => saveTipForLater(tip.id)}
                      >
                        {saved ? (
                          <>
                            <BookmarkCheck className="w-3 h-3 mr-1 text-indigo-600" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3 h-3 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Image/Visual section
function ImageSection({ images }: { images: Skill['images'] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {return null;}

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-500" />
            Visual Guide
          </CardTitle>
          <CardDescription>Click to view full size</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer group"
                onClick={() => setSelectedImage(image.src)}
              >
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt="Full view" 
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

// Progress Summary Card with weighted breakdown
function ProgressSummaryCard({ skill }: { skill: Skill }) {
  const { 
    watchedVideos, 
    completedChecklist, 
    isQuizCompleted, 
    getWeightedSkillProgress 
  } = useSoftSkills();

  const skillWatchedVideos = watchedVideos[skill.id] || [];
  const skillCompletedChecklist = completedChecklist[skill.id] || [];
  const quizDone = isQuizCompleted(skill.id);
  const totalProgress = getWeightedSkillProgress(skill.id);

  const videoProgress = skill.videos.length > 0 
    ? Math.round((skillWatchedVideos.length / skill.videos.length) * 100) 
    : 100;
  const checklistProgress = skill.checklist.length > 0 
    ? Math.round((skillCompletedChecklist.length / skill.checklist.length) * 100) 
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-100 overflow-hidden relative">
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          style={{ skewX: -20 }}
        />
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ⭐
            </motion.div>
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {/* Overall Progress */}
          <div className="text-center py-4">
            <motion.div 
              className="text-5xl font-bold text-indigo-600 relative inline-block"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 150 }}
            >
              <AnimatedCounter value={totalProgress} duration={1.5} />%
              {totalProgress >= 50 && (
                <motion.span
                  className="absolute -top-2 -right-4 text-2xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔥
                </motion.span>
              )}
            </motion.div>
            <motion.p 
              className="text-sm text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Skill Mastery
            </motion.p>
          </div>
          <AnimatedProgress value={totalProgress} className="h-3" delay={150} />

          {/* Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-500" />
                <span className="text-gray-600">Videos</span>
              </div>
              <span className="font-medium text-gray-900">
                {skillWatchedVideos.length}/{skill.videos.length}
              </span>
            </div>
            <AnimatedProgress value={videoProgress} className="h-1.5" delay={200} />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Checklist</span>
              </div>
              <span className="font-medium text-gray-900">
                {skillCompletedChecklist.length}/{skill.checklist.length}
              </span>
            </div>
            <AnimatedProgress value={checklistProgress} className="h-1.5" delay={250} />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Quiz</span>
              </div>
              <span className={`font-medium ${quizDone ? 'text-green-600' : 'text-gray-400'}`}>
                {quizDone ? 'Completed' : 'Not taken'}
              </span>
            </div>
            <AnimatedProgress value={quizDone ? 100 : 0} className="h-1.5" delay={300} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Checklist section with persistence
function ChecklistSection({ checklist, skillId }: { checklist: Skill['checklist']; skillId: string }) {
  const { toggleChecklistItem, isChecklistItemCompleted, getSkillChecklistProgress } = useSoftSkills();
  const progress = getSkillChecklistProgress(skillId);

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  };

  const priorityLabels = {
    high: 'Essential',
    medium: 'Recommended',
    low: 'Nice to have',
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" />
                Practice Checklist
              </CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </div>
            <div className="text-right">
              <motion.span 
                className="text-2xl font-bold text-gray-900"
                key={progress}
                initial={{ scale: 1.2, color: '#4f46e5' }}
                animate={{ scale: 1, color: '#111827' }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedCounter value={progress} />%
              </motion.span>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
          <AnimatedProgress value={progress} className="h-2 mt-2" delay={100} />
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {checklist.map((item) => {
              const isCompleted = isChecklistItemCompleted(skillId, item.id);

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    priorityColors[item.priority]
                  } ${isCompleted ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}
                  whileHover={{ x: 6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  onClick={() => toggleChecklistItem(skillId, item.id)}
                >
                  {/* Success ripple effect */}
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 bg-green-200 rounded-lg"
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformOrigin: 'left center' }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    animate={isCompleted ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : { scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 45 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <div className="flex-1 relative">
                    <motion.p 
                      className={`text-sm transition-all duration-300 ${isCompleted ? 'text-gray-500' : 'text-gray-700'}`}
                      animate={isCompleted ? { x: [0, 5, 0] } : {}}
                    >
                      {isCompleted && <span className="line-through">{item.text}</span>}
                      {!isCompleted && item.text}
                    </motion.p>
                    <span className="text-xs text-gray-400 mt-1">{priorityLabels[item.priority]}</span>
                  </div>
                  
                  {/* Completion badge */}
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="text-green-500 text-xs font-medium"
                      >
                        ✓ Done
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quiz section with feedback
function QuizSection({ quiz, skillId, skillName }: { quiz: Skill['quiz']; skillId: string; skillName: string }) {
  const { submitQuizResult, getQuizResult } = useSoftSkills();
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const previousResult = getQuizResult(skillId);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    return correct;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    submitQuizResult(skillId, score, quiz.length);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setIsQuizMode(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  // Results view
  if (showResults) {
    const score = calculateScore();
    const result = getQuizResult(skillId);
    const levelConfig = result ? skillLevelConfig[result.level] : null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            {/* Score Display */}
            <div className="mb-6">
              <div className="text-5xl font-bold mb-2" style={{ color: levelConfig?.color }}>
                {score}/{quiz.length}
              </div>
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${levelConfig?.color}20`,
                  color: levelConfig?.color 
                }}
              >
                {levelConfig?.label}
              </div>
              <p className="text-gray-600 mt-3">{levelConfig?.description}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Recommended Next Steps:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {score < quiz.length * 0.5 && (
                  <>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                      <span>Watch the training videos again to reinforce concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                      <span>Focus on applying the tips in practice interviews</span>
                    </li>
                  </>
                )}
                {score >= quiz.length * 0.5 && score < quiz.length * 0.8 && (
                  <>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                      <span>Complete remaining checklist items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                      <span>Practice with a friend or record yourself</span>
                    </li>
                  </>
                )}
                {score >= quiz.length * 0.8 && (
                  <>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Great job! Move on to other skills to round out your abilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>Help others by sharing what you&apos;ve learned</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Review Answers */}
            <div className="text-left mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Review Your Answers:</h4>
              <div className="space-y-3">
                {quiz.map((q, i) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div key={q.id} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {i + 1}. {q.question}
                      </p>
                      <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {userAnswer}
                        {!isCorrect && <span className="text-gray-600"> → Correct: {q.correctAnswer}</span>}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button className="gap-2" onClick={resetQuiz}>
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz mode
  if (isQuizMode) {
    const question = quiz[currentQuestion];
    const isAnswered = !!answers[question.id];

    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </motion.div>
              {skillName} Quiz
            </CardTitle>
            <motion.span 
              className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm"
              key={currentQuestion}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              Question {currentQuestion + 1} of {quiz.length}
            </motion.span>
          </div>
          <Progress value={((currentQuestion + 1) / quiz.length) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div 
            className="py-4"
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-start gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-sm font-bold flex-shrink-0">
                Q{currentQuestion + 1}
              </span>
              {question.question}
            </h3>
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {question.options.map((option, index) => (
                <motion.button
                  key={option}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all relative overflow-hidden ${
                    answers[question.id] === option
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(question.id, option)}
                >
                  {answers[question.id] === option && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      answers[question.id] === option
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {answers[question.id] === option && (
                      <motion.span
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex justify-between pt-4 border-t">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              >
                Previous
              </Button>
            </motion.div>
            {currentQuestion === quiz.length - 1 ? (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                animate={Object.keys(answers).length >= quiz.length ? {
                  boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.5)", "0 0 0 10px rgba(99, 102, 241, 0)", "0 0 0 0 rgba(99, 102, 241, 0)"]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Button
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  disabled={Object.keys(answers).length < quiz.length}
                  onClick={handleSubmit}
                >
                  🎯 Submit Quiz
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="gap-2"
                  disabled={!isAnswered}
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz start view
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Self-Assessment Quiz
          </CardTitle>
          <CardDescription>Test your understanding of {skillName}</CardDescription>
        </CardHeader>
        <CardContent>
          {previousResult ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="text-sm text-gray-600">Previous Score</p>
                <p className="text-xl font-bold">{previousResult.score}/{previousResult.total}</p>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${skillLevelConfig[previousResult.level].color}20`,
                  color: skillLevelConfig[previousResult.level].color 
                }}
              >
                {skillLevelConfig[previousResult.level].label}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg mb-4 text-center">
              <p className="text-blue-700">You haven&apos;t taken this quiz yet</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-4">{quiz.length} questions • ~3 minutes</p>
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="inline-block"
            >
              <Button className="gap-2" onClick={() => setIsQuizMode(true)}>
                {previousResult ? 'Retake Quiz' : 'Start Quiz'}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main skill detail page
export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.skillId as string;
  const skill = getSkillById(skillId);

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Skill Not Found</h1>
          <p className="text-gray-600 mb-6">The skill you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/soft-skills">
            <Button>Back to Soft Skills</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[skill.icon] || MessageCircle;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        <Breadcrumb skillName={skill.name} />

        {/* Header */}
        <motion.div 
          className="flex items-start gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div 
            className="p-3 rounded-xl" 
            style={{ backgroundColor: `${skill.color}15` }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent 
              className="w-8 h-8" 
              style={{ color: skill.color }} 
            />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{skill.name}</h1>
            <p className="text-gray-600">{skill.description}</p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <VideoSection videos={skill.videos} skillId={skill.id} />
            <TipsSection tips={skill.tips} skillId={skill.id} />
            <ImageSection images={skill.images} />
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <ProgressSummaryCard skill={skill} />
            <ChecklistSection checklist={skill.checklist} skillId={skill.id} />
            <QuizSection quiz={skill.quiz} skillId={skill.id} skillName={skill.name} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
