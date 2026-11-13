export type Role = 'visitor' | 'sme' | 'admin'

export type Purpose = 'business' | 'medical' | 'education' | 'leisure'

export type VerificationStatus =
  | 'draft'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'changes_requested'

export type CategoryId =
  | 'leisure'
  | 'education'
  | 'culture'
  | 'heritage'
  | 'food'
  | 'nature'
  | 'agriculture'
  | 'workshops'
  | 'wellness'
  | 'community'

export type TagId =
  | 'culture'
  | 'heritage'
  | 'agriculture'
  | 'stem'
  | 'crafts'
  | 'local-food'
  | 'nature-learning'

export type Intensity = 'low' | 'moderate' | 'high'
export type Setting = 'indoor' | 'outdoor' | 'mixed'

export interface Station {
  id: string
  name: string
  state: string
  district: string
  /** order southbound from Gemas (JB direction) */
  order: number
  lat: number
  lng: number
  /** illustrative ETS minutes from JB Sentral, outbound */
  minutesFromJB: number
  /** demo: ETS services per day direction */
  servicesPerDay: number
  seasonalStop: boolean
  towns: string[]
  blurb: string
  lastMile: LastMileOption[]
  sourceNote: string
}

export interface LastMileOption {
  mode: 'walk' | 'ehailing' | 'taxi' | 'bus' | 'shuttle'
  label: string
  minutes: number
  available: boolean | 'unknown'
  note: string
}

export interface Operator {
  id: string
  name: string
  operatorName: string
  category: string
  town: string
  stationId: string
  email: string
  phone: string
  description: string
  verification: VerificationStatus
  joined: string
  profileViews: number
  rating: number
  reviewCount: number
  logoAdopt: string
  submittedAt?: string
  documents: string[]
}

export interface Experience {
  id: string
  operatorId: string
  title: string
  summary: string
  description: string
  category: CategoryId
  tags: TagId[]
  stationId: string
  town: string
  /** illustrative price per person, MYR */
  price: number
  durationMins: number
  capacity: number
  accessibility: {
    wheelchair: boolean
    stepFree: boolean
    seatedOption: boolean
    notes: string
  }
  intensity: Intensity
  setting: Setting
  interests: string[]
  bestFor: Purpose[]
  heroGradient: string
  images: string[]
  learningValue: string
  availability: AvailabilitySlot[]
  verification: VerificationStatus
  rating: number
  reviewCount: number
  views: number
  enquiries: number
  featured: boolean
  lastMileNote: string
  createdAt: string
}

export interface AvailabilitySlot {
  day: string
  times: string[]
}

export interface Review {
  id: string
  experienceId: string
  operatorId: string
  authorName: string
  authorOrigin: string
  rating: number
  date: string
  body: string
  purpose: Purpose
  status: 'published' | 'pending' | 'flagged'
}

export interface Enquiry {
  id: string
  experienceId: string
  operatorId: string
  visitorName: string
  visitorEmail: string
  partySize: number
  date: string
  message: string
  status: 'new' | 'in_review' | 'responded' | 'closed'
  createdAt: string
}

export interface ItineraryItem {
  id: string
  experienceId: string
  startTime: string
  durationMins: number
  price: number
  transportMins: number
}

export interface Itinerary {
  id: string
  name: string
  purpose: Purpose
  stationId: string
  date: string
  items: ItineraryItem[]
  budget: number
  updatedAt: string
  source: 'visitor' | 'seed' | 'generated'
}

export interface VisitorProfile {
  name: string
  email: string
  country: string
  language: string
  purpose: Purpose | null
  interests: string[]
  availableMins: number
  budget: number
  stationId: string
  transport: string[]
  accessibility: string[]
  partySize: number
  onboarded: boolean
}

export interface MatchResult {
  experience: Experience
  score: number
  breakdown: {
    interest: number
    time: number
    access: number
    budget: number
    purpose: number
  }
  reasons: string[]
  hardFail?: string
}

export interface VerificationEvent {
  id: string
  operatorId: string
  experienceId?: string
  action: 'submitted' | 'approved' | 'rejected' | 'changes_requested'
  actor: string
  at: string
  note: string
}
