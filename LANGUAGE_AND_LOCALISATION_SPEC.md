# Language and Localisation Specification

## Decision

**Bahasa Melayu Malaysia is the primary interface language. English is available
as a secondary language for international visitors.** MYR remains the base
currency for all stored prices regardless of display language.

The two are independent controls: a Singaporean visitor can read English while
paying in SGD, and a Johor resident can read BM in MYR. Changing one never
changes the other.

## Language set

| Code | Label in UI | `document.documentElement.lang` | Role |
|---|---|---|---|
| `ms` | BM | `ms-MY` | Default. Primary market and judging audience. |
| `en` | EN | `en` | International accessibility. |

Default on first visit is `ms`. The choice is stored in `localStorage` under
`johor360.v2.lang` and restored before first paint, so there is no flash of the
wrong language on reload.

## Why BM is written Malaysian, not textbook

Product copy uses Malaysian Malay as spoken and written in Johor, not the formal
register of a government circular. Examples taken from the shipped strings:

- "Terokai" not "Jelajahi"
- "Penyenaraian" for a listing, "Pengusaha" for an operator
- "Bajet", "Tempoh", "Disahkan" as used locally
- "Padanan terbaik" for best match

Proper nouns are never translated: JOHOR360, ETS, KTMB, JB Sentral, Gemas,
Segamat, Labis, Bekok, Paloh, Kluang, Rengam, Kulai, and all operator names stay
as-is in both languages. This is deliberate: a visitor searching for "Kluang"
must find "Kluang".

## Architecture

Two mechanisms coexist, chosen for different jobs.

### 1. Synthetic keys via i18next — for data-driven and structured copy

`src/i18n.ts` initialises i18next with `src/locales/ms/translation.json` and
`src/locales/en/translation.json` (534 keys each). Used for:
- navigation labels, category names, purpose names
- formatted strings with interpolation (`{{count}} pengalaman`)
- anything referenced by id rather than written inline

Call site: `const { t } = usePrefs()` then `t('explore.title')`.

### 2. The `<T>` component and `tx()` — for inline UI copy

The interface was written English-first, with copy sitting directly in JSX. Rather
than refactor ~350 call sites into synthetic keys (which risks blanking the UI when
a key is mistyped), inline copy is looked up by **its own English sentence**:

```tsx
<T>Top matches for you</T>
```

`tx()` resolves against a merged table in `src/locales/ui-ms.ts` (224 rows) and
`src/locales/ui-ms-extra.ts` (141 rows). Lookup keys are whitespace-normalised,
because React collapses multi-line JSX paragraphs to single spaces before render.

**The safety property:** a missing row falls back to the English original. A
missing translation can degrade to English; it can never produce a blank or a raw
key on screen. This was the deciding factor — a competition demo cannot afford a
half-translated-looking UI if one string is missed.

## Coverage actually achieved

Verified by rendering all 25 primary routes with `lang=ms` and reading every
button, heading, label, table header, `<option>` and input placeholder from the
DOM. Result: **0 interface strings remain in English**, across Public, Visitor,
SME and Admin.

What is intentionally *not* translated:
- **Experience titles and summaries** ("Loom Session with the Tenun Collective",
  "Farm-to-Table Cook Session"). These are user-content examples, not chrome, and
  a real platform would receive them from operators in whatever language the
  operator wrote them.
- **Operator and business names.**
- **Station and place names.**
- **Verification badges' acronyms** where they are proper nouns.

## Number, date and unit formatting

- Numbers use `en-MY` grouping (comma thousands, dot decimal) in both languages,
  because Malaysian readers expect that convention and switching to comma-decimal
  would confuse, not help.
- Durations are written `3h`, `2h 30m`, `90 min` — compact and unambiguous in both
  languages, so they are not translated.
- Dates use `toLocaleDateString` with the visitor's own locale hint.

## Accessibility of the language control

- The toggle is a real `<button>` pair with `aria-pressed` reflecting state.
- Changing language updates `document.documentElement.lang`, so screen readers
  switch pronunciation.
- The choice persists and is applied before first paint (inline script in
  `index.html` reads the stored value and sets `lang` immediately).

## Known limitations

- **No RTL language support.** Not needed for BM/EN, but the layout assumes LTR.
- **No per-page language override.** Language is global for the session.
- **The `tx()` tables are hand-maintained.** Adding new UI copy requires a new row;
  there is no build-time check that every literal has a translation. The
  fallback-to-English behaviour is the mitigation, not a guarantee of coverage.
- **Arabic script (Jawi) is not offered.** This would be culturally appropriate for
  Johor and is a candidate for future work, not a claim of this build.
