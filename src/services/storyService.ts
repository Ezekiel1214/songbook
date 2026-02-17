import { supabase } from "@/integrations/supabase/client";

export interface StoryPage {
  text: string;
  imageUrl: string;
  imagePrompt?: string;
}

export interface StoryData {
  title: string;
  pages: StoryPage[];
}

interface GenerateStoryResponse {
  title: string;
  pages: Array<{ text: string; imagePrompt: string }>;
}

export const generateStoryFromSong = async (
  songData: { type: string; content: string; title?: string },
  onProgress?: (stage: string, progress: number) => void
): Promise<StoryData> => {
  // Step 1: Generate story text
  onProgress?.("Crafting your story from the lyrics...", 10);

  const { data: storyData, error: storyError } = await supabase.functions.invoke<GenerateStoryResponse>(
    "generate-story",
    { body: { lyrics: songData.content, title: songData.title } }
  );

  if (storyError || !storyData) {
    throw new Error(storyError?.message || "Failed to generate story");
  }

  onProgress?.("Story written! Generating illustrations...", 30);

  // Step 2: Generate images for each page in parallel
  const totalPages = storyData.pages.length;
  let completedImages = 0;

  const imagePromises = storyData.pages.map(async (page, index) => {
    try {
      const { data: imageData, error: imageError } = await supabase.functions.invoke(
        "generate-image",
        { body: { imagePrompt: page.imagePrompt, pageIndex: index } }
      );

      completedImages++;
      const progress = 30 + (completedImages / totalPages) * 60;
      onProgress?.(`Illustrating page ${completedImages} of ${totalPages}...`, progress);

      if (imageError || !imageData?.imageUrl) {
        console.error(`Image generation failed for page ${index}:`, imageError);
        return `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800`;
      }

      return imageData.imageUrl;
    } catch (err) {
      console.error(`Image generation error for page ${index}:`, err);
      return `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800`;
    }
  });

  const imageUrls = await Promise.all(imagePromises);

  onProgress?.("Your storybook is ready!", 100);

  return {
    title: storyData.title,
    pages: storyData.pages.map((page, i) => ({
      text: page.text,
      imageUrl: imageUrls[i],
      imagePrompt: page.imagePrompt,
    })),
  };
};
