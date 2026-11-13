# Currency Conversion Specification

## Principle

**MYR is the source of truth. Every stored price is an integer or decimal in
ringgit and is never mutated.** Display currency is a presentation layer applied
at render time. Switching currency cannot change what is stored, what is matched
against a budget, or what an operator entered.

This matters for the matching engine: budget is a hard constraint. If budget
comparison ran on converted values, floating-point drift in exchange rates could
change which experiences a visitor is shown on a given day. It does not, because
comparison happens in MYR.

## Supported currencies

`MYR`, `SGD`, `USD`, `IDR`, `THB`, `EUR`, `GBP`, `CNY`.

Default is `MYR`. The selection persists in `localStorage` under
`johor360.v2.currency`.

## Rate sources

Two keyless public providers, tried in order:

1. **ExchangeRate-API open endpoint** — `https://open.er-api.com/v6/latest/USD`
   Free, no key, no subscription. Returns its own `time_last_update_utc`, which is
   surfaced to the user verbatim so the true age of the rate is always visible.
2. **Frankfurter** — `https://api.frankfurter.dev/v1/latest`
   Fallback. Republishes ECB reference rates, published once per working day
   around 16:00 CET.

Both publish a USD base, so all cross-rates are computed as
`(USD → X) / (USD → MYR)`, giving units of X per 1 MYR. This single pivot keeps
the maths consistent across providers and avoids triangulation drift between them.

## Honesty rules (enforced in code, not just stated)

These were treated as hard requirements because an invented exchange rate in a
competition entry is a credibility failure.

| Situation | Behaviour | Verified |
|---|---|---|
| Both providers reachable | Live snapshot, `cached: false`, real provider timestamp shown | ✅ tested |
| Primary down, fallback up | Fallback snapshot, source labelled "Frankfurter (ECB reference)" | ✅ tested |
| Both down, warm cache | Last snapshot returned with `cached: true`, UI shows "· cached" | ✅ tested |
| Both down, no cache | `null` returned. UI shows "Rate unavailable" and falls back to MYR. **No rate is invented.** | ✅ tested |
| Rate older than 6h | Cache treated as stale, refetch attempted | ✅ by TTL logic |

Evidence: `docs/evidence/fx-failure-test.txt`, produced by exercising
`src/services/rates.ts` with `fetch` stubbed to fail per scenario. Real output:

```
1. live fetch (both providers up)   → ExchangeRate-API, MYR→SGD 0.31536
2. cache hit (no force)             → cached: true
3. primary down, fallback works     → Frankfurter, SGD 0.31529
4. both down WITH warm cache        → snapshot, cached: true
5. both down, cache cleared         → null (honest)
```

## Caching

Snapshot stored in `localStorage` under `johor360.v2.rates` with a 6-hour TTL,
chosen because both providers update daily at most — a shorter TTL would be
network noise, a longer one could show a stale rate across a working day.

The UI always shows the provider's own timestamp and the source name. It never
claims the rate is "live" or "real-time".

## Presentation

- Prices render via a `<Price>` component or the `useMoneyText()` formatter, never
  by calling the raw `money()` helper, so a converted price cannot be introduced by
  accident on one screen while others stay in MYR.
- Converted amounts are shown **together with** the MYR original
  (`S$ 29.96 ≈ RM 95.00`), not replacing it. The visitor can always see the price
  the operator actually set.
- Rounding is currency-appropriate: 2 decimals for SGD/USD/EUR/GBP, 0 for IDR/THB
  where subunit precision is not meaningful.
- A dedicated converter on `/visitor/profile` lets a visitor check any amount
  between any two supported currencies, and displays the exact rate used plus its
  timestamp.

## What is stored vs displayed

| Value | Stored as | Displayed as |
|---|---|---|
| Experience price | MYR, unchanged | Selected currency + MYR original |
| Visitor budget | MYR | Selected currency + MYR, with slider in MYR |
| Itinerary total | MYR sum | Selected currency + MYR |
| Matching constraint | MYR comparison | — (never converted) |
| Operator-entered price | MYR | MYR (operator portal stays in base currency) |

## Known limitations

- **Daily reference rates, not live market quotes.** Both providers publish at most
  daily. The UI says so. This is acceptable for indicative tourism pricing and
  would need a paid feed for transactional use.
- **No historical rates.** Only the current snapshot is cached; there is no
  time-series.
- **No per-provider rate spread or fee modelling.** The converted figure is a pure
  reference conversion, not what a card issuer would charge.
- **The operator portal does not accept non-MYR input.** Deliberate: keeping the
  catalogue single-currency is what makes the matching constraint exact.
- **If the very first page load happens with both providers down and no cache**,
  every price renders in MYR. The visitor sees a notice explaining the rate is
  unavailable. This is a degraded but honest state, not a broken one.
