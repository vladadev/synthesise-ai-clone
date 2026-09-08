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

1. **Offers** (`/offers`) — the library, with search, filters, sorting and a
   Create Offer modal (Guided vs Fast Mode, topic, Improve Writing, output
   language).
2. **Build** (`/offers/[id]`) — the three steps, streamed over SSE:
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
    types.ts               domain model + the streaming protocol
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
demand problem. Metric bars are coloured by value, not by which metric they
are, so a weak number reads as weak at a glance.

## Notes and limits

- The output language selector is honoured by the Claude engine. The offline
  engine writes English whatever you pick — it composes from an English corpus
  rather than translating.
- Generated drafts are a starting point, not a finished product. Nothing here
  validates market claims; the scores are a model's opinion, or in offline mode
  a hand-assigned one.
- `.data/` is local scratch state and is gitignored. Delete it to reset.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
