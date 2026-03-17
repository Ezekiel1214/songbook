import { useState } from "react";
import { Search, Loader2, Music2, Disc3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchLyrics, LyricResult } from "@/services/lyricsService";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface LyricSearchProps {
  onLyricSelect: (lyrics: string, title?: string, artist?: string) => void;
  onClose: () => void;
}

const LyricSearch = ({ onLyricSelect, onClose }: LyricSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LyricResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<LyricResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setSelectedPreview(null);
      const results = await searchLyrics(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast({
          title: "No songs found",
          description: "Try a different song title or artist name",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Music2 className="h-4 w-4 text-primary" />
          Search for Lyrics
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by song title or artist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-secondary/50 border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
          autoFocus
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !searchQuery.trim()}
          className="shrink-0 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/30">
              <div className="h-4 w-48 skeleton-shimmer rounded mb-2" />
              <div className="h-3 w-32 skeleton-shimmer rounded" />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel-light rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">{selectedPreview.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedPreview.artist}</p>
              </div>
              <Button
                size="sm"
                onClick={() => onLyricSelect(selectedPreview.lyrics, selectedPreview.title, selectedPreview.artist)}
                className="bg-primary hover:bg-primary/80"
              >
                Use These Lyrics
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed p-3 rounded-lg bg-background/50">
              {selectedPreview.lyrics}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && searchResults.length > 0 && (
        <div className="max-h-72 overflow-y-auto rounded-xl border border-border/30 divide-y divide-border/20">
          {searchResults.map((result, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full p-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3 ${
                selectedPreview === result ? "bg-primary/10" : ""
              }`}
              onClick={() => setSelectedPreview(result)}
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Disc3 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {result.artist}
                  {result.year && <span className="ml-2 text-xs opacity-60">({result.year})</span>}
                  {result.genre && <span className="ml-2 text-xs opacity-60">• {result.genre}</span>}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LyricSearch;
