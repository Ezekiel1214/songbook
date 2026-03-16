import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import LyricSearch from "./LyricSearch";
import ArtStylePicker, { ArtStyle } from "./ArtStylePicker";

interface SongInputProps {
  onSubmit: (songData: { type: string; content: string; title?: string; artStyle: ArtStyle }) => void;
  isLoading: boolean;
}

const SongInput = ({ onSubmit, isLoading }: SongInputProps) => {
  const [songLyrics, setSongLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artStyle, setArtStyle] = useState<ArtStyle>("watercolor");
  const [showLyricSearch, setShowLyricSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (songLyrics) {
      onSubmit({ type: "lyrics", content: songLyrics, title: songTitle, artStyle });
    }
  };

  const handleLyricSelect = (lyrics: string) => {
    setSongLyrics(lyrics);
    setShowLyricSearch(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">
        Transform Song into Story
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {showLyricSearch ? (
          <>
            <LyricSearch onLyricSelect={handleLyricSelect} />
            <div className="flex justify-center">
              <Button type="button" variant="outline" onClick={() => setShowLyricSearch(false)} className="text-sm">
                Cancel Search
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="songTitle" className="text-sm font-medium text-foreground">Song Title</label>
              <Input
                id="songTitle"
                placeholder="Enter song title..."
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="songLyrics" className="text-sm font-medium text-foreground">Song Lyrics</label>
              <Textarea
                id="songLyrics"
                placeholder="Paste song lyrics here..."
                className="min-h-[180px]"
                value={songLyrics}
                onChange={(e) => setSongLyrics(e.target.value)}
                required
              />
            </div>

            <ArtStylePicker selected={artStyle} onChange={setArtStyle} />

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => setShowLyricSearch(true)}
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <Search className="h-3 w-3" />
                Search for Lyrics Online
              </Button>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full mt-6 bg-primary hover:bg-primary/80 text-primary-foreground font-medium py-2 flex items-center justify-center gap-2"
          disabled={isLoading || !songLyrics}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Creating Your Story..." : "Generate Storybook"}
        </Button>
      </form>
    </div>
  );
};

export default SongInput;
