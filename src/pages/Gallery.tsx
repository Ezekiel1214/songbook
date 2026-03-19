import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, ArrowLeft, TrendingUp, Flame } from "lucide-react";
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
  view_count: number;
}

const Gallery = () => {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [trending, setTrending] = useState<PublicStory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicStories = async () => {
      const [allRes, trendingRes] = await Promise.all([
        supabase
          .from("stories")
          .select("id, title, song_title, art_style, pages, created_at, view_count")
          .eq("is_public", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("stories")
          .select("id, title, song_title, art_style, pages, created_at, view_count")
          .eq("is_public", true)
          .order("view_count", { ascending: false })
          .limit(6),
      ]);

      if (!allRes.error && allRes.data) setStories(allRes.data as PublicStory[]);
      if (!trendingRes.error && trendingRes.data) setTrending(trendingRes.data as PublicStory[]);
      setLoading(false);
    };
    fetchPublicStories();
  }, []);

  const viewStory = async (story: PublicStory) => {
    // Increment view count
    await supabase.rpc("increment_view_count", { story_id: story.id });
    navigate("/", { state: { story } });
  };

  const StoryCard = ({ story, i, large = false }: { story: PublicStory; i: number; large?: boolean }) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 group"
      onClick={() => viewStory(story)}
    >
      {story.pages[0]?.imageUrl && (
        <div className={`w-full ${large ? 'h-48' : 'h-40'} overflow-hidden`}>
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
          <span className="text-muted-foreground/40 text-xs flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {story.view_count}
          </span>
        </div>
      </div>
    </motion.div>
  );

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
            <>
              {/* Trending Section */}
              {trending.length > 0 && trending.some(s => s.view_count > 0) && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <h3 className="text-lg font-serif font-bold text-foreground">Trending Stories</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {trending.filter(s => s.view_count > 0).slice(0, 3).map((story, i) => (
                      <StoryCard key={story.id} story={story} i={i} large />
                    ))}
                  </div>
                </div>
              )}

              {/* All Stories */}
              <div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-4">All Stories</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story, i) => (
                    <StoryCard key={story.id} story={story} i={i} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
