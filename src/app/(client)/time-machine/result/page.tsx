"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimeMachineStore } from "@/stores/timeMachineStore";
import {
  ArrowLeft,
  Award,
  BarChart3, Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TimeMachineResultFixed() {
  const router = useRouter();
  const { analysisData, goalData } = useTimeMachineStore();
  const [activeTab, setActiveTab] = useState('overview');
  // const [isDownloading, setIsDownloading] = useState(false); // Removed - download feature disabled
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  // Extract values for easier use
  const prediction = analysisData;
  const targetRole = goalData.targetRole;
  const timeGoal = goalData.timeGoal;

  useEffect(() => {
    // Show no data message after delay to allow store hydration
    const timer = setTimeout(() => {
      if (!prediction) {
        setShowNoDataMessage(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [prediction]);

  // Show loading state
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

  // Show message to start new analysis if no data
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

  // Calculate derived metrics from prediction data
  const skills = prediction?.skills || {};
  const skillEntries = Object.entries(skills);
  
  const overallGrowth = skillEntries.length > 0
    ? Math.round(
        skillEntries.reduce(
          (sum, [, data]) => {
            const skillData = data as any;
            
return sum + ((skillData.future || 0) - (skillData.current || 0));
          },
          0
        ) / skillEntries.length
      )
    : 0;

  const newSkillsCount = skillEntries.filter(
    ([, data]) => {
      const skillData = data as any;
      
return (skillData.current || 0) === 0 && (skillData.future || 0) > 0;
    }
  ).length;

  const skillsToImprove = skillEntries.filter(
    ([, data]) => {
      const skillData = data as any;
      
return (skillData.current || 0) > 0 && (skillData.improvement || 0) > 0;
    }
  ).length;

  // Extract salary values safely
  const salaryRange = prediction?.salary?.range || { min: 5, max: 10 };
  const currentSalary = salaryRange.min || 5;
  const futureSalaryMax = salaryRange.max || 10;
  
  // Calculate growth from salary range
  const salaryGrowthMin = Math.round((futureSalaryMax - currentSalary) * 0.8);
  const salaryGrowthMax = Math.round((futureSalaryMax - currentSalary) * 1.2);

  // Format salary for clean display (e.g., "₹15L" not "₹15.519999999L")
  const formatSalary = (value: number) => {
    return Math.round(value); // Round to whole number for clean display
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
            {/* Download buttons removed - feature disabled */}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'skills', label: 'Future Skills', icon: TrendingUp },
              { id: 'projects', label: 'Future Projects', icon: Rocket },
              { id: 'roadmap', label: 'Growth Roadmap', icon: Target },
              { id: 'salary', label: 'Salary Projection', icon: BarChart3 },
              { id: 'comparison', label: 'Before vs After', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Future Self Snapshot</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                AI analysis shows your professional growth trajectory over the next {timeGoal} days.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Key Stats */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-yellow-600" />
                    Key Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Skill Growth</span>
                        <span className="font-bold text-green-600">+{overallGrowth}%</span>
                      </div>
                      <Progress value={Math.min(overallGrowth, 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">New Skills</span>
                        <span className="font-bold text-blue-600">{newSkillsCount}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Skills to Improve</span>
                        <span className="font-bold text-purple-600">{skillsToImprove}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Future Projects</span>
                        <span className="font-bold text-orange-600">{prediction?.projects?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Projection */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
                    Salary Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {prediction?.salary?.estimate || 'TBD'}
                      </div>
                      <p className="text-sm text-gray-600">Expected in {timeGoal} days</p>
                    </div>
                    {salaryGrowthMin > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-800">Projected Growth</span>
                          <span className="font-bold text-green-600">+₹{formatSalary(salaryGrowthMin)} - ₹{formatSalary(salaryGrowthMax)}L</span>
                        </div>
                      </div>
                    )}
                    {prediction?.salary?.range && (
                      <div className="text-sm text-gray-600">
                        Range: ₹{prediction.salary.range.min}L - ₹{prediction.salary.range.max}L
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Target Role Info */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    Role Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{targetRole}</div>
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-sm text-gray-600 mr-2">Readiness Score</span>
                        <span className="font-bold text-purple-600">
                          {prediction?.jobRole?.readinessScore || 85}%
                        </span>
                      </div>
                      <Progress value={prediction?.jobRole?.readinessScore || 85} className="h-2 mb-4" />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">
                        {prediction?.jobRole?.reasoning || `Ready for ${targetRole} role after ${timeGoal} days of focused development.`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements Preview */}
            {prediction?.achievements && prediction.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-yellow-600" />
                    Expected Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prediction.achievements.slice(0, 6).map((achievement: any, index: number) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Star className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {achievement.title || achievement}
                            </h4>
                            {achievement.description && (
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            )}
                            {achievement.timeline && (
                              <span className="text-xs text-purple-600 font-medium mt-2 inline-block">
                                {achievement.timeline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Future Skills Development</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your skill progression plan over the next {timeGoal} days
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {skillEntries.map(([skillName, skillData]) => {
                const skill = skillData as any;
                // Determine skill level label
                const getLevelLabel = (level: number) => {
                  if (level >= 80) {
                    return { label: 'Advanced', color: 'bg-green-100 text-green-800' };
                  }
                  if (level >= 50) {
                    return { label: 'Intermediate', color: 'bg-blue-100 text-blue-800' };
                  }
                  
                  return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-800' };
                };
                const futureLevel = getLevelLabel(skill.future || 0);
                
                return (
                  <Card key={skillName}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skillName}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={futureLevel.color}>
                            {futureLevel.label}
                          </Badge>
                          <Badge variant={skill.priority === 'High' ? 'default' : 'secondary'}>
                            {skill.priority || 'Medium'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Current: {skill.current || 0}%</span>
                            <span>Future: {skill.future || 0}%</span>
                          </div>
                          <Progress 
                            value={skill.future || 0} 
                            className="h-3"
                          />
                          <div className="text-right text-sm text-green-600 font-medium mt-1">
                            +{skill.improvement || 0}% improvement
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                          {skill.reasoning || `Skill development planned for ${skillName}`}
                        </div>
                        
                        {/* Skill importance and focus recommendation */}
                        <div className="bg-blue-50 p-3 rounded border border-blue-100">
                          <p className="text-xs text-blue-700">
                            <strong>💡 Focus Tip:</strong> {skill.current === 0 
                              ? `Start with ${skillName} fundamentals in the first ${Math.ceil(timeGoal / 3)} days for a strong foundation.`
                              : `Dedicate ${Math.ceil((skill.improvement || 10) / 5)} hours/week to advance your ${skillName} skills.`
                            }
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Market Relevance:</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (skill.marketRelevance || 5) / 2 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Tab - Enhanced Interactive Cards */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Future Projects Portfolio</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {prediction?.projects?.length || 0} projects designed based on your resume gaps, target role, and {timeGoal}-day timeline
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {(prediction?.projects || []).map((project: any, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <Card key={`project-${index}`} className="overflow-hidden border-l-4 border-l-purple-500">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          project.difficulty === 'Advanced' ? 'destructive' :
                          project.difficulty === 'Intermediate' ? 'default' : 'secondary'
                        }>
                          {project.difficulty || 'Intermediate'}
                        </Badge>
                        {project.timeline && (
                          <Badge variant="outline" className="bg-white">
                            ⏱️ {project.timeline}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="mt-2 text-gray-700">{project.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          🛠️ Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech: string, techIndex: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Badge key={`tech-${techIndex}`} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Two-column layout for details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* What You Will Build */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          🏗️ What You&#39;ll Build
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                          {(project.whatYouWillBuild || [
                            'Core application functionality',
                            'User authentication system',
                            'RESTful API integration',
                            'Responsive UI components',
                            'Error handling and validation'
                          ]).slice(0, 5).map((item: string, i: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={`build-${i}`} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Why This Matters */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          💡 Why This Matters
                        </h4>
                        <p className="text-sm text-green-800">
                          {project.whyThisMatters || `This project demonstrates ${project.difficulty === 'Advanced' ? 'expert-level' : 'solid'} ${targetRole} capabilities. Building ${project.title} shows you can handle real-world challenges within a ${timeGoal}-day timeline.`}
                        </p>
                        {project.addressesSkillGaps && project.addressesSkillGaps.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">Addresses skill gaps:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.addressesSkillGaps.map((gap: string, i: number) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Badge key={`gap-${i}`} variant="outline" className="text-xs bg-green-100 border-green-300 text-green-800">
                                  {gap}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* What Recruiter Learns */}
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                          👔 What Recruiter Learns
                        </h4>
                        <ul className="text-sm text-purple-800 space-y-2">
                          {(project.whatRecruiterLearns || [
                            `Proficient in ${project.techStack?.[0] || 'modern technologies'}`,
                            `Can build ${project.difficulty?.toLowerCase() || 'production'}-level apps`,
                            `Understands ${targetRole} best practices`
                          ]).slice(0, 4).map((item: string, i: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={`recruiter-${i}`} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resume Impact */}
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                          📄 Resume Impact
                        </h4>
                        <p className="text-sm text-orange-800 mb-3">
                          {project.resumeImpact || `Adds a standout portfolio piece demonstrating ${targetRole} expertise and real-world problem-solving ability.`}
                        </p>
                        {project.impact && (
                          <div className="bg-orange-100 p-2 rounded text-xs text-orange-700">
                            <strong>Measurable outcome:</strong> {project.impact}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    {project.learningOutcomes && project.learningOutcomes.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          🎯 Learning Outcomes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {project.learningOutcomes.slice(0, 5).map((outcome: string, i: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={`outcome-${i}`} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                              {outcome}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!prediction?.projects || prediction.projects.length === 0) && (
              <div className="text-center py-12">
                <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Generated</h3>
                <p className="text-gray-600">Projects will be generated based on your skill development plan.</p>
              </div>
            )}
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Growth Roadmap</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your step-by-step learning journey over {timeGoal} days
              </p>
            </div>

            {prediction?.roadmap ? (
              <div className="space-y-8">
                {Object.entries(prediction.roadmap).map(([phase, phaseData], phaseIndex) => {
                  const data = phaseData as any;
                  const phaseNumber = parseInt(phase.replace('day', '')) || (phaseIndex + 1) * 30;
                  const isActive = phaseNumber <= timeGoal;
                  
return (
                    <Card key={phase} className={`${!isActive ? 'opacity-50' : ''} border-l-4 ${
                      phaseIndex === 0 ? 'border-l-green-500' : 
                      phaseIndex === 1 ? 'border-l-blue-500' : 'border-l-purple-500'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl capitalize flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                              phaseIndex === 0 ? 'bg-green-500' : 
                              phaseIndex === 1 ? 'bg-blue-500' : 'bg-purple-500'
                            }`}>
                              {phaseIndex + 1}
                            </div>
                            {phase.replace('day', 'Day ')} Phase
                          </CardTitle>
                          {!isActive && (
                            <Badge variant="outline" className="text-gray-500">
                              Not included in {timeGoal}-day plan
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {phaseIndex === 0 ? 'Foundation & Quick Wins' : 
                           phaseIndex === 1 ? 'Skill Building & Projects' : 'Mastery & Career Readiness'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {data.goals && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">🎯 Phase Goals:</h4>
                            <ul className="space-y-2">
                              {data.goals.map((goal: string, index: number) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <li key={index} className="flex items-start space-x-2">
                                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    phaseIndex === 0 ? 'bg-green-500' : 
                                    phaseIndex === 1 ? 'bg-blue-500' : 'bg-purple-500'
                                  }`} />
                                  <span className="text-gray-600">{goal}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {data.monthlyMilestones && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">🏆 Key Milestones:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {data.monthlyMilestones.map((milestone: string, index: number) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={index} className={`p-3 rounded-lg border ${
                                  phaseIndex === 0 ? 'bg-green-50 border-green-200' : 
                                  phaseIndex === 1 ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'
                                }`}>
                                  <div className="flex items-center space-x-2">
                                    <Award className={`h-4 w-4 ${
                                      phaseIndex === 0 ? 'text-green-600' : 
                                      phaseIndex === 1 ? 'text-blue-600' : 'text-purple-600'
                                    }`} />
                                    <span className={`text-sm ${
                                      phaseIndex === 0 ? 'text-green-800' : 
                                      phaseIndex === 1 ? 'text-blue-800' : 'text-purple-800'
                                    }`}>{milestone}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Weekly breakdown */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">📅 Weekly Focus:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[1, 2, 3, 4].slice(0, Math.ceil(phaseNumber / 7.5)).map((week) => (
                              <div key={week} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium text-gray-800">Week {week + (phaseIndex * 4)}:</span>
                                {phaseIndex === 0 
                                  ? (week <= 2 ? 'Core concepts & setup' : 'First project development')
                                  : phaseIndex === 1 
                                  ? (week <= 2 ? 'Advanced features' : 'Project completion')
                                  : (week <= 2 ? 'Portfolio polish' : 'Interview preparation')
                                }
                              </div>
                            ))}
                          </div>
                        </div>

                        {data.focusAreas && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">🔧 Focus Areas:</h4>
                            <div className="flex flex-wrap gap-2">
                              {data.focusAreas.map((area: string, index: number) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Badge key={index} variant="outline" className={
                                  phaseIndex === 0 ? 'border-green-300 text-green-700' : 
                                  phaseIndex === 1 ? 'border-blue-300 text-blue-700' : 'border-purple-300 text-purple-700'
                                }>{area}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Roadmap Not Available</h3>
                <p className="text-gray-600">Roadmap will be generated based on your analysis.</p>
              </div>
            )}
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary Projection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Expected salary growth based on skill development and market demand
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {prediction?.salary?.estimate || 'TBD'}
                      </div>
                      <p className="text-gray-600">Expected after {timeGoal} days</p>
                    </div>

                    {prediction?.salary?.range && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Salary Range</h4>
                        <div className="flex justify-between text-sm">
                          <span>Minimum: ₹{prediction.salary.range.min}L</span>
                          <span>Maximum: ₹{prediction.salary.range.max}L</span>
                        </div>
                        <Progress 
                          value={75} 
                          className="mt-2 h-2"
                        />
                      </div>
                    )}

                    {salaryGrowthMin > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">Projected Growth</h4>
                        <div className="text-2xl font-bold text-green-600">+₹{formatSalary(salaryGrowthMin)} - ₹{formatSalary(salaryGrowthMax)}L</div>
                        <p className="text-sm text-green-700">Annual increase potential</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prediction?.salary?.factors ? (
                      prediction.salary.factors.map((factor: string, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">{factor}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">Enhanced technical skills</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">Portfolio project completion</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">{targetRole} market demand</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">Professional development</span>
                        </div>
                      </>
                    )}

                    {prediction?.salary?.reasoning && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                        <h4 className="font-medium text-blue-800 mb-2">Analysis</h4>
                        <p className="text-sm text-blue-700">{prediction.salary.reasoning}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Before vs After Comparison</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See your realistic transformation over {timeGoal} days based on your current resume and goals
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-gray-400">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-6 w-6 mr-2 text-gray-600" />
                    Current State (From Your Resume)
                  </CardTitle>
                  <CardDescription>Based on your uploaded resume analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence Level</span>
                      <span className="font-bold">{prediction?.comparison?.current?.confidence || 65}%</span>
                    </div>
                    <Progress value={prediction?.comparison?.current?.confidence || 65} className="h-2 bg-gray-200" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Technical Depth</span>
                      <span className="font-bold">{prediction?.comparison?.current?.technicalDepth || 60}%</span>
                    </div>
                    <Progress value={prediction?.comparison?.current?.technicalDepth || 60} className="h-2 bg-gray-200" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Projects Count</span>
                      <span className="font-bold">{prediction?.comparison?.current?.projects || 2}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Role Readiness</span>
                      <span className="font-bold">{prediction?.comparison?.current?.readinessLevel || 60}%</span>
                    </div>
                    <Progress value={prediction?.comparison?.current?.readinessLevel || 60} className="h-2 bg-gray-200" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Skills Count</span>
                      <span className="font-bold">{Object.keys(prediction?.comparison?.current?.skills || {}).length || skillEntries.filter(([,d]) => (d as any).current > 0).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-green-600" />
                    Future State (After {timeGoal} Days)
                  </CardTitle>
                  <CardDescription>Achievable with focused effort and the roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence Level</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{prediction?.comparison?.future?.confidence || 90}%</span>
                        <span className="text-xs text-green-600">+{(prediction?.comparison?.future?.confidence || 90) - (prediction?.comparison?.current?.confidence || 65)}%</span>
                      </div>
                    </div>
                    <Progress value={prediction?.comparison?.future?.confidence || 90} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Technical Depth</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{prediction?.comparison?.future?.technicalDepth || 85}%</span>
                        <span className="text-xs text-green-600">+{(prediction?.comparison?.future?.technicalDepth || 85) - (prediction?.comparison?.current?.technicalDepth || 60)}%</span>
                      </div>
                    </div>
                    <Progress value={prediction?.comparison?.future?.technicalDepth || 85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Projects Count</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">
                          {(prediction?.comparison?.current?.projects || 2) + (prediction?.projects?.length || 1)}
                        </span>
                        <span className="text-xs text-green-600">+{prediction?.projects?.length || 1} new</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Role Readiness</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{prediction?.comparison?.future?.readinessLevel || 85}%</span>
                        <span className="text-xs text-green-600">+{(prediction?.comparison?.future?.readinessLevel || 85) - (prediction?.comparison?.current?.readinessLevel || 60)}%</span>
                      </div>
                    </div>
                    <Progress value={prediction?.comparison?.future?.readinessLevel || 85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Skills Count</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{skillEntries.length}</span>
                        <span className="text-xs text-green-600">+{newSkillsCount} new</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Summary */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Growth Summary for {timeGoal} Days</CardTitle>
                <CardDescription>
                  This growth is achievable through consistent effort following the roadmap above
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">+{overallGrowth}%</div>
                    <p className="text-gray-600 text-sm">Avg Skill Growth</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{newSkillsCount}</div>
                    <p className="text-gray-600 text-sm">New Skills</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {prediction?.projects?.length || 0}
                    </div>
                    <p className="text-gray-600 text-sm">New Projects</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      +₹{formatSalary(salaryGrowthMin)} - ₹{formatSalary(salaryGrowthMax)}L
                    </div>
                    <p className="text-gray-600 text-sm">Salary Potential</p>
                  </div>
                </div>
                
                {/* Realistic expectations note */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Note:</strong> This projection assumes {timeGoal === 30 ? '2-3 hours' : timeGoal === 60 ? '3-4 hours' : '4-5 hours'} of 
                    focused learning daily. Results may vary based on your dedication, prior experience, and learning pace.
                    The roadmap is designed to be realistic and achievable.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
