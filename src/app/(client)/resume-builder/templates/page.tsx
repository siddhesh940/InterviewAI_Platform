"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileCheck, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const templates = [
  {
    id: "executive-minimal",
    name: "Executive Minimal",
    description: "Black & Grey theme with perfect spacing and thin separators. HR-preferred design.",
    color: "bg-gray-900",
    textColor: "text-white",
    features: ["Clean Layout", "Professional Typography", "HR Approved"],
    preview: "Clean, minimalist design with bold job titles and elegant spacing"
  },
  {
    id: "modern-blue",
    name: "Modern Blue Accent",
    description: "Blue headers with section icons and right column highlights. Used by FAANG candidates.",
    color: "bg-blue-600",
    textColor: "text-white",
    features: ["Section Icons", "Color Accents", "FAANG Approved"],
    preview: "Modern design with strategic blue accents and professional icons"
  },
  {
    id: "corporate-clean",
    name: "Clean Corporate",
    description: "Serif fonts with clean margins. Very formal design perfect for MNC interviews.",
    color: "bg-slate-700",
    textColor: "text-white",
    features: ["Serif Typography", "Formal Layout", "MNC Ready"],
    preview: "Traditional corporate design with sophisticated typography"
  },
  {
    id: "developer-tech",
    name: "Developer Tech Resume",
    description: "Emphasis on Projects & Skills with code-style labels and modern monospace titles.",
    color: "bg-green-600",
    textColor: "text-white",
    features: ["Tech Focused", "Project Showcase", "Developer Friendly"],
    preview: "Tech-savvy design perfect for software developers and engineers"
  },
  {
    id: "ats-pure",
    name: "ATS Pure Text",
    description: "100% Applicant Tracking System safe with no graphics. Perfect for job portals.",
    color: "bg-orange-600",
    textColor: "text-white",
    features: ["100% ATS Safe", "Text Based", "Portal Optimized"],
    preview: "Simple, text-based design guaranteed to pass all ATS systems"
  }
];

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.push("/resume-builder")}
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Templates</h1>
              <p className="text-gray-600 mt-1">
                Choose from our collection of ATS-optimized, recruiter-approved resume templates
              </p>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                {/* Template Preview */}
                <div className="h-48 bg-white border-2 border-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  <div className={`h-12 ${template.color} flex items-center px-4`}>
                    <div className={`h-2 w-24 bg-white bg-opacity-80 rounded`} />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="h-1 w-16 bg-gray-300 rounded" />
                    <div className="h-1 w-20 bg-gray-200 rounded" />
                    <div className="h-1 w-24 bg-gray-300 rounded mt-3" />
                    <div className="h-1 w-32 bg-gray-200 rounded" />
                    <div className="h-1 w-28 bg-gray-200 rounded" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-1 w-8 bg-gray-300 rounded" />
                      <div className="h-1 w-8 bg-gray-300 rounded" />
                      <div className="h-1 w-8 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <FileCheck className="h-4 w-4 text-green-600" />
                  </div>
                </div>

                <CardTitle className="text-xl font-semibold text-gray-900">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.preview}</p>

                {/* Use Template Button */}
                <Button 
                  className="w-full group-hover:shadow-md transition-all"
                  onClick={() => router.push(`/resume-builder/build?template=${template.id}`)}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Not Sure Which Template to Choose?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Corporate Roles</h3>
              <p className="text-sm text-gray-600">Executive Minimal or Clean Corporate work best for traditional companies and formal positions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Tech Roles</h3>
              <p className="text-sm text-gray-600">Developer Tech Resume or Modern Blue Accent are perfect for software engineering and tech positions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Job Portals</h3>
              <p className="text-sm text-gray-600">ATS Pure Text ensures 100% compatibility with all job portals and automated systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
