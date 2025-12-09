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
      console.warn("PostHog key is missing. Analytics will not be tracked.")
      return
    }

    // Only initialize PostHog if it hasn't been initialized yet
    if (typeof window !== "undefined" && !(posthog as any).__loaded) {
      posthog.init(posthogKey, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: false,
        loaded: (posthog) => {
          // PostHog loaded successfully in production
        },
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}