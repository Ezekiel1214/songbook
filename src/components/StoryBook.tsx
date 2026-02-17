import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export interface StoryPage {
  text: string;
  imageUrl: string;
  imagePrompt?: string;
}

interface StoryBookProps {
  title: string;
  pages: StoryPage[];
  onClose: () => void;
}

const StoryBook = ({ title, pages, onClose }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleShare = async () => {
    try {
      await navigator.share?.({
        title: `${title} - Lyrical Tale Weaver`,
        text: `Check out this storybook: ${title}`,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Share it with your friends." });
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        // Try to load the image
        try {
          const img = await loadImage(pages[i].imageUrl);
          const imgWidth = pageWidth / 2;
          pdf.addImage(img, "JPEG", 0, 0, imgWidth, pageHeight);
        } catch {
          // Draw placeholder
          pdf.setFillColor(200, 200, 220);
          pdf.rect(0, 0, pageWidth / 2, pageHeight, "F");
        }

        // Text side
        const textX = pageWidth / 2 + 10;
        const textWidth = pageWidth / 2 - 20;

        if (i === 0) {
          pdf.setFontSize(20);
          pdf.setFont("helvetica", "bold");
          pdf.text(title, textX, 20, { maxWidth: textWidth });
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          pdf.text("A Lyrical Tale Weaver Story", textX, 30);
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(pages[i].text, textX, 45, { maxWidth: textWidth });
        } else {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(pages[i].text, textX, 20, { maxWidth: textWidth });
        }

        pdf.setFontSize(8);
        pdf.text(`Page ${i + 1} of ${pages.length}`, pageWidth - 30, pageHeight - 10);
      }

      pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      toast({ title: "Downloaded!", description: "Your storybook PDF is ready." });
    } catch (err) {
      console.error("PDF error:", err);
      toast({ title: "Download failed", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-lyrical-deepPurple">{title}</h1>
        <p className="text-lyrical-purple mt-2">A musical story</p>
      </div>

      <Card className="story-card bg-white/80 backdrop-blur-md p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
            <img 
              src={pages[currentPage].imageUrl} 
              alt={`Illustration for page ${currentPage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="story-text text-lg md:text-xl mb-6">
              {pages[currentPage].text}
            </div>
            
            <div className="flex justify-between items-center mt-auto">
              <div className="text-sm text-lyrical-purple">
                Page {currentPage + 1} of {totalPages}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={cn(
                    "border-lyrical-purple text-lyrical-purple hover:bg-lyrical-purple/10",
                    currentPage === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={cn(
                    "border-lyrical-purple text-lyrical-purple hover:bg-lyrical-purple/10",
                    currentPage === totalPages - 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onClose}>
          Create New Story
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button 
            variant="default" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-lyrical-deepPurple hover:bg-lyrical-purple"
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isDownloading ? "Generating..." : "Download"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default StoryBook;
