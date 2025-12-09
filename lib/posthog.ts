import { PostHog } from "posthog-node"

// NOTE: This is a Node.js client, so you can use it for sending events from the server side to PostHog.
// Only returns a client in production, returns null in development/local
export default function PostHogClient() {
  // Only initialize PostHog in production
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}