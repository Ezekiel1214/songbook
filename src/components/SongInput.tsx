import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Wand2 } from "lucide-react";
import LyricSearch from "./LyricSearch";
import ArtStylePicker, { ArtStyle } from "./ArtStylePicker";
import TonePicker, { StoryTone } from "./TonePicker";
import { motion, AnimatePresence } from "framer-motion";

interface SongInputProps {
  onSubmit: (songData: { type: string; content: string; title?: string; artStyle: ArtStyle; tone: StoryTone }) => void;
  isLoading: boolean;
}

const SongInput = ({ onSubmit, isLoading }: SongInputProps) => {
  const [songLyrics, setSongLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artStyle, setArtStyle] = useState<ArtStyle>("watercolor");
  const [tone, setTone] = useState<StoryTone>("whimsical");
  const [showLyricSearch, setShowLyricSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (songLyrics) {
      onSubmit({ type: "lyrics", content: songLyrics, title: songTitle, artStyle, tone });
    }
  };

  const handleLyricSelect = (lyrics: string, title?: string, artist?: string) => {
    setSongLyrics(lyrics);
    if (title) setSongTitle(artist ? `${title} - ${artist}` : title);
    setShowLyricSearch(false);
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto glass-panel rounded-2xl p-6 md:p-8 animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
          <Wand2 className="h-3 w-3" />
          AI-Powered
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Transform Song into Story
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste lyrics or search for a song to create an illustrated storybook
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {showLyricSearch ? (
            <LyricSearch
              key="search"
              onLyricSelect={handleLyricSelect}
              onClose={() => setShowLyricSearch(false)}
            />
          ) : (
            <motion.div
              key="input"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-2">
                <label htmlFor="songTitle" className="text-sm font-medium text-foreground">Song Title</label>
                <Input
                  id="songTitle"
                  placeholder="Enter song title..."
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="songLyrics" className="text-sm font-medium text-foreground">Song Lyrics</label>
                  <Button
                    type="button"
                    onClick={() => setShowLyricSearch(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary hover:bg-primary/10 h-7 gap-1"
                  >
                    <Search className="h-3 w-3" />
                    Search lyrics
                  </Button>
                </div>
                <Textarea
                  id="songLyrics"
                  placeholder="Paste song lyrics here..."
                  className="min-h-[160px] bg-secondary/50 border-border/50 focus:border-primary/50 resize-none"
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                  required
                />
              </div>

              <TonePicker selected={tone} onChange={setTone} />
              <ArtStylePicker selected={artStyle} onChange={setArtStyle} />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground font-medium py-3 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          disabled={isLoading || !songLyrics}
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Creating Your Story..." : "Generate Storybook"}
        </Button>
      </form>
    </motion.div>
  );
};

export default SongInput;
