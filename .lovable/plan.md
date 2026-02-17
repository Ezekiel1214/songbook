

# Lyrical Tale Weaver -- Project Handover Summary

## Overview

**Lyrical Tale Weaver** is a single-page React web app that transforms song lyrics into illustrated storybooks. Users enter a song title and/or paste lyrics (or search from a mock database), and the app generates a multi-page storybook with text and images displayed in a book-like viewer.

**Current state**: Frontend prototype with mock data. No backend, no AI integration, no persistent storage.

---

## Architecture

### Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router (single route `/` plus 404 catch-all)
- **State**: Local React state only (no global store)
- **Fonts**: Merriweather (serif, headings/story text) + Poppins (sans, UI)

### File Structure

```text
src/
  App.tsx                  -- Router setup, providers (QueryClient, Tooltip, Toasters)
  pages/
    Index.tsx              -- Main page: orchestrates SongInput and StoryBook
    NotFound.tsx           -- 404 page
  components/
    Header.tsx             -- App branding with gradient text and music icon
    MusicNotes.tsx         -- Floating music note symbols (decorative background)
    SongInput.tsx          -- Form: song title + lyrics textarea + lyric search toggle
    LyricSearch.tsx        -- Search bar + results list for mock lyrics database
    StoryBook.tsx          -- Paginated story viewer with image + text layout
    ui/                    -- shadcn/ui primitives (button, input, textarea, card, etc.)
  services/
    storyService.ts        -- Mock story generation (returns random pages with Unsplash images)
    lyricsService.ts       -- Mock lyrics search (5 hardcoded songs)
  hooks/                   -- Toast hooks, mobile detection
```

### Custom Design Tokens
Defined in `tailwind.config.ts` under `lyrical` namespace:
- `lyrical-purple` (#5D4C7C), `lyrical-deepPurple` (#2A1A5E), `lyrical-midnight` (#1A1040), `lyrical-gold` (#FFD700), `lyrical-cream` (#FFF8E1)
- Custom animations: `float`, `pulse-soft`, `fade-in`

---

## Feature Inventory

| Feature | Status | Notes |
|---|---|---|
| Song title input | Done | Optional field |
| Lyrics text input | Done | Required field |
| Lyric search | Done | Mock database with 5 songs |
| Story generation | Mock only | Returns random pages with Unsplash stock images |
| Story viewer (page flip) | Done | Prev/next navigation, image + text split layout |
| Share button | UI only | Logs to console, no implementation |
| Download button | UI only | Logs to console, no implementation |
| Create new story | Done | Resets state to input form |
| Floating music notes | Done | Decorative animated background |

---

## Data Flow

1. User fills in song title (optional) and lyrics (required), or uses lyric search
2. `SongInput` calls `onSubmit({ type: "lyrics", content, title })`
3. `Index.tsx` calls `generateStoryFromSong()` in `storyService.ts`
4. Service returns `StoryData { title, pages: [{ text, imageUrl }] }` (currently mocked)
5. `StoryBook` component renders the result with pagination

---

## What Needs Building for Production

### Critical (Core Functionality)
1. **AI Story Generation** -- Replace mock `storyService.ts` with real AI integration (e.g., Lovable AI, OpenAI, Anthropic) to generate story text from lyrics
2. **AI Image Generation** -- Replace Unsplash stock photos with AI-generated illustrations matching story content (e.g., DALL-E, Stable Diffusion)
3. **Real Lyrics API** -- Replace mock `lyricsService.ts` with a real lyrics provider (e.g., Genius API, Musixmatch API)

### Important (User-Facing Features)
4. **Download functionality** -- Implement PDF or image export of the storybook
5. **Share functionality** -- Implement link sharing or social media sharing
6. **User accounts and saved stories** -- Supabase auth + database for persisting generated stories
7. **Loading states** -- Better loading UI during generation (progress indicators, skeleton screens)
8. **Error handling** -- User-friendly error messages, retry logic

### Nice to Have
9. **Story customization** -- Let users choose art style, tone, story length
10. **Audio narration** -- Text-to-speech for the generated story
11. **Print-friendly layout** -- CSS print styles for physical storybooks
12. **Mobile optimization** -- The layout works but could be refined for smaller screens
13. **SEO and social meta tags** -- Open Graph tags for shared story links

---

## Technical Debt / Notes
- `@tanstack/react-query` is installed but unused (no async queries use it yet -- good candidate for API calls)
- No environment variables or secrets configured
- No backend or database connected
- No tests
- The `animate-float` animation on music notes uses absolute positioning that may cause issues on very small viewports
- `StoryBook` component uses Unsplash URLs without size parameters (could cause slow loads)

