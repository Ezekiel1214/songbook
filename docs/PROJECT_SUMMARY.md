# Lyrical Tale Weaver — Project Summary

## What It Is
Lyrical Tale Weaver is a web application that transforms song lyrics into AI-illustrated storybooks. Users paste lyrics (with an optional song title), and the app generates a multi-page children's storybook with narrative text and watercolor-style illustrations — viewable in a paginated reader, downloadable as PDF, and shareable via Web Share API.

## Current State: Functional MVP

The app is **fully functional** end-to-end with AI-powered story and image generation.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui + custom `lyrical` design tokens |
| Backend | Lovable Cloud (Supabase Edge Functions + Storage) |
| AI – Story | `google/gemini-3-flash-preview` via Lovable AI Gateway |
| AI – Images | `google/gemini-2.5-flash-image` via Lovable AI Gateway |
| PDF Export | jsPDF (client-side) |
| Fonts | Merriweather (serif) + Poppins (sans-serif) |

### Key Files

```
src/
  pages/Index.tsx              — Main orchestrator (input → loading → viewer)
  components/
    SongInput.tsx              — Song title + lyrics form + search toggle
    LyricSearch.tsx            — Mock lyrics search (5 hardcoded songs)
    StoryBook.tsx              — Paginated reader with image+text layout, PDF download, share
    Header.tsx                 — App branding
    MusicNotes.tsx             — Decorative floating music notes
  services/
    storyService.ts            — Orchestrates generate-story → generate-image pipeline
    lyricsService.ts           — Mock lyrics database

supabase/functions/
  generate-story/index.ts      — Edge function: lyrics → structured story JSON (Gemini)
  generate-image/index.ts      — Edge function: prompt → watercolor illustration → Storage upload
```

### Data Flow

1. User enters lyrics + optional title → `SongInput.onSubmit()`
2. `Index.tsx` calls `generateStoryFromSong()` with progress callback
3. `storyService.ts` invokes `generate-story` edge function → returns `{title, pages[{text, imagePrompt}]}`
4. For each page, invokes `generate-image` edge function in parallel → generates illustration, uploads to `story-images` bucket, returns public URL
5. `StoryBook` renders paginated result with prev/next navigation
6. User can download as PDF (jsPDF) or share (Web Share API / clipboard fallback)

### Design System

- **Custom palette**: `lyrical-purple` (#5D4C7C), `lyrical-deepPurple` (#2A1A5E), `lyrical-midnight` (#1A1040), `lyrical-gold` (#FFD700), `lyrical-cream` (#FFF8E1)
- **CSS variables**: HSL-based semantic tokens in `index.css` (`--primary`, `--accent`, etc.)
- **Animations**: `float`, `pulse-soft`, `fade-in`
- **Background**: Gradient from deep purple to midnight with floating music note decorations

### Storage

- **Bucket**: `story-images` (public read, service-role write)
- **No database tables** — stories are ephemeral (generated and viewed in-session only)
- **No authentication** — anonymous usage

---

## Feature Status

| Feature | Status | Details |
|---------|--------|---------|
| Lyrics input (paste) | ✅ Done | Required field with textarea |
| Song title input | ✅ Done | Optional field |
| Lyrics search | ⚠️ Mock | 5 hardcoded songs only |
| AI story generation | ✅ Done | Gemini 3 Flash, 4-5 pages |
| AI image generation | ✅ Done | Gemini 2.5 Flash Image, watercolor style |
| Paginated story viewer | ✅ Done | Image + text split layout |
| Progress indicators | ✅ Done | Stage text + progress bar |
| PDF download | ✅ Done | Landscape A4, image + text per page |
| Share | ✅ Done | Web Share API with clipboard fallback |
| Create new story | ✅ Done | Resets to input form |
| User accounts | ❌ None | No auth, no saved stories |
| Story persistence | ❌ None | Ephemeral, lost on refresh |
| Mobile optimization | ⚠️ Basic | Works but not refined |

---

## Known Limitations

1. **No persistence** — stories vanish on page refresh
2. **No auth** — anyone can generate (rate-limited by AI gateway only)
3. **Mock lyrics search** — only 5 hardcoded songs
4. **Image generation cost** — each story generates 4-5 AI images
5. **PDF images** — cross-origin issues possible with some storage configurations
6. **No error retry** — failed image generation falls back to stock photo silently
7. **Storage cleanup** — generated images accumulate with no cleanup policy
