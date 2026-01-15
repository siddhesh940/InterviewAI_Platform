"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadResumeAsPDF } from "@/lib/pdf-utils";
import { useSupabaseWithAuth } from "@/lib/supabase";
import { SavedResume } from "@/types/resume";
import { ArrowLeft, Download, Edit, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SavedResumesPage() {
  const router = useRouter();
  const { supabase, userId } = useSupabaseWithAuth();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch resumes from Supabase
  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) {
        setLoading(false);
        
return;
      }

      try {
        const { data: resumesData, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching resumes:', error);
          setResumes([]);
        } else {
          setResumes(resumesData || []);
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [supabase, userId]);

  const handleDownload = async (resume: SavedResume) => {
    try {
      const resumeData = resume.resumeData || (resume as any).resume_data || resume.data;
      await downloadResumeAsPDF(resumeData, resume.template);
    } catch (error) {
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleEdit = (resumeId: string) => {
    router.push(`/resume-builder/build?resume=${resumeId}`);
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {return;}
    
    setDeletingId(resumeId);
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting resume:', error);
        alert("Failed to delete resume. Please try again.");
      } else {
        // Remove from local state
        setResumes(prev => prev.filter(resume => resume.id !== resumeId));
        alert("Resume deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => router.push("/resume-builder")}
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Resumes</h1>
              <p className="text-gray-600 mt-1">
                Manage your created resumes and download professional PDFs
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `You have ${resumes.length} saved resume${resumes.length !== 1 ? 's' : ''}`}
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/resume-builder/templates")}
          >
            Create New Resume
          </Button>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading your resumes...</p>
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Template: {resume.template}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target Role:</span>
                      <span className="font-medium text-gray-900">{resume.target_role || resume.targetRole}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Modified:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(resume.updated_at || resume.updatedAt || new Date()).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(resume.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
                        disabled={deletingId === resume.id}
                        onClick={() => handleDownload(resume)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        disabled={deletingId === resume.id}
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="p-6 bg-gray-100 rounded-full mx-auto mb-6 w-fit">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Saved Resumes</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t created any resumes yet. Start building your professional resume now.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push("/resume-builder/templates")}
            >
              Create Your First Resume
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Resume Management Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="p-3 bg-blue-100 rounded-full mx-auto mb-3 w-fit">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keep Multiple Versions</h3>
              <p className="text-sm text-gray-600">Create different versions tailored for specific roles or industries.</p>
            </div>
            <div>
              <div className="p-3 bg-green-100 rounded-full mx-auto mb-3 w-fit">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
              <p className="text-sm text-gray-600">Update your resume regularly with new skills, projects, and achievements.</p>
            </div>
            <div>
              <div className="p-3 bg-purple-100 rounded-full mx-auto mb-3 w-fit">
                <Edit className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customize for Jobs</h3>
              <p className="text-sm text-gray-600">Tailor your resume for each application by emphasizing relevant experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
