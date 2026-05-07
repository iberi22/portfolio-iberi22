# Blog Automation Plan

**Status:** Planned  
**Priority:** Next after i18n

## Problem
Blog section shows "COMING SOON" placeholders. Real content + automated pipeline needed.

## Recommended Approach: GitHub Issues → Astro Content Collection

1. **Astro Content Collection**
   - Create `src/content/config.ts` with blog schema (title, date, tags, draft, body)
   - Blog posts at `src/content/blog/<slug>.md`
   - Individual route at `src/pages/blog/[slug].astro`

2. **Pipeline**
   - Write posts as GitHub Issues with `blog-post` label
   - GitHub Action: on issue labeled `blog-post` → extract body as markdown
   - Convert to Astro content entry → commit + deploy

3. **Integration**
   - `BlogSection.svelte` reads from content collection instead of hardcoded array
   - Preserve i18n for titles/descriptions (translate per post)

## Files to create
- `src/content/config.ts`
- `src/pages/blog/[slug].astro`
- `.github/workflows/blog-sync.yml`
- `src/content/blog/` (directory for posts)

## Files to modify
- `src/components/BlogSection.svelte` (read from content collection)

## Why this approach
- Native Astro content collections = fast, typed, MDX-ready
- GitHub Issues = easy writing interface (any device, web UI)
- Auto-deploy = no manual steps
