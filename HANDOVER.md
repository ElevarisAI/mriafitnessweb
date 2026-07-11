# Handover — mriafitness site

Hi Maria — this is your site's source code, built by Harley (Elevaris AI). This doc
gets you from "folder of files" to making edits with Claude Code in about ten minutes.

## What you're holding

A single-page site: hero → scrolling proof strip → Who I Am → Lean & Locked (the big
letter animation) → 1:1 Coaching → beach interlude → final call-to-action. It's
front-end only — nothing here touches payments, email, or a database yet.

Four documents live in this folder and your Claude Code will use them:

- **CLAUDE.md** — read automatically by Claude Code every session. Structure, design
  rules, workflows. You don't need to read it, but don't delete it.
- **PRODUCT.md** — the brand strategy (who the site is for, tone, principles).
- **PLAN.md** — the full build spec and a log of every revision so far.
- **HANDOVER.md** — this file.

## Getting it running

1. Install Node.js 20 or newer (nodejs.org) if you don't have it.
2. In Terminal, in this folder: `npm install` (once), then `npm run dev`.
3. Open the address it prints (usually http://localhost:5173). Edits appear live.

## The one big thing the site needs from you

Everything I couldn't confirm is marked on the page itself with a dashed underline,
like `[confirm: price + sign-up link]`. Nothing was invented — no fake stats, no fake
testimonials. The list:

- Lean & Locked: how many weeks, sessions per week, what's included, price, and where
  "Start Lean & Locked" should actually send people.
- 1:1 Coaching: how people apply, price, how many spots.
- Who I Am: your quals / coaching background line.

Fill these by telling Claude Code the real details, e.g. *"Lean & Locked is 12 weeks,
4 sessions a week with gym and home versions, £X one-time — update the placeholders in
the plan section."*

## Making edits with Claude Code

Open Claude Code in this folder and just describe what you want. Good examples:

- "Change the hero headline to …"
- "Swap the Who I Am photo for the one I've put in assets/ called new-shoot.jpg"
- "Rewrite the 1:1 coaching steps in my voice: …"
- "Add the testimonials section — here are three real quotes with names: …"

Claude Code knows the rules from CLAUDE.md: it'll keep your brand colours and fonts,
keep photos blended into the page (no white boxes), and screenshot its own work to
check it. If it ever proposes inventing numbers or quotes, that's against the project
rules — give it the real ones instead.

Two sections are deliberately not built yet, waiting on real content from you:
**testimonials** and an **Instagram strip**. Ask for them once you have the content.

## Things to leave alone (unless you ask Claude deliberately)

- `src/motion/lock.ts` — the Lean & Locked letter animation (the signature moment).
- `public/img/` — generated automatically; never edit these files by hand.
- The five brand colours and the two fonts — they're sampled from your own portfolio.

## When you're done editing

`npm run build` should finish without errors — that's the "safe to deploy" check.
Deployment to the live domain goes through Harley (Vercel) — send the folder back or,
better, ask him to set up a shared GitHub repo so changes flow both ways.

Questions or anything broken: Harley — harleyjgrey@gmail.com.
