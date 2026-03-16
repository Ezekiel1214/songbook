# Product Requirements Document (PRD)

## Lyrical Tale Weaver

**Version**: 1.0  
**Last Updated**: March 2026  
**Status**: MVP Complete, Roadmap Defined

---

## 1. Vision & Purpose

**Vision**: Make music tangible and visual by transforming song lyrics into beautifully illustrated storybooks that anyone can create, share, and keep.

**Problem Statement**: Music evokes powerful emotions and imagery, but there's no easy way to translate those feelings into a visual narrative. Parents, educators, music fans, and gift-givers lack a tool to turn beloved songs into shareable, illustrated stories.

**Target Users**:
- **Parents & Educators** — Create bedtime stories from children's songs or use as teaching tools
- **Music Fans** — Visualize favorite songs as illustrated narratives
- **Gift Givers** — Generate personalized storybooks from meaningful songs (weddings, birthdays, memorials)
- **Content Creators** — Produce unique visual content inspired by music

---

## 2. Core User Journey

```
Enter Lyrics → AI Generates Story → AI Illustrates Pages → View Storybook → Download / Share
```

### Detailed Flow

1. **Input**: User pastes song lyrics and optionally provides a song title
2. **Generation**: System creates a 4-5 page narrative inspired by the lyrics' themes, emotions, and imagery
3. **Illustration**: Each page receives a unique watercolor-style AI illustration matching the narrative
4. **Viewing**: User reads through the storybook in a paginated reader with image + text layout
5. **Export**: User downloads as PDF or shares via link

---

## 3. Functional Requirements

### 3.1 Input (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-1.1: Text area for pasting lyrics (required) | ✅ |
| FR-1.2: Optional song title field | ✅ |
| FR-1.3: Lyrics search from database | ⚠️ Mock only |

### 3.2 Story Generation (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-2.1: AI generates 4-5 page narrative from lyrics | ✅ |
| FR-2.2: Each page has narrative text (2-3 sentences) | ✅ |
| FR-2.3: Each page has an image description for illustration | ✅ |
| FR-2.4: Story title derived from lyrics/song | ✅ |

### 3.3 Image Generation (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-3.1: AI generates unique illustration per page | ✅ |
| FR-3.2: Consistent watercolor/storybook art style | ✅ |
| FR-3.3: Images stored in cloud storage with public URLs | ✅ |
| FR-3.4: Parallel generation with progress tracking | ✅ |

### 3.4 Story Viewer (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-4.1: Paginated reader with prev/next navigation | ✅ |
| FR-4.2: Image + text split layout | ✅ |
| FR-4.3: Page counter | ✅ |
| FR-4.4: "Create New Story" reset | ✅ |

### 3.5 Export & Sharing (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-5.1: Download as PDF (landscape, image + text per page) | ✅ |
| FR-5.2: Share via Web Share API or clipboard | ✅ |

### 3.6 Loading & Error Handling (P0 — Implemented)
| Requirement | Status |
|-------------|--------|
| FR-6.1: Progress bar with stage descriptions | ✅ |
| FR-6.2: Error toast notifications | ✅ |
| FR-6.3: Fallback images on generation failure | ✅ |

### 3.7 User Accounts (P1 — Not Started)
| Requirement | Status |
|-------------|--------|
| FR-7.1: Email/password sign-up and login | ❌ |
| FR-7.2: Save generated stories to account | ❌ |
| FR-7.3: Story library / history view | ❌ |
| FR-7.4: Re-view and re-download past stories | ❌ |

### 3.8 Customization (P2 — Not Started)
| Requirement | Status |
|-------------|--------|
| FR-8.1: Choose art style (watercolor, cartoon, realistic, etc.) | ❌ |
| FR-8.2: Choose story tone (whimsical, dramatic, dark, comedic) | ❌ |
| FR-8.3: Adjust story length (3-8 pages) | ❌ |
| FR-8.4: Edit generated text before finalizing | ❌ |

### 3.9 Real Lyrics Integration (P2 — Not Started)
| Requirement | Status |
|-------------|--------|
| FR-9.1: Search lyrics by song title/artist | ❌ |
| FR-9.2: Auto-populate lyrics from search result | ❌ |
| FR-9.3: Attribution/licensing compliance | ❌ |

---

## 4. Non-Functional Requirements

| Category | Requirement | Status |
|----------|------------|--------|
| Performance | Story generation < 60 seconds | ⚠️ Varies |
| Performance | Page transitions < 100ms | ✅ |
| Reliability | Graceful fallback on AI failure | ✅ |
| Security | No user data stored without auth | ✅ |
| Security | Rate limiting via AI gateway | ✅ |
| Accessibility | Semantic HTML, alt text on images | ⚠️ Partial |
| Responsive | Usable on mobile and desktop | ⚠️ Basic |
| SEO | Meta tags, OG tags for shared stories | ❌ |

---

## 5. Technical Constraints

- **AI Models**: Dependent on Lovable AI Gateway availability and rate limits
- **Image Storage**: Generated images accumulate without cleanup policy
- **PDF Generation**: Client-side only; cross-origin image loading may fail in some configurations
- **No SSR**: Single-page app, no server-side rendering
- **No Backend Logic**: All business logic in edge functions or client-side

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Story generation success rate | > 95% |
| Average generation time | < 45 seconds |
| PDF download success rate | > 90% |
| User return rate (post-auth) | > 30% within 7 days |
| Stories generated per user | > 2 average |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI rate limits hit during peak usage | Users can't generate | Queue system, caching, usage limits per session |
| AI generates inappropriate content | Brand/safety risk | Content moderation prompts, output filtering |
| Image generation costs scale linearly | High infrastructure cost | Caching similar prompts, reducing pages, lower-quality option |
| Lyrics copyright concerns | Legal risk | User-provided lyrics only, no lyrics database storage |
| Storage costs from accumulated images | Growing infrastructure cost | TTL-based cleanup policy, user-specific storage quotas |
