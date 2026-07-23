import { supabase } from "@/integrations/supabase/client";

export interface LyricResult {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  lyrics: string;
  genre?: string;
}

export interface LyricSearchParams {
  artist?: string;
  track?: string;
  query?: string;
}

export const searchLyrics = async (
  params: string | LyricSearchParams
): Promise<LyricResult[]> => {
  const requestBody =
    typeof params === "string" ? { query: params } : params;

  const { data, error } = await supabase.functions.invoke<{ results: LyricResult[] }>(
    "search-lyrics",
    { body: requestBody }
  );

  if (error || !data?.results) {
    console.error("Lyrics search error:", error);
    throw new Error(error?.message || "Failed to search lyrics");
  }

  return data.results;
};
