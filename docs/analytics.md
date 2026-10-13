# Product analytics (PostHog)

Config (Vercel env, build time):

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_POSTHOG_KEY` | no | PostHog project key. If unset, PostHog is fully disabled (no init, no network calls). |
| `VITE_POSTHOG_HOST` | no | Defaults to `https://us.i.posthog.com`. |

Autocapture is off. Pageviews are captured on route changes (`$pageview`). All funnel events are explicit `capture` calls from `src/util/posthog.js`.

Identity: users are identified by email (`posthog.identify(email)`), taken from the session JWT claims. This runs on app start (session restore) and right after every successful login. The user is grouped under `organization` (org id). Logout calls `posthog.reset()`.

## Events

| Event | Fires when | Properties |
| --- | --- | --- |
| `signup_submitted` | Email signup form accepted by the API (verification email sent) | `method: "email"` |
| `signup_completed` | Account fully created: email verified, or OAuth profile completed | `method: "email" \| "google" \| "github"` |
| `login_succeeded` | Password login or OAuth login for an existing user | `method: "password" \| "google" \| "github"` |
| `logout` | User confirms logout | none |
| `service_api_key_created` | Service API key generated on Services page | none |
| `github_app_connected` | Integrations page first sees the GitHub App as Connected (once per user per browser) | none |
| `first_events_viewed` | Events page loads at least one change event (once per user per browser) | `count` |
| `rewind_run` | Rewind analysis returns from `/scoring/incident` | `service`, `environment`, `window_minutes`, `has_results` |
| `first_rewind_run` | First `rewind_run` (once per user per browser) | same as `rewind_run` |
| `slack_connect_clicked` | "Connect Slack" clicked on Notifications | none |
| `slack_connected` | Notifications page sees Slack connected (once per user per browser) | none |
| `slack_channel_saved` | Alert channel saved | none |

Funnel: `signup_submitted` > `signup_completed` > `login_succeeded` > `first_events_viewed` > `first_rewind_run` > `slack_connected`.
There is no separate onboarding wizard, so `signup_completed` is the onboarding-complete step.
"Once" events are guarded in localStorage, so a new browser can fire them again.
