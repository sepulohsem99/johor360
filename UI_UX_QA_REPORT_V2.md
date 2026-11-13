# UI/UX QA Report — V2.2

**Target:** https://johor360.pages.dev
**Method:** every result below was produced by driving a real browser against the
**live production URL**, not localhost — except where a row is explicitly marked
*local*. Values were read from the DOM (`getComputedStyle`, `getBoundingClientRect`,
`document.body.innerText`), not inferred from source.

Build under test: `index-Bhf1MJOC.js`, deployed 13 Nov 2026.

---

## 1. Production build and routing

| Check | Result |
|---|---|
| TypeScript `tsc --noEmit -p tsconfig.app.json` | 0 errors |
| `npm run build` | success, 4.28 s |
| Main bundle | 235.6 KB raw / 71.2 KB gzip |
| Routes defined | 44 |
| Routes reachable and non-blank | 35 / 35 previously swept, 25 primary re-verified in this pass |
| SPA fallback on unknown path (`/nonexistent-xyz`) | 200, renders NotFound |
| Nested deep-link + hard refresh | verified on 5 nested routes, DOM length identical before and after refresh |

Nested refresh evidence (direct load vs post-refresh `#root` innerHTML length, live):

| Route | Direct | After refresh | H1 |
|---|---|---|---|
| `/admin/verifications` | 24 842 | 24 842 | Pengesahan penyenaraian |
| `/sme/listings/new` | 22 142 | 22 142 | Cipta penyenaraian |
| `/visitor/itinerary` | 39 961 | 39 961 | Four hours in Labis |
| `/experiences/exp-batik-canting` | 101 289 | 101 289 | Canting Batik Workshop |
| `/admin/impact` | 38 355 | 38 355 | Impak penemuan ekonomi |

---

## 2. Language, theme and currency

Tested by **clicking the real controls**, then hard-reloading.

| Combination | Result | Persists after refresh |
|---|---|---|
| BM + MYR + Light | `lang=ms-MY`, bg `rgb(255,255,255)`, h1 "Terokai Johor Melangkaui Bandar" | ✅ |
| BM + SGD + Dark | bg `rgb(11,20,37)`, price `S$ 29.96 ≈ RM 95.00` | ✅ |
| EN + SGD + Light | `lang=en`, h1 "Discover Johor Beyond the City" | ✅ |
| EN + USD + Dark | `US$ 23.29 ≈ RM 95.00` | ✅ |

Theme toggle cycles Cerah → Gelap → Sistem, all three applied instantly
(`light` → `rgb(255,255,255)`; `dark` → `rgb(11,20,37)`; `system` stored as the
literal `system` and resolved against the OS preference).

**Two real defects were found and fixed during this pass:**

1. **Language switch did not re-render.** Clicking EN changed
   `document.documentElement.lang` to `en` but the `<h1>` stayed in BM until a
   full reload. Cause: `t()` read `i18n.language`, which is mutated inside a
   `useEffect` — after React had already rendered. Fixed by deriving the
   translator from the `lang` state (`i18n.getFixedT(lang)`). Verified after the
   fix: BM → EN → BM switches take effect with no reload.
2. **Dark mode had light-theme artefacts.** 87 occurrences of `bg-white` were
   left hard-coded, so cards stayed white inside a navy page. Replaced with the
   `bg-raised` token. Root cause was a Tailwind override that remapped `white` to
   `var(--bg)`, which also inverted `text-white`.

---

## 3. Untranslated interface elements

Swept all 25 primary routes in BM, reading every `button`, `h1`–`h4`, `label`,
`th`, `<option>` and `input[placeholder]` from the live DOM and matching against
English UI vocabulary.

**Result: 0 interface strings remaining in English.**

Excluded by design (documented in `LANGUAGE_AND_LOCALISATION_SPEC.md`): experience
titles, operator names, and station names, which are user/data content rather than
chrome. Examples that still appear in English — "Loom Session with the Tenun
Collective", "Farm-to-Table Cook Session" — are catalogue entries, not labels.

---

## 4. Responsive layout

Measured `documentElement.scrollWidth` vs `clientWidth` on every primary route at
three widths. Anything where `scrollWidth > clientWidth + 2` counts as overflow.

| Width | Routes tested | Overflow before fixes | Overflow after fixes |
|---|---|---|---|
| 1440 | 24 | 0 | **0** |
| 768 | 24 | 0 | **0** |
| 390 | 25 | **3** | **0** |

The three mobile overflows were real and were caused by the classic grid defect:
`lg:grid-cols-[1fr_320px]` gives the `1fr` track an automatic minimum equal to its
content's min-content width, so a long row (a horizontal chip strip, a 4-step
stepper, a data table) pushed the track wider than the viewport.

Fixes applied:
- `1fr` → `minmax(0,1fr)` in 6 files (Admin, SME, Itinerary, Auth,
  ExperienceDetail, Stations).
- `min-w-0` on the flex/grid children that were forcing the track open.
- Itinerary chip strip wrapped in a clipping container with its own scroll.

