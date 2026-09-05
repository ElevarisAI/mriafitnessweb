# mriafitness — Maria Savage's site

Single-page marketing site for Maria Savage (@mriafitness): fitness coach and content
creator. One job: convert visitors into Lean & Locked sign-ups (and 1:1 coaching
applications). Front-end only — no backend, no build-time CMS.

Built by Elevaris AI (Harley Grey) and handed to Maria for content edits and iteration.
Read PRODUCT.md (brand strategy) and PLAN.md (full build spec + revision log) before
making design decisions. HANDOVER.md is the owner-facing guide.

## Stack & commands

Vite + vanilla TypeScript + GSAP ScrollTrigger. No framework. Node 20+.

- `npm install` — once, after receiving the files
- `npm run dev` — dev server (this project assumes port 5199 for the check scripts:
  `npx vite --port 5199`)
- `npm run build` — typecheck + production build to `dist/`
- `npm run images` — regenerate responsive AVIF/WebP/JPEG renditions from `assets/`
  into `public/img/` (sharp). Run after adding or replacing any photo.

## File map

- `index.html` — ALL page content and section markup lives here
- `src/styles/tokens.css` — brand colours, fonts, spacing, z-index scale
- `src/styles/base.css` — reset, typography, nav, pills, footer, reduced-motion
- `src/styles/sections.css` — every section, in page order
- `src/main.ts` — boots motion; all GSAP is gated behind `prefers-reduced-motion`
- `src/motion/*.ts` — one module per effect: hero intro, `lock` (the signature
  "Lean & Locked." letter lock-in), `about` (manifesto word-fill), reveals, parallax,
  marquee, nav
- `scripts/optimize-images.mjs` — image pipeline; its `MAP` object assigns each photo
  in `assets/` a slug and sizes
- `scripts/shoot.mjs` — screenshot harness (see Verification)
- `assets/` — original photos, untouched. `public/img/` — generated, never hand-edit.

Page order: hero → proof marquee → Who I Am → Lean & Locked (pinned lock-in animation)
→ 1:1 Coaching → beach break → final CTA → footer.

## Design system (do not drift from this)

- **Colours: the five tokens only** (`--tan #CFBFA9`, `--brown #64472F`, `--ink
  #3F2C1D`, `--bone #E6DED2`, `--espresso #130A02`), sampled from Maria's brand.
  No new colours. Body text on tan uses `--ink` (7.35:1); `--brown` is for large
  display type only (4.7:1). Keep every text/background pair at WCAG AA.
- **Type:** Poppins 800 for display, Quicksand for body. Every heading ends with a
  full stop ("The Plan.") — brand tic, keep it. Exception, per Maria: the "What's
  included" accordion labels take no full stop (they're row labels, not headings).
- **Photos are never boxed.** Studio shots get `.wash` (warm tan multiply) and
  `.feather` (edge mask) so they dissolve into the page. New photos should get the
  same treatment; full-bleed images are the exception.
- **Motion:** the lock-in is the one big moment; everything else stays restrained
  (150–300ms hovers, few reveals). Initial hidden states are set from JS only — CSS
  must never hide content, so the page works with JS off and under
  `prefers-reduced-motion`. Any new animation needs a reduced-motion fallback.
- **CTAs** are filled pills (`.pill`), one primary action per section.

## Honesty rules (hard constraints, from the owner)

- Never invent facts: no made-up stats, testimonials, results, prices, or credentials.
- Unconfirmed facts ship as visible placeholders: `<span class="todo">[confirm: …]</span>`.
  When Maria supplies the real fact, replace the text AND remove the `todo` class/span.
- Current placeholders to fill: Lean & Locked duration/sessions/inclusions/price and
  sign-up link; 1:1 coaching application link/price/spots; Maria's quals; CTA
  destinations (currently instagram.com/mriafitness).
- On hold, deliberately not built yet: testimonials section (slot is after 1:1
  Coaching), Instagram strip. Don't add them without real content.

## Verification habit (required before calling a change done)

Visual changes must be looked at, not assumed. With the dev server on port 5199:

```
node scripts/shoot.mjs <output-dir>
```

captures 390/768/1440 viewports at nine scroll positions (the site is scroll-driven —
mid-scroll is where it breaks) and prints a horizontal-overflow check. Read the
screenshots. `scripts/rm-check.mjs` verifies everything stays visible under reduced
motion and that no ScrollTrigger pins leak in. Both scripts use puppeteer-core with
Chrome at `/Applications/Google Chrome.app/...` — adjust `executablePath` if Chrome
lives elsewhere. `npm run build` must pass before handing work back.

## Adding or swapping a photo

1. Drop the original into `assets/`.
2. Add/edit its entry in the `MAP` in `scripts/optimize-images.mjs` (slug + widths).
3. `npm run images`.
4. Reference it in `index.html` with the `<picture>` pattern used by existing sections
   (AVIF/WebP/JPEG srcsets, explicit width/height, `loading="lazy"` below the fold).
5. Apply `.wash`/`.feather` if it's a studio-backdrop shot; screenshot to confirm no
   visible box.

In reserve (in `assets/`, currently unused): `photo.png` (gym candid), `IMG_5639.jpg`
(low-res, avoid large use).
