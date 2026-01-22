"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Building2, CheckCircle, Code2, Download, Eye, FileText, Pin, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

interface PDFFile {
  name: string;
  displayName: string;
}

interface CompanyData {
  name: string;
  slug: string;
  description: string;
  logoPath: string;
  pdfs: PDFFile[];
  totalResources: number;
}

// Company Interview Snapshot Data
const COMPANY_SNAPSHOT: Record<string, { 
  aptitudeDifficulty: string; 
  technicalFocus: string; 
  commonRounds: string;
  whyThisCompany: string[];
  startHerePdfs: number; // Number of PDFs to mark as "Start Here"
}> = {
  'accenture': { 
    aptitudeDifficulty: 'Medium', 
    technicalFocus: 'Medium', 
    commonRounds: 'Aptitude → Communication Assessment → Technical → HR',
    whyThisCompany: ['Strong aptitude focus with communication round', 'Fresher-friendly hiring process', 'Mass recruiter — high selection chances'],
    startHerePdfs: 2
  },
  'capgemini': { 
    aptitudeDifficulty: 'Medium', 
    technicalFocus: 'High', 
    commonRounds: 'Aptitude → Technical → HR',
    whyThisCompany: ['Heavy technical + pseudo-code focus', 'Good for CS/IT students', 'Emphasis on logical reasoning'],
    startHerePdfs: 2
  },
  'cognizant': { 
    aptitudeDifficulty: 'Easy', 
    technicalFocus: 'Medium', 
    commonRounds: 'Aptitude → Coding → Technical → HR',
    whyThisCompany: ['Easier aptitude — great for first-timers', 'Coding round uses basic DSA', 'Open to non-CS branches'],
    startHerePdfs: 2
  },
  'infosys': { 
    aptitudeDifficulty: 'Medium', 
    technicalFocus: 'Low', 
    commonRounds: 'Aptitude → Verbal → Technical → HR',
    whyThisCompany: ['Strong verbal + reasoning focus', 'Low technical depth required', 'Best for non-CS & freshers'],
    startHerePdfs: 2
  },
  'tcs': { 
    aptitudeDifficulty: 'Hard', 
    technicalFocus: 'Medium', 
    commonRounds: 'NQT (Aptitude + Verbal) → Technical → HR',
    whyThisCompany: ['NQT is competitive — needs strong prep', 'Verbal section is crucial', 'India\'s largest IT recruiter'],
    startHerePdfs: 3
  },
  'wipro': { 
    aptitudeDifficulty: 'Easy', 
    technicalFocus: 'Medium', 
    commonRounds: 'Aptitude → Coding → Technical → HR',
    whyThisCompany: ['Easier aptitude cutoffs', 'Basic coding (Turbo/Elite tracks)', 'Open to all branches'],
    startHerePdfs: 2
  },
};

