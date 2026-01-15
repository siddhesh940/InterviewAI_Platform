"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Download, Eye, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PDFFile {
  name: string;
  displayName: string;
}

interface CompanyData {
  name: string;
  slug: string;
  description: string;
  logoPath: string;
  pdfs: PDFFile[];
  totalResources: number;
}

export default function CompanyResourcePage() {
  const router = useRouter();
  const params = useParams();
  const companySlug = params.companySlug as string;
  
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/dream-company/${companySlug}`);
        if (response.ok) {
          const data = await response.json();
          setCompanyData(data);
        } else {
          console.error('Company not found');
          setCompanyData(null);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setCompanyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companySlug]);

  const handleView = (filename: string) => {
    const pdfPath = `/${companyData!.name}/${filename}`;
    window.open(pdfPath, '_blank');
  };

  const handleDownload = (filename: string) => {
    const pdfPath = `/${companyData!.name}/${filename}`;
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company resources...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Company Resources</h3>
          <p className="text-gray-600 mb-4">Please wait while we load the company resources...</p>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Company Not Found</h3>
          <p className="text-gray-600 mb-4">The requested company resources could not be found.</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dream-company')}>
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/dream-company')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <img 
                src={companyData.logoPath}
                alt={`${companyData.name} Logo`}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<div class="h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">${companyData.name.charAt(0)}</div>`;
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{companyData.name} Resources</h1>
              <p className="text-gray-600 mt-1">
                {companyData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Resources</p>
                  <p className="text-xl font-semibold">{companyData.totalResources} PDFs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Grid - Exactly like Interview Resource Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyData.pdfs.map((pdf) => (
            <Card key={pdf.name} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {pdf.displayName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to view or download
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    onClick={() => handleView(pdf.name)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                    size="sm"
                    onClick={() => handleDownload(pdf.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Resources Found - Same style as Interview Resource Hub */}
        {companyData.pdfs.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600">
              No PDF files were found for {companyData.name} preparation materials.
            </p>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {companyData.name} Interview Preparation
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Access specialized interview preparation materials for {companyData.name}. 
              These resources are curated to help you succeed in their specific interview process.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
