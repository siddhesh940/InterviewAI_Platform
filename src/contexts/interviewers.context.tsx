"use client";

import { INTERVIEWERS } from "@/lib/constants";
import { InterviewerService } from "@/services/interviewers.service";
import { Interviewer } from "@/types/interviewer";
import { useClerk } from "@clerk/nextjs";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface InterviewerContextProps {
  interviewers: Interviewer[];
  setInterviewers: React.Dispatch<React.SetStateAction<Interviewer[]>>;
  createInterviewer: (payload: any) => void;
  interviewersLoading: boolean;
  setInterviewersLoading: (interviewersLoading: boolean) => void;
}

export const InterviewerContext = React.createContext<InterviewerContextProps>({
  interviewers: [],
  setInterviewers: () => {},
  createInterviewer: () => {},
  interviewersLoading: false,
  setInterviewersLoading: () => undefined,
});

interface InterviewerProviderProps {
  children: ReactNode;
}

export function InterviewerProvider({ children }: InterviewerProviderProps) {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const { user } = useClerk();
  const [interviewersLoading, setInterviewersLoading] = useState(true);

  const fetchInterviewers = async () => {
    try {
      setInterviewersLoading(true);
      console.log('🔄 Fetching interviewers...');
      
      const response = await InterviewerService.getAllInterviewers(
        user?.id as string,
      );
      
      console.log('📋 Interviewers fetched:', response);
      
      // If no interviewers exist, try to create the default ones
      if (response.length === 0) {
        console.log('⚠️ No interviewers found, creating default ones...');
        try {
          const createResponse = await fetch('/api/create-interviewer', { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (createResponse.ok) {
            const createResult = await createResponse.json();
            console.log('✅ Default interviewers created via API:', createResult);
            
            // Fetch again after creating default interviewers
            const updatedResponse = await InterviewerService.getAllInterviewers(
              user?.id as string,
            );
            console.log('📋 Updated interviewers after API creation:', updatedResponse);
            setInterviewers(updatedResponse);
          } else {
            throw new Error(`API call failed with status: ${createResponse.status}`);
          }
        } catch (createError) {
          console.error('❌ API creation failed, trying direct database insertion:', createError);
          
          // Fallback: Try to create interviewers directly via service
          try {
            console.log('🔄 Creating interviewers directly in database...');
            
            await InterviewerService.createInterviewer({
              agent_id: "fallback-lisa-" + Date.now(),
              ...INTERVIEWERS.LISA,
            });
            
            await InterviewerService.createInterviewer({
              agent_id: "fallback-bob-" + Date.now(), 
              ...INTERVIEWERS.BOB,
            });
            
            // Fetch again after direct creation
            const finalResponse = await InterviewerService.getAllInterviewers(
              user?.id as string,
            );
            console.log('✅ Interviewers created directly:', finalResponse);
            setInterviewers(finalResponse);
          } catch (directError) {
            console.error('❌ Direct database insertion also failed:', directError);
            // Even if database fails, we'll show fallback in the UI
            setInterviewers([]);
          }
        }
      } else {
        console.log('✅ Setting existing interviewers:', response);
        setInterviewers(response);
      }
    } catch (error) {
      console.error('❌ Error in fetchInterviewers:', error);
      setInterviewers([]);
    }
    setInterviewersLoading(false);
  };

  const createInterviewer = async (payload: any) => {
    await InterviewerService.createInterviewer({ ...payload });
    fetchInterviewers();
  };

  useEffect(() => {
    if (user?.id) {
      fetchInterviewers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <InterviewerContext.Provider
      value={{
        interviewers,
        setInterviewers,
        createInterviewer,
        interviewersLoading,
        setInterviewersLoading,
      }}
    >
      {children}
    </InterviewerContext.Provider>
  );
}

export const useInterviewers = () => {
  const value = useContext(InterviewerContext);

  return value;
};
