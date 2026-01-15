"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimeMachine } from "@/hooks/useTimeMachine";
import { convertSalaryRangeToLPA, formatSalaryWithBoth } from "@/lib/currency-utils";
import { useTimeMachineStore } from "@/stores/timeMachineStore";
import {
    ArrowLeft,
    Award,
    BarChart3,
    Calendar,
    Clock,
    Download,
    FileText,
    Rocket,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    User,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TimeMachineResult() {
  const router = useRouter();
  const { analysisData, goalData } = useTimeMachineStore();
  useTimeMachine();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  // Extract values for easier use
  const prediction = analysisData;
  const targetRole = goalData.targetRole;
  const timeGoal = goalData.timeGoal;

  useEffect(() => {
    // Only show no data message after a brief delay to allow store to hydrate
    const timer = setTimeout(() => {
      if (!prediction) {
        setShowNoDataMessage(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [prediction]);

  // Show loading state while store is hydrating
  if (!prediction && !showNoDataMessage) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your future prediction...</p>
        </div>
      </div>
    );
  }

  // Show message to start new analysis if no data found
  if (showNoDataMessage) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <CardTitle>No Prediction Data Found</CardTitle>
            <CardDescription>
              Start a new Time Machine analysis to see your future prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push('/time-machine/data')}
            >
              Start New Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownloadResume = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch('/api/time-machine/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'resume',
          data: prediction?.futureResume,
          prediction: {
            targetRole: prediction?.targetRole,
            salary: prediction?.salary,
            skills: prediction?.skills
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `future-resume-${targetRole?.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      // Show error toast if available
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadRoadmap = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch('/api/time-machine/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'roadmap',
          data: prediction?.roadmap,
          prediction: {
            targetRole: prediction?.targetRole,
            timeframe: prediction?.timeframe,
            projects: prediction?.projects,
            achievements: prediction?.achievements
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `growth-roadmap-${targetRole?.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading roadmap:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="p-2 text-white hover:bg-white/20"
                onClick={() => router.push("/time-machine")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold">🔥 Meet Your Future Self — {timeGoal} Days Later</h1>
                <p className="text-purple-100 mt-2">AI-Powered Prediction for {targetRole}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isDownloading}
                onClick={handleDownloadResume}
              >
                <Download className="h-4 w-4 mr-2" />
                Resume PDF
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isDownloading}
                onClick={handleDownloadRoadmap}
              >
                <Download className="h-4 w-4 mr-2" />
                Roadmap PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: '🎯 Overview', icon: Target },
              { id: 'skills', label: '📊 Future Skills', icon: BarChart3 },
              { id: 'projects', label: '🚀 Future Projects', icon: Rocket },
              { id: 'roadmap', label: '📅 Growth Roadmap', icon: Calendar },
              { id: 'salary', label: '💰 Salary & Role', icon: TrendingUp },
              { id: 'comparison', label: '📈 Before vs After', icon: TrendingUp },
              { id: 'resume', label: '📄 Future Resume', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Key Predictions Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-800 text-lg">
                    <Target className="h-6 w-6 mr-2" />
                    Future Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-900 mb-1">{prediction.jobRole?.predictedRole || 'Loading...'}</p>
                  <div className="flex items-center mb-2">
                    <Progress value={(prediction.jobRole?.confidence || 0) * 100} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-green-700 ml-2">{Math.round((prediction.jobRole?.confidence || 0) * 100)}%</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
                    Readiness: {Math.round((prediction.jobRole?.readinessScore || 0) * 100)}%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-800 text-lg">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Salary Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const salaryData = prediction.salary?.estimate 
                      ? formatSalaryWithBoth(prediction.salary.estimate)
                      : { lpa: convertSalaryRangeToLPA('$75k - $95k'), usd: '$75k - $95k' };
                    
return (
                      <>
                        <p className="text-lg font-bold text-blue-900 mb-1">{salaryData.lpa}</p>
                        <p className="text-sm text-blue-700 mb-2">
                          USD: {salaryData.usd}
                        </p>
                      </>
                    );
                  })()}
                  <p className="text-xs text-blue-600 mb-2">
                    {prediction.salary?.timeline || 'Expected within target timeframe'}
                  </p>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800 text-xs">
                    Market Validated
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-purple-800 text-lg">
                    <Award className="h-6 w-6 mr-2" />
                    Future Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-900 mb-1">{(prediction.projects || []).length}</p>
                  <p className="text-sm text-purple-700 mb-2">
                    Realistic project ideas
                  </p>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800 text-xs">
                    {(prediction.projects || [])[0]?.difficulty || 'Intermediate'} Level
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-orange-800 text-lg">
                    <Sparkles className="h-6 w-6 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-900 mb-1">{(prediction.achievements || []).length}</p>
                  <p className="text-sm text-orange-700 mb-2">
                    Milestone targets
                  </p>
                  <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-xs">
                    {timeGoal} Day Plan
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-purple-600" />
                Take Action Now
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isDownloading}
                  onClick={handleDownloadResume}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Future Resume
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={isDownloading}
                  onClick={handleDownloadRoadmap}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Download Roadmap
                </Button>

              </div>
            </div>

            {/* Future Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
                    Top Future Skills
                  </CardTitle>
                  <CardDescription>Your strongest predicted skills in {timeGoal} days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(prediction.skills)
                      .sort(([,a], [,b]) => b.future - a.future)
                      .slice(0, 5)
                      .map(([skill, data]) => (
                      <div key={skill} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-900">{skill}</span>
                            <span className="text-sm text-gray-600">{data.future}%</span>
                          </div>
                          <Progress value={data.future} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">+{data.future - data.current}% growth</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="h-6 w-6 mr-2 text-blue-600" />
                    Next Major Project
                  </CardTitle>
                  <CardDescription>Your most impactful upcoming project</CardDescription>
                </CardHeader>
                <CardContent>
                  {prediction.projects[0] && (
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{prediction.projects[0].title}</h4>
                      <p className="text-gray-600 mb-3">{prediction.projects[0].description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {prediction.projects[0].techStack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Impact:</p>
                        <p className="text-sm text-blue-700">{prediction.projects[0].impact}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Future Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Future Skills Projection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                AI analysis of your skill development over the next {timeGoal} days based on market trends and your learning patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(prediction.skills).map(([skill, data]) => (
                <Card key={skill} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{skill}</span>
                      <Badge variant={data.marketRelevance > 8 ? "default" : "secondary"}>
                        Market Relevance: {data.marketRelevance}/10
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Current Level</p>
                          <div className="flex items-center">
                            <Progress value={data.current} className="flex-1 h-2" />
                            <span className="ml-2 text-sm font-bold">{data.current}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Future Level</p>
                          <div className="flex items-center">
                            <Progress value={data.future} className="flex-1 h-2" />
                            <span className="ml-2 text-sm font-bold">{data.future}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-700">
                            +{data.improvement}% Growth Expected
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{data.reasoning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Future Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Future Project Portfolio</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Realistic project ideas tailored to your growth trajectory and current skill set.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(prediction.projects || []).map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant={
                        project.difficulty === 'Beginner' ? 'secondary' :
                        project.difficulty === 'Intermediate' ? 'default' : 'destructive'
                      }>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{project.role} • {project.timeline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Tech Stack:</h5>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium text-blue-900 mb-2">Expected Impact:</h5>
                      <p className="text-sm text-blue-700">{project.impact}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-2">Why This Is Realistic:</h5>
                      <p className="text-sm text-green-700">{project.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Growth Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your {timeGoal}-Day Growth Roadmap</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Structured daily, weekly, and monthly plans to achieve your future self.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 30 Day Plan */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Calendar className="h-6 w-6 mr-2" />
                    Days 1-30: Foundation
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Building core skills and habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Goals:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        {(prediction.roadmap?.day30?.goals || []).map((goal, index) => (
                          <li key={index}>• {goal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Weekly Missions:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        {(prediction.roadmap?.day30?.weeklyMissions || []).map((mission, index) => (
                          <li key={index}>
                            <Badge variant="outline" className="mr-2 text-xs">
                              Week {mission.week}
                            </Badge>
                            {mission.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Focus Areas:</h5>
                      <div className="flex flex-wrap gap-1">
                        {(prediction.roadmap?.day30?.focusAreas || []).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-200 text-green-800">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 60 Day Plan */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <Target className="h-6 w-6 mr-2" />
                    Days 31-60: Growth
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Advanced skill development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Goals:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {(prediction.roadmap?.day60?.goals || []).map((goal, index) => (
                          <li key={index}>• {goal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Weekly Missions:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {(prediction.roadmap?.day60?.weeklyMissions || []).map((mission, index) => (
                          <li key={index}>
                            <Badge variant="outline" className="mr-2 text-xs">
                              Week {mission.week}
                            </Badge>
                            {mission.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-900 mb-2">Focus Areas:</h5>
                      <div className="flex flex-wrap gap-1">
                        {(prediction.roadmap?.day60?.focusAreas || []).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-200 text-blue-800">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 90 Day Plan */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <Star className="h-6 w-6 mr-2" />
                    Days 61-90: Mastery
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Expert level and specialization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-purple-900 mb-2">Goals:</h5>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {(prediction.roadmap?.day90?.goals || []).map((goal, index) => (
                          <li key={index}>• {goal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-purple-900 mb-2">Weekly Missions:</h5>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {(prediction.roadmap?.day90?.weeklyMissions || []).map((mission, index) => (
                          <li key={index}>
                            <Badge variant="outline" className="mr-2 text-xs">
                              Week {mission.week}
                            </Badge>
                            {mission.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-900 mb-2">Focus Areas:</h5>
                      <div className="flex flex-wrap gap-1">
                        {(prediction.roadmap?.day90?.focusAreas || []).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-purple-200 text-purple-800">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievement Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-yellow-600" />
                  Achievement Timeline
                </CardTitle>
                <CardDescription>
                  Key milestones you'll achieve along your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(prediction.achievements || []).map((achievement, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{achievement.title}</h5>
                        <Badge variant={
                          achievement.difficulty === 'Easy' ? 'secondary' :
                          achievement.difficulty === 'Medium' ? 'default' : 'destructive'
                        } className="text-xs">
                          {achievement.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline">{achievement.category}</Badge>
                        <span className="text-gray-500">{achievement.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Salary & Role Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Future Career Profile</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Detailed analysis of your predicted role and compensation based on market data and skill development.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <User className="h-6 w-6 mr-2" />
                    Future Job Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-green-900 mb-2">
                        {prediction.jobRole?.predictedRole || 'Target Role'}
                      </h3>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-green-700 mr-2">Confidence:</span>
                        <Progress value={(prediction.jobRole?.confidence || 0) * 100} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-green-800 ml-2">
                          {Math.round((prediction.jobRole?.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <p className="text-green-700">{prediction.jobRole?.reasoning || 'Analyzing your profile...'}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-900 mb-3">Key Requirements:</h4>
                      <ul className="space-y-2">
                        {(prediction.jobRole?.requirements || []).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-green-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Target className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">Readiness Score</span>
                      </div>
                      <div className="flex items-center">
                        <Progress value={prediction.jobRole.readinessScore * 100} className="flex-1 h-3" />
                        <span className="text-lg font-bold text-green-800 ml-3">
                          {Math.round(prediction.jobRole.readinessScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Salary Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(() => {
                      const salaryData = prediction.salary?.estimate 
                        ? formatSalaryWithBoth(prediction.salary.estimate)
                        : { lpa: convertSalaryRangeToLPA('$75k - $95k'), usd: '$75k - $95k' };
                      return (
                        <div className="text-center">
                          <h3 className="text-4xl font-bold text-blue-900 mb-2">
                            {salaryData.lpa}
                          </h3>
                          <p className="text-blue-700 mb-2">
                            USD Range: {salaryData.usd}
                          </p>
                          {prediction.salary?.range && (
                            <p className="text-sm text-blue-600">
                              (₹{((prediction.salary.range.min * 1000 * 83) / 100000).toFixed(1)}L - ₹{((prediction.salary.range.max * 1000 * 83) / 100000).toFixed(1)}L annually)
                            </p>
                          )}
                        </div>
                      );
                    })()}
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-900 mb-3">Salary Factors:</h4>
                      <ul className="space-y-2">
                        {prediction.salary.factors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-blue-700">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Market Analysis:</h4>
                      <p className="text-sm text-blue-700">{prediction.salary.reasoning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Before vs After Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Transformation Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Visual comparison of your professional profile before and after the {timeGoal}-day transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current State */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <User className="h-6 w-6 mr-2" />
                    Current You (Today)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Top Skills:</h4>
                      <div className="space-y-2">
                        {Object.entries(prediction.comparison.current.skills).map(([skill, level]) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{skill}</span>
                            <div className="flex items-center">
                              <Progress value={level as number} className="w-20 h-2 mr-2" />
                              <span className="text-xs text-gray-600">{level}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{prediction.comparison.current.confidence}%</p>
                        <p className="text-sm text-gray-600">Confidence</p>
                      </div>
                      <div className="text-center p-3 bg-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{prediction.comparison.current.technicalDepth}/10</p>
                        <p className="text-sm text-gray-600">Technical Depth</p>
                      </div>
                      <div className="text-center p-3 bg-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{prediction.comparison.current.projects}</p>
                        <p className="text-sm text-gray-600">Projects</p>
                      </div>
                      <div className="text-center p-3 bg-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{prediction.comparison.current.readinessLevel}%</p>
                        <p className="text-sm text-gray-600">Job Readiness</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future State */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Star className="h-6 w-6 mr-2" />
                    Future You ({timeGoal} Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-900 mb-3">Enhanced Skills:</h4>
                      <div className="space-y-2">
                        {Object.entries(prediction.comparison.future.skills).map(([skill, level]) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span className="text-sm text-green-700">{skill}</span>
                            <div className="flex items-center">
                              <Progress value={level as number} className="w-20 h-2 mr-2" />
                              <span className="text-xs text-green-600">{level}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-200 rounded-lg">
                        <p className="text-2xl font-bold text-green-800">{prediction.comparison.future.confidence}%</p>
                        <p className="text-sm text-green-600">Confidence</p>
                        <p className="text-xs text-green-500">+{prediction.comparison.future.confidence - prediction.comparison.current.confidence}%</p>
                      </div>
                      <div className="text-center p-3 bg-green-200 rounded-lg">
                        <p className="text-2xl font-bold text-green-800">{prediction.comparison.future.technicalDepth}/10</p>
                        <p className="text-sm text-green-600">Technical Depth</p>
                        <p className="text-xs text-green-500">+{prediction.comparison.future.technicalDepth - prediction.comparison.current.technicalDepth}</p>
                      </div>
                      <div className="text-center p-3 bg-green-200 rounded-lg">
                        <p className="text-2xl font-bold text-green-800">{prediction.comparison.future.projects}</p>
                        <p className="text-sm text-green-600">Projects</p>
                        <p className="text-xs text-green-500">+{prediction.comparison.future.projects - prediction.comparison.current.projects}</p>
                      </div>
                      <div className="text-center p-3 bg-green-200 rounded-lg">
                        <p className="text-2xl font-bold text-green-800">{prediction.comparison.future.readinessLevel}%</p>
                        <p className="text-sm text-green-600">Job Readiness</p>
                        <p className="text-xs text-green-500">+{prediction.comparison.future.readinessLevel - prediction.comparison.current.readinessLevel}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                  Key Improvements
                </CardTitle>
                <CardDescription>
                  Specific areas where you'll see the most significant growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(prediction.skills)
                    .sort(([,a], [,b]) => b.improvement - a.improvement)
                    .slice(0, 3)
                    .map(([skill, data]) => (
                    <div key={skill} className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <h4 className="font-bold text-blue-900 text-lg mb-2">{skill}</h4>
                      <p className="text-3xl font-bold text-blue-600 mb-2">+{data.improvement}%</p>
                      <p className="text-sm text-blue-700">{data.current}% → {data.future}%</p>
                      <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Market Relevance: {data.marketRelevance}/10
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Future Resume Tab */}
        {activeTab === 'resume' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your AI-Enhanced Future Resume</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional, ATS-optimized resume incorporating your future skills and achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ATS Score */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
                    ATS Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {prediction.futureResume.atsScore}/100
                      </div>
                      <p className="text-green-700 font-medium">ATS Score</p>
                      <p className="text-sm text-gray-600 mt-1">Excellent for job portals</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Improvements:</h4>
                      <ul className="space-y-2">
                        {prediction.futureResume.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isDownloading}
                      onClick={handleDownloadResume}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Resume Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 text-sm font-mono max-h-96 overflow-y-auto">
                    {/* Resume Header */}
                    <div className="text-center mb-6 border-b pb-4">
                      <h3 className="text-lg font-bold">{prediction.futureResume.personalInfo.name}</h3>
                      <p className="text-gray-600">{prediction.futureResume.personalInfo.jobTitle}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        {prediction.futureResume.personalInfo.email} | {prediction.futureResume.personalInfo.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prediction.futureResume.personalInfo.location}
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 border-b">PROFESSIONAL SUMMARY</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {prediction.futureResume.personalInfo.summary}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 border-b">TECHNICAL SKILLS</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-800 mb-1">Technologies:</p>
                          <p className="text-gray-700">{prediction.futureResume.skills.technical.join(", ")}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 mb-1">Tools:</p>
                          <p className="text-gray-700">{prediction.futureResume.skills.tools.join(", ")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 border-b">PROFESSIONAL EXPERIENCE</h4>
                      {prediction.futureResume.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-baseline mb-1">
                            <h5 className="font-medium text-gray-900">{exp.role}</h5>
                            <span className="text-sm text-gray-600">{exp.duration}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 border-b">KEY PROJECTS</h4>
                      {prediction.futureResume.projects.map((project, index) => (
                        <div key={index} className="mb-3">
                          <h5 className="font-medium text-gray-900">{project.title}</h5>
                          <p className="text-sm text-gray-600 mb-1">{project.techStack.join(", ")}</p>
                          <p className="text-sm text-gray-700">{project.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    {prediction.futureResume.education.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2 border-b">EDUCATION</h4>
                        {prediction.futureResume.education.map((edu, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between items-baseline">
                              <span className="font-medium text-gray-900">{edu.degree}</span>
                              <span className="text-sm text-gray-600">{edu.year}</span>
                            </div>
                            <p className="text-sm text-gray-700">{edu.college}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}
