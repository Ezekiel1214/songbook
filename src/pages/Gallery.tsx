import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, ArrowLeft } from "lucide-react";
import MusicNotes from "@/components/MusicNotes";
import Header from "@/components/Header";
import { motion } from "framer-motion";

interface PublicStory {
  id: string;
  title: string;
  song_title: string | null;
  art_style: string;
  pages: any[];
  created_at: string;
}

const Gallery = () => {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicStories = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, song_title, art_style, pages, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setStories(data as PublicStory[]);
      }
      setLoading(false);
    };
    fetchPublicStories();
  }, []);

  const viewStory = (story: PublicStory) => {
    navigate("/", { state: { story } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-foreground">
      <MusicNotes />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Public Gallery</h2>
                <p className="text-sm text-muted-foreground">Stories shared by the community</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" /> Home
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stories.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-serif mb-2 text-foreground">No public stories yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share a story with the community!</p>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/80">
                Create Story
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 group"
                  onClick={() => viewStory(story)}
                >
                  {story.pages[0]?.imageUrl && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={story.pages[0].imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-foreground truncate">{story.title}</h3>
                    {story.song_title && (
                      <p className="text-muted-foreground text-sm truncate">♪ {story.song_title}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-muted-foreground/60 text-xs">
                        {story.pages.length} pages • {story.art_style}
                      </span>
                      <span className="text-muted-foreground/40 text-xs">
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
