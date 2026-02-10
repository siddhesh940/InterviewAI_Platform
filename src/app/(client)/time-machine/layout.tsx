"use client";

import { FuturePrediction, ResumeUpload, TargetRole } from '@/types/time-machine';
import React, { createContext, useContext, useState } from 'react';

interface TimeMachineContextType {
  resumeUpload: ResumeUpload | null;
  setResumeUpload: (resume: ResumeUpload | null) => void;
  targetRole: TargetRole | null;
  setTargetRole: (role: TargetRole | null) => void;
  timeGoal: 30 | 60 | 90;
  setTimeGoal: (goal: 30 | 60 | 90) => void;
  prediction: FuturePrediction | null;
  setPrediction: (prediction: FuturePrediction | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const TimeMachineContext = createContext<TimeMachineContextType | undefined>(undefined);

export const useTimeMachineContext = () => {
  const context = useContext(TimeMachineContext);
  if (context === undefined) {
    throw new Error('useTimeMachineContext must be used within a TimeMachineProvider');
  }
  
  return context;
};

export function TimeMachineProvider({ children }: { children: React.ReactNode }) {
  const [resumeUpload, setResumeUpload] = useState<ResumeUpload | null>(null);
  const [targetRole, setTargetRole] = useState<TargetRole | null>(null);
  const [timeGoal, setTimeGoal] = useState<30 | 60 | 90>(90);
  const [prediction, setPrediction] = useState<FuturePrediction | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <TimeMachineContext.Provider
      value={{
        resumeUpload,
        setResumeUpload,
        targetRole,
        setTargetRole,
        timeGoal,
        setTimeGoal,
        prediction,
        setPrediction,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </TimeMachineContext.Provider>
  );
}

export default function TimeMachineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="time-machine-layout">
      {children}
    </div>
  );
}
