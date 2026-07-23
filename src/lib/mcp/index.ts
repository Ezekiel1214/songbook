import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listStoriesTool from "./tools/list-stories";
import getStoryTool from "./tools/get-story";
import setStoryVisibilityTool from "./tools/set-story-visibility";
import deleteStoryTool from "./tools/delete-story";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "lyrical-tale-weaver-mcp",
  title: "Lyrical Tale Weaver",
  version: "0.1.0",
  instructions:
    "Tools for the Lyrical Tale Weaver app. Browse, inspect, publish, and delete the signed-in user's AI-generated storybooks made from song lyrics.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listStoriesTool, getStoryTool, setStoryVisibilityTool, deleteStoryTool],
});
