import { initPostHog, identifyFromSession } from './util/posthog'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

// Initialize once before rendering. No-op unless VITE_POSTHOG_KEY is set.
initPostHog()
identifyFromSession() // session restore

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache stability
      gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
