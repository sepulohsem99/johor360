# Implementation Status — V2.2

**Live:** https://johor360.pages.dev
**Repository:** https://github.com/sepulohsem99/johor360
**Last verified deployment:** `44e07d48` / later
**Build:** `index-Bhf1MJOC.js` — 235.6 KB raw, 71.2 KB gzip
**Source:** 45 files, 12 760 lines, 44 routes

Honest accounting. "Verified" means it was exercised in a browser against the live
URL and produced the stated result.

---

## 1. Design system

| Item | Status | Evidence |
|---|---|---|
| Johor palette tokens (navy `#071D49`, red `#C8102E`, gold `#D4A64A`, dark bg `#0B1425`) | Done | `src/styles/index.css` |
| CSS-variable token layer, light + dark | Done | same file |
| Tailwind neutral remap to variables | Done | `tailwind.config.js` |
| Typography scale (was 13 ad-hoc sizes) | Done | unified scale in CSS |
| `.johor-band`, `.johor-rule`, `.motif-lattice` identity devices | Done | used on Home, About, Stations |
| Rail geometry as structural element | Done | `RailCorridor` used on Explore, Stations, Home |

## 2. Theming

| Item | Status | Evidence |
|---|---|---|
| Light / Dark / System toggle | Done, verified | clicking cycles all three; `data-theme` and body bg change instantly |
| No flash of wrong theme on load | Done | inline script in `index.html` sets `data-theme` before paint |
| Follows OS changes in System mode | Done | `matchMedia` listener in `prefs.tsx` |
| Dark mode across all modules | Done, verified | 87 hard-coded `bg-white` replaced; all 25 routes render dark correctly |

## 3. Language

| Item | Status | Evidence |
|---|---|---|
| BM default, EN available | Done | `lang=ms-MY` on first load |
| Switch without reload | Done, verified | *was broken*, fixed this pass (see QA report §2) |
| Persists across reload | Done, verified | 4 combinations tested |
| Full UI coverage | 0 English chrome on 25 routes | swept live DOM |
| `document.documentElement.lang` updated | Done | screen readers switch pronunciation |

## 4. Currency

| Item | Status | Evidence |
|---|---|---|
| MYR as immutable base | Done | stored prices never mutated |
| 8 currencies supported | Done | MYR, SGD, USD, IDR, THB, EUR, GBP, CNY |
| Live rates from 2 keyless providers | Done, verified | ExchangeRate-API primary, Frankfurter fallback |
| Fallback when primary down | Done, verified | returns Frankfurter, source relabelled |
| Honest failure when both down and no cache | Done, verified | returns `null`, UI falls back to MYR |
| Cached snapshots marked | Done, verified | `cached: true`, timestamp shown |
| Base MYR shown alongside converted | Done | `S$ 29.96 ≈ RM 95.00` |
| Dedicated converter UI | Done | `/visitor/profile` |
| Prices across cards, itinerary, budget | Done | 31 `money()` call sites migrated to currency-aware formatter |

## 5. Pages redesigned

| Page | Status |
|---|---|
| Home | Redesigned — 5.00 → **2.99** screens |
| Explore | Redesigned — discovery header, sticky 208 px filter rail, 3-col grid, fused rail band |
| Stations | Redesigned with corridor treatment |
| Experience detail | Restyled, currency-aware |
| Map & operator profile | Restyled |
| Auth / About / NotFound | Restyled |
| Visitor: onboarding, dashboard, recommendations, itinerary, favourites, profile | Restyled + translated + currency-aware |
| SME: dashboard, listings, listing form, enquiries, profile, performance | Restyled + translated |
| Admin: dashboard, verifications, reviews, experiences, impact, settings | Restyled + translated |

## 6. Defects found and fixed

1. `usePrefs` hook missing in `VisitorProfilePage` — build break.
2. **Search on Explore did not filter** — read URL param while input wrote state.
3. **Language switch did not re-render** — `i18n.language` read in effect.
4. **Dark mode broken by `white` token override** — `text-white` inverted, 87 `bg-white` left.
5. **Mobile overflow on 3 routes** — `1fr` grid tracks with auto min-width.
6. **`money()` ignored selected currency** on 31 call sites.
7. **Matching reasons hard-coded in English.**
8. Category labels hard-coded in English.
9. "Add another to itinerary" label promised append but did not mutate (fixed in V1, regression re-verified).
10. `bg-white` in admin KPI cards leaking light theme into dark.

## 7. What is NOT done

Stated plainly so nothing is overclaimed.

| Area | Reality |
|---|---|
| Backend | **None.** All state is `localStorage`. No server, no database. |
| Real authentication | **None.** Role switching is a demo control, not auth. |
| Payments / bookings | **Not implemented.** Enquiries are mock; nothing is sent or reserved. |
| Real operator data | **None.** All 34 experiences, 14 operators and 50 reviews are fabricated demonstration data, labelled as such. |
| Live train schedules | **None.** ETS corridor order is real reference information; times and frequencies are illustrative and labelled. |
| Photography | **None.** All imagery is procedurally generated SVG (`Scene.tsx`, `JohorIdentity.tsx`) — zero licensing risk, documented in code. |
| Automated tests | **None.** All QA is manual browser execution. |
| Automated a11y audit | **None.** Contrast and semantics checked by hand. |
| Jawi script | Not offered. |
| RTL layouts | Not supported. |

## 8. Deployment model

Manual `wrangler pages deploy dist` to the existing `johor360` Pages project,
`master` branch. There is **no GitHub → Cloudflare auto-deploy** connected, so a
git push does not publish. Rollback available via the Cloudflare dashboard to the
previous deployment.

## 9. Honest completion statement

The UI/UX redesign, bilingual layer, currency layer and theme layer are complete
and verified on production. The **product remains a front-end mockup**: it has no
backend, no real bookings and no real operator data, by design and per the
competition's prohibitions. Nothing in this repository should be read as a claim
of production readiness for real transactions.
