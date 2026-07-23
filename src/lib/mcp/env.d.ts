// Ambient declaration for edge-function runtime (Deno) globals used by MCP tools
// bundled into the Supabase function. These tools never execute in the browser.
declare const process: { env: Record<string, string | undefined> };
