import type { Station } from '../types'

/**
 * Rail reference note
 * -------------------
 * Station order and names verified against KTMB ETS (KL Sentral–JB Sentral)
 * service information: Gemas → Segamat → Labis → Bekok → Paloh → Kluang →
 * Rengam → Layang-Layang → Kulai → Kempas Baru → JB Sentral.
 * The KL–JB ETS through-service began 12 December 2025 with four services per
 * direction per day; not every station has identical frequency.
 *
 * Journey times below are ILLUSTRATIVE ESTIMATES for the mockup only, not live
 * KTMB data. Always check ktmb.com.my before travelling.
 */
export const RAIL_SOURCE = {
  label: 'KTMB — Keretapi Tanah Melayu Berhad',
  url: 'https://www.ktmb.com.my/',
  lastVerified: '2026-11-13',
  note: 'Station names and order verified against KTMB ETS route information. Timings shown in JOHOR360 are illustrative estimates, not live schedules.',
}

export const STATIONS: Station[] = [
  {
    id: 'jb-sentral',
    name: 'JB Sentral',
    state: 'Johor',
    district: 'Johor Bahru',
    order: 0,
    lat: 1.4626,
    lng: 103.7646,
    minutesFromJB: 0,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Johor Bahru', 'Danga Bay', 'Stulang'],
    blurb:
      'The southern terminus and the gateway most visitors already know. Everything beyond this point is the part Johor360 exists to surface.',
    lastMile: [
      { mode: 'walk', label: 'Walk to city centre', minutes: 8, available: true, note: 'Covered linkway to JB City Square.' },
      { mode: 'ehailing', label: 'E-hailing pickup', minutes: 5, available: true, note: 'Designated pickup at Level 2 drop-off.' },
      { mode: 'bus', label: 'Local bus (Johor Bahru network)', minutes: 12, available: true, note: 'Frequent in the city centre.' },
    ],
    sourceNote: 'Terminus of the KL–JB ETS through-service. Also linked to the future RTS Link to Singapore.',
  },
  {
    id: 'kulai',
    name: 'Kulai',
    state: 'Johor',
    district: 'Kulai',
    order: 1,
    lat: 1.6578,
    lng: 103.6037,
    minutesFromJB: 35,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Kulai', 'Saleng', 'Senai'],
    blurb:
      'A working town rather than a tourist town. Its food scene and small workshops sit ten minutes from the platform, and almost none of them appear on international travel apps.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Kulai old town', minutes: 12, available: true, note: 'Flat pavement most of the way.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 4, available: true, note: 'Pickup at station forecourt.' },
      { mode: 'bus', label: 'Local bus to Saleng', minutes: 15, available: 'unknown', note: 'Frequency not confirmed — verify locally.' },
    ],
    sourceNote: 'Served by the KL–JB ETS through-service.',
  },
  {
    id: 'rengam',
    name: 'Rengam',
    state: 'Johor',
    district: 'Kluang',
    order: 2,
    lat: 1.853,
    lng: 103.573,
    minutesFromJB: 55,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Rengam', 'Bandar Tenggara'],
    blurb:
      'A small stop surrounded by rubber smallholdings and fruit orchards. The kind of place a visitor would never route through without a reason given to them.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Rengam village', minutes: 15, available: true, note: 'Quiet road, limited shade at midday.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 8, available: 'unknown', note: 'Coverage is patchy outside peak hours.' },
    ],
    sourceNote: 'Served by the KL–JB ETS through-service.',
  },
  {
    id: 'kluang',
    name: 'Kluang',
    state: 'Johor',
    district: 'Kluang',
    order: 3,
    lat: 2.0306,
    lng: 103.3188,
    minutesFromJB: 85,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Kluang', 'Kampung Melayu', 'Taman Sri Kluang'],
    blurb:
      'Coffee, batik and a walkable colonial-era grid. Kluang has the densest cluster of small operators on the corridor and is the natural first stop beyond the city.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Jalan Lambak', minutes: 10, available: true, note: 'Level footpaths, one crossing.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 4, available: true, note: 'Reliable in town.' },
      { mode: 'shuttle', label: 'Community shuttle (demo)', minutes: 10, available: 'unknown', note: 'Illustrative — service to be confirmed with operator.' },
    ],
    sourceNote: 'Directly served by ETS3 since August 2025 and by the KL–JB through-service.',
  },
  {
    id: 'paloh',
    name: 'Paloh',
    state: 'Johor',
    district: 'Kluang',
    order: 4,
    lat: 2.1667,
    lng: 103.2333,
    minutesFromJB: 105,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Paloh', 'Kampung Baru Paloh'],
    blurb:
      'A one-street town with a herb farming belt behind it. Tiny, quiet, and the sort of place where the operator will meet you at the platform themselves.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Paloh main street', minutes: 6, available: true, note: 'Station sits at the edge of town.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 10, available: 'unknown', note: 'Limited availability — arrange pickup in advance.' },
    ],
    sourceNote: 'Served by the KL–JB ETS through-service.',
  },
  {
    id: 'bekok',
    name: 'Bekok',
    state: 'Johor',
    district: 'Segamat',
    order: 5,
    lat: 2.3167,
    lng: 103.1667,
    minutesFromJB: 125,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Bekok', 'Kampung Chaah'],
    blurb:
      'Rainforest edge, rivers and waterfalls. Bekok is where the corridor turns green — and where a visitor most needs a guide who actually lives there.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Bekok village', minutes: 8, available: true, note: 'Short walk, unpaved shoulder at the end.' },
      { mode: 'taxi', label: 'Local taxi (arranged)', minutes: 12, available: 'unknown', note: 'Very few vehicles — book through operator.' },
    ],
    sourceNote: 'Served by the KL–JB ETS through-service.',
  },
  {
    id: 'labis',
    name: 'Labis',
    state: 'Johor',
    district: 'Segamat',
    order: 6,
    lat: 2.383,
    lng: 103.02,
    minutesFromJB: 145,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Labis', 'Kampung Tenang', 'Chaah'],
    blurb:
      'Hot springs, smallholder farms and a weaving collective. Labis is the demo centre of this mockup because it is exactly the town the challenge describes: reachable, real, and almost entirely unlisted.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Labis town', minutes: 9, available: true, note: 'Station to main road is flat.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 6, available: 'unknown', note: 'Intermittent — confirm before relying on it.' },
      { mode: 'shuttle', label: 'Operator pickup (demo)', minutes: 5, available: 'unknown', note: 'Several demo operators offer platform pickup on request.' },
    ],
    sourceNote: 'Directly served by ETS3 since August 2025 and by the KL–JB through-service.',
  },
  {
    id: 'segamat',
    name: 'Segamat',
    state: 'Johor',
    district: 'Segamat',
    order: 7,
    lat: 2.5146,
    lng: 102.8159,
    minutesFromJB: 175,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Segamat', 'Buloh Kasap', 'Jementah'],
    blurb:
      'The district capital of north Johor. Durian smallholdings, a busy market and a hospital catchment that pulls visitors in for days at a time.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Segamat town', minutes: 11, available: true, note: 'Pavement for most of the route.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 5, available: true, note: 'Good coverage in the district capital.' },
      { mode: 'bus', label: 'Local bus', minutes: 18, available: true, note: 'Town loop service.' },
    ],
    sourceNote: 'Served by the KL–JB ETS through-service. Nearest hospital catchment for northern Johor.',
  },
  {
    id: 'gemas',
    name: 'Gemas',
    state: 'Negeri Sembilan',
    district: 'Tampin',
    order: 8,
    lat: 2.5812,
    lng: 102.6111,
    minutesFromJB: 210,
    servicesPerDay: 4,
    seasonalStop: false,
    towns: ['Gemas', 'Gemencheh', 'Batang Melaka'],
    blurb:
      'The historic junction where the east and west rail lines meet. A heritage stop in its own right, and the northern bookend of the Johor corridor.',
    lastMile: [
      { mode: 'walk', label: 'Walk to Gemas old town', minutes: 7, available: true, note: 'Station opens onto the main street.' },
      { mode: 'ehailing', label: 'E-hailing', minutes: 9, available: 'unknown', note: 'Limited — arrange ahead.' },
      { mode: 'taxi', label: 'Local taxi', minutes: 6, available: true, note: 'Usually waiting at the station.' },
    ],
    sourceNote:
      'Historic rail junction. Note: Gemas is in Negeri Sembilan, at the northern edge of the Johor corridor — included as a corridor endpoint.',
  },
]

export const stationById = (id?: string | null) => STATIONS.find((s) => s.id === id)

/** Corridor sequence used by the rail visual, north → south. */
export const CORRIDOR = [...STATIONS].sort((a, b) => b.order - a.order)
