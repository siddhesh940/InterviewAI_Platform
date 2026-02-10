// src/app/(client)/interview-resources/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInterviewResources } from "@/contexts/InterviewResourcesContext";
import {
    categories,
    difficultyConfig, getStats,
    PDFCategory,
    PDFResource,
    pdfResources
} from "@/data/interview-resources-data";
import { AnimatePresence, motion } from "framer-motion";
import {
    BookMarked,
    BookOpen,
    BrainCircuit,
    Clock,
    Code2,
    Database,
    Download,
    Eye,
    FileText,
    Filter,
    Globe,
    Search,
    Server,
    Star,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

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

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Floating animation for icons
const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Pulse animation for highlights
const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useState(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = end / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  });
  
  return <>{displayValue}</>;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Server,
  Database,
  BrainCircuit,
  Globe,
  BookOpen,
};

// Difficulty filter options
const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export default function InterviewResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PDFCategory | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<typeof difficultyOptions[number]>('All');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);

  const {
    toggleBookmark,
    isBookmarked,
    addToRecentlyViewed,
    getRecentlyViewedIds,
    bookmarkCount,
  } = useInterviewResources();

  const stats = getStats();
  const recentIds = getRecentlyViewedIds();

  // Filter PDFs based on all criteria
  const filteredPDFs = useMemo(() => {
    let result = [...pdfResources];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pdf =>
        pdf.title.toLowerCase().includes(query) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(query)) ||
        pdf.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(pdf => pdf.category === activeCategory);
    }

    // Difficulty filter
    if (activeDifficulty !== 'All') {
      result = result.filter(pdf => pdf.difficulty === activeDifficulty);
    }

    // Bookmarks only
    if (showBookmarksOnly) {
      result = result.filter(pdf => isBookmarked(pdf.id));
    }

    // Recent only
    if (showRecentOnly) {
      result = result.filter(pdf => recentIds.includes(pdf.id));
      // Sort by recent order
      result.sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
    }

    return result;
  }, [searchQuery, activeCategory, activeDifficulty, showBookmarksOnly, showRecentOnly, isBookmarked, recentIds]);

  const handleView = (pdf: PDFResource) => {
    addToRecentlyViewed(pdf.id);
    window.open(pdf.filePath, '_blank');
  };

  const handleDownload = (pdf: PDFResource) => {
    addToRecentlyViewed(pdf.id);
    const link = document.createElement('a');
    link.href = pdf.filePath;
    link.download = pdf.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory('all');
    setActiveDifficulty('All');
    setShowBookmarksOnly(false);
    setShowRecentOnly(false);
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'all' || activeDifficulty !== 'All' || showBookmarksOnly || showRecentOnly;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-2">
            <motion.div 
              className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={floatingAnimation}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <BookOpen className="h-7 w-7 text-white relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Interview Resource Hub
                <motion.span 
                  className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full"
                  animate={pulseAnimation}
                >
                  ✨ {stats.totalPDFs} PDFs
                </motion.span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {stats.totalPDFs} curated PDFs across {stats.totalCategories} categories
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: FileText, color: 'blue', value: stats.totalPDFs, label: 'Total PDFs' },
            { icon: Star, color: 'amber', value: bookmarkCount, label: 'Bookmarked' },
            { icon: Clock, color: 'purple', value: recentIds.length, label: 'Recently Viewed' },
            { icon: Filter, color: 'green', value: filteredPDFs.length, label: 'Showing' },
          ].map((stat, index) => {
            const IconComp = stat.icon;
            const bgColors: Record<string, string> = {
              blue: 'bg-blue-50 dark:bg-blue-900/30',
              amber: 'bg-amber-50 dark:bg-amber-900/30',
              purple: 'bg-purple-50 dark:bg-purple-900/30',
              green: 'bg-green-50 dark:bg-green-900/30',
            };
            const iconColors: Record<string, string> = {
              blue: 'text-blue-600 dark:text-blue-400',
              amber: 'text-amber-500 dark:text-amber-400',
              purple: 'text-purple-600 dark:text-purple-400',
              green: 'text-green-600 dark:text-green-400',
            };
            const emojis: Record<string, string> = {
              blue: '📚',
              amber: '⭐',
              purple: '👁️',
              green: '🎯',
            };
            return (
              <motion.div 
                key={stat.label} 
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/50 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-4 relative">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`p-2.5 rounded-xl ${bgColors[stat.color]} relative`}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ 
                          y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                          scale: { type: "spring", stiffness: 400 }
                        }}
                      >
                        <IconComp className={`h-5 w-5 ${iconColors[stat.color]}`} />
                      </motion.div>
                      <div>
                        <motion.p 
                          className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1"
                          key={stat.value}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, type: "spring" }}
                        >
                          {stat.value}
                          {stat.value > 0 && (
                            <motion.span 
                              className="text-sm"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {emojis[stat.color]}
                            </motion.span>
                          )}
                        </motion.p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="mb-6 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, tag, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({stats.totalPDFs})
              </button>
              {categories.map((cat) => {
                const IconComp = categoryIcons[cat.icon] || FileText;
                const count = stats.byCategory.find(c => c.id === cat.id)?.count || 0;
                return (
                  <button
                    key={cat.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      activeCategory === cat.id
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: activeCategory === cat.id ? cat.color : undefined,
                    }}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <IconComp className="h-4 w-4" />
                    <span className="hidden sm:inline">{cat.name}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Difficulty:</span>
                <div className="flex gap-1">
                  {difficultyOptions.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setActiveDifficulty(diff)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        activeDifficulty === diff
                          ? diff === 'All'
                            ? 'bg-gray-900 text-white'
                            : ''
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={
                        activeDifficulty === diff && diff !== 'All'
                          ? {
                              backgroundColor: difficultyConfig[diff as keyof typeof difficultyConfig].bgColor,
                              color: difficultyConfig[diff as keyof typeof difficultyConfig].color,
                            }
                          : undefined
                      }
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-4 w-px bg-gray-200" />

              {/* Bookmark Toggle */}
              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showBookmarksOnly
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star className={`h-4 w-4 ${showBookmarksOnly ? 'fill-amber-500' : ''}`} />
                Bookmarks
              </button>

              {/* Recent Toggle */}
              <button
                onClick={() => setShowRecentOnly(!showRecentOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showRecentOnly
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock className="h-4 w-4" />
                Recent
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Results Info */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Showing {filteredPDFs.length} of {stats.totalPDFs} resources
              {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* PDF Grid */}
        {filteredPDFs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${activeCategory}-${activeDifficulty}-${showBookmarksOnly}-${showRecentOnly}`}
          >
            {filteredPDFs.map((pdf, index) => (
              <motion.div key={pdf.id} variants={cardVariants}>
                <PDFCard
                  pdf={pdf}
                  isBookmarked={isBookmarked(pdf.id)}
                  isRecent={recentIds.includes(pdf.id)}
                  onToggleBookmark={() => toggleBookmark(pdf.id)}
                  onView={() => handleView(pdf)}
                  onDownload={() => handleDownload(pdf)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-500 mb-4">
              {showBookmarksOnly
                ? "You haven't bookmarked any PDFs yet."
                : showRecentOnly
                ? "You haven't viewed any PDFs yet."
                : "Try adjusting your search or filters."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Footer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border dark:border-gray-700 shadow-sm overflow-hidden">
            <CardContent className="p-8 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <motion.div 
                  className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookMarked className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Your Interview Preparation Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
                  Bookmark resources, track your progress, and ace your next technical interview
                  with our comprehensive collection of preparation materials.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// PDF Card Component
function PDFCard({
  pdf,
  isBookmarked,
  isRecent,
  onToggleBookmark,
  onView,
  onDownload,
}: {
  pdf: PDFResource;
  isBookmarked: boolean;
  isRecent: boolean;
  onToggleBookmark: () => void;
  onView: () => void;
  onDownload: () => void;
}) {
  const category = categories.find(c => c.id === pdf.category);
  const IconComp = category ? categoryIcons[category.icon] || FileText : FileText;
  const diffConfig = difficultyConfig[pdf.difficulty];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <div 
        className="h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-xl relative"
        style={{ 
          border: '2px solid #d1d5db',
          borderTopWidth: '4px',
          borderTopColor: category?.color || '#6b7280'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#34d399';
          e.currentTarget.style.borderTopColor = category?.color || '#6b7280';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.borderTopColor = category?.color || '#6b7280';
        }}
      >
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        <div className="p-0 h-full flex flex-col relative">
          <div className="p-4 flex flex-col flex-1">
            {/* Top row: Icon, badges, bookmark */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2.5 rounded-xl transition-colors relative overflow-hidden"
                  style={{ backgroundColor: category?.bgColor || '#f3f4f6' }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Icon glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: category?.color || '#6b7280' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                  />
                  <IconComp
                    className="h-5 w-5 relative z-10"
                    style={{ color: category?.color || '#6b7280' }}
                  />
                </motion.div>
                <div className="flex flex-col gap-1">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0 h-5 font-medium"
                      style={{
                        backgroundColor: diffConfig.bgColor,
                        color: diffConfig.color,
                      }}
                    >
                      {pdf.difficulty}
                    </Badge>
                  </motion.div>
                  <AnimatePresence>
                    {isRecent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -10 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400">
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                          </motion.span>
                          Recent
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark();
                }}
                className={`p-2.5 rounded-xl transition-all relative overflow-hidden ${
                  isBookmarked
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.15, rotate: isBookmarked ? 0 : 15 }}
                whileTap={{ scale: 0.85 }}
                animate={isBookmarked ? { 
                  scale: [1, 1.4, 1],
                  rotate: [0, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.4 }}
              >
                {isBookmarked && (
                  <motion.div
                    className="absolute inset-0 bg-amber-300/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 2, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <Star className={`h-4 w-4 transition-all relative z-10 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </motion.button>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
              {pdf.title}
              <motion.span
                className="inline-block ml-1 opacity-0 group-hover:opacity-100"
                initial={{ x: -5 }}
                whileHover={{ x: 0 }}
              >
                →
              </motion.span>
            </h3>

            {/* Description */}
            {pdf.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {pdf.description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pdf.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 cursor-default transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Spacer to push actions to bottom */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              <motion.div
                className="flex-1"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-lg transition-all duration-200 gap-1.5"
                  onClick={onView}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.span>
                  View
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-emerald-300 transition-all duration-200 gap-1.5"
                  onClick={onDownload}
                >
                  <motion.span
                    whileHover={{ y: [0, 2, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    <Download className="h-4 w-4" />
                  </motion.span>
                  Download
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
