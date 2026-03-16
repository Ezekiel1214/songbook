import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SongInput from "@/components/SongInput";
import StoryBook from "@/components/StoryBook";
import MusicNotes from "@/components/MusicNotes";
import { generateStoryFromSong, StoryData } from "@/services/storyService";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArtStyle } from "@/components/ArtStylePicker";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<StoryData | null>(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle viewing a saved story from Library
  useEffect(() => {
    const state = location.state as { story?: any } | null;
    if (state?.story) {
      setStory({
        title: state.story.title,
        pages: state.story.pages,
      });
      // Clear state to avoid re-showing on refresh
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state]);

  const saveStory = async (storyData: StoryData, songTitle: string | undefined, lyrics: string, artStyle: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("stories").insert({
        user_id: user.id,
        title: storyData.title,
        song_title: songTitle || null,
        lyrics,
        art_style: artStyle,
        pages: storyData.pages as any,
      });
      if (error) throw error;
      toast({ title: "Story saved!", description: "Find it in your library." });
    } catch (err) {
      console.error("Failed to save story:", err);
    }
  };

  const handleSongSubmit = async (songData: { type: string; content: string; title?: string; artStyle: ArtStyle }) => {
    try {
      setIsLoading(true);
      setLoadingStage("Starting...");
      setLoadingProgress(0);

      const generatedStory = await generateStoryFromSong(
        songData,
        (stage, progress) => {
          setLoadingStage(stage);
          setLoadingProgress(progress);
        },
        songData.artStyle
      );
      setStory(generatedStory);

      // Auto-save for logged-in users
      await saveStory(generatedStory, songData.title, songData.content, songData.artStyle);
    } catch (error) {
      console.error("Error generating story:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({ title: "Story generation failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
      setLoadingStage("");
      setLoadingProgress(0);
    }
  };

  const resetStory = () => setStory(null);

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-white">
      <MusicNotes />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Header />

        <div className="my-12 text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Transform Songs into Magical Stories
          </h1>
          <p className="text-xl opacity-90">
            Enter your favorite lyrics, and watch as AI weaves a beautiful illustrated storybook inspired by the music.
          </p>
        </div>

        <div className="max-w-6xl mx-auto my-12">
          {isLoading ? (
            <div className="max-w-md mx-auto text-center space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl animate-fade-in">
              <div className="animate-pulse-soft">
                <span className="text-6xl">📖</span>
              </div>
              <h2 className="text-2xl font-serif font-bold">{loadingStage}</h2>
              <Progress value={loadingProgress} className="h-3 bg-white/20" />
              <p className="text-sm opacity-70">This may take a minute...</p>
            </div>
          ) : story ? (
            <StoryBook title={story.title} pages={story.pages} onClose={resetStory} />
          ) : (
            <SongInput onSubmit={handleSongSubmit} isLoading={isLoading} />
          )}
        </div>

        <footer className="mt-16 text-center opacity-80 text-sm">
          <p>© 2025 Lyrical Tale Weaver • AI-Powered Story Generation from Songs</p>
        </footer>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-lyrical-midnight/50 to-transparent"></div>
    </div>
  );
};

export default Index;
