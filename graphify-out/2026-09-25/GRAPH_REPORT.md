# Graph Report - lastgood-ui  (2026-09-22)

## Corpus Check
- 88 files · ~64,640 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 436 nodes · 638 edges · 40 communities (33 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac6f77a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Correctness Properties
- devDependencies
- dependencies
- App.jsx
- Settings.jsx
- What You Must Do When Invoked
- Requirements
- Correlations.jsx
- Login.jsx
- staff-frontend/SKILL.md
- Events.jsx
- graphify reference: extra exports and benchmark
- Sandbox.jsx
- graphify reference: query, path, explain
- Implementation Plan: Correlation Timeline Enhancements
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- React + Vite
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- workflows/graphify.md
- extraction-spec.md
- vercel.json
- OverallRiskSummary.jsx
- oncall-engineer/SKILL.md
- Rewind.jsx

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 12 edges
2. `toast` - 11 edges
3. `useOrganization()` - 11 edges
4. `Services()` - 10 edges
5. `/graphify` - 10 edges
6. `api` - 9 edges
7. `PageContainer()` - 9 edges
8. `PageHeader()` - 9 edges
9. `Design Document` - 9 edges
10. `Correctness Properties` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GlobalGuard()` --references--> `react`  [EXTRACTED]
  src/App.jsx → package.json
- `GitHubWebhookModal()` --calls--> `useOrgStore`  [EXTRACTED]
  src/components/GitHubWebhookModal/GitHubWebhookModal.jsx → src/stores/useOrgStore.js
- `useOrganization()` --indirect_call--> `getOrganization()`  [INFERRED]
  src/hooks/useOrganization.js → src/service/organization.js
- `Services()` --calls--> `useOrganization()`  [EXTRACTED]
  src/pages/Services.jsx → src/hooks/useOrganization.js
- `useOrganizationCount()` --indirect_call--> `getOrganizationCount()`  [INFERRED]
  src/hooks/useOrganizationCount.js → src/service/organization.js

## Import Cycles
- None detected.

## Communities (40 total, 7 thin omitted)

### Community 0 - "Correctness Properties"
Cohesion: 0.05
Nodes (38): Architecture, Components and Interfaces, Correctness Properties, Correlation (existing shape, documented for reference), Correlation Timeline Enhancements, `correlations` absent / null, Correlations.jsx — changes, Data Models (+30 more)

### Community 1 - "devDependencies"
Cohesion: 0.07
Nodes (29): autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, devDependencies (+21 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (37): axios, class-variance-authority, clsx, date-fns, dayjs, lucide-react, dependencies, axios (+29 more)

### Community 3 - "App.jsx"
Cohesion: 0.11
Nodes (29): api, App(), GlobalGuard(), PageContainer(), PageHeader(), useHelpLoom(), queryClient, EventDetail() (+21 more)

### Community 4 - "Settings.jsx"
Cohesion: 0.17
Nodes (13): CommandPaletteModal(), CreateAPIKey(), GitHubWebhookModal(), LogoutConfirmationModal(), useApiKeys(), useOrganization(), MainLayout(), Settings() (+5 more)

### Community 5 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 6 - "Requirements"
Cohesion: 0.12
Nodes (16): Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Glossary, Introduction (+8 more)

### Community 7 - "Correlations.jsx"
Cohesion: 0.60
Nodes (3): Correlations(), getConfidenceColor(), STATUS_STYLES

### Community 8 - "Login.jsx"
Cohesion: 0.29
Nodes (10): useOrganizationCount(), CompleteProfile(), Login(), timelineSteps, loginUser(), oauthSignup(), resetPassword(), signupUser() (+2 more)

### Community 9 - "staff-frontend/SKILL.md"
Cohesion: 0.09
Nodes (21): 1. User Experience & Performance First, 2. Component Design & API Ergonomics, 3. Strict Type Safety & Defensive Engineering, Accessibility (a11y) & Semantic HTML, Architectural / Root Cause Analysis, Architecture & Code Review Checklist, Core Responsibilities, Debugging & Performance Audit Process (+13 more)

### Community 10 - "Events.jsx"
Cohesion: 0.29
Nodes (6): DateRangeFilter(), MultiSelectFilter(), SearchBar(), fetchEvents(), useEvents(), Events()

### Community 11 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 12 - "Sandbox.jsx"
Cohesion: 0.18
Nodes (13): initialMockServices, mockAiDiagnosis, mockIncident, mockTimelineEvents, SandboxIntegrations(), SandboxServices(), getColorClass(), getIconForType() (+5 more)

### Community 14 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 15 - "Implementation Plan: Correlation Timeline Enhancements"
Cohesion: 0.33
Nodes (5): Implementation Plan: Correlation Timeline Enhancements, Notes, Overview, Task Dependency Graph, Tasks

### Community 16 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 17 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 18 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 19 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 38 - "oncall-engineer/SKILL.md"
Cohesion: 0.06
Nodes (34): Architecture Reviews, Backend Expertise, Coding Standards, Communication Style, Core Responsibilities, Databases, Debugging Process, Decision Framework (+26 more)

### Community 39 - "Rewind.jsx"
Cohesion: 0.12
Nodes (18): EventCard(), getRiskColor(), ROLE_BADGE_LABELS, ROLE_BADGE_STYLES, LoadingState(), RewindAiDiagnosisPanel(), RewindIncidentBrief(), getIconForType() (+10 more)

## Knowledge Gaps
- **174 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GlobalGuard()` connect `App.jsx` to `dependencies`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `react` connect `dependencies` to `App.jsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Correctness Properties` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11100832562442182 - nodes in this community are weakly interconnected._