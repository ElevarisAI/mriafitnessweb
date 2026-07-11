# Maria Savage — mriafitness site build plan

Single-page front-end marketing site. Vite + vanilla TypeScript + GSAP ScrollTrigger.
No backend, no SEO pass yet. This document is the build spec; follow it top to bottom.

## 1. Brand tokens (sampled from her Canva portfolio screenshots, contrast-verified)

| Token          | Value     | Use                                                    |
|----------------|-----------|--------------------------------------------------------|
| `--tan`        | `#CFBFA9` | Body background (committed mid-tone surface, 60%+)     |
| `--brown`      | `#64472F` | Display headings, nav pill fill (4.70:1 on tan — large text only) |
| `--ink`        | `#3F2C1D` | Body copy on tan (7.35:1, AA)                          |
| `--bone`       | `#E6DED2` | Light panels, text on brown/espresso (6.34:1 on brown) |
| `--espresso`   | `#130A02` | Dark final section bg, strongest ink (10.89:1 on tan)  |

Rules: no colour outside these five (plus alpha variants). CTAs are filled `--brown`
pills with `--bone` text — lifted straight from her portfolio nav. OKLCH equivalents
defined in tokens.css with hex fallbacks. Focus ring: 2px `--espresso` offset 2px.

## 2. Typography

- **Display: Poppins ExtraBold (800)** — closest maintained match to her Canva heavy
  geometric. Every heading ends with a full stop ("Lean & Locked.") — brand tic, kept
  site-wide. Clamp ceiling 6rem. Letter-spacing -0.02em, never tighter than -0.04em.
