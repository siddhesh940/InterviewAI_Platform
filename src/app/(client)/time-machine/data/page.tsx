"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTimeMachine } from "@/hooks/useTimeMachine";
import { useTimeMachineStore } from "@/stores/timeMachineStore";
import { TARGET_ROLES, TargetRole, TimeMachineData } from "@/types/time-machine";
import { AlertTriangle, ArrowLeft, ArrowRight, Brain, CheckCircle, FileText, Loader2, Sparkles, Target, Upload, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function TimeMachineDataPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    resumeData,
    setResumeData,
    goalData,
    setGoalData,
    setAnalysisData,
    currentStep,
    setCurrentStep,
    setIsUploading,
    isAnalyzing,
    setIsAnalyzing
  } = useTimeMachineStore();

  const { uploadResume, analyzeFuture, isLoading } = useTimeMachine();

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Extract individual values for easier use
  const targetRole = goalData.targetRole;
  const timeGoal = goalData.timeGoal;
  
  // VALIDATION: Reset state if resumeData exists but is invalid (e.g., from stale storage)
  useEffect(() => {
    if (resumeData) {
      // Check if resumeData has valid content
      const hasValidText = resumeData.text && resumeData.text.trim().length > 50;
      const hasValidFile = resumeData.file && resumeData.file.name;
      
      if (!hasValidText || !hasValidFile) {
        console.log('⚠️ Invalid/stale resume data detected, clearing...');
        setResumeData(null);
        setAnalysisData(null);
        setCurrentStep(1);
      }
    }
  }, [resumeData, setResumeData, setAnalysisData, setCurrentStep]);

  // Platform data fetching function - only use if available
  const getPlatformData = async () => {
    try {
      // In real implementation, fetch from actual platform APIs
      const response = await fetch('/api/platform-data');
      if (response.ok) {
        return await response.json();
      }
      
return null;
    } catch (error) {
      console.log('Platform data not available, using resume-only analysis');
      
return null;
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (!file) {return;}

      // Reset any previous data before new upload
      setResumeData(null);
      setAnalysisData(null); // Clear previous analysis
      setUploadProgress(0);
      setCurrentStep(1); // Reset to step 1
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        });
        
