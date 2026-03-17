import { supabase } from "@/integrations/supabase/client";

export interface LyricResult {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  lyrics: string;
  genre?: string;
}

export const searchLyrics = async (query: string): Promise<LyricResult[]> => {
  const { data, error } = await supabase.functions.invoke<{ results: LyricResult[] }>(
    "search-lyrics",
    { body: { query } }
  );

  if (error || !data?.results) {
    console.error("Lyrics search error:", error);
    throw new Error(error?.message || "Failed to search lyrics");
  }

  return data.results;
};
