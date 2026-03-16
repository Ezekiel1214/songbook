import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { BookOpen, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import MusicNotes from "@/components/MusicNotes";
import Header from "@/components/Header";

interface SavedStory {
  id: string;
  title: string;
  song_title: string | null;
  art_style: string;
  pages: any[];
  created_at: string;
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
      <div className="min-h-screen lyrical-gradient text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-white">
      <MusicNotes />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Header />

        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-serif font-bold">My Stories</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/")} className="text-white/70 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/80">
                <Plus className="h-4 w-4 mr-1" /> New Story
              </Button>
            </div>
          </div>

          {stories.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-serif mb-2">No stories yet</h3>
              <p className="text-white/60 mb-6">Create your first storybook from song lyrics!</p>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/80">
                Create Story
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer hover:bg-white/15 transition-colors group"
                  onClick={() => viewStory(story)}
                >
                  <div className="flex">
                    {story.pages[0]?.imageUrl && (
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={story.pages[0].imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h3 className="font-serif font-bold text-white truncate">{story.title}</h3>
                        {story.song_title && (
                          <p className="text-white/50 text-sm truncate">♪ {story.song_title}</p>
                        )}
                        <p className="text-white/40 text-xs mt-1">
                          {story.pages.length} pages • {story.art_style}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/30 text-xs">
                          {new Date(story.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
