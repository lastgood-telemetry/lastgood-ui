import posthog from 'posthog-js'

/**
 * PostHog product analytics.
 * Enabled only when VITE_POSTHOG_KEY is set. With no key every export is a no-op
 * and posthog-js is never initialized, so no network calls are made.
 * Events are explicit (autocapture is off). See docs/analytics.md for the event list.
 */
const KEY = import.meta.env.VITE_POSTHOG_KEY
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let enabled = false

export const initPostHog = () => {
  if (!KEY || enabled) return
  try {
    posthog.init(KEY, {
      api_host: HOST,
      autocapture: false,
      capture_pageview: 'history_change',
      person_profiles: 'identified_only',
    })
    enabled = true
  } catch {
    enabled = false
  }
}

export const isPostHogEnabled = () => enabled

const readTokenEmail = () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return { email: payload.email, userId: payload.userId, orgId: payload.orgId, role: payload.role }
  } catch {
    return null
  }
}

/**
 * Identify the current user by email from the stored session token.
 * Call on app start (session restore) and right after a token is saved (login).
 * The token is only decoded for display claims, not trusted for authorization.
 */
export const identifyFromSession = () => {
  if (!enabled) return null
  const claims = readTokenEmail()
  if (!claims?.email) return null
  try {
    posthog.identify(claims.email, {
      email: claims.email,
      user_id: claims.userId,
      role: claims.role,
    })
    if (claims.orgId) posthog.group('organization', claims.orgId)
  } catch {
    /* ignore */
  }
  return claims
}

export const resetAnalytics = () => {
  if (!enabled) return
  try {
    posthog.reset()
  } catch {
    /* ignore */
  }
}

export const capture = (event, properties = {}) => {
  if (!enabled) return
  try {
    posthog.capture(event, properties)
  } catch {
    /* ignore */
  }
}

/** Fire an event once per user per browser (for first-time funnel steps). */
export const captureOnce = (event, properties = {}) => {
  if (!enabled) return
  try {
    const who = readTokenEmail()?.email || 'anon'
    const key = `ph_once:${who}:${event}`
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
    capture(event, properties)
  } catch {
    /* ignore */
  }
}

/** Call after a token has been saved to localStorage. */
export const trackAuthenticated = (event, properties = {}) => {
  identifyFromSession()
  capture(event, properties)
}
