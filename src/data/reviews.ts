import type { Review, Enquiry, Itinerary, VisitorProfile } from '../types'

/**
 * DEMONSTRATION DATA — all reviews, enquiries and itineraries here are invented
 * sample records for the mockup. Author names are fictional. Ratings are not
 * verified and do not represent real visitor feedback.
 */

export const REVIEWS: Review[] = [
  { id: 'rv-01', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', authorName: 'Hana S.', authorOrigin: 'Singapore', rating: 5, date: '2026-09-14', body: 'Six people maximum genuinely means six. Norhayati corrected my wax line three times without making me feel stupid. Walked out with a piece I actually like.', purpose: 'leisure', status: 'published' },
  { id: 'rv-02', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', authorName: 'Daniel R.', authorOrigin: 'Australia', rating: 5, date: '2026-08-02', body: 'Did this on a four-hour gap between meetings. Ten minutes from the station, done in two hours, back in time. Exactly what I needed.', purpose: 'business', status: 'published' },
  { id: 'rv-03', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', authorName: 'Mei Ling T.', authorOrigin: 'Singapore', rating: 5, date: '2026-07-19', body: 'Brought my mother who uses a wheelchair. Step-free entry and she worked at the table comfortably for the full two hours.', purpose: 'leisure', status: 'published' },
  { id: 'rv-04', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', authorName: 'Arun P.', authorOrigin: 'India', rating: 4, date: '2026-06-28', body: 'Great session. Dye smell is strong for the first twenty minutes — worth knowing if you are sensitive.', purpose: 'education', status: 'published' },
  { id: 'rv-05', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', authorName: 'Sofia K.', authorOrigin: 'Germany', rating: 5, date: '2026-05-11', body: 'The part I did not expect was the explanation of what a six-person studio earns per month. Honest and specific.', purpose: 'leisure', status: 'published' },

  { id: 'rv-06', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'James W.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-09-20', body: 'Four roasts from one green bean. I have done cuppings in London that explained less in two hours.', purpose: 'leisure', status: 'published' },
  { id: 'rv-07', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'Priya N.', authorOrigin: 'Singapore', rating: 5, date: '2026-08-15', body: 'Ninety minutes, walkable from the station, and I still made my 1pm call. Recommended for business travellers.', purpose: 'business', status: 'published' },
  { id: 'rv-08', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'Tomás A.', authorOrigin: 'Germany', rating: 4, date: '2026-07-04', body: 'Excellent content. Seating is stools at a counter — fine for ninety minutes, less so if you have back issues.', purpose: 'leisure', status: 'published' },
  { id: 'rv-09', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'Nurul A.', authorOrigin: 'Singapore', rating: 5, date: '2026-06-12', body: 'Brought a group of students. The roast curve explanation landed well with the sixteen-year-olds.', purpose: 'education', status: 'published' },
  { id: 'rv-10', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'Kenji M.', authorOrigin: 'Japan', rating: 5, date: '2026-04-30', body: 'Very careful about hygiene and the slurping technique was demonstrated properly. Good for first-timers.', purpose: 'leisure', status: 'published' },
  { id: 'rv-11', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', authorName: 'Alia R.', authorOrigin: 'Indonesia', rating: 5, date: '2026-03-18', body: 'Bought beans after. The price explanation made me understand why it costs what it costs.', purpose: 'leisure', status: 'published' },

  { id: 'rv-12', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Claire D.', authorOrigin: 'France', rating: 5, date: '2026-10-05', body: 'Eleven women running their own collective, and they explained the export order and what each member was paid. Genuinely the best two hours of my trip.', purpose: 'leisure', status: 'published' },
  { id: 'rv-13', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Sarah L.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-09-01', body: 'Wheelchair accessible looms — actual modified looms, not just a ramp at the door. Rare and appreciated.', purpose: 'medical', status: 'published' },
  { id: 'rv-14', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Wei J.', authorOrigin: 'Singapore', rating: 5, date: '2026-08-22', body: 'Went with my daughter for a school project. They let her record part of the interview for her assignment.', purpose: 'education', status: 'published' },
  { id: 'rv-15', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Marcus B.', authorOrigin: 'Australia', rating: 5, date: '2026-07-11', body: 'The station pickup was offered without me asking. Nine-minute walk is accurate.', purpose: 'leisure', status: 'published' },
  { id: 'rv-16', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Ines V.', authorOrigin: 'Germany', rating: 4, date: '2026-06-03', body: 'Wish it were longer. Two hours goes fast once you are actually weaving.', purpose: 'leisure', status: 'published' },
  { id: 'rv-17', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', authorName: 'Hafiz I.', authorOrigin: 'Malaysia', rating: 5, date: '2026-05-20', body: 'Brought my parents who are from Labis originally. They learned things about their own town.', purpose: 'leisure', status: 'published' },

  { id: 'rv-18', experienceId: 'exp-labis-orchard', operatorId: 'op-tenang-orchard', authorName: 'Rachel P.', authorOrigin: 'Australia', rating: 5, date: '2026-08-30', body: 'He told us exactly what a bad season costs. That honesty is why I would come back.', purpose: 'leisure', status: 'published' },
  { id: 'rv-19', experienceId: 'exp-labis-orchard', operatorId: 'op-tenang-orchard', authorName: 'Dinesh K.', authorOrigin: 'Singapore', rating: 4, date: '2026-07-06', body: 'Muddy after rain — they lent us boots which saved the day. Orchard tracks are not wheelchair friendly, as stated.', purpose: 'leisure', status: 'published' },
  { id: 'rv-20', experienceId: 'exp-labis-orchard', operatorId: 'op-tenang-orchard', authorName: 'Yuki T.', authorOrigin: 'Japan', rating: 5, date: '2026-06-17', body: 'The intercropping explanation was the most interesting thing I learned in Johor.', purpose: 'education', status: 'published' },

  { id: 'rv-21', experienceId: 'exp-bekok-river-walk', operatorId: 'op-bekok-river', authorName: 'Oliver H.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-09-12', body: 'Ravi knows every bird by call. Three hours went quickly. Leeches are real, wear long socks.', purpose: 'leisure', status: 'published' },
  { id: 'rv-22', experienceId: 'exp-bekok-river-walk', operatorId: 'op-bekok-river', authorName: 'Anita S.', authorOrigin: 'Netherlands', rating: 4, date: '2026-08-08', body: 'Beautiful but genuinely rough terrain. The listing is accurate about that — do not underestimate it.', purpose: 'leisure', status: 'published' },

  { id: 'rv-23', experienceId: 'exp-segamat-market', operatorId: 'op-segamat-market', authorName: 'Grace C.', authorOrigin: 'Singapore', rating: 5, date: '2026-10-01', body: 'Six tastings and I was full before half of them. Siew Lan knows every stallholder by name.', purpose: 'leisure', status: 'published' },
  { id: 'rv-24', experienceId: 'exp-segamat-market', operatorId: 'op-segamat-market', authorName: 'Robert N.', authorOrigin: 'Australia', rating: 5, date: '2026-09-05', body: 'Did this at 7am before a hospital appointment at 10. Perfect timing and they dropped me back.', purpose: 'medical', status: 'published' },
  { id: 'rv-25', experienceId: 'exp-segamat-market', operatorId: 'op-segamat-market', authorName: 'Lina M.', authorOrigin: 'Indonesia', rating: 5, date: '2026-08-19', body: 'The market is not a tourist market. That is exactly the point.', purpose: 'leisure', status: 'published' },
  { id: 'rv-26', experienceId: 'exp-segamat-market', operatorId: 'op-segamat-market', authorName: 'Peter L.', authorOrigin: 'United Kingdom', rating: 4, date: '2026-07-25', body: 'Wish it started at 6:30. By 10am the market is packing up.', purpose: 'leisure', status: 'published' },

  { id: 'rv-27', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', authorName: 'Michelle T.', authorOrigin: 'Singapore', rating: 5, date: '2026-09-28', body: 'I have crossed the causeway fifty times and never walked those lanes. Worth the ninety minutes.', purpose: 'business', status: 'published' },
  { id: 'rv-28', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', authorName: 'Andreas F.', authorOrigin: 'Germany', rating: 5, date: '2026-08-14', body: 'Fatimah grew up there and it shows. The parts the plaques leave out are the interesting parts.', purpose: 'leisure', status: 'published' },
  { id: 'rv-29', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', authorName: 'Nadia H.', authorOrigin: 'Singapore', rating: 4, date: '2026-07-02', body: 'Two road-shoulder stretches with traffic. Not awful, but worth knowing if you have small children.', purpose: 'leisure', status: 'published' },
  { id: 'rv-30', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', authorName: 'Samuel O.', authorOrigin: 'United States', rating: 5, date: '2026-06-09', body: 'Best ninety minutes I have spent in Johor. Booked the kopitiam crawl the next day.', purpose: 'leisure', status: 'published' },
  { id: 'rv-31', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', authorName: 'Chloe B.', authorOrigin: 'Australia', rating: 4, date: '2026-05-16', body: 'Hot at midday. They moved one stop into shade which helped.', purpose: 'leisure', status: 'published' },

  { id: 'rv-32', experienceId: 'exp-gemas-rail-heritage', operatorId: 'op-gemas-rail', authorName: 'Ian K.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-09-08', body: 'The signal cabin is the highlight. Volunteers clearly care about the archive.', purpose: 'leisure', status: 'published' },
  { id: 'rv-33', experienceId: 'exp-gemas-rail-heritage', operatorId: 'op-gemas-rail', authorName: 'Farah Z.', authorOrigin: 'Malaysia', rating: 4, date: '2026-07-30', body: 'Good walk. Note Gemas is technically Negeri Sembilan, which confused my itinerary planning.', purpose: 'education', status: 'published' },
  { id: 'rv-34', experienceId: 'exp-gemas-rail-heritage', operatorId: 'op-gemas-rail', authorName: 'Peter S.', authorOrigin: 'Australia', rating: 5, date: '2026-06-22', body: 'Railway nerds will love this. Everyone else will still enjoy the clock story.', purpose: 'leisure', status: 'published' },

  { id: 'rv-35', experienceId: 'exp-rengam-rubber', operatorId: 'op-rengam-rubber', authorName: 'Hannah J.', authorOrigin: 'Germany', rating: 5, date: '2026-08-26', body: '6:30am start is worth it. Watching latex run at dawn is something I will remember.', purpose: 'leisure', status: 'published' },
  { id: 'rv-36', experienceId: 'exp-rengam-rubber', operatorId: 'op-rengam-rubber', authorName: 'Vikram R.', authorOrigin: 'India', rating: 4, date: '2026-07-14', body: 'The economics explanation was blunt and useful. Wear shoes you do not mind ruining.', purpose: 'education', status: 'published' },

  { id: 'rv-37', experienceId: 'exp-paloh-herb-garden', operatorId: 'op-paloh-herb', authorName: 'Elena M.', authorOrigin: 'Spain', rating: 5, date: '2026-09-17', body: 'Took home a bottle of oil I pressed myself. Small garden but forty different herbs.', purpose: 'leisure', status: 'published' },
  { id: 'rv-38', experienceId: 'exp-paloh-herb-garden', operatorId: 'op-paloh-herb', authorName: 'Jonas W.', authorOrigin: 'Germany', rating: 4, date: '2026-08-05', body: 'Firm level paths, easy walking. Good for my father who cannot manage long distances.', purpose: 'medical', status: 'published' },

  { id: 'rv-39', experienceId: 'exp-kulai-noodle-pull', operatorId: 'op-kulai-noodle', authorName: 'Ben C.', authorOrigin: 'Australia', rating: 5, date: '2026-09-25', body: 'My noodles were terrible and I ate them anyway. Great fun, genuinely hands-on.', purpose: 'leisure', status: 'published' },
  { id: 'rv-40', experienceId: 'exp-kulai-noodle-pull', operatorId: 'op-kulai-noodle', authorName: 'Siti N.', authorOrigin: 'Singapore', rating: 4, date: '2026-08-11', body: 'Standing at the bench for 75 minutes. Fine for me, worth flagging for anyone with knee issues.', purpose: 'leisure', status: 'published' },
  { id: 'rv-41', experienceId: 'exp-kulai-noodle-pull', operatorId: 'op-kulai-noodle', authorName: 'Henry T.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-07-08', body: 'Wong has been doing this since he was nine. The muscle memory is humbling.', purpose: 'leisure', status: 'published' },

  { id: 'rv-42', experienceId: 'exp-segamat-durian', operatorId: 'op-segamat-durian', authorName: 'Alicia G.', authorOrigin: 'Singapore', rating: 5, date: '2026-08-20', body: 'Nine families pooling a harvest is a better story than any single estate. Tasting was generous.', purpose: 'leisure', status: 'published' },
  { id: 'rv-43', experienceId: 'exp-segamat-durian', operatorId: 'op-segamat-durian', authorName: 'Martin D.', authorOrigin: 'Germany', rating: 5, date: '2026-07-27', body: 'They were upfront that it was early season and the varieties were limited. Appreciated the honesty.', purpose: 'leisure', status: 'published' },

  { id: 'rv-44', experienceId: 'exp-jb-kopitiam', operatorId: 'op-jb-heritage', authorName: 'Yasmin R.', authorOrigin: 'Singapore', rating: 5, date: '2026-09-30', body: 'Three shops in ninety minutes and I still caught my 6pm train. Perfect for a work trip.', purpose: 'business', status: 'published' },
  { id: 'rv-45', experienceId: 'exp-jb-kopitiam', operatorId: 'op-jb-heritage', authorName: 'Lucas M.', authorOrigin: 'Brazil', rating: 4, date: '2026-08-18', body: 'One doorway was narrow but the guide helped. Good value for the price.', purpose: 'leisure', status: 'published' },

  { id: 'rv-46', experienceId: 'exp-bekok-night', operatorId: 'op-bekok-river', authorName: 'Aiko S.', authorOrigin: 'Japan', rating: 5, date: '2026-09-22', body: 'Sitting still for fifteen minutes listening was the best part. Red torches are a thoughtful touch.', purpose: 'leisure', status: 'published' },

  { id: 'rv-47', experienceId: 'exp-labis-storytelling', operatorId: 'op-labis-weave', authorName: 'Diana L.', authorOrigin: 'United Kingdom', rating: 5, date: '2026-09-19', body: 'Three generations on one veranda. No performance, just people talking. I cried a bit.', purpose: 'leisure', status: 'published' },
  { id: 'rv-48', experienceId: 'exp-labis-storytelling', operatorId: 'op-labis-weave', authorName: 'Ravi S.', authorOrigin: 'Singapore', rating: 4, date: '2026-08-07', body: 'All seated, ramped entry — brought my mother post-surgery and it worked well.', purpose: 'medical', status: 'published' },
  { id: 'rv-49', experienceId: 'exp-labis-storytelling', operatorId: 'op-labis-weave', authorName: 'Emma W.', authorOrigin: 'Australia', rating: 5, date: '2026-07-16', body: 'The flood of 2006 told by someone who lived it is different from reading about it.', purpose: 'education', status: 'published' },

  { id: 'rv-50', experienceId: 'exp-kluang-heritage-loop', operatorId: 'op-jb-heritage', authorName: 'Kumar V.', authorOrigin: 'Singapore', rating: 5, date: '2026-10-03', body: 'The 1950s photograph comparison at each stop is a clever device. Two hours well spent.', purpose: 'leisure', status: 'published' },
]

export const ENQUIRIES: Enquiry[] = [
  { id: 'en-01', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', visitorName: 'Hana Sulaiman', visitorEmail: 'hana.s@example.com', partySize: 2, date: '2026-11-21', message: 'Hi, we are two adults arriving on the 09:12 from JB. Is the 11:00 session doable with luggage?', status: 'new', createdAt: '2026-11-12T08:14:00+08:00' },
  { id: 'en-02', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', visitorName: 'Daniel Reyes', visitorEmail: 'd.reyes@example.com', partySize: 1, date: '2026-11-18', message: 'Can I do this in under two hours door to door? I have a 14:30 train.', status: 'responded', createdAt: '2026-11-10T15:02:00+08:00' },
  { id: 'en-03', experienceId: 'exp-batik-canting', operatorId: 'op-sri-kluang-batik', visitorName: 'Mei Ling Tan', visitorEmail: 'ml.tan@example.com', partySize: 3, date: '2026-11-25', message: 'My mother uses a wheelchair — is the dyeing area reachable without steps?', status: 'in_review', createdAt: '2026-11-11T11:40:00+08:00' },
  { id: 'en-04', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', visitorName: 'James Whitfield', visitorEmail: 'j.whitfield@example.com', partySize: 2, date: '2026-11-20', message: 'Do you have decaf options? One of us cannot take caffeine.', status: 'new', createdAt: '2026-11-12T09:31:00+08:00' },
  { id: 'en-05', experienceId: 'exp-kluang-coffee-cupping', operatorId: 'op-lambak-roast', visitorName: 'Priya Nair', visitorEmail: 'p.nair@example.com', partySize: 4, date: '2026-11-22', message: 'Group of four from Singapore. Can we start at 08:30 instead of 09:00?', status: 'responded', createdAt: '2026-11-09T18:22:00+08:00' },
  { id: 'en-06', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', visitorName: 'Claire Dubois', visitorEmail: 'c.dubois@example.com', partySize: 2, date: '2026-12-02', message: 'Is the collective able to host a group of six on a Saturday morning?', status: 'new', createdAt: '2026-11-12T10:05:00+08:00' },
  { id: 'en-07', experienceId: 'exp-labis-weave', operatorId: 'op-labis-weave', visitorName: 'Sarah Lim', visitorEmail: 's.lim@example.com', partySize: 1, date: '2026-11-19', message: 'You mentioned modified looms. Could you confirm the seat height?', status: 'responded', createdAt: '2026-11-08T14:47:00+08:00' },
  { id: 'en-08', experienceId: 'exp-labis-orchard', operatorId: 'op-tenang-orchard', visitorName: 'Rachel Phua', visitorEmail: 'r.phua@example.com', partySize: 3, date: '2026-11-28', message: 'What is in season at the end of November?', status: 'in_review', createdAt: '2026-11-11T07:55:00+08:00' },
  { id: 'en-09', experienceId: 'exp-bekok-river-walk', operatorId: 'op-bekok-river', visitorName: 'Oliver Hart', visitorEmail: 'o.hart@example.com', partySize: 2, date: '2026-11-23', message: 'Do you provide leech socks? And how deep is the river crossing?', status: 'new', createdAt: '2026-11-12T06:20:00+08:00' },
  { id: 'en-10', experienceId: 'exp-segamat-market', operatorId: 'op-segamat-market', visitorName: 'Robert Ng', visitorEmail: 'r.ng@example.com', partySize: 2, date: '2026-11-17', message: 'We have a hospital appointment at 10:00. Can you guarantee return by 09:30?', status: 'responded', createdAt: '2026-11-07T16:12:00+08:00' },
  { id: 'en-11', experienceId: 'exp-jb-heritage-walk', operatorId: 'op-jb-heritage', visitorName: 'Michelle Teo', visitorEmail: 'm.teo@example.com', partySize: 2, date: '2026-11-15', message: 'Is the 4pm slot still available? We are coming from Singapore for the day.', status: 'closed', createdAt: '2026-11-05T13:30:00+08:00' },
  { id: 'en-12', experienceId: 'exp-gemas-rail-heritage', operatorId: 'op-gemas-rail', visitorName: 'Ian Kwan', visitorEmail: 'i.kwan@example.com', partySize: 5, date: '2026-12-06', message: 'We are a railway enthusiasts group. Can we see the archive room?', status: 'new', createdAt: '2026-11-12T11:18:00+08:00' },
  { id: 'en-13', experienceId: 'exp-rengam-rubber', operatorId: 'op-rengam-rubber', visitorName: 'Hannah Jung', visitorEmail: 'h.jung@example.com', partySize: 2, date: '2026-11-26', message: 'What time does the 6:30am session actually finish? We need to catch the 10:00 train.', status: 'in_review', createdAt: '2026-11-10T19:41:00+08:00' },
  { id: 'en-14', experienceId: 'exp-kulai-noodle-pull', operatorId: 'op-kulai-noodle', visitorName: 'Ben Carter', visitorEmail: 'b.carter@example.com', partySize: 2, date: '2026-11-24', message: 'Is there a vegetarian broth option for the meal afterwards?', status: 'new', createdAt: '2026-11-12T12:03:00+08:00' },
  { id: 'en-15', experienceId: 'exp-paloh-herb-garden', operatorId: 'op-paloh-herb', visitorName: 'Elena Martin', visitorEmail: 'e.martin@example.com', partySize: 4, date: '2026-11-29', message: 'Four of us, one is 78 years old. Is the walk entirely on firm ground?', status: 'responded', createdAt: '2026-11-09T10:26:00+08:00' },
]

export const SEED_ITINERARIES: Itinerary[] = [
  { id: 'it-seed-01', name: 'Four hours in Labis', purpose: 'business', stationId: 'labis', date: '2026-11-21', budget: 150, source: 'seed', updatedAt: '2026-11-10T09:00:00+08:00', items: [
    { id: 'ii-01', experienceId: 'exp-labis-weave', startTime: '10:30', durationMins: 120, price: 70, transportMins: 10 },
    { id: 'ii-02', experienceId: 'exp-labis-storytelling', startTime: '13:00', durationMins: 60, price: 35, transportMins: 8 },
  ]},
  { id: 'it-seed-02', name: 'Kluang coffee morning', purpose: 'leisure', stationId: 'kluang', date: '2026-11-19', budget: 200, source: 'seed', updatedAt: '2026-11-08T14:20:00+08:00', items: [
    { id: 'ii-03', experienceId: 'exp-kluang-coffee-cupping', startTime: '09:00', durationMins: 90, price: 55, transportMins: 10 },
    { id: 'ii-04', experienceId: 'exp-batik-canting', startTime: '11:15', durationMins: 120, price: 85, transportMins: 6 },
  ]},
  { id: 'it-seed-03', name: 'Medical stay — Segamat, gentle', purpose: 'medical', stationId: 'segamat', date: '2026-11-23', budget: 120, source: 'seed', updatedAt: '2026-11-09T11:45:00+08:00', items: [
    { id: 'ii-05', experienceId: 'exp-segamat-hospital-short', startTime: '14:00', durationMins: 120, price: 35, transportMins: 0 },
  ]},
  { id: 'it-seed-04', name: 'Education group — Labis & Kluang', purpose: 'education', stationId: 'labis', date: '2026-11-27', budget: 400, source: 'seed', updatedAt: '2026-11-06T16:10:00+08:00', items: [
    { id: 'ii-06', experienceId: 'exp-labis-heritage-school', startTime: '09:30', durationMins: 90, price: 30, transportMins: 10 },
    { id: 'ii-07', experienceId: 'exp-labis-orchard', startTime: '11:30', durationMins: 150, price: 60, transportMins: 6 },
  ]},
  { id: 'it-seed-05', name: 'Bekok nature half-day', purpose: 'leisure', stationId: 'bekok', date: '2026-11-22', budget: 250, source: 'seed', updatedAt: '2026-11-07T08:00:00+08:00', items: [
    { id: 'ii-08', experienceId: 'exp-bekok-river-walk', startTime: '09:00', durationMins: 180, price: 75, transportMins: 8 },
  ]},
  { id: 'it-seed-06', name: 'JB layover three hours', purpose: 'business', stationId: 'jb-sentral', date: '2026-11-18', budget: 100, source: 'seed', updatedAt: '2026-11-05T12:30:00+08:00', items: [
    { id: 'ii-09', experienceId: 'exp-jb-kopitiam', startTime: '15:00', durationMins: 90, price: 65, transportMins: 5 },
  ]},
  { id: 'it-seed-07', name: 'Paloh herbs & cooking', purpose: 'leisure', stationId: 'paloh', date: '2026-11-29', budget: 180, source: 'seed', updatedAt: '2026-11-08T09:15:00+08:00', items: [
    { id: 'ii-10', experienceId: 'exp-paloh-herb-garden', startTime: '10:00', durationMins: 100, price: 50, transportMins: 10 },
    { id: 'ii-11', experienceId: 'exp-paloh-cooking', startTime: '13:30', durationMins: 150, price: 78, transportMins: 2 },
  ]},
  { id: 'it-seed-08', name: 'Gemas rail heritage', purpose: 'education', stationId: 'gemas', date: '2026-12-04', budget: 90, source: 'seed', updatedAt: '2026-11-04T10:00:00+08:00', items: [
    { id: 'ii-12', experienceId: 'exp-gemas-rail-heritage', startTime: '10:00', durationMins: 90, price: 35, transportMins: 0 },
  ]},
  { id: 'it-seed-09', name: 'Kulai food & craft day', purpose: 'leisure', stationId: 'kulai', date: '2026-12-01', budget: 300, source: 'seed', updatedAt: '2026-11-09T17:20:00+08:00', items: [
    { id: 'ii-13', experienceId: 'exp-kulai-market-breakfast', startTime: '08:00', durationMins: 60, price: 32, transportMins: 8 },
    { id: 'ii-14', experienceId: 'exp-kulai-noodle-pull', startTime: '10:00', durationMins: 75, price: 48, transportMins: 10 },
  ]},
  { id: 'it-seed-10', name: 'Durian season run', purpose: 'leisure', stationId: 'segamat', date: '2026-12-08', budget: 260, source: 'seed', updatedAt: '2026-11-11T13:05:00+08:00', items: [
    { id: 'ii-15', experienceId: 'exp-segamat-market', startTime: '07:00', durationMins: 105, price: 45, transportMins: 11 },
    { id: 'ii-16', experienceId: 'exp-segamat-durian', startTime: '11:00', durationMins: 180, price: 95, transportMins: 22 },
  ]},
]

export const VISITOR_PERSONAS: { id: string; name: string; country: string; purpose: VisitorProfile['purpose']; blurb: string }[] = [
  { id: 'persona-a', name: 'Wei Ming', country: 'Singapore', purpose: 'business', blurb: 'Two meetings in JB, four spare hours, wants something walkable from the station.' },
  { id: 'persona-b', name: 'Anna', country: 'Indonesia', purpose: 'medical', blurb: 'Three-day treatment at Segamat. Low intensity, step-free, close to the hospital.' },
  { id: 'persona-c', name: 'Tom', country: 'United Kingdom', purpose: 'education', blurb: 'Geography teacher scouting field visits for a school trip.' },
  { id: 'persona-d', name: 'Yuki', country: 'Japan', purpose: 'leisure', blurb: 'Travelling the ETS corridor for a week with a rail pass and a camera.' },
]

export const DEFAULT_VISITOR_PROFILE: VisitorProfile = {
  name: 'Guest visitor',
  email: '',
  country: 'Singapore',
  language: 'English',
  purpose: null,
  interests: [],
  availableMins: 240,
  budget: 150,
  stationId: 'labis',
  transport: ['walk', 'ehailing'],
  accessibility: [],
  partySize: 1,
  onboarded: false,
}
