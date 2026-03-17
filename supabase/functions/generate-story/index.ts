import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lyrics, title, tone = "whimsical" } = await req.json();
    if (!lyrics) {
      return new Response(JSON.stringify({ error: "Lyrics are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const toneGuides: Record<string, string> = {
      whimsical: "Light, playful, and magical. Think fairy tales and wonder.",
      dramatic: "Epic, intense, emotionally powerful. Think sweeping cinematic stories.",
      dark: "Mysterious, haunting, gothic. Think Brothers Grimm original tales.",
      romantic: "Tender, heartfelt, poetic. Think love letters and moonlit gardens.",
      humorous: "Witty, fun, lighthearted. Think Roald Dahl or Shel Silverstein.",
    };

    const toneDesc = toneGuides[tone] || toneGuides.whimsical;

    const systemPrompt = `You are a master storyteller who transforms song lyrics into richly illustrated storybooks. Your stories don't just vaguely reference the song — they are deeply intertwined with the lyrics.

APPROACH:
1. First, identify the KEY THEMES, EMOTIONS, and IMAGERY in the lyrics
2. Extract specific MEMORABLE LINES or PHRASES from the lyrics
3. Build a narrative that uses the song's emotional arc as its backbone
4. Weave actual lyric fragments naturally into the story text (italicized with *)
5. Each page's illustration should reflect a specific moment or image from the lyrics

TONE: ${toneDesc}

Create a storybook with 5 pages. Each page should have:
- Rich narrative text (3-4 sentences) that directly connects to the lyrics
- At least one reference or woven-in lyric fragment per page
- A detailed image prompt that captures a specific visual from the lyrics

Return ONLY valid JSON in this exact format:
{
  "title": "A creative story title inspired by the song",
  "themes": ["theme1", "theme2", "theme3"],
  "pages": [
    {
      "text": "Story text with *woven lyric fragments* in italics",
      "imagePrompt": "Detailed illustration description capturing a specific lyric image",
      "lyricReference": "The specific lyric line this page is inspired by"
    }
  ]
}`;

    const userPrompt = title
      ? `Transform this song into a storybook:\n\nSong: "${title}"\n\nLyrics:\n${lyrics}`
      : `Transform these lyrics into a storybook:\n\nLyrics:\n${lyrics}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let storyData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      storyData = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse story JSON:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(storyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-story error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
