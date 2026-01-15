"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Company {
  name: string;
  slug: string;
  description: string;
  logoPath: string;
  resourceCount: number;
}

// Map company slugs to actual logo filenames in /public/company-logos/
const COMPANY_LOGO_MAP: Record<string, string> = {
  'accenture': 'ACN_BIG.png',
  'capgemini': 'CAP.PA_BIG.png', 
  'cognizant': 'CTSH_BIG.png',
  'infosys': 'INFY_BIG.png',
  'tcs': 'TCS.NS_BIG.png',
  'wipro': 'WIT.png',
};

export default function DreamCompanyStationPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/dream-company');
        const companiesData = await response.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const getLogoPath = (slug: string): string | null => {
    const logoFile = COMPANY_LOGO_MAP[slug.toLowerCase()];
    return logoFile ? `/company-logos/${logoFile}` : null;
  };

  const handleLogoError = (slug: string) => {
    setLogoErrors(prev => new Set(prev).add(slug));
  };

  const handleCompanyClick = (companySlug: string) => {
    router.push(`/dream-company/${companySlug}`);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading companies...</p>
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
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl section-icon">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dream Company Station</h1>
              <p className="text-gray-600 mt-1">
                Access company-specific preparation materials, coding resources, and placement guides
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 grid-animate">
          <Card className="card-bordered hover:border-blue-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl icon-hover-scale">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-green-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl icon-hover-scale">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{companies.reduce((total, company) => total + company.resourceCount, 0)}+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-purple-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl icon-hover-scale">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-orange-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl icon-hover-scale">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Placements</p>
                  <p className="text-2xl font-bold text-gray-900">1000+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-animate">
          {companies.map((company) => {
            const logoPath = getLogoPath(company.slug);
            const hasLogoError = logoErrors.has(company.slug);
            const showLogo = logoPath && !hasLogoError;

            return (
              <Card 
                key={company.slug} 
                className="card-bordered group cursor-pointer hover:border-blue-200 hover:shadow-xl"
                onClick={() => handleCompanyClick(company.slug)}
              >
                <CardHeader className="pb-4 text-center">
                  <div className="flex flex-col items-center gap-4">
                    {/* Company Logo Container */}
                    <div className="w-20 h-20 relative bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden p-2 group-hover:shadow-md group-hover:border-gray-200 transition-all duration-300 group-hover:scale-105">
                      {showLogo ? (
                        <Image 
                          src={logoPath}
                          alt={`${company.name} Logo`}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                          onError={() => handleLogoError(company.slug)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed text-center line-clamp-2">
                    {company.description}
                  </p>
                  
                  <div className="flex items-center justify-center text-xs mb-4">
                    <span className="text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      {company.resourceCount} Resources Available
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 text-center group-hover:shadow-md btn-premium">
                      Explore Resources
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {companies.length === 0 && !loading && (
          <div className="text-center py-12 animate-fade-in">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
            <p className="text-gray-600">
              No company resources were found in the Dream Company Station folder.
            </p>
          </div>
        )}

        {/* Footer Info Card */}
        <Card className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 animate-fade-in-up delay-300">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full icon-hover-float">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Company-Specific Preparation
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-4">
              Get access to curated materials, coding challenges, and placement guides 
              specifically designed for your dream company&apos;s interview process.
            </p>
            <p className="text-sm text-gray-500 italic">
              More company preparation modules coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