return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        
return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const resumeUploadResult = await uploadResume(file);
        
        clearInterval(interval);
        setUploadProgress(100);
        
        // Validate parsing results
        const hasValidData = resumeUploadResult.text && resumeUploadResult.text.trim().length > 10;
        const hasExtractedData = resumeUploadResult.extractedData && (
          resumeUploadResult.extractedData.skills.length > 0 ||
          resumeUploadResult.extractedData.experience.length > 0 ||
          resumeUploadResult.extractedData.projects.length > 0
        );

        if (!hasValidData) {
          toast({
            title: "Resume could not be parsed",
            description: "Please upload a clearer PDF or DOCX file. The text could not be extracted properly.",
            variant: "destructive",
          });
          setUploadProgress(0);
          
return;
        }

        setResumeData(resumeUploadResult);

        toast({
          title: "Resume uploaded successfully!",
          description: hasExtractedData 
            ? "Your resume has been parsed and analyzed."
            : "Resume uploaded. Some data may need manual review.",
        });

        // Only auto-advance if we have valid data
        if (hasValidData) {
          setTimeout(() => setCurrentStep(2), 1000);
        }
      } catch (error) {
        console.error('Resume upload error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to upload and parse resume. Please try again.",
          variant: "destructive",
        });
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    }
  }, [setResumeData, setAnalysisData, setUploadProgress, setIsUploading, setCurrentStep, uploadResume, toast]);

  const resetResumeUpload = useCallback(() => {
    // FULL RESET - Clear ALL resume and analysis data
    console.log('🔄 Resetting resume upload - clearing all data');
    
    // Clear resume data from store
    setResumeData(null);
    
    // Clear analysis data from store
    setAnalysisData(null);
    
    // Reset upload progress
    setUploadProgress(0);
    
    // Reset to step 1
    setCurrentStep(1);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    console.log('✅ Reset complete - all data cleared');
  }, [setResumeData, setAnalysisData, setCurrentStep]);

  const handleFileUpload = async (file: File) => {
    if (!file) {return;}

    // Reset any previous data before new upload
    resetResumeUpload();

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      
return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      
return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const resumeUploadResult = await uploadResume(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Validate parsing results
      const hasValidData = resumeUploadResult.text && resumeUploadResult.text.trim().length > 10;
      const hasExtractedData = resumeUploadResult.extractedData && (
        resumeUploadResult.extractedData.skills.length > 0 ||
        resumeUploadResult.extractedData.experience.length > 0 ||
        resumeUploadResult.extractedData.projects.length > 0
      );

      if (!hasValidData) {
        toast({
          title: "Resume could not be parsed",
          description: "Please upload a clearer PDF or DOCX file. The text could not be extracted properly.",
          variant: "destructive",
        });
        setUploadProgress(0);
        
return;
      }

      setResumeData(resumeUploadResult);

      toast({
        title: "Resume uploaded successfully!",
        description: hasExtractedData 
          ? "Your resume has been parsed and analyzed."
          : "Resume uploaded. Some data may need manual review.",
      });

      // Only auto-advance if we have valid data
      if (hasValidData) {
        setTimeout(() => setCurrentStep(2), 1000);
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload and parse resume. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Prevent double-click: if already analyzing, ignore
    if (isAnalyzing || isLoading) {
      console.log('⚠️ Analysis already in progress, ignoring duplicate click');
      // eslint-disable-next-line newline-before-return
      return;
    }

    // Validate required data
    if (!resumeData) {
      toast({
        title: "Resume missing",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      
return;
    }

    if (!targetRole) {
      toast({
        title: "Target role missing",
        description: "Please select a target role.",
        variant: "destructive",
      });
      
return;
    }

    // Validate resume has valid content
    if (!resumeData.text || resumeData.text.trim().length < 10) {
      toast({
        title: "Resume content issue",
        description: "Resume text could not be extracted properly. Please upload a clearer file.",
        variant: "destructive",
      });
      
return;
    }

    try {
      // Set loading state immediately to prevent double-clicks
      setIsAnalyzing(true);
      
      // Try to get platform data, but proceed without it if unavailable
      const platformData = await getPlatformData();
      
      const timeMachineData: TimeMachineData = {
        resumeText: resumeData.text,
        targetRole,
        timeGoal,
        ...(platformData && {
          interviewScores: platformData.interviewScores,
          strengths: platformData.strengths,
          weaknesses: platformData.weaknesses,
          technicalPatterns: platformData.technicalPatterns,
          communicationPatterns: platformData.communicationPatterns
        })
      };

      console.log('🚀 Starting AI analysis with data:', {
        resumeLength: resumeData.text.length,
        targetRole,
        timeGoal,
        hasPlatformData: !!platformData
      });
      
      const prediction = await analyzeFuture(timeMachineData);
      
      // Save analysis result to persistent store
      setAnalysisData(prediction);
      
      toast({
        title: "Analysis complete!",
        description: "Your future prediction is ready. Redirecting to results...",
      });

      // Redirect to results page (NOT back to data page)
      setTimeout(() => {
        router.push("/time-machine/result");
      }, 1000);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { id: 1, title: "Upload Resume", icon: Upload },
    { id: 2, title: "Select Goals", icon: Users },
    { id: 3, title: "Review & Analyze", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.push("/time-machine")}
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Time Machine Data Collection</h1>
              <p className="text-gray-600 mt-1">
                Upload your resume and let AI analyze your future potential
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 h-0.5 w-16 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {currentStep === 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-purple-600" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your resume (PDF or DOCX) for AI analysis. We&#39;ll extract your skills, experience, and achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-purple-400 bg-purple-50'
                    : resumeData
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadProgress > 0 && uploadProgress < 100 ? (
                  <div>
                    <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Uploading and parsing...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                       />
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                  </div>
                ) : resumeData ? (
                  <div>
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Resume uploaded successfully!</p>
                    <p className="text-sm text-gray-600 mb-4">
                      File: {resumeData.file.name} ({resumeData.file.size ? (resumeData.file.size / 1024 / 1024).toFixed(2) : '0.00'} MB)
                    </p>
                    
                    {/* EXTRACTED DATA SUMMARY - Show immediately after upload */}
                    <div className="bg-white border rounded-lg p-4 text-left max-w-2xl mx-auto mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        Extracted Resume Data
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Skills Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            Skills ({resumeData.extractedData?.skills?.length || 0} found)
                          </h5>
                          {resumeData.extractedData?.skills && resumeData.extractedData.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {resumeData.extractedData.skills.slice(0, 15).map((skill, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Badge key={`skill-${skill}-${idx}`} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                              {resumeData.extractedData.skills.length > 15 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resumeData.extractedData.skills.length - 15} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ No skills detected</p>
                          )}
                        </div>

                        {/* Experience Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Experience ({resumeData.extractedData?.experience?.length || 0} positions)
                          </h5>
                          {resumeData.extractedData?.experience && resumeData.extractedData.experience.length > 0 ? (
                            <div className="space-y-1">
                              {resumeData.extractedData.experience.slice(0, 3).map((exp, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={`exp-${idx}`} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                                  {exp}
                                </div>
                              ))}
                              {resumeData.extractedData.experience.length > 3 && (
                                <p className="text-xs text-gray-500">+{resumeData.extractedData.experience.length - 3} more positions</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ No experience detected</p>
                          )}
                        </div>

                        {/* Projects Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Projects ({resumeData.extractedData?.projects?.filter(p => {
                              // Only count valid projects (not contact info or summaries)
                              const projText = typeof p === 'string' ? p : String(p);
                              
return !/@|gmail|linkedin|github\.com|phone|summary|objective/i.test(projText.split(':')[0] || '');
                            }).length || 0} found)
                          </h5>
                          {resumeData.extractedData?.projects && resumeData.extractedData.projects.length > 0 ? (
                            <div className="space-y-1">
                              {resumeData.extractedData.projects.slice(0, 3).map((proj, idx) => {
                                const projText = typeof proj === 'string' ? proj : String(proj);
                                const projTitle = projText.split(':')[0] || projText;
                                
                                // Skip if it looks like contact info or summary (not a real project)
                                if (/@|gmail|linkedin|github\.com\/(?!.*\/)|phone|\+\d{2}|summary|objective/i.test(projTitle)) {
                                  return null;
                                }
                                
                                // Skip if too long (probably raw text dump)
                                if (projTitle.length > 100) {
                                  return null;
                                }
                                
                                return (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <div key={`proj-${idx}`} className="text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                                    {projTitle.length > 80 ? projTitle.slice(0, 80) + '...' : projTitle}
                                  </div>
                                );
                              }).filter(Boolean)}
                              {resumeData.extractedData.projects.filter(p => {
                                const projText = typeof p === 'string' ? p : String(p);
                                
return !/@|gmail|linkedin|github\.com\/(?!.*\/)|phone|\+\d{2}|summary|objective/i.test(projText.split(':')[0] || '');
                              }).length > 3 && (
                                <p className="text-xs text-gray-500">+{resumeData.extractedData.projects.length - 3} more projects</p>
                              )}
                              {resumeData.extractedData.projects.every(p => {
                                const projText = typeof p === 'string' ? p : String(p);
                                
return /@|gmail|linkedin|github\.com\/(?!.*\/)|phone|\+\d{2}|summary|objective/i.test(projText.split(':')[0] || '');
                              }) && (
                                <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ No valid projects detected</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ No projects detected</p>
                          )}
                        </div>

                        {/* Education Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                            Education ({resumeData.extractedData?.education?.length || 0} entries)
                          </h5>
                          {resumeData.extractedData?.education && resumeData.extractedData.education.length > 0 ? (
                            <div className="space-y-1">
                              {resumeData.extractedData.education.slice(0, 2).map((edu, idx) => {
                                // Truncate long education strings (prevent raw text dump)
                                const eduText = typeof edu === 'string' ? edu : String(edu);
                                const truncated = eduText.length > 100 ? eduText.slice(0, 100) + '...' : eduText;
                                
                                // Skip if it looks like raw text dump (too long, contains multiple sections)
                                if (eduText.length > 300 || /\b(experience|skills|projects)\b/i.test(eduText)) {
                                  return null;
                                }
                                
                                return (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <div key={`edu-${idx}`} className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                    {truncated}
                                  </div>
                                );
                              }).filter(Boolean)}
                              {resumeData.extractedData.education.length === 0 || 
                               (resumeData.extractedData.education[0] && resumeData.extractedData.education[0].length > 300) ? (
                                <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ Education could not be properly parsed</p>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">⚠️ No education detected</p>
                          )}
                        </div>

                        {/* Achievements */}
                        {resumeData.extractedData?.achievements && resumeData.extractedData.achievements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full" />
                              Achievements ({resumeData.extractedData.achievements.length} found)
                            </h5>
                            <div className="flex flex-wrap gap-1.5">
                              {resumeData.extractedData.achievements.slice(0, 4).map((ach, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Badge key={`ach-${idx}`} variant="secondary" className="text-xs bg-orange-50 text-orange-700 border border-orange-200">
                                  {ach}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Parsing Confidence */}
                      {resumeData.confidence?.overall !== undefined && (
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <span className="text-xs text-gray-500">Parsing confidence:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  resumeData.confidence.overall >= 0.7 ? 'bg-green-500' : 
                                  resumeData.confidence.overall >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.round(resumeData.confidence.overall * 100)}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${
                              resumeData.confidence.overall >= 0.7 ? 'text-green-600' : 
                              resumeData.confidence.overall >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {Math.round(resumeData.confidence.overall * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Clear & Upload New Resume Button */}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        onClick={resetResumeUpload}
                      >
                        Clear & Upload New Resume
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Supported formats: PDF, DOCX (Max size: 10MB)
                    </p>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {handleFileUpload(file);}
                  }}
                />
              </div>

              {resumeData && (
                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setCurrentStep(2)}
                  >
                    Next: Select Goals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Goal Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  Target Job Role
                </CardTitle>
                <CardDescription>
                  Select the job role you&#39;re targeting to get personalized predictions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="target-role">Target Job Role</Label>
                  <Select value={targetRole || ""} onValueChange={(value: TargetRole) => 
                    setGoalData({ ...goalData, targetRole: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target job role" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6 space-y-4">
                  <Label>Time Goal</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[30, 60, 90].map((days) => (
                      <button
                        key={days}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          timeGoal === days
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                        onClick={() => setGoalData({ ...goalData, timeGoal: days as 30 | 60 | 90 })}
                      >
                        <div className="text-2xl font-bold">{days}</div>
                        <div className="text-sm">Days</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    disabled={!targetRole}
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setCurrentStep(3)}
                  >
                    Next: Review & Analyze
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Analysis */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Review & Start Analysis
                </CardTitle>
                <CardDescription>
                  Review your information and start the AI analysis to predict your future career path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Essential Summary - Clean and Simple */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Resume File
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>• File:</span>
                        <span className="font-medium">{resumeData?.file.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Size:</span>
                        <span className="font-medium">{resumeData?.file.size ? (resumeData.file.size / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Status:</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-400">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      Analysis Goals
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>• Target Role:</span>
                        <span className="font-medium text-purple-600">{targetRole}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Time Frame:</span>
                        <span className="font-medium">{timeGoal} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Interview Data:</span>
                        <span className="text-orange-600 text-xs">Auto-fetched</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Platform Activity:</span>
                        <span className="text-blue-600 text-xs">Analyzed</span>
                      </div>
                    </ul>
                  </div>
                </div>

                {/* DETAILED EXTRACTED DATA - Step 3 Review */}
                {resumeData && (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Extracted Resume Data Summary
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skills */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h5 className="text-sm font-semibold text-blue-800 mb-2 flex items-center justify-between">
                          <span>🛠️ Skills</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {resumeData.extractedData?.skills?.length || 0} found
                          </Badge>
                        </h5>
                        {resumeData.extractedData?.skills && resumeData.extractedData.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {resumeData.extractedData.skills.slice(0, 8).map((skill, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <span key={`review-skill-${skill}-${idx}`} className="text-xs bg-white px-2 py-0.5 rounded border text-blue-700">
                                {skill}
                              </span>
                            ))}
                            {resumeData.extractedData.skills.length > 8 && (
                              <span className="text-xs text-blue-600">+{resumeData.extractedData.skills.length - 8} more</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">❌ No skills detected in resume</p>
                        )}
                      </div>

                      {/* Experience */}
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center justify-between">
                          <span>💼 Experience</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {resumeData.extractedData?.experience?.length || 0} positions
                          </Badge>
                        </h5>
                        {resumeData.extractedData?.experience && resumeData.extractedData.experience.length > 0 ? (
                          <div className="space-y-1">
                            {resumeData.extractedData.experience.slice(0, 2).map((exp, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <p key={`review-exp-${idx}`} className="text-xs text-green-700 truncate">
                                • {exp}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">❌ No experience detected</p>
                        )}
                      </div>

                      {/* Projects */}
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <h5 className="text-sm font-semibold text-purple-800 mb-2 flex items-center justify-between">
                          <span>🚀 Projects</span>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {resumeData.extractedData?.projects?.length || 0} found
                          </Badge>
                        </h5>
                        {resumeData.extractedData?.projects && resumeData.extractedData.projects.length > 0 ? (
                          <div className="space-y-1">
                            {resumeData.extractedData.projects.slice(0, 2).map((proj, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <p key={`review-proj-${idx}`} className="text-xs text-purple-700 truncate">
                                • {proj.split(':')[0]}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">❌ No projects detected</p>
                        )}
                      </div>

                      {/* Education */}
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center justify-between">
                          <span>🎓 Education</span>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            {resumeData.extractedData?.education?.length || 0} entries
                          </Badge>
                        </h5>
                        {resumeData.extractedData?.education && resumeData.extractedData.education.length > 0 ? (
                          <div className="space-y-1">
                            {resumeData.extractedData.education.slice(0, 2).map((edu, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <p key={`review-edu-${idx}`} className="text-xs text-yellow-700 truncate">
                                • {edu}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">❌ No education detected</p>
                        )}
                      </div>
                    </div>

                    {/* Parsing Confidence Bar */}
                    {resumeData.confidence?.overall !== undefined && (
                      <div className="mt-4 pt-3 border-t flex items-center gap-3">
                        <span className="text-sm text-gray-600">Parsing Accuracy:</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              resumeData.confidence.overall >= 0.7 ? 'bg-green-500' : 
                              resumeData.confidence.overall >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.round(resumeData.confidence.overall * 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          resumeData.confidence.overall >= 0.7 ? 'text-green-600' : 
                          resumeData.confidence.overall >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(resumeData.confidence.overall * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Warning for low data */}
                {resumeData && (
                  (resumeData.extractedData?.skills?.length === 0 || 
                   resumeData.extractedData?.experience?.length === 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Limited Data Warning</h4>
                          <p className="text-sm text-yellow-700">
                            Some sections could not be extracted from your resume. The AI analysis will still work but may be less accurate. For best results, ensure your resume has clear Skills and Experience sections.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Analysis Preview - Clean and Simple */}
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h4 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    What AI Will Analyze
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-blue-800 mb-2">Analysis Includes</h5>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Your resume content and skills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>Market trends for {targetRole}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span>Personalized {timeGoal}-day growth roadmap</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-blue-800 mb-2">You&#39;ll Get</h5>
                      <div className="space-y-1 text-sm text-blue-700">
                        <div>📈 Future skills progression</div>
                        <div>🚀 Project recommendations</div>
                        <div>💰 Salary projection range</div>
                        <div>🗺️ Learning roadmap</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={isAnalyzing}
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    disabled={isAnalyzing || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                    onClick={handleSubmit}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Future...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
