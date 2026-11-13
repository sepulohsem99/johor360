# UI/UX Audit — V2 (Before Redesign)

**Scope:** the V1 build as deployed at the start of this directive.
**Method:** source inspection plus rendered-page measurement through a real
browser at 1440×900, 768×1024 and 390×844. Screenshots were captured (see
`docs/before/`), and layout numbers were read from the live DOM rather than
estimated by eye.

Everything below is measured, not asserted. Where a number appears, it came from
`getBoundingClientRect()` / `getComputedStyle()` on the running page.

---

## 1. Excessive vertical spacing and oversize hero

| Page | Measured page height | Viewport | Screens of scroll |
|---|---|---|---|
| Home (`/`) | 4 500 px | 900 px | **5.00** |
| Explore (`/explore`) | 4 410 px | 900 px | **4.90** |

The homepage hero alone consumed ~640 px of vertical space before the first
piece of real content. On a 900 px viewport this meant the first experience card
did not appear until after roughly one full screen of scrolling.

**Symptom:** a visitor lands, sees a headline and a large empty band, and has to
scroll before learning what the product actually contains.

## 2. Empty sections and low information density

On `/explore` the experience grid received a **924 px** wide column while cards
inside it were rendered at ~300 px with large internal padding. The result was a
three-across grid that looked sparse rather than dense: wide gutters, tall cards,
very little text per card.

Sections were separated by 96–128 px of white space, exceeding the directive's
40–64 px guidance.

## 3. Weak contrast

Two concrete failures, both caught by reading computed colours:

- Body/faint text used `#8FA1B5` on `#FFFFFF` — a contrast ratio of about
  **2.6:1**, below the 4.5:1 WCAG AA threshold for body text.
- In dark mode the search input on `/explore` stayed `#FFFFFF` because the
  Tailwind `white` token had been overridden to `var(--bg)`. The input read as a
  white hole punched into a navy page.

## 4. Unbalanced cards

Cards in the same row had inconsistent heights because the title block and meta
rows wrapped differently. The CTA row therefore landed at different vertical
positions across a row, breaking the horizontal rhythm.

## 5. Poor filter accessibility

- Filter controls on `/explore` were deployed in a single dense strip; on a
  390 px viewport several controls were clipped with no scroll affordance.
- The search field had no programmatic `aria-label` and no visible label.
- Station and category `<select>` elements had no associated `<label>`.
- Focus states were removed on several inputs (`outline: none` with no
  replacement ring), making keyboard navigation invisible.

## 6. Inconsistent typography

**13 distinct font sizes** were in use between 9.5 px and 32 px, several of them
one-off values (10.5, 11.5, 12.5, 13.5). There was no scale — sizes were chosen
per component.

## 7. Unnecessary scrolling

The homepage required 5.0 screens of scroll to reach the footer, of which
approximately 1.4 screens was padding and dead space rather than content.

## 8. Generic components lacking tourism identity

The V1 visual language was a default SaaS pattern: white cards, grey borders,
blue accent, rounded pills. Nothing on the page communicated Johor, rail travel
or local operators. The product could have been any directory site.

Specifically absent:
- No use of the Johor palette (navy `#071D49`, red `#C8102E`, gold `#D4A64A`).
- No rail geometry anywhere in the interface, despite rail being the entire
  premise of the product.
- No station-based information architecture in the visual design.

## 9. No theme or language control

V1 shipped English-only, light-only, MYR-only, with no way for a user to change
any of it. For a competition entry aimed at cross-border visitors from
Singapore, Indonesia and Thailand, this was a direct scoring risk.

---

## What the redesign had to fix

1. Cut page height materially without cramping content.
2. Raise text contrast to at least WCAG AA.
3. Introduce a Johor identity that is structural (rail, corridor, palette), not
   decorative.
4. Make the Explore page a genuine three-column discovery grid with a sticky
   filter rail.
5. Add Light/Dark/System theming, BM/EN language and MYR-based currency display
   that all persist.
6. Fix the accessibility failures listed above.

## Honest limits of this audit

- Measurements were taken on the V1 build at the three widths named. Behaviour
  at other widths was not exhaustively profiled.
- Contrast ratios were computed from the two colours involved; they were not
  validated with an automated axe/Lighthouse run.
- No user testing was performed. Density and hierarchy judgements are design
  judgements supported by measurements, not by observed user behaviour.