- **Body: Quicksand (400/500/600, variable)** — closest maintained match to her Canva
  body (Glacial Indifference isn't on Fontsource). 16–18px, line-height 1.6, max 70ch.
- Both self-hosted via @fontsource. `font-display: swap`. `text-wrap: balance` on
  headings, `pretty` on prose.

## 3. Asset map (source in /assets, renditions generated to /public/img)

| Source file                       | Slug        | Placement                                   | Treatment |
|-----------------------------------|-------------|---------------------------------------------|-----------|
| `Hero.jpg` (6720×4480, grey studio, knee-up pose) | `hero`  | Hero background (user-specified)  | Warm tan wash (multiply overlay) so grey studio joins the brand world; giant brown type over |
| `dfuns 2025-11-18 030406.054.jpg` (beach torso, warm film) | `plan` | Lean & Locked section (user-specified) | Feathered mask into tan; already palette-perfect |
| `0371 - lojo.jpg` (seated stretch, grey studio) | `stretch` | 1:1 Coaching side image | Same warm wash treatment as hero |
| `dfuns 2025-11-18 112758.429.JPEG` (beach glute bridge, moody ocean) | `beach` | Full-bleed editorial break before final CTA | Full-bleed, slight scroll parallax, one line of type |
| `Who i am.jpg` (crouched studio pose, looks to camera) | `whoiam` | Who I Am section | Warm wash + feather |
| `photo.png` (gym candid, pink leggings) | `about` | **Held in reserve** (was About; replaced by whoiam) | — |
| `IMG_5639.jpg` (1280px, 2013, AYBL candid) | — | **Held in reserve** — too low-res for large use | — |

Pipeline: `scripts/optimize-images.mjs` (sharp). Hero/beach: 2400/1600/960w. Others:
1600/960/640w. AVIF + WebP + JPEG each, quality ~72/75/80. `<picture>` with `srcset`,
explicit width/height (no CLS), `loading="lazy"` below the fold, hero eager +
`fetchpriority="high"`.

## 4. Page structure & section specs

Sticky nav → Hero → Proof strip → Who I Am → Lean & Locked → 1:1 Coaching → Beach break →
Final CTA/footer. Who I Am sits directly after the hero to build trust before any pitch.
**Held per Harley: testimonials, Instagram strip.**

Revisions (2026-07-10, round 2):
- §4.3 proof strip is now bare brown text on the tan body — no espresso band.
- Who I Am moved up, uses `whoiam` photo, and gains its own scroll moment: the
  first-person manifesto inks in word-by-word on scrub (src/motion/about.ts), photo
  drifts ±4% (generalised data-parallax).
- §4.5 How It Works became **1:1 Coaching.** — same Start/Train/Lock-in structure,
  copy tailored to personal coaching with weekly calls; own CTA + placeholders.
  Lean & Locked stays the one-time-purchase plan; 1:1 is the personal offer.

### 4.1 Nav (sticky)
"Maria Savage" wordmark left (Poppins 800). Links: The Plan. / How It Works. / About. /
pill CTA "Start Now". Active section gets the filled brown pill (her portfolio's own nav
pattern). Transparent over hero, gains tan background + subtle shadow after scroll.
Mobile: wordmark + Start Now pill only (no hamburger — four anchors don't earn one;
the page itself is the nav).

### 4.2 Hero (100dvh)
Full-bleed `hero` image, warm-washed. Headline stacked left, overlapping her figure like
her "Creative Portfolio" cover: **"Stronger. Leaner. Locked in."** (three lines, clamp
2.8–6rem). Sub: one sentence naming her and the offer. CTA pill "Start Lean & Locked" +
ghost link "How it works ↓". Intro motion: type rises line-by-line (120ms stagger),
image scales 1.04→1. Reduced motion: everything visible, simple fade.

### 4.3 Proof strip
Slim espresso band, tan text marquee (CSS transform loop, pausable, reduced-motion:
static row): `50k+ community · 30+ brand collabs · MyProtein · AYBL · Motel Rocks ·
@mriafitness`. Facts from her portfolio only.

### 4.4 Lean & Locked — THE section + signature animation
Pinned intro: "Lean & Locked." viewport-wide in Poppins 800. On scroll-scrub the letters
start loose (wide tracking, alternating baseline offsets, 0.6 opacity) and **lock**
tight into final setting — the name performing its meaning — with a settle
(scale 1.01→1) at the end. GSAP ScrollTrigger pin + scrub 0.5, ~120vh of scroll.
Reduced motion: heading static, content crossfades.
Content after unpin: two-column (stacks on mobile). Left: what the plan is, who it's
for, "What's included" list — all factual claims as marked placeholders (see §6). Right:
`plan` beach photo, feathered mask, slight rotation (-2deg) for editorial looseness.
Primary CTA pill. No price shown until Maria confirms one.

### 4.5 How It Works
A real 3-step sequence, so numbered markers are honest here (and only here):
1. Start — sign up, tell Maria where you're at. 2. Train — follow the plan, [X] sessions
a week. 3. Lock in — check-ins and adjustments so it sticks. Layout: steps as a
staggered vertical rhythm beside the `stretch` image (warm-washed), not three identical
cards. Numbers oversized in brown at 0.15 alpha behind each step title.

### 4.6 Beach break (editorial breather)
Full-bleed `beach` photo, ~70vh. One line of type in bone, bottom-left: a short
first-person line (non-factual, tone only). Background parallax ±8% via ScrollTrigger.
Reduced motion: static.

### 4.7 About — "Who I Am."
Split: `about` gym candid (feathered) left ~45%, copy right. Heading "Who I Am." First
person, 3 short paragraphs max: creator (@mriafitness), what she believes about
training, why she coaches. Factual specifics beyond the portfolio = placeholders.

### 4.8 Final CTA + footer
Espresso section (the page's one dark moment). Big line: "Ready to lock in." Tan display
type, CTA pill (bone fill, espresso text). Below: small footer — © Maria Savage,
Instagram link (https://instagram.com/mriafitness), "Site by Elevaris AI" optional
(ask Harley). CTA destination is a placeholder Instagram link until a checkout/form
exists.

## 5. Motion system

- Signature: §4.4 lock-in scrub. One only.
- Supporting: hero intro; per-section reveals only where they add rhythm (not uniform);
  hovers 150–250ms ease-out-quart; marquee.
- All reveals enhance already-visible content (no opacity:0 defaults in CSS — GSAP sets
  initial states from JS, so no-JS/headless still shows everything).
- `prefers-reduced-motion`: kill ScrollTrigger pins/scrubs, marquee static, hovers keep
  colour-only transitions.
- Semantic z-index scale: base 0 / imagery 1 / content 2 / nav 100 / skip-link 200.

## 6. Honesty rules (hard constraints)

- Real facts allowed: name, @mriafitness, 50k+ followers, 30+ brand collabs, MyProtein /
  AYBL / Motel Rocks, her doing strategy/shoot/edit/post.
- Everything unknown ships as a visible bracketed placeholder: `[confirm: weeks]`,
  `[confirm: what's included]`, `[confirm: price]`. Collected in §9 so nothing hides.
- No testimonials, no results claims, no invented stats. Testimonial section HELD.

## 7. File structure

```
index.html
package.json / tsconfig.json / vite.config.ts
scripts/optimize-images.mjs      # sharp renditions, run once (npm run images)
src/main.ts                      # boots motion modules
src/motion/{hero,lock,reveals,marquee,nav}.ts
src/styles/{tokens,base,nav,hero,proof,plan,how,beach,about,footer}.css
assets/                          # originals, untouched
public/img/                      # generated renditions (gitignored? keep — no repo yet)
```

## 8. Build order + verification

1. Scaffold + deps (vite, typescript, gsap, @fontsource/poppins, @fontsource/quicksand;
   dev: sharp, puppeteer-core).
2. Run image pipeline; confirm renditions.
3. tokens/base/nav → hero → proof → Lean & Locked (+ lock-in) → how → beach → about →
   footer. Screenshot after hero and after each risky section, not only at the end.
4. Verify: puppeteer-core + installed Chrome, viewports 390×844 / 768×1024 / 1440×900,
   screenshots at multiple scroll positions (scroll-driven site — the money is
   mid-scroll). Real viewport heights (no full-page capture distortion of 100dvh).
5. Final pass: contrast spot-checks, keyboard tab order + visible focus, reduced-motion
   run-through, heading overflow at 375px, `text-wrap`, alt text, no horizontal scroll.

## 9. Open questions for Maria/Harley (placeholders in the meantime)

- Lean & Locked: duration, sessions/week, what's included, price, CTA destination.
- About: any specifics she wants (certifications, years training, location).
- Footer: "Site by Elevaris AI" credit yes/no.
- Later: real testimonials (section designed but held), Instagram strip (held).
