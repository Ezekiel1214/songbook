import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Plus, Trash2, ArrowLeft, Loader2, Globe, Lock } from "lucide-react";
import MusicNotes from "@/components/MusicNotes";
import Header from "@/components/Header";
import { motion } from "framer-motion";

interface SavedStory {
  id: string;
  title: string;
  song_title: string | null;
  art_style: string;
    pages: any[];
    created_at: string;
    is_public: boolean;
  }

const Library = () => {
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchStories();
  }, [user, authLoading]);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading stories", description: error.message, variant: "destructive" });
    } else {
      setStories(data as SavedStory[]);
    }
    setLoading(false);
  };

  const deleteStory = async (id: string) => {
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStories((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Story deleted" });
    }
  };

  const viewStory = (story: SavedStory) => {
    navigate("/", { state: { story } });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen lyrical-gradient text-foreground flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-foreground">
      <MusicNotes />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />

        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">My Stories</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/80">
                <Plus className="h-4 w-4 mr-1" /> New Story
              </Button>
            </div>
          </div>

          {stories.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-serif mb-2 text-foreground">No stories yet</h3>
              <p className="text-muted-foreground mb-6">Create your first storybook from song lyrics!</p>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/80">
                Create Story
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 group"
                  onClick={() => viewStory(story)}
                >
                  <div className="flex">
                    {story.pages[0]?.imageUrl && (
                      <div className="w-28 h-28 flex-shrink-0">
                        <img
                          src={story.pages[0].imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h3 className="font-serif font-bold text-foreground truncate">{story.title}</h3>
                        {story.song_title && (
                          <p className="text-muted-foreground text-sm truncate">♪ {story.song_title}</p>
                        )}
                        <p className="text-muted-foreground/60 text-xs mt-1">
                          {story.pages.length} pages • {story.art_style}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-muted-foreground/40 text-xs">
                          {new Date(story.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStory(story.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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

export default Library;
