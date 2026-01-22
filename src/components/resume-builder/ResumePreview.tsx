"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useResumeBuilderContext } from "@/contexts/ResumeBuilderContext";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Eye, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ResumePreviewHTML from "./ResumePreviewHTML";

// Floating animation
const floatingAnimation = {
  y: [0, -4, 0],
  transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
};

export default function ResumePreview() {
  const { resumeData, isLoading, setIsLoading } = useResumeBuilderContext();
  const { toast } = useToast();
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    setDownloadState('downloading');
    setIsLoading(true);

    try {
      // Wait for preview to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = document.getElementById('resume-preview');
      if (!element) {
        throw new Error('Resume preview not found');
      }

      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      const userName = resumeData.contact.name || 'Resume';
      const filename = `${userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Resume.pdf`;

      const options = {
        margin: [0.3, 0.3, 0.3, 0.3] as [number, number, number, number],
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait' as const,
          compress: true,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(options).from(element).save();

      setDownloadState('success');
      toast({
        title: "Success!",
        description: "Resume PDF downloaded successfully!",
      });

      // Reset state after 2 seconds
      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
      setDownloadState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {return;}

    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!printWindow) {return;}

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.contact.name || 'Resume'} - Preview</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Times New Roman', Times, serif; }
            @page { size: A4; margin: 0.5in; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <motion.div 
      className="w-full space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div animate={floatingAnimation}>
            <Sparkles className="h-5 w-5 text-green-500" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-500">Updates automatically as you type</p>
          </div>
        </div>
        <AnimatePresence>
          {isLoading && (
            <motion.span 
              className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <RefreshCw className="h-3 w-3 animate-spin" />
              Updating...
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preview Container */}
      <motion.div 
        ref={previewRef}
        className="relative bg-gray-100 rounded-xl p-4 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.005 }}
      >
        {/* Paper Shadow Effect */}
        <motion.div 
          className="bg-white rounded-lg shadow-2xl overflow-hidden max-h-[600px] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ResumePreviewHTML data={resumeData} />
        </motion.div>
        
        {/* Corner sparkle effect */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </motion.div>
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disabled={downloadState === 'downloading'}
            className={`w-full ${
              downloadState === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleDownloadPDF}
          >
            <AnimatePresence mode="wait">
              {downloadState === 'downloading' ? (
                <motion.span 
                  key="downloading"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </motion.span>
              ) : downloadState === 'success' ? (
                <motion.span 
                  key="success"
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Downloaded!
                </motion.span>
              ) : (
                <motion.span 
                  key="idle"
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
