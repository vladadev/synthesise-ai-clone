# Synthesise AI — clone

A working clone of the Synthesise AI product builder: type a topic (or let it
choose), watch it weigh a field of scored niches, lock one in, write a
~2,000-word lead magnet, and render a cover.

Built with Next.js (App Router), TypeScript and Tailwind v4. It runs with **no
API key and no database** — a deterministic generation engine ships with the
app — and switches to Claude when you give it a key.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

That's the whole setup. Offers are persisted as JSON under `.data/offers/`.

To route generation through Claude instead of the bundled engine:

```bash
cp .env.example .env.local
# set ANTHROPIC_API_KEY, then restart
```

## The flow

1. **Composer** (`/`) — "What do you know, care about, or want to help people
   with?" One box, a Guided/Fast mode picker, trending offers, a Growth
   Operator path for building on someone else's expertise, and a "you choose"
   option for a blank start.
2. **Discover Your Profitable Pocket** (`/discover/[id]`) — the market sweep,
   streamed over SSE in three stages:
   - **Directions** — finds the industry directions worth exploring. Anything
     typed in the composer re-orders this, because what the user already knows
     is evidence about demand rather than only a filter.
   - **Brainstorm** — turns each direction into concrete opportunities, listed
     as Title Case topics against their industry ("20 directions explored").
   - **Score** — restates each as *"I help <audience> <outcome> without
     <constraint>"*, scores all 30, then cuts a shortlist with the current
     leader and the field average ("30 evaluated · 20 ready to review").

   Picking a shortlisted opportunity creates an offer with the niche already
   decided — step 1 locks in immediately rather than re-scanning a field the
   explorer has already scored.
3. **Offers** (`/offers`) — the library, with search, filters, sorting, starring
   and a Create Offer modal for starting from a topic directly.
4. **Build** (`/offers/[id]`) — the three steps, streamed over SSE:
   - **Niche** — candidates land one at a time as `Drafting…` then resolve into
     a scored card (pain / demand / speed), against a `n / total` counter, with
     skeletons for the ones not reached yet. The highest score wins and the
     view collapses into *Niche locked in*: an **Also considered** rail beside
     the full winner card (specific knowledge, problem solved, and pain /
     worsening / demand / speed).
   - **Script** — a named framework, an opening, five numbered moves that each
     end on a rule, a "how to tell it is working" section, and a close.
     Sections appear as they are written.
   - **Render** — the cover, drawn from the winning niche's palette.

Every left-rail entry routes to a real page: Explorations (every sweep and its
leader), Activity (a feed of runs), Trending (the whole opportunity corpus,
ranked), Saved (starred offers) and How it works (what each stage does and what
the score means).

## How it is put together

```
src/
  app/                     routes + API (offers CRUD, SSE stream, improve-writing)
  components/
    shell/                 icon rail, top bar
    offers/                list, toolbar, offer card, create modal
    build/                 stepper, candidate grid, winner card, reader, cover
    ui/                    button, score badge, metric bar, skeletons, logo
  hooks/useOfferStream.ts  folds the SSE events into render state
  lib/
    types.ts               domain model + both streaming protocols
    discovery/
      directions.ts        24 industry directions, 39 opportunities
      engine.ts            seed-aware field selection and scoring
      pipeline.ts          Directions -> Brainstorm -> Score, as events
    store.ts               JSON file store (serialised writes, atomic rename)
    ai/
      engine.ts            the two-method interface both engines implement
      offline.ts           default engine — deterministic, no network
      claude.ts            live engine, used when ANTHROPIC_API_KEY is set
      corpus*.ts           the hand-written niche library
      derive.ts            topic → scored field of niche angles
      writer.ts            niche → the finished lead magnet
      pipeline.ts          orchestrates the three steps, emits StreamEvents
```

### The two engines

Both implement the same interface — propose a field of niches, write the
lead magnet for the winner — so pacing, scoring, persistence and every pixel of
the UI are shared:

- **Offline (default).** A hand-written library of ten fully-authored niches
  plus a template system that synthesises angles for any typed topic. Seeded
  from a hash of the topic, so the same input always produces the same run.
- **Claude.** Fills the same structures from the model. Anything it omits falls
  back to the offline value for that field, and a failed call falls back to the
  offline engine entirely — a rate limit degrades the output, it never breaks a
  run.

### Scoring

`score = (3·pain + 2·demand + 2·worsening + speed) / 8`

Pain carries the most weight because a product nobody hurts for does not sell;
speed the least, because slow-to-deliver is a scheduling problem rather than a
demand problem. The same formula scores opportunities in the explorer and
candidates in the builder, so one number means one thing everywhere. Metric bars
are coloured by value, not by which metric they are, so a weak number reads as
weak at a glance.

A typed seed lifts pain and demand for the directions it matches, capped at
+0.9, and those rows are labelled "matches what you know". The cap is the point:
knowing an area should let a good niche win, but should not let a weak one
outrank a much stronger market.

## Notes and limits

- The output language selector is honoured by the Claude engine. The offline
  engine writes English whatever you pick — it composes from an English corpus
  rather than translating.
- Generated drafts are a starting point, not a finished product. Nothing here
  validates market claims; the scores are a model's opinion, or in offline mode
  a hand-assigned one. **No live marketplace is queried** — the "market model"
  is the corpus in `src/lib/discovery/`.
- There is no PDF export yet.
- `.data/` is local scratch state and is gitignored. Delete it to reset.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
