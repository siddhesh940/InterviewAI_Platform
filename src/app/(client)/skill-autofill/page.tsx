"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_COLORS, CATEGORY_ORDER, SkillCategory } from "@/data/skills-database";
import {
    ExtractedSkill,
    formatSkillsForResumeBuilder,
    getSkillStats,
    groupSkillsByCategory,
    processSkillExtraction,
} from "@/lib/skill-extraction";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    FileText,
    Lightbulb,
    Loader2,
    Pencil,
    Plus,
    Sparkles,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Step = "input" | "review" | "complete";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const floatingAnimation = {
  y: [0, -6, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

export default function SkillAutofillPage() {
  const router = useRouter();
  
  // Step state
  const [currentStep, setCurrentStep] = useState<Step>('input');
  
  // Input state
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Results state
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editedSkillName, setEditedSkillName] = useState('');
  const [showMissing, setShowMissing] = useState(true);
  
  // Manual skill addition
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Programming Languages');

  // Handle PDF upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    
    // Check file type
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      setUploadError('Please upload a PDF file');

      return;
    }
    
    setUploadError(null);
    setIsProcessing(true);
    
    try {
      // Use API route to extract PDF text
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file:', file.name, file.type, file.size);
      
      const response = await fetch('/api/extract-pdf-text', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text');
      }
      
      if (data.text && data.text.trim()) {
        setResumeText(data.text);
        setUploadError(null);
      } else {
        throw new Error('No text content found in PDF');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      setUploadError(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please paste the resume text manually.`);
    } finally {
      setIsProcessing(false);
      // Reset file input
      event.target.value = '';
    }
  }, []);

  // Process skills extraction
  const handleExtractSkills = useCallback(() => {
    if (!resumeText.trim()) {
      setUploadError('Please provide resume text');

      return;
    }
    
    setIsProcessing(true);
    setUploadError(null);
    
    // Simulate small delay for UX
    setTimeout(() => {
      const skills = processSkillExtraction(resumeText, jdText);
      setExtractedSkills(skills);
      setCurrentStep('review');
      setIsProcessing(false);
    }, 500);
  }, [resumeText, jdText]);

  // Toggle skill selection
  const toggleSkillSelection = useCallback((skillId: string) => {
    setExtractedSkills(prev => 
      prev.map(skill => 
        skill.id === skillId 
          ? { ...skill, isSelected: !skill.isSelected }
          : skill
      )
    );
  }, []);

  // Remove skill
  const removeSkill = useCallback((skillId: string) => {
    setExtractedSkills(prev => prev.filter(skill => skill.id !== skillId));
  }, []);

  // Edit skill name
  const startEditingSkill = useCallback((skill: ExtractedSkill) => {
    setEditingSkillId(skill.id);
    setEditedSkillName(skill.name);
  }, []);

  const saveEditedSkill = useCallback(() => {
    if (!editingSkillId || !editedSkillName.trim()) {
      return;
    }
    
    setExtractedSkills(prev =>
      prev.map(skill =>
        skill.id === editingSkillId
          ? { ...skill, name: editedSkillName.trim() }
          : skill
      )
    );
    setEditingSkillId(null);
    setEditedSkillName('');
  }, [editingSkillId, editedSkillName]);

  // Add manual skill
  const addManualSkill = useCallback(() => {
    if (!newSkillName.trim()) {
      return;
    }
    
    const newSkill: ExtractedSkill = {
      id: `manual-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      confidence: 'High',
      source: 'Resume',
      frequency: 1,
      inResume: true,
      inJD: false,
      isSelected: true,
    };
    
    setExtractedSkills(prev => [...prev, newSkill]);
    setNewSkillName('');
    setShowAddSkill(false);
  }, [newSkillName, newSkillCategory]);

  // Apply skills to Resume Builder (store in localStorage)
  const applyToResumeBuilder = useCallback(() => {
    const formattedSkills = formatSkillsForResumeBuilder(extractedSkills);
    // Store in localStorage for Resume Builder to pick up
    localStorage.setItem('autofill-skills', formattedSkills);
    localStorage.setItem('autofill-skills-timestamp', Date.now().toString());
    setCurrentStep('complete');
  }, [extractedSkills]);

  // Get grouped skills
  const groupedSkills = groupSkillsByCategory(extractedSkills);
  const stats = getSkillStats(extractedSkills);
  const missingSkills = extractedSkills.filter(s => !s.inResume && s.inJD);

  // Render step indicator
  const renderStepIndicator = () => (
    <motion.div 
      className="flex items-center justify-center gap-2 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {["input", "review", "complete"].map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step
                ? "bg-blue-600 text-white"
                : index < ["input", "review", "complete"].indexOf(currentStep)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            initial={{ scale: 0.8 }}
            animate={{
              scale: currentStep === step ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: currentStep === step ? 1.5 : 0.3,
              repeat: currentStep === step ? Infinity : 0,
            }}
            whileHover={{ scale: 1.1 }}
          >
            {index < ["input", "review", "complete"].indexOf(currentStep) ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
            ) : (
              index + 1
            )}
          </motion.div>
          {index < 2 && (
            <motion.div
              className={`w-12 h-0.5 mx-1 ${
                index < ["input", "review", "complete"].indexOf(currentStep)
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );

  // Render input step
  const renderInputStep = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Resume Input */}
      <motion.div variants={cardVariants}>
        <Card className="border border-gray-200 overflow-hidden relative">
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent pointer-events-none"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          />
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <motion.div animate={floatingAnimation}>
                <FileText className="h-5 w-5 text-blue-600" />
              </motion.div>
              Resume Text
              <motion.span
                className="text-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                *
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            {/* Upload Option */}
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <motion.div
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                    isProcessing
                      ? "border-blue-400 bg-blue-50 cursor-wait"
                      : "border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                  whileHover={{ scale: 1.01, borderColor: "#3b82f6" }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-600 font-medium">
                        Processing PDF...
                      </span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Upload className="h-5 w-5 text-gray-500" />
                      </motion.div>
                      <span className="text-sm text-gray-600">Upload PDF</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={isProcessing}
                    onChange={handleFileUpload}
                  />
                </motion.div>
              </label>
              <span className="text-sm text-gray-400">or</span>
              <span className="text-sm text-gray-600">Paste below</span>
            </div>

            {/* Text Area */}
            <motion.div whileTap={{ scale: 0.995 }}>
              <Textarea
                placeholder="Paste your resume text here..."
                value={resumeText}
                className="min-h-[200px] resize-y focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-shadow"
                disabled={isProcessing}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </motion.div>

            <AnimatePresence>
              {uploadError && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="h-4 w-4" />
                  {uploadError}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* JD Input (Optional) */}
      <motion.div variants={cardVariants}>
        <Card className="border border-gray-200 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/50 to-transparent pointer-events-none"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
          />
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <motion.div animate={floatingAnimation}>
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </motion.div>
              Job Description
              <span className="text-xs font-normal text-gray-500 ml-2">
                (Optional but recommended)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <motion.div whileTap={{ scale: 0.995 }}>
              <Textarea
                placeholder="Paste the job description to find missing skills and improve matching..."
                value={jdText}
                className="min-h-[150px] resize-y focus:ring-2 focus:ring-amber-500 focus:shadow-md transition-shadow"
                disabled={isProcessing}
                onChange={(e) => setJdText(e.target.value)}
              />
            </motion.div>
            <motion.p
              className="text-xs text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Providing a JD helps identify skills you should add to your resume.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Extract Button */}
      <motion.div
        className="flex justify-end"
        variants={cardVariants}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            disabled={!resumeText.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 relative overflow-hidden"
            onClick={handleExtractSkills}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                </motion.div>
                Extract Skills
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  // Render skill card
  const renderSkillCard = (skill: ExtractedSkill, index: number) => {
    const colors = CATEGORY_COLORS[skill.category];
    const isEditing = editingSkillId === skill.id;

    return (
      <motion.div
        key={skill.id}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          skill.isSelected
            ? `${colors.bg} ${colors.border} border`
            : "bg-gray-50 border-gray-200"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.02, y: -2 }}
        layout
      >
        {/* Selection checkbox */}
        <motion.button
          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
            skill.isSelected
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-gray-300 hover:border-blue-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleSkillSelection(skill.id)}
        >
          <AnimatePresence>
            {skill.isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Skill name */}
        {isEditing ? (
          <input
            type="text"
            value={editedSkillName}
            className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
            onChange={(e) => setEditedSkillName(e.target.value)}
            onBlur={saveEditedSkill}
            onKeyDown={(e) => e.key === "Enter" && saveEditedSkill()}
          />
        ) : (
          <span className={`flex-1 text-sm font-medium ${colors.text}`}>
            {skill.name}
          </span>
        )}

        {/* Confidence badge */}
        <motion.span
          className={`text-xs px-1.5 py-0.5 rounded ${
            skill.confidence === "High"
              ? "bg-green-100 text-green-700"
              : skill.confidence === "Medium"
              ? "bg-amber-100 text-amber-700"
              : "bg-gray-100 text-gray-600"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {skill.confidence}
        </motion.span>

        {/* Source badge */}
        {skill.source === "JD" && !skill.inResume && (
          <motion.span
            className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Missing
          </motion.span>
        )}
        {skill.source === "Both" && (
          <motion.span
            className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            Match
          </motion.span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <motion.button
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => startEditingSkill(skill)}
          >
            <Pencil className="h-3 w-3" />
          </motion.button>
          <motion.button
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Remove"
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeSkill(skill.id)}
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render review step
  const renderReviewStep = () => (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={containerVariants}
      >
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center overflow-hidden relative"
          variants={cardVariants}
          whileHover={{ scale: 1.03, y: -2 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.p
            className="text-2xl font-bold text-blue-700 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {stats.total}
          </motion.p>
          <p className="text-xs text-blue-600 relative">Skills Found</p>
        </motion.div>
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-3 text-center overflow-hidden relative"
          variants={cardVariants}
          whileHover={{ scale: 1.03, y: -2 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/50 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
          />
          <motion.p
            className="text-2xl font-bold text-green-700 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            {stats.selected}
          </motion.p>
          <p className="text-xs text-green-600 relative">Selected</p>
        </motion.div>
        {jdText && (
          <>
            <motion.div
              className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center overflow-hidden relative"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.p
                className="text-2xl font-bold text-purple-700 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                {stats.matching}
              </motion.p>
              <p className="text-xs text-purple-600 relative">Matching JD</p>
            </motion.div>
            <motion.div
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center overflow-hidden relative"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/50 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 3.5 }}
              />
              <motion.p
                className="text-2xl font-bold text-amber-700 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
              >
                {stats.missing}
              </motion.p>
              <p className="text-xs text-amber-600 relative">Missing</p>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Missing Skills Alert */}
      <AnimatePresence>
        {missingSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border border-amber-200 bg-amber-50 overflow-hidden">
              <CardContent className="p-4">
                <motion.div
                  className="flex items-center justify-between cursor-pointer"
                  whileHover={{ x: 3 }}
                  onClick={() => setShowMissing(!showMissing)}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </motion.div>
                    <span className="text-sm font-medium text-amber-800">
                      {missingSkills.length} skills from JD are missing in your
                      resume
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showMissing ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.div>
                <AnimatePresence>
                  {showMissing && (
                    <motion.div
                      className="mt-3 flex flex-wrap gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {missingSkills.map((skill, index) => (
                        <motion.button
                          key={skill.id}
                          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                            skill.isSelected
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleSkillSelection(skill.id)}
                        >
                          {skill.isSelected ? (
                            <Check className="h-3 w-3 inline mr-1" />
                          ) : (
                            <Plus className="h-3 w-3 inline mr-1" />
                          )}
                          {skill.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills by Category */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {CATEGORY_ORDER.map((category, catIndex) => {
          const categorySkills = groupedSkills[category];
          if (!categorySkills || categorySkills.length === 0) {
            return null;
          }

          const colors = CATEGORY_COLORS[category];

          return (
            <motion.div
              key={category}
              variants={cardVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <Card className={`border ${colors.border} overflow-hidden`}>
                <CardHeader className={`py-3 ${colors.bg}`}>
                  <CardTitle
                    className={`text-sm font-semibold ${colors.text} flex items-center justify-between`}
                  >
                    <span>{category}</span>
                    <motion.span
                      className="text-xs font-normal"
                      key={`${category}-count`}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {categorySkills.filter((s) => s.isSelected).length}/
                      {categorySkills.length} selected
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categorySkills.map((skill, index) =>
                      renderSkillCard(skill, index)
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Manual Skill */}
      <motion.div variants={cardVariants}>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <AnimatePresence mode="wait">
              {showAddSkill ? (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="add-form"
                >
                  <input
                    type="text"
                    value={newSkillName}
                    placeholder="Skill name"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                    onChange={(e) => setNewSkillName(e.target.value)}
                  />
                  <select
                    value={newSkillCategory}
                    className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onChange={(e) =>
                      setNewSkillCategory(e.target.value as SkillCategory)
                    }
                  >
                    {CATEGORY_ORDER.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      disabled={!newSkillName.trim()}
                      onClick={addManualSkill}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddSkill(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.button
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="add-button"
                  whileHover={{ x: 5 }}
                  onClick={() => setShowAddSkill(true)}
                >
                  <motion.div
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.div>
                  Add skill manually
                </motion.button>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex items-center justify-between pt-4 border-t"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.02, x: -3 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" onClick={() => setCurrentStep("input")}>
            ← Back to Input
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disabled={stats.selected === 0}
            className="bg-blue-600 hover:bg-blue-700 relative overflow-hidden"
            onClick={applyToResumeBuilder}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            Apply to Resume Builder
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  // Render complete step
  const renderCompleteStep = () => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </motion.div>
      </motion.div>
      <motion.h2
        className="text-xl font-semibold text-gray-900 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Skills Applied Successfully! 🎉
      </motion.h2>
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {stats.selected} skills have been added to your Resume Builder.
      </motion.p>
      <motion.div
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep("review");
            }}
          >
            Edit Skills
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            className="bg-blue-600 hover:bg-blue-700 relative overflow-hidden"
            onClick={() => router.push("/resume-builder")}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            Go to Resume Builder
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Celebration emojis */}
      <motion.div
        className="mt-6 flex justify-center gap-4 text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {["✨", "🚀", "💼"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-50/50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg"
              animate={floatingAnimation}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="h-6 w-6 text-purple-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Skill Autofill
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </h1>
              <p className="text-sm text-gray-600">
                Extract skills from your resume and job descriptions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Labels */}
        <motion.div
          className="flex justify-between text-xs text-gray-500 mb-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span whileHover={{ scale: 1.1 }}>Input</motion.span>
          <motion.span whileHover={{ scale: 1.1 }}>Review & Edit</motion.span>
          <motion.span whileHover={{ scale: 1.1 }}>Complete</motion.span>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-gray-200 shadow-sm overflow-hidden relative">
            {/* Card shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 4 }}
            />
            <CardContent className="p-6 relative">
              <AnimatePresence mode="wait">
                {currentStep === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    {renderInputStep()}
                  </motion.div>
                )}
                {currentStep === "review" && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    {renderReviewStep()}
                  </motion.div>
                )}
                {currentStep === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    {renderCompleteStep()}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Signal */}
        <motion.p
          className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            🔒
          </motion.span>
          Skills are extracted locally using pattern matching. No data is sent
          to any server.
        </motion.p>
      </div>
    </motion.div>
  );
}
