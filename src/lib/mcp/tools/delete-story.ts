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
  name: "delete_story",
  title: "Delete a story",
  description: "Permanently delete one of the signed-in user's storybooks.",
  inputSchema: {
    story_id: z.string().uuid().describe("The story's UUID."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ story_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { error } = await supabaseForUser(ctx)
      .from("stories")
      .delete()
      .eq("id", story_id)
      .eq("user_id", ctx.getUserId()!);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return { content: [{ type: "text", text: "Story deleted." }] };
  },
});
