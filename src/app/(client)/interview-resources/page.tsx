"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Eye, FileText, FolderOpen, Library } from "lucide-react";
import { useEffect, useState } from "react";

interface PDFFile {
  name: string;
  displayName: string;
  path: string;
}

export default function InterviewResourcesPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch PDF files from the API
    const fetchPDFs = async () => {
      try {
        const response = await fetch('/api/interview-resources');
        const files = await response.json();
        setPdfFiles(files);
      } catch (error) {
        console.error('Error fetching PDF files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);


  const handleView = (filename: string) => {
    const url = `/InterviewPrep/${encodeURIComponent(filename)}`;
    window.open(url, '_blank');
  };

  const handleDownload = (filename: string) => {
    const url = `/InterviewPrep/${encodeURIComponent(filename)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl section-icon">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Resource Hub</h1>
              <p className="text-gray-600 mt-1">
                Access curated interview preparation PDFs to boost your learning and readiness.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 grid-animate">
          <Card className="card-bordered hover:border-blue-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl icon-hover-scale">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Available Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{pdfFiles.length} PDFs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-emerald-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl icon-hover-scale">
                  <Library className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Topics Covered</p>
                  <p className="text-2xl font-bold text-gray-900">10+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-purple-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl icon-hover-scale">
                  <FolderOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">Multiple</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-animate">
          {pdfFiles.map((pdf, index) => (
            <Card 
              key={pdf.name} 
              className="card-bordered group hover:shadow-xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-xl flex-shrink-0 group-hover:bg-red-100 transition-colors icon-hover-scale">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {pdf.displayName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1.5">
                      Click to view or download
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white btn-premium"
                    size="sm"
                    onClick={() => handleView(pdf.name)}
                  >
                    <Eye className="h-4 w-4 mr-1.5" />
                    View PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                    size="sm"
                    onClick={() => handleDownload(pdf.name)}
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pdfFiles.length === 0 && !loading && (
          <div className="text-center py-12 animate-fade-in">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600">
              No PDF files were found in the interview preparation folder.
            </p>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-10 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-100 animate-fade-in-up delay-300">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-full icon-hover-float">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Comprehensive Interview Preparation
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              Access a wide range of interview preparation materials covering programming languages, 
              system design, databases, and more to help you ace your next technical interview.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
