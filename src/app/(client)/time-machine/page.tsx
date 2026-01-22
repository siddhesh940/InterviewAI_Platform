"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeMachineStore } from "@/stores/timeMachineStore";
import { motion } from "framer-motion";
import { ArrowRight, Brain, DollarSign, Rocket, Sparkles, TrendingUp, Upload, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TimeMachinePage() {
  const router = useRouter();
  const { setCurrentStep } = useTimeMachineStore();

  const handleStartPrediction = () => {
    setCurrentStep(1);
    router.push("/time-machine/data");
  };

  const handleUploadResume = () => {
    setCurrentStep(1);
    router.push("/time-machine/data");
  };

  const handlePredictJobRole = () => {
    setCurrentStep(1);
    router.push("/time-machine/data");
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="content-container max-w-6xl">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div 
              className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg shadow-purple-200"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
            >
              <Zap className="h-10 w-10 text-white" />
            </motion.div>
            <motion.div 
              className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            <motion.div 
              className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="h-10 w-10 text-white" />
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Meet Your Future Self — Powered by AI Time Machine ⏳
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Predict who you will become in 30–90 days using resume + interview performance + AI analysis.
            Get detailed insights into your future skills, salary, projects, and career trajectory.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-5 text-lg font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-300"
                onClick={handleStartPrediction}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Prediction
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-5 text-lg font-semibold hover:shadow-lg transition-all duration-300"
                onClick={handleUploadResume}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Resume
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-5 text-lg font-semibold hover:shadow-lg transition-all duration-300"
                onClick={handlePredictJobRole}
              >
                <Brain className="h-5 w-5 mr-2" />
                Predict My Future Job Role
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-purple-500 h-full">
            <CardHeader>
              <div className="p-4 bg-purple-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-purple-100 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-purple-600 transition-colors">Future Skills Prediction</CardTitle>
              <CardDescription className="text-center mt-2">
                AI analyzes your current skills and predicts your growth trajectory over 30-90 days
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-purple-500">•</span> Current vs Future skill levels</li>
                <li className="flex items-center justify-center gap-2"><span className="text-purple-500">•</span> Market relevance analysis</li>
                <li className="flex items-center justify-center gap-2"><span className="text-purple-500">•</span> Improvement reasoning</li>
                <li className="flex items-center justify-center gap-2"><span className="text-purple-500">•</span> Skill gap identification</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-blue-500 h-full">
            <CardHeader>
              <div className="p-4 bg-blue-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-blue-100 transition-all duration-300">
                <Rocket className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-blue-600 transition-colors">Future Projects & Role</CardTitle>
              <CardDescription className="text-center mt-2">
                Discover realistic projects you can build and your predicted job role
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-blue-500">•</span> 2-4 tailored project ideas</li>
                <li className="flex items-center justify-center gap-2"><span className="text-blue-500">•</span> Predicted job role & salary</li>
                <li className="flex items-center justify-center gap-2"><span className="text-blue-500">•</span> Tech stack recommendations</li>
                <li className="flex items-center justify-center gap-2"><span className="text-blue-500">•</span> Impact & feasibility analysis</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-green-500 h-full">
            <CardHeader>
              <div className="p-4 bg-green-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-green-100 transition-all duration-300">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-green-600 transition-colors">30/60/90 Day Roadmap</CardTitle>
              <CardDescription className="text-center mt-2">
                Get a detailed growth plan with daily missions and weekly goals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-green-500">•</span> Daily action plans</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-500">•</span> Weekly missions</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-500">•</span> Monthly milestones</li>
                <li className="flex items-center justify-center gap-2"><span className="text-green-500">•</span> Progress tracking</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-amber-500 h-full">
            <CardHeader>
              <div className="p-4 bg-amber-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-amber-100 transition-all duration-300">
                <DollarSign className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-amber-600 transition-colors">Salary Prediction</CardTitle>
              <CardDescription className="text-center mt-2">
                AI predicts your realistic salary range after 30/60/90 days based on skills, projects, experience, and market demand.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-amber-500">•</span> Current vs future salary</li>
                <li className="flex items-center justify-center gap-2"><span className="text-amber-500">•</span> Market-based salary range</li>
                <li className="flex items-center justify-center gap-2"><span className="text-amber-500">•</span> Skill impact on pay</li>
                <li className="flex items-center justify-center gap-2"><span className="text-amber-500">•</span> Growth potential</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>

          {/* Future Resume Generation card removed - feature disabled */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-indigo-500 h-full">
            <CardHeader>
              <div className="p-4 bg-indigo-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-indigo-100 transition-all duration-300">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-indigo-600 transition-colors">AI-Powered Analysis</CardTitle>
              <CardDescription className="text-center mt-2">
                Advanced AI analyzes your interview performance and market trends
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-indigo-500">•</span> Interview performance insights</li>
                <li className="flex items-center justify-center gap-2"><span className="text-indigo-500">•</span> Market trend analysis</li>
                <li className="flex items-center justify-center gap-2"><span className="text-indigo-500">•</span> Behavioral patterns</li>
                <li className="flex items-center justify-center gap-2"><span className="text-indigo-500">•</span> Growth opportunities</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
          <Card className="card-bordered group cursor-pointer hover:shadow-xl border-l-4 border-l-pink-500 h-full">
            <CardHeader>
              <div className="p-4 bg-pink-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-pink-100 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-center group-hover:text-pink-600 transition-colors">Before vs After</CardTitle>
              <CardDescription className="text-center mt-2">
                Visual comparison of your current vs future professional profile
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2.5">
                <li className="flex items-center justify-center gap-2"><span className="text-pink-500">•</span> Skills progression chart</li>
                <li className="flex items-center justify-center gap-2"><span className="text-pink-500">•</span> Confidence improvement</li>
                <li className="flex items-center justify-center gap-2"><span className="text-pink-500">•</span> Technical depth growth</li>
                <li className="flex items-center justify-center gap-2"><span className="text-pink-500">•</span> Readiness score increase</li>
              </ul>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
        <Card className="card-bordered p-10 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">How Time Machine Works ⚙️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="p-5 bg-blue-50 rounded-2xl mx-auto mb-5 w-fit group-hover:bg-blue-100 transition-all duration-300">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">1. Data Collection</h3>
              <p className="text-gray-600">
                Upload your resume and let AI automatically gather your interview performance data from our platform.
              </p>
            </div>
            <div className="text-center group">
              <div className="p-5 bg-purple-50 rounded-2xl mx-auto mb-5 w-fit group-hover:bg-purple-100 transition-all duration-300 icon-hover-scale">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your skills, performance patterns, and market trends to predict your growth.
              </p>
            </div>
            <div className="text-center group">
              <div className="p-5 bg-green-50 rounded-2xl mx-auto mb-5 w-fit group-hover:bg-green-100 transition-all duration-300 icon-hover-scale">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">3. Future Prediction</h3>
              <p className="text-gray-600">
                Get detailed predictions including future resume, salary estimate, and personalized growth roadmap.
              </p>
            </div>
          </div>
        </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-14 text-white shadow-xl shadow-indigo-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-3xl font-bold mb-5">Ready to Meet Your Future Self? 🚀</h2>
          <p className="text-xl mb-10 opacity-90 max-w-xl mx-auto">
            Start your AI-powered career prediction journey today.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-50 px-14 py-5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleStartPrediction}
            >
              <Zap className="h-5 w-5 mr-2" />
              Begin Time Machine Analysis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
