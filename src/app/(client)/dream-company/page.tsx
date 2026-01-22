"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Building2, CheckCircle2, FileText, ScrollText, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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
  y: [0, -8, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
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

interface Company {
  name: string;
  slug: string;
  description: string;
  logoPath: string;
  resourceCount: number;
}

// Company-specific metadata for professional display
const COMPANY_METADATA: Record<string, { 
  focus: string; 
  prepTime: string; 
  contentTypes: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  idealFor: string;
}> = {
  'accenture': { focus: 'Aptitude + Communication', prepTime: '5–7 days', contentTypes: ['Aptitude', 'Technical', 'Previous Papers'], difficulty: 'Medium', idealFor: 'Freshers & Non-CS' },
  'capgemini': { focus: 'Logical + Technical', prepTime: '6–8 days', contentTypes: ['Aptitude', 'Technical', 'Previous Papers'], difficulty: 'Medium', idealFor: 'Strong Aptitude' },
  'cognizant': { focus: 'Aptitude + Coding', prepTime: '5–6 days', contentTypes: ['Aptitude', 'Technical', 'Previous Papers'], difficulty: 'Easy', idealFor: 'Freshers' },
  'infosys': { focus: 'Aptitude + Verbal', prepTime: '5–7 days', contentTypes: ['Aptitude', 'Verbal', 'Previous Papers'], difficulty: 'Medium', idealFor: 'Non-CS & Freshers' },
  'tcs': { focus: 'Aptitude + Verbal', prepTime: '6–8 days', contentTypes: ['Aptitude', 'Verbal', 'Previous Papers'], difficulty: 'Hard', idealFor: 'Strong Aptitude' },
  'wipro': { focus: 'Technical + Aptitude', prepTime: '5–6 days', contentTypes: ['Aptitude', 'Technical', 'Previous Papers'], difficulty: 'Easy', idealFor: 'Freshers' },
};

// Map company slugs to actual logo filenames in /public/company-logos/
const COMPANY_LOGO_MAP: Record<string, string> = {
  'accenture': 'ACN_BIG.png',
  'capgemini': 'CAP.PA_BIG.png', 
  'cognizant': 'CTSH_BIG.png',
  'infosys': 'INFY_BIG.png',
  'tcs': 'TCS.NS_BIG.png',
  'wipro': 'WIT.png',
};

export default function DreamCompanyStationPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/dream-company');
        const companiesData = await response.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const getLogoPath = (slug: string): string | null => {
    const logoFile = COMPANY_LOGO_MAP[slug.toLowerCase()];
    return logoFile ? `/company-logos/${logoFile}` : null;
  };

  const handleLogoError = (slug: string) => {
    setLogoErrors(prev => new Set(prev).add(slug));
  };

  const handleCompanyClick = (companySlug: string) => {
    router.push(`/dream-company/${companySlug}`);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
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
            Loading companies...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header Section - Strengthened */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl relative"
              animate={floatingAnimation}
            >
              <Building2 className="h-8 w-8 text-blue-600" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Dream Company Station
                <motion.span
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏢
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Prepare exactly what companies ask in real campus placements.
              </motion.p>
            </div>
          </div>
          
          {/* Value Proposition Bullets */}
          <motion.div 
            className="ml-16 mt-4 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              "Company-specific preparation materials",
              "Previous year questions & patterns", 
              "Aptitude + Technical + Verbal coverage"
            ].map((text, idx) => (
              <motion.div 
                key={text}
                className="flex items-center gap-2 text-sm text-gray-600"
                variants={cardVariants}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                </motion.div>
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Compact Stats Row */}
        <motion.div 
          className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
              <Building2 className="h-4 w-4 text-blue-600" />
            </motion.div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold"><AnimatedNumber value={companies.length} /></span> Companies
            </span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <FileText className="h-4 w-4 text-green-600" />
            </motion.div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold">
                <AnimatedNumber value={companies.reduce((total, company) => total + company.resourceCount, 0)} />+
              </span> Resources
            </span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={floatingAnimation}>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </motion.div>
            <span className="text-sm text-gray-700">Updated for <span className="font-semibold">2025</span> placements</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Company Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {companies.map((company, index) => {
            const logoPath = getLogoPath(company.slug);
            const hasLogoError = logoErrors.has(company.slug);
            const showLogo = logoPath && !hasLogoError;

            return (
              <motion.div
                key={company.slug}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className="border border-gray-200 group cursor-pointer hover:border-blue-300 hover:shadow-xl transition-all duration-200 overflow-hidden relative"
                  onClick={() => handleCompanyClick(company.slug)}
                >
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    {/* Company Logo Container */}
                    <motion.div 
                      className="w-16 h-16 relative bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden p-2 flex-shrink-0"
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {showLogo ? (
                        <Image 
                          src={logoPath}
                          alt={`${company.name} Logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          onError={() => handleLogoError(company.slug)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center text-white font-bold text-xl">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </CardTitle>
                      <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">
                        {company.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Metadata Tags */}
                  {COMPANY_METADATA[company.slug] && (
                    <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100">
                      <motion.span 
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          COMPANY_METADATA[company.slug].difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                          COMPANY_METADATA[company.slug].difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {COMPANY_METADATA[company.slug].difficulty}
                      </motion.span>
                      <motion.span 
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded"
                        whileHover={{ scale: 1.1 }}
                      >
                        {COMPANY_METADATA[company.slug].idealFor}
                      </motion.span>
                    </div>
                  )}
                  
                  {/* Content Type Indicators */}
                  {COMPANY_METADATA[company.slug] && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {COMPANY_METADATA[company.slug].contentTypes.map((type, idx) => (
                        <motion.span 
                          key={type} 
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          {type}
                        </motion.span>
                      ))}
                      <motion.span 
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-medium"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📄 {company.resourceCount} PDFs
                      </motion.span>
                    </div>
                  )}

                  <motion.div 
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors text-center flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Resources
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {companies.length === 0 && !loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div animate={floatingAnimation}>
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
            <p className="text-gray-600">
              No company resources were found in the Dream Company Station folder.
            </p>
          </motion.div>
        )}

        {/* 7-Day Preparation Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-10 border border-gray-200 bg-white shadow-sm overflow-hidden relative">
            {/* Animated background dots */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${20 + (i % 3) * 30}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ScrollText className="h-5 w-5 text-blue-600" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900">
                  7-Day Preparation Plan
                </h3>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  📅
                </motion.span>
              </div>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { day: "Day 1–2", task: "Aptitude basics (Quant + Logical)", emoji: "📊" },
                  { day: "Day 3", task: "Logical reasoning patterns", emoji: "🧩" },
                  { day: "Day 4–5", task: "Technical fundamentals (DSA, DBMS, OS)", emoji: "💻" },
                  { day: "Day 6", task: "Previous year papers practice", emoji: "📝" },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.day}
                    className="flex items-center gap-3 py-2 border-b border-gray-100"
                    variants={cardVariants}
                    whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  >
                    <span className="text-xs font-medium text-blue-600 w-16">{item.day}</span>
                    <span className="text-gray-700">{item.task}</span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    >
                      {item.emoji}
                    </motion.span>
                  </motion.div>
                ))}
                <motion.div 
                  className="flex items-center gap-3 py-2 md:col-span-2"
                  variants={cardVariants}
                  whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  <span className="text-xs font-medium text-blue-600 w-16">Day 7</span>
                  <span className="text-gray-700">Revision + Mock tests</span>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🎯
                  </motion.span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Signal */}
        <motion.p 
          className="text-center text-xs text-gray-500 mt-6 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Resources curated from previous year patterns and campus feedback. ✨
        </motion.p>
      </div>
    </div>
  );
}
