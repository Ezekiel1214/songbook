declare const process: { env: Record<string, string | undefined> };
import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "set_story_visibility",
  title: "Set story visibility",
  description: "Publish a story to the public gallery, or make it private again.",
  inputSchema: {
    story_id: z.string().uuid().describe("The story's UUID."),
    is_public: z.boolean().describe("True to share publicly, false to make private."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ story_id, is_public }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("stories")
      .update({ is_public })
      .eq("id", story_id)
      .eq("user_id", ctx.getUserId()!)
      .select("id, title, is_public")
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: "Story not found." }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Story "${data.title}" is now ${data.is_public ? "public" : "private"}.` }],
      structuredContent: { story: data },
    };
  },
});
