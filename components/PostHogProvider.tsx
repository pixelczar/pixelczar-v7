"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog in production
    if (process.env.NODE_ENV !== "production") {
      return
    }

    // Only initialize if we have a PostHog key
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

    if (!posthogKey) {
      return
    }

    const init = () => {
      // Only initialize PostHog if it hasn't been initialized yet
      if (typeof window !== "undefined" && !(posthog as any).__loaded) {
        posthog.init(posthogKey, {
          api_host: "/ingest",
          ui_host: "https://us.posthog.com",
          defaults: '2025-05-24',
          capture_exceptions: true,
          debug: false,
          loaded: (posthog) => {
            // Check for ?internal=true URL param to set internal user flag
            const urlParams = new URLSearchParams(window.location.search)
            if (urlParams.get('internal') === 'true') {
              localStorage.setItem('isInternalUser', 'true')
            }

            // Identify internal user for filtering in PostHog
            const isInternal = localStorage.getItem('isInternalUser') === 'true'
            if (isInternal) {
              posthog.identify('will-internal', {
                email: 'willisvt@gmail.com',
                is_internal_user: true,
              })
            }
          },
        })
      }
    }

    // Defer initialization until after the page is interactive
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(init, { timeout: 3000 })
      return () => cancelIdleCallback(id)
    } else {
      const id = setTimeout(init, 1000)
      return () => clearTimeout(id)
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}