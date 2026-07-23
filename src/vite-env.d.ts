/// <reference types="vite/client" />

// Ambient declaration for `process.env` used by MCP tool files that are bundled
// into a Supabase Edge Function at build time. These tool handlers do not run
// in the browser bundle.
declare const process: { env: Record<string, string | undefined> };