export default function CompanyResourcePage() {
  const router = useRouter();
  const params = useParams();
  const companySlug = params.companySlug as string;
  
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewedPdfs, setViewedPdfs] = useState<Set<string>>(new Set());
  const [importantPdfs, setImportantPdfs] = useState<Set<string>>(new Set());

  // Load viewed/important state from localStorage
  useEffect(() => {
    const storedViewed = localStorage.getItem(`viewed-pdfs-${companySlug}`);
    const storedImportant = localStorage.getItem(`important-pdfs-${companySlug}`);
    if (storedViewed) setViewedPdfs(new Set(JSON.parse(storedViewed)));
    if (storedImportant) setImportantPdfs(new Set(JSON.parse(storedImportant)));
  }, [companySlug]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/dream-company/${companySlug}`);
        if (response.ok) {
          const data = await response.json();
          setCompanyData(data);
        } else {
          console.error('Company not found');
          setCompanyData(null);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setCompanyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companySlug]);

  const handleView = (filename: string) => {
    const pdfPath = `/${companyData!.name}/${filename}`;
    // Mark as viewed
    const newViewed = new Set(viewedPdfs).add(filename);
    setViewedPdfs(newViewed);
    localStorage.setItem(`viewed-pdfs-${companySlug}`, JSON.stringify([...newViewed]));
    window.open(pdfPath, '_blank');
  };

  const toggleImportant = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newImportant = new Set(importantPdfs);
    if (newImportant.has(filename)) {
      newImportant.delete(filename);
    } else {
      newImportant.add(filename);
    }
    setImportantPdfs(newImportant);
    localStorage.setItem(`important-pdfs-${companySlug}`, JSON.stringify([...newImportant]));
  };

  const handleDownload = (filename: string) => {
    const pdfPath = `/${companyData!.name}/${filename}`;
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading company resources...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div animate={floatingAnimation}>
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Company Not Found</h3>
          <p className="text-gray-600 mb-4">The requested company resources could not be found.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dream-company')}>
              Back to Companies
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
              onClick={() => router.push('/dream-company')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies
            </Button>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 bg-blue-50 rounded-lg border border-blue-100 relative"
              animate={floatingAnimation}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <img 
                src={companyData.logoPath}
                alt={`${companyData.name} Logo`}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<div class="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">${companyData.name.charAt(0)}</div>`;
                }}
              />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {companyData.name} Preparation
                <motion.span
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-sm mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {companyData.totalResources} resources available
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Progress Summary Strip */}
        <motion.div 
          className="flex items-center gap-6 mb-6 py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <FileText className="h-4 w-4 text-gray-500" />
            </motion.div>
            <span className="text-sm text-gray-600">Total: <span className="font-semibold text-gray-900">{companyData.totalResources}</span></span>
          </motion.div>
          <div className="h-4 w-px bg-gray-200"></div>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </motion.div>
            <span className="text-sm text-gray-600">Viewed: <span className="font-semibold text-green-600">{viewedPdfs.size}</span></span>
          </motion.div>
          <div className="h-4 w-px bg-gray-200"></div>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Pin className="h-4 w-4 text-amber-500" />
            </motion.div>
            <span className="text-sm text-gray-600">Pinned: <span className="font-semibold text-amber-600">{importantPdfs.size}</span></span>
          </motion.div>
          <div className="h-4 w-px bg-gray-200"></div>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <motion.div animate={floatingAnimation}>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </motion.div>
            <span className="text-sm text-gray-600">Remaining: <span className="font-semibold text-blue-600">{companyData.totalResources - viewedPdfs.size}</span></span>
          </motion.div>
        </motion.div>

        {/* Company Interview Snapshot */}
        {COMPANY_SNAPSHOT[companySlug] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6 border border-blue-100 bg-blue-50/50 overflow-hidden relative">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              />
              
              <CardContent className="p-4 relative">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  Company Interview Snapshot
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    📋
                  </motion.span>
                </h3>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="flex items-center gap-2" variants={cardVariants} whileHover={{ x: 5 }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Brain className="h-4 w-4 text-purple-600" />
                    </motion.div>
                    <span className="text-gray-600">Aptitude Difficulty:</span>
                    <motion.span 
                      className={`font-medium ${
                        COMPANY_SNAPSHOT[companySlug].aptitudeDifficulty === 'Easy' ? 'text-green-600' :
                        COMPANY_SNAPSHOT[companySlug].aptitudeDifficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {COMPANY_SNAPSHOT[companySlug].aptitudeDifficulty}
                    </motion.span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2" variants={cardVariants} whileHover={{ x: 5 }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Code2 className="h-4 w-4 text-blue-600" />
                    </motion.div>
                    <span className="text-gray-600">Technical Focus:</span>
                    <motion.span 
                      className={`font-medium ${
                        COMPANY_SNAPSHOT[companySlug].technicalFocus === 'Low' ? 'text-green-600' :
                        COMPANY_SNAPSHOT[companySlug].technicalFocus === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {COMPANY_SNAPSHOT[companySlug].technicalFocus}
                    </motion.span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2" variants={cardVariants} whileHover={{ x: 5 }}>
                    <motion.div animate={floatingAnimation}>
                      <Users className="h-4 w-4 text-orange-600" />
                    </motion.div>
                    <span className="text-gray-600">Rounds:</span>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-sm text-gray-700 mt-2 pl-6 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {COMPANY_SNAPSHOT[companySlug].commonRounds}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Why This Company Section */}
        {COMPANY_SNAPSHOT[companySlug] && (
          <motion.div 
            className="mb-6 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
              Why prepare for {companyData.name}?
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💡
              </motion.span>
            </h4>
            <motion.ul 
              className="space-y-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {COMPANY_SNAPSHOT[companySlug].whyThisCompany.map((point, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start gap-2 text-sm text-gray-600"
                  variants={cardVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="text-blue-500 mt-0.5"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  >
                    •
                  </motion.span>
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {/* PDF Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {companyData.pdfs.map((pdf, index) => {
            const isViewed = viewedPdfs.has(pdf.name);
            const isImportant = importantPdfs.has(pdf.name);
            const isStartHere = COMPANY_SNAPSHOT[companySlug] && index < COMPANY_SNAPSHOT[companySlug].startHerePdfs;
            
            return (
              <motion.div
                key={pdf.name}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`border transition-all duration-200 hover:shadow-md overflow-hidden relative ${
                    isImportant ? 'border-amber-300 bg-amber-50/30' : 
                    isStartHere && !isViewed ? 'border-green-300 bg-green-50/20' :
                    'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Hover shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <CardHeader className="pb-2 pt-4 px-4 relative">
                    <div className="flex items-start gap-3">
                      <motion.div 
                        className="p-2 bg-red-50 rounded-lg flex-shrink-0"
                        animate={isStartHere && !isViewed ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <FileText className="h-5 w-5 text-red-600" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
                            {pdf.displayName}
                          </CardTitle>
                          <motion.button
                            onClick={(e) => toggleImportant(pdf.name, e)}
                            className={`flex-shrink-0 p-1 rounded transition-colors ${
                              isImportant 
                                ? 'text-amber-600 bg-amber-100' 
                                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                            title={isImportant ? 'Remove from important' : 'Mark as important'}
                            whileHover={{ scale: 1.2, rotate: isImportant ? -15 : 15 }}
                            whileTap={{ scale: 0.9 }}
                            animate={isImportant ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Pin className="h-4 w-4" />
                          </motion.button>
                        </div>
                        {/* Status indicators */}
                        <div className="flex items-center gap-2 mt-1.5">
                          {isStartHere && !isViewed && (
                            <motion.span 
                              className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-medium"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                <Sparkles className="h-3 w-3" />
                              </motion.div>
                              Start Here
                            </motion.span>
                          )}
                          {isViewed && (
                            <motion.span 
                              className="inline-flex items-center gap-1 text-xs text-green-600"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Viewed
                            </motion.span>
                          )}
                          {isImportant && (
                            <motion.span 
                              className="inline-flex items-center gap-1 text-xs text-amber-600"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Pin className="h-3 w-3" />
                              Pinned
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-4 px-4 relative">
                    <div className="flex gap-2">
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                          onClick={() => handleView(pdf.name)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View PDF
                        </Button>
                      </motion.div>
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                          size="sm"
                          onClick={() => handleDownload(pdf.name)}
                        >
                          <Download className="h-4 w-4 mr-1.5" />
                          Download
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Resources Found - Same style as Interview Resource Hub */}
        {companyData.pdfs.length === 0 && !loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div animate={floatingAnimation}>
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600">
              No PDF files were found for {companyData.name} preparation materials.
            </p>
          </motion.div>
        )}

        {/* 7-Day Preparation Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-8 border border-gray-200 bg-white shadow-sm overflow-hidden relative">
            {/* Subtle shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <CardContent className="p-5 relative">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                7-Day Prep Plan for {companyData.name}
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📅
                </motion.span>
              </h3>
              <motion.div 
                className="space-y-2 text-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { day: 'Day 1–2', task: 'Aptitude basics (Quant + Logical)', emoji: '🧮' },
                  { day: 'Day 3', task: 'Logical reasoning patterns', emoji: '🧩' },
                  { day: 'Day 4–5', task: 'Technical fundamentals (DSA, DBMS, OS)', emoji: '💻' },
                  { day: 'Day 6', task: 'Previous year papers practice', emoji: '📝' },
                  { day: 'Day 7', task: 'Revision + Mock tests', emoji: '🎯' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0"
                    variants={cardVariants}
                    whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                    />
                    <span className="text-xs font-medium text-blue-600 w-14">{item.day}</span>
                    <span className="text-gray-700 flex-1">{item.task}</span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    >
                      {item.emoji}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Signal */}
        <motion.p 
          className="text-center text-xs text-gray-500 mt-6 pb-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.span>
          Resources curated from previous year patterns and campus feedback.
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎓
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}
