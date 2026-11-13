# JOHOR360 — Build Plan and Progress

**Problem statement:** Johor Innovation Challenge 2026, Category 4 — *Connecting
Visitors in Johor.* "How might we help visitors in Johor discover leisure and
educational activities, focusing on small and medium operators, across the ETS line?"

**Live:** https://johor360.pages.dev
**Repo:** https://github.com/sepulohsem99/johor360

---

## The one-sentence version

Johor has experiences worth crossing the state for; nobody tells visitors where
they are or how to reach them without a car. JOHOR360 is a rail-first discovery
platform that matches visitors to verified small operators along the ETS corridor,
with the return train already in the plan.

## Why this problem statement

Chosen over PS1 (SME Economic Participation: Digital & ESG Integration) because
the pain is visible and demonstrable in a live demo, and because the corridor is a
real, verifiable piece of infrastructure — the KL–JB ETS through-service opened in
December 2025, which makes the timing of the problem concrete rather than
hypothetical.

---

## Phase 1 — Build (complete)

- Vite + React + TypeScript, 44 routes, Tailwind.
- 34 demonstration experiences across 14 operators, 9 real corridor stations.
- Matching engine with published weights and per-result breakdown.
- Itinerary builder with time, budget and station constraints.
- Visitor, SME and Admin role portals.
- Procedural SVG artwork instead of unlicensed photography.
- Deployed to Cloudflare Pages.

**Problems solved in this phase:** bundle reduced 1.19 MB → 385 KB by replacing
`import * as Lucide` with an explicit icon registry; itinerary engine initially
picked a station two hours away inside a four-hour window, fixed by preferring
station-local results; add-to-itinerary button did not mutate state, rewritten.

## Phase 2 — V2 redesign (complete)

Directive: excessive whitespace, weak hierarchy, insufficient Johor identity,
generic SaaS appearance.

### Audit first, measurements not impressions

- 6 before-screenshots captured at 1440/768/390 (`docs/before/`).
- Page heights measured from the DOM: Home **5.00 screens**, Explore **4.90**.
- Explore result column measured at 924 px with ~300 px cards — the cause of the
  "sparse, not dense" impression.
- 13 distinct font sizes between 9.5 and 32 px.
- Contrast computed: faint text `#8FA1B5` on white ≈ 2.6:1, below AA.

Findings written to `UI_UX_AUDIT_V2.md`.

### Then the redesign

| Area | Change |
|---|---|
| Tokens | CSS-variable layer, Johor palette, light + dark |
| Identity | Rail geometry as structure; corridor strip, station markers, heritage motifs |
| Home | 5.00 → **2.99 screens** |
| Explore | Compact discovery header, sticky 208 px filter rail, 3-col grid, rail band fused to results card (measured 0 px seam, equal width and left offset) |
| Theme | Light / Dark / System, persists, no flash |
| Language | BM default, EN secondary, immediate switch |
| Currency | MYR base, 8 currencies, 2 providers, honest failure |

## Phase 3 — V2.2 completion (complete)

Bilingual coverage, currency everywhere, theme consistency, responsive fixes,
production deployment and verification.

| Work item | Result |
|---|---|
| UI strings translated | ~350, across 11 files, via `<T>` + `tx()` |
| English chrome remaining | **0** on 25 routes |
| `money()` → currency-aware | 31 call sites |
| `bg-white` → `bg-raised` | 87 occurrences |
| Mobile overflow routes | 3 → **0** |
| Real bugs fixed this pass | 4 (language re-render, mobile grid, search filter, review chips) |

---

## Before / after — measured

| Metric | Before | After | Δ |
|---|---|---|---|
| Home page height | 5.00 screens | **2.99 screens** | −40% |
| Font sizes in use | 13 | unified scale | — |
| Faint-text contrast | ≈2.6:1 | ≥4.5:1 | passes AA |
| Explore grid | 924 px column, ~300 px cards | 3 × 361 px columns | 3-col confirmed |
| Mobile overflow (390 px) | 3 of 25 routes | **0 of 25** | fixed |
| Untranslated UI chrome | all English | **0 on 25 routes** | fixed |
| Languages | 1 | 2 | +1 |
| Themes | 1 | 3 | +2 |
| Currencies | 1 | 8 | +7 |

Screenshots: `docs/before/` vs `docs/after/` — same two pages, same three widths
(1440 / 768 / 390), plus a dark-mode desktop capture.

---

## Evidence trail

| File | Contents |
|---|---|
| `UI_UX_AUDIT_V2.md` | Measured audit of the V1 build |
| `LANGUAGE_AND_LOCALISATION_SPEC.md` | Language architecture and coverage |
| `CURRENCY_CONVERSION_SPEC.md` | Rate sources, caching, honesty rules |
| `UI_UX_QA_REPORT_V2.md` | Production test results |
| `IMPLEMENTATION_STATUS.md` | What is done and what is not |
| `docs/evidence/fx-failure-test.txt` | Real output of the 5 FX failure scenarios |
| `docs/before/`, `docs/after/` | Screenshots, 3 widths each |

---

## Verification standard used

A claim went in this document only if a browser returned it. Numeric claims come
from `getComputedStyle` / `getBoundingClientRect` / `document.body.innerText` on
the running page — never from reading source and inferring the result.

Where something could not be verified, it is listed as a limitation rather than
softened into a pass.

## Known gaps

- No backend, no real auth, no payments, no bookings. By design.
- All operators, experiences and reviews are demonstration data, labelled.
- No automated tests, no automated accessibility audit.
- Manual deployment; no CI pipeline.

## Next, if this were continued past the competition

1. Operator-authored listings with a real database and moderation workflow.
2. Actual KTMB timetable integration to turn illustrative times into real ones.
3. Accessibility audit with axe and a keyboard-only pass on the filter drawer.
4. Automated smoke tests over the six journeys so regressions are caught.
