// Ambient declaration for edge-function runtime globals used by MCP tools
// bundled into the Supabase function. These tools never execute in the browser.
export {};

declare global {
  const process: { env: Record<string, string | undefined> };
}
