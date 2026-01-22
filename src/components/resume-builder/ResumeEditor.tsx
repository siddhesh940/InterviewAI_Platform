"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TabKey } from "@/config/resume-fields";
import { useResumeBuilderContext } from "@/contexts/ResumeBuilderContext";
import { useResumeStorage } from "@/hooks/useResumeStorage";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  RotateCcw,
  Save
} from "lucide-react";
import { useCallback, useState } from "react";
import EditorForm from "./EditorForm";
import EditorTabs from "./EditorTabs";
import ResumePreview from "./ResumePreview";

type SaveState = "idle" | "saving" | "success" | "error";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const floatingAnimation = {
  y: [0, -6, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

export default function ResumeEditor() {
  const { 
    resumeData, 
    currentTab, 
    setCurrentTab, 
    saveResume, 
    resetResume 
  } = useResumeBuilderContext();
  
  const { isSignedIn } = useResumeStorage();
  const { toast } = useToast();
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = useCallback(async () => {
    if (saveState === 'saving') {return;}

    setSaveState('saving');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      saveResume();
      setSaveState('success');
      
      toast({
        title: "Saved!",
        description: "Your resume has been saved successfully.",
      });

      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveState('error');
      
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });

      setTimeout(() => setSaveState('idle'), 3000);
    }
  }, [saveState, saveResume, toast]);

  const handleReset = useCallback(() => {
    if (resetConfirm) {
      resetResume();
      setResetConfirm(false);
      setSaveState('idle');
      
      toast({
        title: "Reset Complete",
        description: "Your resume has been cleared.",
      });
    } else {
      setResetConfirm(true);
      
      toast({
        title: "Confirm Reset",
        description: "Click Reset again to confirm clearing your resume.",
        variant: "destructive",
      });

      // Auto-cancel after 3 seconds
      setTimeout(() => setResetConfirm(false), 3000);
    }
  }, [resetConfirm, resetResume, toast]);

  const getSaveButtonContent = () => {
    switch (saveState) {
      case 'saving':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Saved!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            Failed
          </>
        );
      default:
        return (
          <>
            <Save className="h-4 w-4" />
            Save
          </>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Container - Two Column Layout */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1800px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ========== LEFT: EDITOR ========== */}
        <motion.div 
          className="flex-1 lg:w-[55%] space-y-4"
          variants={cardVariants}
        >
          {/* Header */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-blue-50 rounded-lg border border-blue-100"
                animate={floatingAnimation}
              >
                <FileText className="h-6 w-6 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Resume Editor
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✏️
                  </motion.span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your details to build your ATS-friendly resume
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Unsaved Indicator */}
              <AnimatePresence>
                {!resumeData.saved && saveState === 'idle' && (
                  <motion.div 
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-amber-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs text-amber-600">Unsaved</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className={`${
                    resetConfirm
                      ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {resetConfirm ? 'Confirm Reset' : 'Reset'}
                </Button>
              </motion.div>

              {/* Save Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  disabled={saveState === 'saving'}
                  className={`min-w-[100px] ${
                    saveState === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : saveState === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleSave}
                >
                  {getSaveButtonContent()}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EditorTabs 
              activeTab={currentTab} 
              onTabChange={(tab: TabKey) => setCurrentTab(tab)} 
            />
          </motion.div>

          {/* Editor Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 lg:p-8 bg-white shadow-sm border border-gray-200 overflow-hidden relative">
              {/* Subtle shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EditorForm tab={currentTab} />
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>

        {/* ========== RIGHT: PREVIEW ========== */}
        <motion.div 
          className="lg:w-[45%] lg:sticky lg:top-6 lg:self-start"
          variants={cardVariants}
        >
          <Card className="p-6 bg-white shadow-sm border border-gray-200 overflow-hidden relative">
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/30 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 4 }}
            />
            <ResumePreview />
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
