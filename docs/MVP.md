# MVP Definition — Lyrical Tale Weaver

## MVP Status: ✅ COMPLETE

The Minimum Viable Product is **fully functional**. A user can go from lyrics input to illustrated storybook to PDF download in a single session.

---

## MVP Scope

### What's In (Delivered)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Lyrics Input** | Paste lyrics + optional song title |
| 2 | **AI Story Generation** | Gemini transforms lyrics into 4-5 page narrative |
| 3 | **AI Image Generation** | Watercolor illustrations generated per page, stored in cloud |
| 4 | **Story Viewer** | Paginated reader with image + text, prev/next navigation |
| 5 | **PDF Download** | Landscape A4 PDF with images and text |
| 6 | **Share** | Web Share API with clipboard fallback |
| 7 | **Progress UX** | Stage-based progress bar during generation |
| 8 | **Error Handling** | Toast notifications, fallback images |

### What's Out (Post-MVP)

| # | Feature | Priority | Rationale for Exclusion |
|---|---------|----------|----------------------|
| 1 | User accounts & auth | P1 | MVP validates core value prop without accounts |
| 2 | Story persistence / library | P1 | Depends on auth |
| 3 | Real lyrics search API | P2 | Copyright complexity; paste works fine |
| 4 | Art style customization | P2 | Single style validates concept |
| 5 | Story text editing | P2 | Regeneration is available |
| 6 | Audio narration (TTS) | P3 | Nice-to-have, not core |
| 7 | Print-optimized layout | P3 | PDF covers basic need |
| 8 | Social sharing with previews | P2 | Requires OG images, story permalinks |

---

## MVP Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│                                                   │
│  SongInput → storyService → StoryBook → PDF      │
│     │              │              │                │
│     └──────────────┼──────────────┘                │
│                    │ supabase.functions.invoke()   │
└────────────────────┼──────────────────────────────┘
                     │
┌────────────────────┼──────────────────────────────┐
│              Lovable Cloud                        │
│                    │                               │
│  ┌─────────────────┴────────────────┐             │
│  │         Edge Functions            │             │
│  │                                   │             │
│  │  generate-story ──► Gemini 3 Flash│             │
│  │  generate-image ──► Gemini 2.5    │             │
│  │       │            Flash Image    │             │
│  │       └──► Storage (story-images) │             │
│  └───────────────────────────────────┘             │
└────────────────────────────────────────────────────┘
```

---

## MVP Validation Criteria

| Criteria | Met? |
|----------|------|
| User can input lyrics and get a story | ✅ |
| Story has AI-generated narrative text | ✅ |
| Each page has a unique AI illustration | ✅ |
| User can navigate through pages | ✅ |
| User can download the story as PDF | ✅ |
| User can share the story | ✅ |
| Errors are handled gracefully | ✅ |
| Generation takes < 2 minutes | ✅ |

---

## Post-MVP Roadmap

### Phase 1: Retention (P1)
- User authentication (email/password)
- Story persistence in database
- "My Stories" library page
- Re-view and re-download saved stories

### Phase 2: Engagement (P2)
- Art style picker (watercolor, cartoon, oil painting, pixel art)
- Story tone selection (whimsical, dramatic, dark, humorous)
- Page count control (3-8 pages)
- Edit generated text before finalizing
- Real lyrics search API integration

### Phase 3: Growth (P2-P3)
- Story permalinks with OG image previews
- Social sharing with rich previews
- Public gallery of shared stories
- Audio narration (text-to-speech)
- Print-optimized layouts
- Storage cleanup policies

### Phase 4: Monetization (P3)
- Free tier (2 stories/day)
- Premium tier (unlimited, higher quality images, more pages)
- Gift storybook ordering (printed physical books)
