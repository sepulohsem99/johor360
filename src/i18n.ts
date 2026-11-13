import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import ms from './locales/ms/translation.json'

const saved = (() => {
  try {
    return localStorage.getItem('johor360.v2.lang')
  } catch {
    return null
  }
})()

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ms: { translation: ms },
  },
  lng: saved ?? 'ms', // Bahasa Melayu is the product default
  fallbackLng: 'en',
  supportedLngs: ['ms', 'en'],
  interpolation: { escapeValue: false },
  returnNull: false,
})

export default i18n
