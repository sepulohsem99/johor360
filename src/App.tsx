import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AppProvider } from './app/store'
import { PublicHeader, PublicFooter } from './layouts/PublicLayout'
import PortalLayout, { ToastStack } from './layouts/PortalLayout'
import { Skeleton } from './components/ui'
import { useApp } from './app/store'

const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const StationsIndex = lazy(() => import('./pages/Stations').then((m) => ({ default: m.StationsIndex })))
const StationDetail = lazy(() => import('./pages/Stations').then((m) => ({ default: m.StationDetail })))
const ExperienceDetail = lazy(() => import('./pages/ExperienceDetail'))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const HowItWorks = lazy(() => import('./pages/About').then((m) => ({ default: m.HowItWorks })))
const ExploreMap = lazy(() => import('./pages/MapAndOperator'))
const OperatorProfile = lazy(() => import('./pages/MapAndOperator').then((m) => ({ default: m.OperatorProfile })))
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('./pages/Auth').then((m) => ({ default: m.ForgotPassword })))
const NotFound = lazy(() => import('./pages/NotFound'))

const Onboarding = lazy(() => import('./pages/visitor/Onboarding'))


function PageFallback() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-64 w-full !rounded-2xl" />
      </div>
    </div>
  )
}

function PublicShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}

// ----------------------------------------------------------- portal wrappers
function VisitorLayout() {
  const { itineraries } = useApp()
  return (
    <PortalLayout
      title="Visitor portal"
      subtitle="JOHOR360"
      accent="visitor"
      items={[
        { to: '/visitor/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/visitor/recommendations', label: 'My matches', icon: 'sparkles' },
        { to: '/visitor/itinerary', label: 'Itinerary builder', icon: 'route' },
        { to: '/visitor/itineraries', label: 'Saved itineraries', icon: 'list-checks', badge: itineraries.length },
        { to: '/visitor/favourites', label: 'Saved experiences', icon: 'heart' },
        { to: '/visitor/profile', label: 'Profile & preferences', icon: 'settings' },
      ]}
    />
  )
}
const VisitorDashboard = lazy(() => import('./pages/visitor/Portal').then((m) => ({ default: m.VisitorDashboard })))
const Recommendations = lazy(() => import('./pages/visitor/Portal').then((m) => ({ default: m.Recommendations })))
const VisitorProfilePage = lazy(() => import('./pages/visitor/Portal').then((m) => ({ default: m.VisitorProfilePage })))
const Favourites = lazy(() => import('./pages/visitor/Portal').then((m) => ({ default: m.Favourites })))
const ItineraryBuilder = lazy(() => import('./pages/visitor/Itinerary').then((m) => ({ default: m.default })))
const ItinerariesIndex = lazy(() => import('./pages/visitor/Itinerary').then((m) => ({ default: m.ItinerariesIndex })))

function SmeLayout() {
  const { experiences } = useApp()
  const pending = experiences.filter((e) => e.verification === 'pending').length
  return (
    <PortalLayout
      title="SME operator portal"
      subtitle="JOHOR360"
      accent="sme"
      items={[
        { to: '/sme/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/sme/listings', label: 'Listings', icon: 'package' },
        { to: '/sme/enquiries', label: 'Enquiries', icon: 'message-square' },
        { to: '/sme/reviews', label: 'Visitor feedback', icon: 'star' },
        { to: '/sme/analytics', label: 'Performance', icon: 'activity' },
        { to: '/sme/profile', label: 'Operator profile', icon: 'store' },
      ]}
      headerRight={
        pending > 0 ? (
          <span className="hidden items-center gap-1.5 rounded-lg bg-gold-50 px-2.5 py-1.5 text-[11px] font-bold text-gold-800 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {pending} pending review
          </span>
        ) : null
      }
    />
  )
}
const SmeDashboard = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeDashboard })))
const SmeListings = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeListings })))
const SmeListingForm = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeListingForm })))
const SmeEnquiries = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeEnquiries })))
const SmeReviews = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeReviews })))
const SmeAnalytics = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeAnalytics })))
const SmeProfilePage = lazy(() => import('./pages/sme/Portal').then((m) => ({ default: m.SmeProfilePage })))

function AdminLayout() {
  const { experiences, reviews } = useApp()
  const pending = experiences.filter((e) => e.verification === 'pending').length
  const flagged = reviews.filter((r) => r.status === 'pending').length
  return (
    <PortalLayout
      title="Administrator portal"
      subtitle="JOHOR360"
      accent="admin"
      items={[
        { to: '/admin/dashboard', label: 'Overview', icon: 'layout-dashboard' },
        { to: '/admin/verifications', label: 'Verifications', icon: 'clipboard-check', badge: pending },
        { to: '/admin/operators', label: 'Operators', icon: 'store' },
        { to: '/admin/experiences', label: 'Experiences', icon: 'package' },
        { to: '/admin/reviews', label: 'Review moderation', icon: 'message-square', badge: flagged },
        { to: '/admin/analytics', label: 'Visitor insights', icon: 'activity' },
        { to: '/admin/impact', label: 'Impact dashboard', icon: 'target' },
        { to: '/admin/settings', label: 'Settings', icon: 'settings' },
      ]}
    />
  )
}
const AdminDashboard = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminDashboard })))
const AdminVerifications = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminVerifications })))
const AdminOperators = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminOperators })))
const AdminExperiences = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminExperiences })))
const AdminReviews = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminReviews })))
const AdminAnalytics = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminAnalytics })))
const AdminImpact = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminImpact })))
const AdminSettings = lazy(() => import('./pages/admin/Portal').then((m) => ({ default: m.AdminSettings })))

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* public */}
            <Route element={<PublicShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/stations" element={<StationsIndex />} />
              <Route path="/explore/stations/:stationId" element={<StationDetail />} />
              <Route path="/experiences/:slug" element={<ExperienceDetail />} />
              <Route path="/operators/:slug" element={<OperatorProfile />} />
              <Route path="/map" element={<ExploreMap />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* visitor */}
            <Route path="/visitor/onboarding" element={<Onboarding />} />
            <Route path="/visitor" element={<VisitorLayout />}>
              <Route index element={<Navigate to="/visitor/dashboard" replace />} />
              <Route path="dashboard" element={<VisitorDashboard />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="itinerary" element={<ItineraryBuilder />} />
              <Route path="itineraries" element={<ItinerariesIndex />} />
              <Route path="favourites" element={<Favourites />} />
              <Route path="profile" element={<VisitorProfilePage />} />
            </Route>

            {/* sme */}
            <Route path="/sme" element={<SmeLayout />}>
              <Route index element={<Navigate to="/sme/dashboard" replace />} />
              <Route path="dashboard" element={<SmeDashboard />} />
              <Route path="listings" element={<SmeListings />} />
              <Route path="listings/new" element={<SmeListingForm />} />
              <Route path="listings/:id/edit" element={<SmeListingForm />} />
              <Route path="enquiries" element={<SmeEnquiries />} />
              <Route path="reviews" element={<SmeReviews />} />
              <Route path="analytics" element={<SmeAnalytics />} />
              <Route path="profile" element={<SmeProfilePage />} />
            </Route>

            {/* admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="operators" element={<AdminOperators />} />
              <Route path="experiences" element={<AdminExperiences />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="impact" element={<AdminImpact />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastStack />
      </BrowserRouter>
    </AppProvider>
  )
}