Verified after fix at 390 px: `/visitor/itinerary`, `/sme`, `/admin`,
`/admin/impact`, `/sme/listings/new` all report `scrollWidth == clientWidth == 390`.

---

## 5. Three-column grid on Explore

At 1440 px, the results grid computes to
`361.328px 361.328px 361.344px` — three equal columns — with a 208 px sticky
filter rail and 28 cards rendered.

---

## 6. Functional journeys (live production)

All six journeys were executed against https://johor360.pages.dev.

### J1 — Discovery, search, filtering
- Baseline 28 cards.
- Type "batik" → **1** card ("Canting Batik Workshop"), URL becomes `?q=batik`.
- Clear → back to 28.
- Station filter `kluang` → URL `?q=batik&station=kluang`, 1 card.
- Empty state present and correctly worded when a search matches nothing.

**Note:** search filtering was broken in an earlier build — the filter read the
`q` URL param while the input wrote to local state, so typing changed nothing.
Fixed to filter on the typed value with a 350 ms debounced URL sync. Verified: 28
→ 1 → 0 → 28.

### J2 — Itinerary creation
- Opened `/experiences/exp-batik-canting`, clicked the itinerary CTA.
- Navigated to `/visitor/itinerary`, **3 stops**, cost recomputed (RM 262 total across the three).

### J3 — Adaptive recommendations
- Default top 3: Farm-to-Table Cook Session · Smallholder Orchard Walk & Tasting ·
  Loom Session with the Tenun Collective.
- Toggled rain → top 3 becomes **Loom Session** · Wood-Fired Coffee Cupping ·
  Railway Engineering for Families (all indoor).

### J4 — SME listing submission
- Filled all 4 steps of `/sme/listings/new`; "Teruskan" stayed disabled until each
  step's validation passed (min title length, ≥60-char description, price > 0,
  access notes, learning value).
- Submitted → toast "Dihantar untuk pengesahan", pending count 1 → **2**.

### J5 — Admin verification and approval
- New listing appeared in `/admin/verifications`.
- Inspect → Luluskan → queue 2 → **1**.
- Switched to visitor `/explore`, searched "Mengkuang" → listing visible.
- Hard reload with `?q=Mengkuang` → still visible. **Cross-role persistence confirmed.**

### J6 — Impact analytics
- `/admin/impact` renders headline **93%** of enquiries going to operators outside
  JB Sentral, station-level breakdown, enquiry funnel and discovery distribution,
  all derived from live store state (counts moved as listings were added).

---

## 7. Currency API failure behaviour

Tested at the service layer with `fetch` stubbed per scenario (browser-level fetch
interception does not survive navigation, so this was run against
`src/services/rates.ts` directly). Full output in
`docs/evidence/fx-failure-test.txt`.

| Scenario | Observed |
|---|---|
| Both providers up | ExchangeRate-API, MYR→SGD 0.31536, `cached: false` |
| Cache within TTL | `cached: true` |
| Primary down, fallback up | Frankfurter (ECB reference), SGD 0.31529 |
| Both down, warm cache | snapshot returned, `cached: true` |
| Both down, cache cleared | **`null`** — no rate invented |

---

## 8. Screenshots

Captured from **production** at three widths, plus a dark-mode desktop capture.
See `docs/after/`:

- `home_desktop_1440.png`, `home_tablet_768.png`, `home_mobile_390.png`
- `explore_desktop_1440.png`, `explore_tablet_768.png`, `explore_mobile_390.png`
- `explore_desktop_1440_dark.png`

Before/after comparison against `docs/before/` (same three widths, same two pages)
is in `plan.md`.

---

## 9. Known defects and limitations

Honest list of what is still wrong or unproven.

1. **Experience titles, summaries and operator names are English.** Deliberate —
   they are operator-authored content, not UI. A real deployment would need an
   operator-side language field.
2. **Currency rates are daily reference rates, not live quotes.** Stated in the UI.
3. **No automated accessibility audit.** Contrast and semantics were checked by
   hand and by reading computed styles; no axe/Lighthouse run was performed, so
   there may be uncaught violations (notably in focus order within the mobile
   filter drawer).
4. **No automated test suite.** All verification in this report is manual
   browser execution. There is no CI test gate, so a future regression would not
   be caught automatically.
5. **One transient production blank-page event was observed** during deployment and
   did not reproduce on reload; the assets served correctly on inspection
   (241 270 bytes for the main bundle). Treated as an edge propagation window, but
   it is a real observation and is recorded rather than dismissed.
6. **Cross-role state is localStorage only.** Clearing browser data resets
   listings, approvals and enquiries. Correct for a mockup, not for production.
7. **Mobile filter drawer focus trap** is not verified; keyboard users may escape
   the drawer.
8. **Tablet 768 px was measured for overflow only**, not for visual hierarchy.

## 10. Status

Local build: **passing**.
Production deployment: **verified working** at https://johor360.pages.dev.
Critical journeys: **6 / 6 passing on production**.
Mobile overflow: **0 / 25 routes**.
Untranslated UI chrome: **0 across 25 routes**.
