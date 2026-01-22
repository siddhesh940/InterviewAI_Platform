import { FuturePrediction, ResumeUpload, TargetRole } from '@/types/time-machine';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimeMachineState {
  // Resume data
  resumeData: ResumeUpload | null;
  setResumeData: (data: ResumeUpload | null) => void;
  
  // Goal data
  goalData: {
    targetRole: TargetRole | null;
    timeGoal: 30 | 60 | 90;
  };
  setGoalData: (data: { targetRole: TargetRole | null; timeGoal: 30 | 60 | 90 }) => void;
  
  // Analysis data (API response)
  analysisData: FuturePrediction | null;
  setAnalysisData: (data: FuturePrediction | null) => void;
  
  // UI state
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Loading states
  isUploading: boolean;
  setIsUploading: (loading: boolean) => void;
  
  isAnalyzing: boolean;
  setIsAnalyzing: (loading: boolean) => void;
  
  // Reset function
  resetStore: () => void;
  
  // Clear resume data only
  clearResumeData: () => void;
}

const initialState = {
  resumeData: null,
  goalData: {
    targetRole: null,
    timeGoal: 30 as const,
  },
  analysisData: null,
  currentStep: 1,
  isUploading: false,
  isAnalyzing: false,
};

export const useTimeMachineStore = create<TimeMachineState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setResumeData: (data) => set({ resumeData: data }),
      
      setGoalData: (data) => set({ goalData: data }),
      
      setAnalysisData: (data) => set({ analysisData: data }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setIsUploading: (loading) => set({ isUploading: loading }),
      
      setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
      
      resetStore: () => set(initialState),
      
      clearResumeData: () => set({ 
        resumeData: null, 
        analysisData: null, 
        currentStep: 1 
      }),
    }),
    {
      name: 'time-machine-storage',
      // Persist everything except loading states
      partialize: (state) => ({
        resumeData: state.resumeData,
        goalData: state.goalData,
        analysisData: state.analysisData,
        currentStep: state.currentStep,
      }),
      // Custom merge to validate persisted data on load
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TimeMachineState>;
        
        // Validate resumeData - File objects don't survive serialization properly
        let validResumeData = persisted.resumeData;
        if (validResumeData) {
          // Check if the File object is valid (it won't be after JSON serialization)
          const isFileValid = validResumeData.file && 
                             validResumeData.file instanceof File &&
                             typeof validResumeData.file.name === 'string';
          
          // Check if text content is valid
          const isTextValid = validResumeData.text && 
                             typeof validResumeData.text === 'string' &&
                             validResumeData.text.length > 50;
          
          if (!isFileValid || !isTextValid) {
            console.log('🔄 Clearing invalid/stale persisted resume data');
            validResumeData = null;
          }
        }
        
        return {
          ...currentState,
          ...persisted,
          resumeData: validResumeData ?? null,
          // If resumeData is invalid, also clear analysis and reset step
          analysisData: validResumeData ? (persisted.analysisData ?? null) : null,
          currentStep: validResumeData ? (persisted.currentStep || 1) : 1,
        };
      },
    }
  )
);
