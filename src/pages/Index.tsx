import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SongInput from "@/components/SongInput";
import StoryBook from "@/components/StoryBook";
import MusicNotes from "@/components/MusicNotes";
import SkeletonLoader from "@/components/SkeletonLoader";
import { generateStoryFromSong, StoryData } from "@/services/storyService";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArtStyle } from "@/components/ArtStylePicker";
import { StoryTone } from "@/components/TonePicker";
import { motion } from "framer-motion";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<StoryData | null>(null);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { story?: any } | null;
    if (state?.story) {
      setStory({
        title: state.story.title,
        pages: state.story.pages,
      });
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

  const handleSongSubmit = async (songData: { type: string; content: string; title?: string; artStyle: ArtStyle; tone: StoryTone }) => {
    try {
      setIsLoading(true);
      setLoadingStage("Analyzing song themes...");
      setLoadingProgress(0);

      const generatedStory = await generateStoryFromSong(
        { ...songData, tone: songData.tone },
        (stage, progress) => {
          setLoadingStage(stage);
          setLoadingProgress(progress);
        },
        songData.artStyle
      );
      setStory(generatedStory);
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
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-foreground">
      <MusicNotes />

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <motion.div
          className="my-10 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-light text-xs text-muted-foreground mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Story Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            Transform Songs into
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Magical Stories
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Enter your favorite lyrics, and watch as AI weaves a beautiful illustrated storybook inspired by the music.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto my-10">
          {isLoading ? (
            <SkeletonLoader stage={loadingStage} progress={loadingProgress} />
          ) : story ? (
            <StoryBook title={story.title} pages={story.pages} onClose={resetStory} />
          ) : (
            <SongInput onSubmit={handleSongSubmit} isLoading={isLoading} />
          )}
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground/60">
          <p>© 2025 Lyrical Tale Weaver • AI-Powered Story Generation from Songs</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
