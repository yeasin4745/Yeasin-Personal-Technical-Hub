# Change Log — Yeasin Personal Technical Hub

Date: 2026-11-19

This release preserves the existing React 19 / TypeScript / Vite 6 / Tailwind CSS 4 stack, package scripts, Vercel routing, contact API contract, and verified portfolio data.

## A. Performance & Bundle

### Modified
- `src/App.tsx` — Added `React.lazy()` and `Suspense` boundaries for the terminal, Labs, Learning Roadmap (which contains the Research anchor), and Contact sections. The terminal chunk is requested only when the terminal is opened. Preserved the session boot check and made the storage read resilient when browser storage is unavailable.
- `vite.config.ts` — Added Rollup manual chunks for React, Motion, and Lucide vendor code.
- `index.html` — Kept the existing font preconnects and narrowed Fira Code to the weights used by the interface (400–700); the other font families retain their used weights.

## B. SEO & Metadata

### Modified
- `src/config/siteConfig.ts` — Runtime SEO initialization now synchronizes canonical URL, Open Graph URL, Twitter URL, and the WebSite/Person JSON-LD `@id` and `url` fields against the current configured/runtime origin. A malformed optional JSON-LD block cannot prevent startup.
- `index.html` — Added Open Graph image/alt and Twitter image metadata; referenced the SVG/ICO favicons, Apple touch icon, and web manifest.
- `public/robots.txt` — Replaced the relative sitemap reference with an absolute documented placeholder.
- `public/sitemap.xml` — Replaced the relative `<loc>` with an absolute documented placeholder.
- `src/components/ProfileImage.tsx` — No change required: the existing branded initials fallback already renders when the image URL is empty. `src/data/portfolioData.ts` remains unchanged and `profileImageUrl: ''` is preserved.

### Added
- `public/og-image.png` — 1200×630 branded violet social preview with Yeasin's name and technical focus.
- `public/favicon.svg` — Violet terminal-style Y favicon.
- `public/favicon.ico` — ICO fallback favicon.
- `public/apple-touch-icon.png` — 180×180 Apple touch icon.
- `public/site.webmanifest` — Minimal install metadata and theme colors.

**Deployment note:** The domain is intentionally not fabricated. Replace `REPLACE-WITH-REAL-DOMAIN` in `public/robots.txt` and `public/sitemap.xml` with the actual canonical host before submitting the sitemap to search engines. Runtime canonical/OG/Twitter/JSON-LD URLs resolve from `VITE_SITE_URL` when configured, otherwise from the active browser origin.

## C. UX / Design / Animation

### Modified
- `src/App.tsx` — Added the first-focusable “Skip to main content” link and a focusable main landmark.
- `src/index.css` — Added anchor scroll offset, shared motion CSS tokens, keyboard focus visibility, skip-link styling, reduced-motion safeguards, narrow-screen word wrapping, and WCAG AA-oriented violet/slate text overrides for the affected muted shades.
- `src/components/Navbar.tsx` — Added IntersectionObserver-based active-section styling and mutation observation so lazily mounted sections are observed too; increased mobile navigation and menu-control hit areas to at least 44px.
- `src/components/TerminalModal.tsx` — Added dialog semantics, initial focus, visible-element focus trapping, Escape-to-close, and return-focus behavior.
- `src/components/ContactSection.tsx` — Added blur/submit field validation, inline errors, `aria-invalid`/`aria-describedby`, accessible success/error announcements, and stricter client email validation. Existing endpoint, payload fields, and submit state behavior are preserved.
- `src/components/ThemeSwitcher.tsx` — Increased compact touch target to at least 44×44px.
- `src/components/SystemAudioToggle.tsx` — Increased compact touch target to at least 44×44px.
- `src/components/YeasinWordmark.tsx` — Allowed the animated topic wordmark to wrap within narrow mobile widths.
- `src/components/ScrollReveal.tsx` — Applied the shared motion transition class to scroll-reveal wrappers.

## D. Code Quality & Integrity

### Modified
- `server.ts` — Removed the production startup `console.log`; security headers, CSP, body-size limits, and contact routing are unchanged.
- `bun.lock` — Corrected the root workspace name to match `package.json`; dependency declarations and versions were not changed.

### Added
- `CHANGES.md` — This file-level release record.

### Intentionally unchanged
- `package.json` and all scripts/dependency versions.
- `api/contact.ts` and every file under `src/server/` (including `contactHandler`, `resendDelivery`, `emailTemplate`, `clientMetadata`, and `security`).
- `vercel.json` and its CSP/security/cache headers.
- `src/data/portfolioData.ts` and its verified portfolio entries.
- `profileImageUrl: ''`.

No files were deleted. No `node_modules`, `dist`, `.env`, or Git internals are included in the release archive.

## Validation status

- TypeScript/TSX syntax transpilation: passed (0 syntax diagnostics).
- JSON/manifest, XML sitemap, image dimensions, and protected-file integrity checks: performed before packaging.
- `bun run lint` and `bun run build`: **not executable in the packaging environment** because Bun and the repository's dependencies are not installed, and package installation could not complete due unavailable package-registry access. These two production gates must be run in the project's Bun-enabled environment before merging to `main`; no successful build or bundle-size result is claimed here.
