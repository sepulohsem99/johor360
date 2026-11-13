import { EXPERIENCES } from './experiences'
import { EXPERIENCES_B } from './experiencesB'

/** DEMONSTRATION DATA — invented demo listings for the JOHOR360 mockup. */
export const ALL_EXPERIENCES = [...EXPERIENCES, ...EXPERIENCES_B]

export const experienceById = (id?: string | null) => ALL_EXPERIENCES.find((e) => e.id === id)

export const publishedExperiences = () => ALL_EXPERIENCES.filter((e) => e.verification === 'verified')
