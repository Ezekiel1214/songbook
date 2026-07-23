import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LrclibHit {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const query: string = (body.query ?? "").toString().trim();
    const artist: string = (body.artist ?? "").toString().trim();
    const track: string = (body.track ?? "").toString().trim();

    if (!query && !artist && !track) {
      return new Response(JSON.stringify({ error: "Provide a query, or artist and track" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const params = new URLSearchParams();
    if (track) params.set("track_name", track);
    if (artist) params.set("artist_name", artist);
    if (!track && !artist && query) params.set("q", query);

    const url = `https://lrclib.net/api/search?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "LyricalTaleWeaver/1.0 (https://songbook.lovable.app)",
      },
    });

    if (!res.ok) {
      throw new Error(`LRCLIB error: ${res.status}`);
    }

    const hits = (await res.json()) as LrclibHit[];

    const results = hits
      .filter((h) => h.plainLyrics && h.plainLyrics.trim().length > 0)
      .slice(0, 10)
      .map((h) => ({
        title: h.trackName,
        artist: h.artistName,
        album: h.albumName,
        lyrics: h.plainLyrics!.trim(),
      }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-lyrics error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
