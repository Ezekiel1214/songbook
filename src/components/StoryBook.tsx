import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download, Share2, Loader2, Quote, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNarration } from "@/hooks/use-narration";
import jsPDF from "jspdf";

export interface StoryPage {
  text: string;
  imageUrl: string;
  imagePrompt?: string;
  lyricReference?: string;
}

interface StoryBookProps {
  title: string;
  pages: StoryPage[];
  onClose: () => void;
}

const StoryBook = ({ title, pages, onClose }: StoryBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [direction, setDirection] = useState(0);
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
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
        try {
          const img = await loadImage(pages[i].imageUrl);
          pdf.addImage(img, "JPEG", 0, 0, pageWidth / 2, pageHeight);
        } catch {
          pdf.setFillColor(30, 25, 50);
          pdf.rect(0, 0, pageWidth / 2, pageHeight, "F");
        }
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

  const pageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const currentPageData = pages[currentPage];

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">A musical story</p>
      </div>

      <Card className="glass-panel border-0 p-0 overflow-hidden shadow-2xl rounded-2xl">
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Image side */}
          <div className="w-full md:w-1/2 h-[280px] md:h-auto relative overflow-hidden bg-muted">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentPage}
                src={currentPageData.imageUrl}
                alt={`Illustration for page ${currentPage + 1}`}
                className="w-full h-full object-cover absolute inset-0"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>

          {/* Text side */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                className="space-y-4"
                custom={direction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="story-text text-base md:text-lg text-card-foreground leading-relaxed">
                  {currentPageData.text}
                </div>
                {currentPageData.lyricReference && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary/80 italic leading-relaxed">
                      {currentPageData.lyricReference}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/30">
              <div className="text-xs text-muted-foreground font-medium">
                {currentPage + 1} / {totalPages}
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="h-8 w-8 border-border/30 hover:bg-secondary/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="h-8 w-8 border-border/30 hover:bg-secondary/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onClose} className="border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50">
          Create New Story
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleShare} className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/80"
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline">{isDownloading ? "Generating..." : "Download"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
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
