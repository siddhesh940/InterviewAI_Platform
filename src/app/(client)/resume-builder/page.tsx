"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileCheck, FileText, Palette, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumeBuilderPage() {
  const router = useRouter();

  return (
    <div className="page-container">
      <div className="content-container max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl section-icon">
              <FileCheck className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Builder — Professional Edition
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create polished, ATS-ready resumes tailored for top companies with our professional templates and AI-powered optimization.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 grid-animate">
          <Card 
            className="card-bordered group cursor-pointer hover:shadow-xl"
            onClick={() => router.push("/resume-builder/templates")}
          >
            <CardHeader className="text-center pb-4">
              <div className="p-5 bg-purple-50 rounded-2xl mx-auto mb-4 w-fit group-hover:bg-purple-100 transition-all duration-300 group-hover:scale-105">
                <Palette className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold group-hover:text-purple-600 transition-colors">Choose Template</CardTitle>
              <CardDescription className="text-base mt-2">
                Select from our collection of professional, ATS-optimized resume templates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 btn-premium py-3">
                Browse Templates
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="card-bordered group cursor-pointer hover:shadow-xl"
            onClick={() => router.push("/resume-builder/build")}
          >
            <CardHeader className="text-center pb-4">
              <div className="p-5 bg-green-50 rounded-2xl mx-auto mb-4 w-fit group-hover:bg-green-100 transition-all duration-300 group-hover:scale-105">
                <FileText className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold group-hover:text-green-600 transition-colors">Build Resume</CardTitle>
              <CardDescription className="text-base mt-2">
                Create your professional resume with our step-by-step builder and download PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full bg-green-600 hover:bg-green-700 btn-premium py-3">
                Start Building
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="card-bordered p-8 mb-12 animate-fade-in-up delay-150">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Resume Builder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="p-4 bg-blue-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-blue-100 transition-all duration-300 icon-hover-scale">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ATS Optimized</h3>
              <p className="text-sm text-gray-600">All templates pass Applicant Tracking Systems</p>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-green-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-green-100 transition-all duration-300 icon-hover-scale">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
              <p className="text-sm text-gray-600">Modern, clean templates used by top companies</p>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-purple-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-purple-100 transition-all duration-300 icon-hover-scale">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Enhancement</h3>
              <p className="text-sm text-gray-600">AI-powered content optimization and suggestions</p>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-orange-50 rounded-xl mx-auto mb-4 w-fit group-hover:bg-orange-100 transition-all duration-300 icon-hover-scale">
                <Save className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Export & Save</h3>
              <p className="text-sm text-gray-600">Download high-quality PDFs and save multiple versions</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up delay-300">
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 p-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full icon-hover-float">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to create your professional resume?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join thousands of professionals who landed their dream jobs using our resume builder.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 px-10 py-4 text-base btn-premium"
              onClick={() => router.push("/resume-builder/templates")}
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
