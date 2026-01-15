"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useResumeContext } from "@/contexts/ResumeContext";
import { ArrowLeft, Bot, ChevronLeft, ChevronRight, Download, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState, } from "react";

// Removed interface - using imported type from @/types/resume

const steps = [
  { id: 1, title: "Personal Info", description: "Basic contact information" },
  { id: 2, title: "Skills", description: "Technical & soft skills" },
  { id: 3, title: "Experience", description: "Work history" },
  { id: 4, title: "Projects", description: "Notable projects" },
  { id: 5, title: "Education", description: "Academic background" },
  { id: 6, title: "Extras", description: "Certifications & achievements" },
];

function BuildResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const {
    resumeData,
    setResumeData,
    currentStep,
    setCurrentStep,
    templateId,
    setTemplateId  } = useResumeContext();
  
  const [, setIsLoading] = useState(false);

  // Initialize template from URL parameter
  useEffect(() => {
    const template = searchParams.get("template");
    if (template && template !== templateId) {
      setTemplateId(template);
    }
  }, [searchParams, templateId, setTemplateId]);

  // Clear draft - reset to default values
  const clearDraft = () => {
    setResumeData({
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        jobTitle: "",
        summary: ""
      },
      workExperience: [],
      education: [],
      skills: { technical: [], soft: [], tools: [] },
      projects: [],
      certifications: [],
      achievements: []
    });
    setCurrentStep(1);
    toast({
      title: "Draft cleared",
      description: "Resume draft has been cleared successfully.",
    });
  };

  const handleAIImprove = async (field: string, currentText: string) => {
    // Simulate AI improvement
    const improvements = {
      summary: "Results-oriented professional with proven expertise in delivering high-quality solutions and driving business growth through innovative approaches and collaborative leadership.",
      description: "• Developed and implemented scalable solutions that improved system performance by 40%\n• Collaborated with cross-functional teams to deliver projects ahead of schedule\n• Led code reviews and mentoring initiatives for junior developers"
    };
    
    const improvedText = improvements[field as keyof typeof improvements] || currentText;
    alert(`AI Improved Text:\n\n${improvedText}\n\nThis would be automatically applied in the real implementation.`);
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };



  // X-Ray analysis feature has been removed


  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      // Wait for resume preview to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the resume preview element
      const element = document.getElementById("resume-preview");
      if (!element) {
        throw new Error('Resume preview not found');
      }
      
      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      
      const userName = resumeData.personalInfo.name || "Resume";
      const filename = `Resume-${userName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      const options = {
        margin: [0.2, 0.2, 0.2, 0.2] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { avoid: ["div"] }
      };

      await html2pdf().set(options).from(element).save();

      toast({
        title: "Success!",
        description: "Resume PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Error generating PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };





  const addExperience = () => {
    setResumeData({
      ...resumeData,
      workExperience: [...resumeData.workExperience, { role: "", company: "", location: "", startDate: "", endDate: "", description: "" }]
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { title: "", description: "", technologies: "", github: "", liveLink: "" }]
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { degree: "", college: "", location: "", startDate: "", endDate: "", gpa: "" }]
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={resumeData.personalInfo.name}
                  placeholder="John Doe"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={resumeData.personalInfo.jobTitle}
                  placeholder="Software Engineer"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, jobTitle: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  placeholder="john.doe@email.com"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  placeholder="+1 (555) 123-4567"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={resumeData.personalInfo.linkedin}
                  placeholder="linkedin.com/in/johndoe"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={resumeData.personalInfo.github}
                  placeholder="github.com/johndoe"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={resumeData.personalInfo.website}
                  placeholder="www.johndoe.com"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, website: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.personalInfo.location}
                placeholder="San Francisco, CA"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                })}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleAIImprove("summary", resumeData.personalInfo.summary)}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Improve
                </Button>
              </div>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                placeholder="Brief professional summary highlighting your key strengths and career objectives..."
                rows={3}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Technical Skills</Label>
              <Input
                placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                value={resumeData.skills.technical.join(', ')}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                  ...resumeData,
                  skills: { ...resumeData.skills, technical: e.target.value.split(',').map((s: string) => s.trim()) }
                })}
              />
            </div>

            <div>
              <Label>Soft Skills</Label>
              <Input
                placeholder="Enter skills separated by commas (e.g., Leadership, Communication, Problem Solving)"
                value={resumeData.skills.soft.join(', ')}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                  ...resumeData,
                  skills: { ...resumeData.skills, soft: e.target.value.split(',').map((s: string) => s.trim()) }
                })}
              />
            </div>

            <div>
              <Label>Tools & Technologies</Label>
              <Input
                placeholder="Enter tools separated by commas (e.g., Git, Docker, AWS, Figma)"
                value={resumeData.skills.tools.join(', ')}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeData({
                  ...resumeData,
                  skills: { ...resumeData.skills, tools: e.target.value.split(',').map((s: string) => s.trim()) }
                })}
              />
            </div>

            <Button variant="outline" className="w-full">
              <Bot className="h-4 w-4 mr-2" />
              AI Categorize Skills
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {resumeData.workExperience.map((exp: any, index: number) => (
              <Card key={`exp-${index}`} className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title *</Label>
                      <Input
                        value={exp.role}
                        placeholder="Software Engineer"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newExp = [...resumeData.workExperience];
                          newExp[index].role = e.target.value;
                          setResumeData({ ...resumeData, workExperience: newExp });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        placeholder="Tech Company Inc."
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newExp = [...resumeData.workExperience];
                          newExp[index].company = e.target.value;
                          setResumeData({ ...resumeData, workExperience: newExp });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        placeholder="New York, NY"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newExp = [...resumeData.workExperience];
                          newExp[index].location = e.target.value;
                          setResumeData({ ...resumeData, workExperience: newExp });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        placeholder="Jan 2022"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newExp = [...resumeData.workExperience];
                          newExp[index].startDate = e.target.value;
                          setResumeData({ ...resumeData, workExperience: newExp });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <Input
                      value={exp.endDate}
                      placeholder="Present"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newExp = [...resumeData.workExperience];
                        newExp[index].endDate = e.target.value;
                        setResumeData({ ...resumeData, workExperience: newExp });
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label>Job Description</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleAIImprove("description", exp.description)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Polish (STAR Method)
                      </Button>
                    </div>
                    <Textarea
                      value={exp.description}
                      placeholder="Describe your key responsibilities and achievements..."
                      rows={4}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        const newExp = [...resumeData.workExperience];
                        newExp[index].description = e.target.value;
                        setResumeData({ ...resumeData, workExperience: newExp });
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={addExperience}>
              Add Experience
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {resumeData.projects.map((project: any, index: number) => (
              <Card key={`proj-${index}`} className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Project Title *</Label>
                    <Input
                      value={project.title}
                      placeholder="E-commerce Platform"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].title = e.target.value;
                        setResumeData({ ...resumeData, projects: newProjects });
                      }}
                    />
                  </div>

                  <div>
                    <Label>Technologies</Label>
                    <Input
                      placeholder="React, Node.js, MongoDB"
                      value={project.technologies}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].technologies = e.target.value;
                        setResumeData({ ...resumeData, projects: newProjects });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>GitHub URL</Label>
                      <Input
                        placeholder="https://github.com/username/repo"
                        value={project.github || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newProjects = [...resumeData.projects];
                          newProjects[index].github = e.target.value;
                          setResumeData({ ...resumeData, projects: newProjects });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Live Demo URL</Label>
                      <Input
                        placeholder="https://yourproject.com"
                        value={project.liveLink || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newProjects = [...resumeData.projects];
                          newProjects[index].liveLink = e.target.value;
                          setResumeData({ ...resumeData, projects: newProjects });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Project Description</Label>
                    <Textarea
                      value={project.description}
                      placeholder="Describe your project, its impact, and key features..."
                      rows={3}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[index].description = e.target.value;
                        setResumeData({ ...resumeData, projects: newProjects });
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={addProject}>
              Add Project
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {resumeData.education.map((edu: any, index: number) => (
              <Card key={`edu-${index}`} className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      placeholder="B.Tech in Computer Science"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newEdu = [...resumeData.education];
                        newEdu[index].degree = e.target.value;
                        setResumeData({ ...resumeData, education: newEdu });
                      }}
                    />
                  </div>

                  <div>
                    <Label>College/University *</Label>
                    <Input
                      value={edu.college}
                      placeholder="XYZ Institute of Technology"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newEdu = [...resumeData.education];
                        newEdu[index].college = e.target.value;
                        setResumeData({ ...resumeData, education: newEdu });
                      }}
                    />
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={edu.location}
                      placeholder="City, State"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newEdu = [...resumeData.education];
                        newEdu[index].location = e.target.value;
                        setResumeData({ ...resumeData, education: newEdu });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={edu.startDate}
                        placeholder="2019"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].startDate = e.target.value;
                          setResumeData({ ...resumeData, education: newEdu });
                        }}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        value={edu.endDate}
                        placeholder="2023"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].endDate = e.target.value;
                          setResumeData({ ...resumeData, education: newEdu });
                        }}
                      />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        placeholder="8.4/10 or 84%"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].gpa = e.target.value;
                          setResumeData({ ...resumeData, education: newEdu });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={addEducation}>
              Add Education
            </Button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label>Certifications</Label>
              <Textarea
                placeholder="Enter each certification on a new line..."
                rows={4}
                value={resumeData.certifications.join('\n')}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResumeData({
                  ...resumeData,
                  certifications: e.target.value.split('\n').filter(cert => cert.trim() !== '')
                })}
              />
            </div>

            <div>
              <Label>Achievements</Label>
              <Textarea
                placeholder="Enter each achievement on a new line..."
                rows={4}
                value={resumeData.achievements.join('\n')}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResumeData({
                  ...resumeData,
                  achievements: e.target.value.split('\n').filter(achievement => achievement.trim() !== '')
                })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex">
        {/* Main Form Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => router.push("/resume-builder/templates")}
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Build Your Resume</h1>
                  <p className="text-gray-600 mt-1">
                    Template: {templateId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={clearDraft}
              >
                Clear Draft
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {step.id < 6 && (
                    <div className={`w-16 h-1 ml-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form Content */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentStep === 1}
                onClick={prevStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep < 6 ? (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="sticky top-0 bg-white pb-4 border-b mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-600">Updates automatically as you type</p>
          </div>

          {/* Resume Preview */}
          <div 
            id="resume-preview"
            className="bg-white border border-gray-200 rounded-lg text-sm"
            style={{ 
              fontFamily: 'Inter, "Source Sans 3", Lato, Roboto, Helvetica, Arial, sans-serif',
              lineHeight: '1.4',
              color: '#1f2937',
              padding: '32px',
              maxWidth: '210mm',
              minHeight: '297mm'
            }}
          >
            {/* Header */}
            <div className="text-center mb-8 pb-4" style={{ borderBottom: '2px solid #e5e7eb' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '6px',
                letterSpacing: '-0.025em'
              }}>
                {resumeData.personalInfo.name || "Your Name"}
              </h1>
              <p style={{ 
                fontSize: '16px',
                color: '#4b5563', 
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                {resumeData.personalInfo.jobTitle || "Job Title"}
              </p>
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <span>{resumeData.personalInfo.email}</span>
                {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin}</span>}
                {resumeData.personalInfo.github && <span>• {resumeData.personalInfo.github}</span>}
                {resumeData.personalInfo.website && <span>• {resumeData.personalInfo.website}</span>}
              </div>
            </div>

            {/* Summary */}
            {resumeData.personalInfo.summary && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  PROFESSIONAL SUMMARY
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151', 
                  lineHeight: '1.6',
                  textAlign: 'justify'
                }}>
                  {resumeData.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  SKILLS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  {resumeData.skills.technical.length > 0 && (
                    <div>
                      <strong style={{ 
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        Technical Skills:
                      </strong>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#4b5563',
                        marginTop: '4px',
                        lineHeight: '1.5'
                      }}>
                        {resumeData.skills.technical.join(" • ")}
                      </p>
                    </div>
                  )}
                  {resumeData.skills.tools.length > 0 && (
                    <div>
                      <strong style={{ 
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        Tools & Technologies:
                      </strong>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#4b5563',
                        marginTop: '4px',
                        lineHeight: '1.5'
                      }}>
                        {resumeData.skills.tools.join(" • ")}
                      </p>
                    </div>
                  )}
                  {resumeData.skills.soft.length > 0 && (
                    <div>
                      <strong style={{ 
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        Soft Skills:
                      </strong>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#4b5563',
                        marginTop: '4px',
                        lineHeight: '1.5'
                      }}>
                        {resumeData.skills.soft.join(" • ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData.workExperience.length > 0 && resumeData.workExperience[0].role && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  EXPERIENCE
                </h3>
                {resumeData.workExperience.map((exp: any, index: number) => (
                  <div key={`preview-exp-${exp.role}-${exp.company}-${index}`} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <strong style={{ 
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {exp.role}
                      </strong>
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.startDate || exp.endDate || '')}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#4b5563', 
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      {exp.company}
                    </p>
                    {exp.description && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#374151', 
                        lineHeight: '1.6'
                      }}>
                        {exp.description.split('\\n').map((line: any, i: number) => (
                          <p key={i} style={{ 
                            marginBottom: '2px',
                            paddingLeft: line.trim().startsWith('•') ? '0' : '12px'
                          }}>
                            {line.trim().startsWith('•') ? line : `• ${line}`}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && resumeData.projects[0].title && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  PROJECTS
                </h3>
                {resumeData.projects.map((project: any, index: number) => (
                  <div key={`preview-proj-${project.title}-${index}`} style={{ marginBottom: '16px' }}>
                    <strong style={{ 
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600'
                    }}>
                      {project.title}
                    </strong>
                    {project.technologies && (
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        marginTop: '2px',
                        fontStyle: 'italic'
                      }}>
                        Technologies: {project.technologies}
                      </p>
                    )}
                    {project.description && (
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#374151', 
                        lineHeight: '1.6',
                        marginTop: '4px'
                      }}>
                        {project.description}
                      </p>
                    )}
                    {(project.github || project.liveLink) && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        {project.github && (
                          <span>GitHub: {project.github}</span>
                        )}
                        {project.github && project.liveLink && ' • '}
                        {project.liveLink && (
                          <span>Live: {project.liveLink}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && resumeData.education[0].degree && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  EDUCATION
                </h3>
                {resumeData.education.map((edu: any, index: number) => (
                  <div key={`preview-edu-${edu.degree}-${edu.college}-${index}`} style={{ marginBottom: '12px' }}>
                    <strong style={{ 
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600'
                    }}>
                      {edu.degree}
                    </strong>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#4b5563',
                      marginTop: '2px'
                    }}>
                      {edu.college}{edu.location && `, ${edu.location}`}
                    </p>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      marginTop: '2px'
                    }}>
                      {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : (edu.endDate || edu.startDate || '')} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  CERTIFICATIONS
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {resumeData.certifications.map((cert: any, index: number) => (
                    <li key={`preview-cert-${cert}-${index}`} style={{ 
                      fontSize: '14px', 
                      color: '#374151',
                      marginBottom: '6px',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '0', 
                        fontWeight: 'bold'
                      }}>•</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {resumeData.achievements.length > 0 && (
              <div>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  ACHIEVEMENTS
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {resumeData.achievements.map((achievement: any, index: number) => (
                    <li key={`preview-ach-${achievement.substring(0, 20)}-${index}`} style={{ 
                      fontSize: '14px', 
                      color: '#374151',
                      marginBottom: '6px',
                      paddingLeft: '12px',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '0', 
                        fontWeight: 'bold'
                      }}>•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preview Actions */}
          <div className="mt-6 space-y-2">
            <Button
              variant="outline"
              className="w-full text-green-700 border-green-200 hover:bg-green-50"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/resume-builder/templates")}
            >
              Change Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildResumePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildResumeContent />
    </Suspense>
  );
}


