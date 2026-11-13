import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { Button, DemoTag, Section } from '../components/ui'
import Scene from '../components/art/Scene'
import { RAIL_SOURCE, CORRIDOR } from '../data/stations'

export function About() {
  return (
    <div>
      <div className="relative overflow-hidden bg-navy-900">
        <Scene seed="about-hero" category="heritage" className="absolute inset-0 h-full w-full opacity-25" variant="hero" motif="shophouse" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/40" />
        <div className="shell relative py-14 sm:py-20">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold">About JOHOR360</p>
          <h1 className="mt-3 max-w-2xl text-[30px] font-extrabold leading-[1.1] text-white sm:text-[44px]">
            The problem is not that Johor has nothing to offer. It is that nobody tells you where it is.
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/60">
            Visitors come for business, medical care, education and leisure. Their spending concentrates in a handful
            of well-known areas while small operators in towns along the ETS corridor stay unlisted, unreviewed and
            effectively invisible.
          </p>
        </div>
      </div>

      <Section eyebrow="The challenge" title="Category 4: Connecting visitors in Johor">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {[
              ['Visitor spending concentrates', 'Money lands in JB city centre, KSL, City Square, Legoland. Small operators in Kulai, Paloh, Bekok and Labis rarely see it.'],
              ['Small operators are unlisted', 'No Google listing, no reviews, no photos, no price. A visitor with three spare hours has no way to find them.'],
              ['Rail changed the geography, not the behaviour', 'ETS now reaches JB Sentral, with four through-services per direction per day. The RTS Link will add more. The infrastructure exists; the discovery layer does not.'],
              ['Visitors with time do not find them', 'Medical travellers with three days between appointments, business travellers with a four-hour window, education groups scouting field visits — all have time and no map.'],
            ].map(([t, d]) => (
              <div key={t} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-johor-50 text-johor">
                  <Icon name="alert-circle" size={14} />
                </span>
                <div>
                  <p className="text-[13.5px] font-extrabold text-navy">{t}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-mute">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-navy-200 bg-navy-900 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">The official question</p>
            <blockquote className="mt-3 text-[17px] font-bold leading-[1.45]">
              “How might we help visitors in Johor discover leisure and educational activities, focusing on small and
              medium operators, across the ETS line?”
            </blockquote>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Our answer</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                A rail-first discovery platform that matches visitors to verified small operators along the corridor,
                with the return train and the last mile calculated before they commit.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <section className="border-y border-line bg-white py-14">
        <div className="shell">
          <p className="eyebrow mb-2.5">Three commitments</p>
          <h2 className="max-w-xl text-[26px] font-extrabold leading-[1.14] sm:text-[34px]">
            How we chose to be different
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                i: 'train-front',
                t: 'Rail-first, not city-first',
                d: 'Discovery is organised by ETS station, not by a city name. The constraint is the train you have to catch — so that is the primary axis, not an afterthought filter.',
              },
              {
                i: 'store',
                t: 'SME-centric by design',
                d: 'Every listing must come from an operator with ten employees or fewer. Verification is manual. Enquiries replace bookings so operators keep control of the conversation.',
              },
              {
                i: 'shield-check',
                t: 'Purpose-based, not one-size',
                d: 'A medical traveller and a business traveller need different Johors. Purpose is the first input, and accessibility requirements are hard constraints — never soft preferences.',
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-line p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white">
                  <Icon name={c.i} size={18} />
                </span>
                <h3 className="mt-4 text-[15px] font-extrabold">{c.t}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-mute">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="The corridor" title="What we cover, and what we verified">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="mb-3 text-[12px] font-bold text-navy">Station sequence (north → south)</p>
            <div className="space-y-1">
              {CORRIDOR.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <span className="w-4 text-[9.5px] text-ink-faint num">{i + 1}</span>
                  <span className="h-2 w-2 shrink-0 rounded-full border border-navy-300 bg-white" />
                  <span className="w-[78px] shrink-0 text-[11.5px] font-bold text-navy">{s.name}</span>
                  <span className="flex-1 truncate text-[10.5px] text-ink-mute">{s.district}, {s.state}</span>
                  <span className="shrink-0 text-[10px] text-ink-faint num">~{s.minutesFromJB}m</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-line pt-2.5 text-[10.5px] leading-relaxed text-ink-faint">
              Station names and order verified against {RAIL_SOURCE.label} route information on{' '}
              {RAIL_SOURCE.lastVerified}. Journey times shown are illustrative estimates for this mockup, not live
              KTMB schedules.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-gold-200 bg-gold-50/60 p-4">
              <p className="text-[12px] font-extrabold text-navy">What is real in this mockup</p>
              <ul className="mt-2 space-y-1.5">
                {['Station names and rail order', 'District and town geography', 'Map tiles from OpenStreetMap', 'The matching logic and scoring'].map((x) => (
                  <li key={x} className="flex items-start gap-1.5 text-[11.5px] text-ink-soft">
                    <Icon name="check" size={11} strokeWidth={3} className="mt-0.5 shrink-0 text-emerald2-600" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-johor-200 bg-johor-50/60 p-4">
              <p className="text-[12px] font-extrabold text-navy">What is simulated</p>
              <ul className="mt-2 space-y-1.5">
                {['All 15 operators and 30+ listings', 'All prices, ratings and reviews', 'All enquiries and view counts', 'All schedules and journey times'].map((x) => (
                  <li key={x} className="flex items-start gap-1.5 text-[11.5px] text-ink-soft">
                    <Icon name="x" size={11} strokeWidth={3} className="mt-0.5 shrink-0 text-johor-600" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <DemoTag label="Competition mockup" />
          </div>
        </div>
      </Section>

      <section className="py-14">
        <div className="shell">
          <div className="rounded-3xl bg-navy-900 px-6 py-10 sm:px-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Built for</p>
            <h2 className="mt-2 max-w-lg text-[24px] font-extrabold leading-[1.16] text-white sm:text-[30px]">
              Johor Innovation Challenge 2026
            </h2>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-white/60">
              Presented by Iskandar Regional Development Authority (IRDA) and Microsoft, implemented by Biji-biji
              Initiative and Mereka. This is an interactive UI/UX mockup and proof of concept — not a live commercial
              service.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/explore" className="btn btn-primary btn-md">
                Try the product <Icon name="arrow-right" size={15} />
              </Link>
              <Link to="/admin/impact" className="btn btn-md !bg-white/10 !border !border-white/20 !text-white hover:!bg-white/15">
                See the impact model
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function HowItWorks() {
  const steps = [
    { n: '01', t: 'Set your purpose', d: 'Business, medical, education or leisure. This single choice changes what you see, because a two-hour window near a station is a different trip from a relaxed accessible afternoon.', icon: 'compass' },
    { n: '02', t: 'Tell us your constraints', d: 'Available time, budget in ringgit, preferred station, and any accessibility requirements. Accessibility is treated as a hard constraint — not a preference to be traded off.', icon: 'sliders-horizontal' },
    { n: '03', t: 'Get scored matches', d: 'Five weighted factors produce a score. Every result shows its breakdown and a plain-language reason. You can see exactly why something ranked first.', icon: 'sparkles' },
    { n: '04', t: 'Pick a window', d: 'Three generated itineraries sized to 2 hours, 4 hours or a half day, with the return leg and buffer already calculated.', icon: 'route' },
    { n: '05', t: 'Adjust the scenario', d: 'Change your time from four hours to two, or turn on the rain simulation. The plan regenerates and tells you what was removed and why.', icon: 'refresh-cw' },
    { n: '06', t: 'Enquire, do not book', d: 'Send an enquiry to the operator. No payment, no slot held. The operator replies from the SME portal and you keep control of the conversation.', icon: 'message-square' },
  ]

  return (
    <div>
      <div className="border-b border-line bg-white">
        <div className="shell py-12 sm:py-16">
          <p className="eyebrow mb-2.5">How JOHOR360 works</p>
          <h1 className="max-w-2xl text-[30px] font-extrabold leading-[1.1] sm:text-[42px]">
            Built around one constraint every other travel app ignores
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-mute">
            Your day is bounded by a train you have to catch. With four ETS services per direction per day, missing
            one is not a minor inconvenience — it is the end of your afternoon. Everything in JOHOR360 is organised
            around that.
          </p>
        </div>
      </div>

      <Section eyebrow="The visitor flow" title="Six steps, in order">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative overflow-hidden rounded-2xl border border-line bg-white p-5">
              <span className="absolute right-3 top-2 text-[38px] font-extrabold leading-none text-navy-50 num">{s.n}</span>
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-navy text-white">
                <Icon name={s.icon} size={16} />
              </span>
              <h3 className="relative mt-3.5 text-[14px] font-extrabold">{s.t}</h3>
              <p className="relative mt-1.5 text-[12.5px] leading-relaxed text-ink-mute">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-white py-14">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="eyebrow mb-2.5">The scoring model</p>
              <h2 className="text-[26px] font-extrabold leading-[1.14] sm:text-[34px]">
                Transparent by default
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mute">
                Most recommendation engines are a black box. We publish the weights, show the breakdown per result,
                and explain the outcome in one sentence a visitor can read on a platform.
              </p>
              <div className="mt-5 rounded-xl border border-gold-200 bg-gold-50/60 px-3.5 py-3">
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-gold-900">
                  <Icon name="info" size={12} className="mt-0.5 shrink-0" />
                  These are proposed product weights for the mockup, not research-validated coefficients. We state
                  this openly rather than implying scientific precision we do not have.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                ['Interest relevance', 25, 'Maps your selected interests to listing tags and categories.'],
                ['Time compatibility', 25, 'Duration + rail travel both ways + arrival buffer + return buffer against your window.'],
                ['Rail & last-mile access', 25, 'Distance from your station, plus whether a usable last-mile mode is confirmed.'],
                ['Budget compatibility', 15, 'Price against your stated budget, favouring the sweet spot over the cheapest option.'],
                ['Purpose relevance', 10, 'Category affinity tuned per traveller type.'],
              ].map(([l, w, d]) => (
                <div key={l as string} className="rounded-xl border border-line bg-white p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-bold text-navy">{l}</span>
                    <span className="rounded-md bg-navy px-1.5 py-0.5 text-[11px] font-extrabold text-white num">{w}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-100">
                    <div className="h-full rounded-full bg-royal" style={{ width: `${Number(w) * 4}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-ink-mute">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Hard constraints" title="What gets excluded before scoring begins">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Wheelchair requirement', 'Any listing not declaring wheelchair access is removed entirely.', 'accessibility'],
            ['Step-free requirement', 'Listings with steps or uneven ground are removed, not ranked down.', 'footprints'],
            ['Low intensity only', 'High-intensity activities are excluded, including hikes and long walks.', 'heart-pulse'],
            ['Gross time mismatch', 'Anything needing 60% more than your window is dropped before scoring.', 'clock'],
          ].map(([t, d, i]) => (
            <div key={t} className="rounded-2xl border border-johor-200 bg-johor-50/40 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-johor"><Icon name={i} size={15} /></span>
              <p className="mt-2.5 text-[12.5px] font-extrabold text-navy">{t}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-mute">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-ink-mute">
          This is a deliberate design choice. A wheelchair user who is shown an inaccessible listing and told it is
          “92% match” has been failed by the product, not helped by a high score.
        </p>
      </Section>

      <section className="py-14">
        <div className="shell">
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="eyebrow mb-2.5">For operators</p>
                <h2 className="text-[22px] font-extrabold leading-[1.18] sm:text-[28px]">
                  Five steps from unlisted to discoverable
                </h2>
                <div className="mt-5 space-y-2.5">
                  {[
                    ['Register', 'Business details, category, nearest ETS station.'],
                    ['List an experience', 'Description, price, duration, capacity, accessibility statement.'],
                    ['Get verified', 'Admin checks registration and safety documents manually.'],
                    ['Get discovered', 'Appear in station pages, search, matching and the map.'],
                    ['Grow', 'Receive enquiries, collect feedback, publish packages.'],
                  ].map(([t, d], i) => (
                    <div key={t} className="flex items-start gap-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald2-50 text-[10px] font-bold text-emerald2-700 num">{i + 1}</span>
                      <div>
                        <p className="text-[12.5px] font-bold text-navy">{t}</p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-mute">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/sme/dashboard" className="btn btn-navy btn-md mt-6">
                  Open operator portal <Icon name="arrow-right" size={15} />
                </Link>
              </div>

              <div className="rounded-2xl bg-canvas p-5">
                <p className="text-[12px] font-extrabold text-navy">What we do not do</p>
                <div className="mt-3 space-y-2">
                  {[
                    ['Take bookings or payments', 'Enquiries only. Operators keep control and negotiate directly.'],
                    ['Invent transport options', 'If we have not confirmed a shuttle service, we show “unknown”.'],
                    ['Publish unverified listings', 'Nothing appears in discovery until a human approves it.'],
                    ['Guess train times', 'Schedules are labelled illustrative and link to KTMB.'],
                  ].map(([t, d]) => (
                    <div key={t} className="flex items-start gap-2 rounded-lg bg-white px-2.5 py-2">
                      <Icon name="x-circle" size={12} className="mt-0.5 shrink-0 text-johor" />
                      <div>
                        <p className="text-[11.5px] font-bold text-navy">{t}</p>
                        <p className="mt-0.5 text-[10.5px] leading-snug text-ink-mute">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
