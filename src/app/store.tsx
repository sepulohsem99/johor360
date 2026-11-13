import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  Enquiry,
  Experience,
  Itinerary,
  Review,
  Role,
  VerificationEvent,
  VisitorProfile,
  VerificationStatus,
} from '../types'
import { DEFAULT_VISITOR_PROFILE, ENQUIRIES, REVIEWS, SEED_ITINERARIES } from '../data/reviews'
import { ALL_EXPERIENCES } from '../data/experiencesIndex'
import { OPERATORS } from '../data/operators'
import { load, save } from '../services/storage'

interface Toast {
  id: string
  title: string
  body?: string
  tone: 'success' | 'info' | 'error'
}

interface AppState {
  role: Role
  setRole: (r: Role) => void

  experiences: Experience[]
  operators: typeof OPERATORS
  setExperienceStatus: (id: string, status: VerificationStatus, note?: string) => void
  upsertExperience: (e: Experience) => void

  enquiries: Enquiry[]
  updateEnquiry: (id: string, status: Enquiry['status']) => void
  addEnquiry: (e: Enquiry) => void

  reviews: Review[]
  addReview: (r: Review) => void
  moderateReview: (id: string, status: Review['status']) => void

  itineraries: Itinerary[]
  addItinerary: (i: Itinerary) => void
  updateItinerary: (i: Itinerary) => void
  removeItinerary: (id: string) => void

  favourites: string[]
  toggleFavourite: (id: string) => void

  profile: VisitorProfile
  setProfile: (p: VisitorProfile) => void

  events: VerificationEvent[]

  toasts: Toast[]
  toast: (title: string, body?: string, tone?: Toast['tone']) => void
  dismissToast: (id: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => load<Role>('visitor', 'role'))
  const [experiences, setExperiences] = useState<Experience[]>(() =>
    load<Experience[]>(ALL_EXPERIENCES, 'experiences')
  )
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => load<Enquiry[]>(ENQUIRIES, 'enquiries'))
  const [reviews, setReviews] = useState<Review[]>(() => load<Review[]>(REVIEWS, 'reviews'))
  const [itineraries, setItineraries] = useState<Itinerary[]>(() =>
    load<Itinerary[]>(SEED_ITINERARIES, 'itineraries')
  )
  const [favourites, setFavourites] = useState<string[]>(() => load<string[]>([], 'favourites'))
  const [profile, setProfileState] = useState<VisitorProfile>(() =>
    load<VisitorProfile>(DEFAULT_VISITOR_PROFILE, 'profile')
  )
  const [events, setEvents] = useState<VerificationEvent[]>(() =>
    load<VerificationEvent[]>(
      [
        {
          id: 'ev-seed-1',
          operatorId: 'op-kulai-clay',
          experienceId: 'exp-kulai-clay',
          action: 'submitted',
          actor: 'Nur Aisyah binti Rahim',
          at: '2026-11-09T09:20:00+08:00',
          note: 'New wheel-throwing taster listing submitted with SSM and safety documents.',
        },
        {
          id: 'ev-seed-2',
          operatorId: 'op-labis-hotspring',
          experienceId: 'exp-labis-hotspring',
          action: 'changes_requested',
          actor: 'JOHOR360 Admin',
          at: '2026-11-01T10:12:00+08:00',
          note: 'Please remove the therapeutic claims and resubmit with an accessibility statement.',
        },
      ],
      'events'
    )
  )
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => save('role', role), [role])
  useEffect(() => save('experiences', experiences), [experiences])
  useEffect(() => save('enquiries', enquiries), [enquiries])
  useEffect(() => save('reviews', reviews), [reviews])
  useEffect(() => save('itineraries', itineraries), [itineraries])
  useEffect(() => save('favourites', favourites), [favourites])
  useEffect(() => save('profile', profile), [profile])
  useEffect(() => save('events', events), [events])

  const toast = useCallback((title: string, body?: string, tone: Toast['tone'] = 'success') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((t) => [...t, { id, title, body, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const setRole = useCallback((r: Role) => setRoleState(r), [])

  const setExperienceStatus = useCallback(
    (id: string, status: VerificationStatus, note?: string) => {
      setExperiences((list) => list.map((e) => (e.id === id ? { ...e, verification: status } : e)))
      const exp = experiences.find((e) => e.id === id)
      if (exp) {
        setEvents((prev) => [
          {
            id: `ev-${Date.now()}`,
            operatorId: exp.operatorId,
            experienceId: exp.id,
            action:
              status === 'verified'
                ? 'approved'
                : status === 'rejected'
                  ? 'rejected'
                  : status === 'changes_requested'
                    ? 'changes_requested'
                    : 'submitted',
            actor: 'JOHOR360 Admin',
            at: new Date().toISOString(),
            note: note ?? `Status set to ${status}.`,
          },
          ...prev,
        ])
      }
    },
    [experiences]
  )

  const upsertExperience = useCallback((e: Experience) => {
    setExperiences((list) => {
      const idx = list.findIndex((x) => x.id === e.id)
      if (idx === -1) return [e, ...list]
      const next = [...list]
      next[idx] = e
      return next
    })
    setEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        operatorId: e.operatorId,
        experienceId: e.id,
        action: 'submitted',
        actor: 'SME operator',
        at: new Date().toISOString(),
        note: `“${e.title}” submitted for verification.`,
      },
      ...prev,
    ])
  }, [])

  const updateEnquiry = useCallback((id: string, status: Enquiry['status']) => {
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)))
  }, [])

  const addEnquiry = useCallback((e: Enquiry) => setEnquiries((l) => [e, ...l]), [])

  const addReview = useCallback((r: Review) => setReviews((l) => [r, ...l]), [])

  const moderateReview = useCallback((id: string, status: Review['status']) => {
    setReviews((l) => l.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const addItinerary = useCallback((i: Itinerary) => setItineraries((l) => [i, ...l]), [])

  const updateItinerary = useCallback((i: Itinerary) => {
    setItineraries((l) => l.map((x) => (x.id === i.id ? { ...i, updatedAt: new Date().toISOString() } : x)))
  }, [])

  const removeItinerary = useCallback((id: string) => {
    setItineraries((l) => l.filter((x) => x.id !== id))
  }, [])

  const toggleFavourite = useCallback(
    (id: string) => {
      setFavourites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
    },
    []
  )

  const setProfile = useCallback((p: VisitorProfile) => setProfileState(p), [])

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      experiences,
      operators: OPERATORS,
      setExperienceStatus,
      upsertExperience,
      enquiries,
      updateEnquiry,
      addEnquiry,
      reviews,
      addReview,
      moderateReview,
      itineraries,
      addItinerary,
      updateItinerary,
      removeItinerary,
      favourites,
      toggleFavourite,
      profile,
      setProfile,
      events,
      toasts,
      toast,
      dismissToast,
    }),
    [
      role, setRole, experiences, setExperienceStatus, upsertExperience,
      enquiries, updateEnquiry, addEnquiry, reviews, addReview, moderateReview,
      itineraries, addItinerary, updateItinerary, removeItinerary,
      favourites, toggleFavourite, profile, setProfile, events, toasts, toast, dismissToast,
    ]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function usePublishedExperiences() {
  const { experiences } = useApp()
  return useMemo(() => experiences.filter((e) => e.verification === 'verified'), [experiences])
}
