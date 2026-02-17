import { useState } from "react";
import Header from "@/components/Header";
import SongInput from "@/components/SongInput";
import StoryBook from "@/components/StoryBook";
import MusicNotes from "@/components/MusicNotes";
import { generateStoryFromSong, StoryData } from "@/services/storyService";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [story, setStory] = useState<StoryData | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const handleSongSubmit = async (songData: { type: string; content: string; title?: string }) => {
    try {
      setIsLoading(true);
      setLoadingStage("Starting...");
      setLoadingProgress(0);

      const generatedStory = await generateStoryFromSong(songData, (stage, progress) => {
        setLoadingStage(stage);
        setLoadingProgress(progress);
      });
      setStory(generatedStory);
    } catch (error) {
      console.error("Error generating story:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Story generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingStage("");
      setLoadingProgress(0);
    }
  };

  const resetStory = () => {
    setStory(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-white">
      <MusicNotes />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Header />
        
        <div className="my-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Transform Songs into Magical Stories
          </h1>
          <p className="text-xl opacity-90">
            Enter your favorite lyrics, and watch as AI weaves a beautiful illustrated storybook inspired by the music.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto my-12">
          {isLoading ? (
            <div className="max-w-md mx-auto text-center space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="animate-pulse-soft">
                <span className="text-6xl">📖</span>
              </div>
              <h2 className="text-2xl font-serif font-bold">{loadingStage}</h2>
              <Progress value={loadingProgress} className="h-3 bg-white/20" />
              <p className="text-sm opacity-70">This may take a minute...</p>
            </div>
          ) : story ? (
            <StoryBook 
              title={story.title} 
              pages={story.pages} 
              onClose={resetStory} 
            />
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
