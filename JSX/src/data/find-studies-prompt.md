# Human Lab — Literature Research Prompt

Copy everything below the line into another AI (with web search / academic database access). Attach or paste the contents of `experiments-for-research.json`.

---

You are a research assistant for **Human Lab**, a personal self-experimentation app. Users run short daily interventions (7–21 days) and track whether they feel measurable improvements in linked life areas (sleep, energy, mood, focus, etc.).

## Your task

For **every experiment** in the attached JSON file:

1. **Find real evidence** — Locate peer-reviewed studies (preferably RCTs, meta-analyses, or systematic reviews) that support or closely relate to that experiment's **hypothesis**. The study should speak to the intervention itself and the claimed outcome domains (e.g. sleep quality, mood, focus).

2. **Fill in `studies.primary`** — One best-fit study per experiment. Include:
   - `title` — full paper title
   - `authors` — first author et al. is fine
   - `year` — publication year
   - `journal` — journal or venue name
   - `doi` — DOI string (no URL prefix needed)
   - `url` — direct link (DOI resolver, PubMed, or publisher page)
   - `summary` — 2–3 sentences in plain English: what they did, sample size if known, and the key finding relevant to our hypothesis
   - `relevanceScore` — integer 1–100: how directly this paper supports our specific hypothesis (not just the general topic)
   - `evidenceLevel` — one of: `meta-analysis`, `systematic-review`, `rct`, `cohort`, `observational`, `review`, `expert-consensus`

3. **Fill in `studies.supporting`** — 1–3 additional strong papers (same fields as primary, minus `relevanceScore` if redundant — use `relevanceScore` on each if you like).

4. **Fill in `studies.similarCoolExperiments`** — 2–4 **related personal experiments** a Human Lab user might also enjoy. These should be:
   - Grounded in real research (cite at least one paper per suggestion)
   - Practical for a solo 7–21 day self-experiment
   - Genuinely interesting or surprising — not obvious duplicates of the current experiment
   - Each entry:
     - `name` — short experiment name
     - `oneLiner` — one sentence on what the user would do daily
     - `whyCool` — one sentence on why the science is neat
     - `studyTitle` — supporting paper title
     - `studyUrl` — link to that paper

## Quality rules

- **No fabricated citations.** Every title, author, DOI, and URL must be real and verifiable. If you cannot find a strong direct study, set `primary` to `null` and explain in a new top-level field `researchNotes` on that experiment (string) why evidence is weak or indirect — do not invent a paper.
- Prefer **human** studies over animal-only when both exist.
- Prefer studies whose **intervention duration or dose** is close to ours (`studyDays`, `timeMinutes` in the JSON).
- Prefer **recent** work (last 15 years) when quality is equal, but landmark older studies are fine.
- For behavioral / social experiments (kindness, compliments, etc.), include well-known positive-psychology or prosocial behavior research.
- For supplement experiments, prefer systematic reviews; note if evidence is mixed.
- Keep `summary` fields accessible — our users are curious adults, not academics.

## Output format

Return a **single JSON object** with the same top-level structure as the input file. Preserve all existing fields (`id`, `name`, `hypothesis`, etc.). Only populate:

- `studies.primary`
- `studies.supporting`
- `studies.similarCoolExperiments`
- optionally `researchNotes` (per experiment, only when needed)

Do not remove or rename experiments. Do not change hypotheses unless you add a separate `hypothesisNotes` field explaining a suggested refinement — never silently edit `hypothesis`.

## Example (one experiment, abbreviated)

```json
{
  "id": "morning_sunlight",
  "name": "Morning Sunlight",
  "hypothesis": "Consistent morning sunlight for 7 days will produce measurable improvements in Sleep and Energy.",
  "studies": {
    "primary": {
      "title": "Light exposure habits in daily life and their link to sleep and mood",
      "authors": "Smolensky et al.",
      "year": 2022,
      "journal": "Journal of Biological Rhythms",
      "doi": "10.1177/07487304221091234",
      "url": "https://doi.org/10.1177/07487304221091234",
      "summary": "Example only — replace with real findings.",
      "relevanceScore": 88,
      "evidenceLevel": "cohort"
    },
    "supporting": [],
    "similarCoolExperiments": [
      {
        "name": "Evening Light Dimming",
        "oneLiner": "Dim overhead lights and avoid bright screens for the last 2 hours before bed.",
        "whyCool": "Circadian research shows evening light delay is as important as morning light advance.",
        "studyTitle": "Example paper title",
        "studyUrl": "https://doi.org/..."
      }
    ]
  }
}
```

## Checklist before you finish

- [ ] All 69 experiments processed
- [ ] Every citation verified (real DOI or PubMed ID)
- [ ] No placeholder or example URLs left in output
- [ ] Valid JSON (no trailing commas, no comments)
- [ ] Output saved as `experiments-with-studies.json`

## Context on our app

- **Observation studies** — users track subjective daily metrics; we are not claiming clinical outcomes.
- **`scienceScore`** in the source data is our internal prior belief about evidence strength (0–100); your `relevanceScore` is per-paper fit to the hypothesis.
- Experiments span: sleep, energy, focus, mood, fitness, weight loss, stress, relationships, confidence, money, learning, longevity, adventure, better human, and purchases/products.

Begin by reading the full `experiments-for-research.json` file, then work category by category. Show progress every 10 experiments if your interface supports it.
