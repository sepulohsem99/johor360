import type { CategoryId, TagId, Purpose } from '../types'

export const CATEGORIES: {
  id: CategoryId
  label: string
  blurb: string
  glyph: string
}[] = [
  { id: 'leisure', label: 'Leisure', blurb: 'Easy, unhurried things to do', glyph: 'sparkles' },
  { id: 'education', label: 'Education', blurb: 'Structured learning visits', glyph: 'graduation-cap' },
  { id: 'culture', label: 'Culture', blurb: 'Living traditions of the district', glyph: 'drama' },
  { id: 'heritage', label: 'Heritage', blurb: 'Rail towns and old streets', glyph: 'landmark' },
  { id: 'food', label: 'Food', blurb: 'Coffee, kitchens and markets', glyph: 'utensils' },
  { id: 'nature', label: 'Nature', blurb: 'Forest, rivers and hills', glyph: 'trees' },
  { id: 'agriculture', label: 'Agriculture', blurb: 'Farms, orchards and estates', glyph: 'sprout' },
  { id: 'workshops', label: 'Workshops', blurb: 'Make something with your hands', glyph: 'hammer' },
  { id: 'wellness', label: 'Wellness', blurb: 'Slow, restorative, low intensity', glyph: 'heart-pulse' },
  { id: 'community', label: 'Community', blurb: 'Run by kampung collectives', glyph: 'users' },
]

export const TAGS: { id: TagId; label: string }[] = [
  { id: 'culture', label: 'Culture' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'stem', label: 'STEM' },
  { id: 'crafts', label: 'Crafts' },
  { id: 'local-food', label: 'Local Food' },
  { id: 'nature-learning', label: 'Nature Learning' },
]

export const INTERESTS: { id: string; label: string }[] = [
  { id: 'food', label: 'Food & coffee' },
  { id: 'culture', label: 'Culture & tradition' },
  { id: 'heritage', label: 'Heritage & history' },
  { id: 'nature', label: 'Nature & outdoors' },
  { id: 'agriculture', label: 'Farms & agriculture' },
  { id: 'craft', label: 'Crafts & making' },
  { id: 'wellness', label: 'Wellness & slow travel' },
  { id: 'education', label: 'Learning' },
  { id: 'photography', label: 'Photography' },
  { id: 'community', label: 'Community & local life' },
]

export const PURPOSES: {
  id: Purpose
  label: string
  blurb: string
  glyph: string
  accent: string
}[] = [
  {
    id: 'business',
    label: 'Business traveller',
    blurb: 'Short, time-boxed experiences near stations and business districts.',
    glyph: 'briefcase',
    accent: 'royal',
  },
  {
    id: 'medical',
    label: 'Medical traveller',
    blurb: 'Low-intensity, accessible, close to town, generous buffers.',
    glyph: 'stethoscope',
    accent: 'emerald2',
  },
  {
    id: 'education',
    label: 'Education traveller',
    blurb: 'Workshops, heritage learning, agriculture and cultural visits.',
    glyph: 'graduation-cap',
    accent: 'gold',
  },
  {
    id: 'leisure',
    label: 'Leisure traveller',
    blurb: 'Food, nature, culture and community-run experiences.',
    glyph: 'palmtree',
    accent: 'johor',
  },
]

export const TRANSPORT_OPTIONS = [
  { id: 'walk', label: 'Walking' },
  { id: 'ehailing', label: 'E-hailing' },
  { id: 'taxi', label: 'Local taxi' },
  { id: 'bus', label: 'Local bus' },
  { id: 'shuttle', label: 'Community shuttle' },
]

export const ACCESSIBILITY_OPTIONS = [
  { id: 'wheelchair', label: 'Wheelchair user' },
  { id: 'step_free', label: 'Needs step-free access' },
  { id: 'seated', label: 'Needs seated rest options' },
  { id: 'low_intensity', label: 'Low physical intensity only' },
]

export const LANGUAGES = ['English', 'Bahasa Melayu', 'Mandarin', 'Tamil', 'Japanese', 'Korean']

export const COUNTRIES = [
  'Singapore',
  'Indonesia',
  'Australia',
  'United Kingdom',
  'Japan',
  'South Korea',
  'China',
  'India',
  'United States',
  'Germany',
  'Other',
]

export const DURATION_PRESETS = [
  { mins: 120, label: '2 hours' },
  { mins: 240, label: '4 hours' },
  { mins: 300, label: 'Half day' },
]
