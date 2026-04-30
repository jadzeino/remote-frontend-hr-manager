# People Manager — Remote Frontend Challenge

A production-grade HR people-management SPA built for the Remote.com frontend code exercise.
Live demo: **[remote-frontend-hr-manager.vercel.app](https://remote-frontend-hr-manager.vercel.app)**

---

## What the challenge asked

> Finish the "People" page — search, filter, paginate, and display a list of team members. Bonus: ship at least one extra feature.

The original repo contained a partially-built starter: a bare table with a basic `name_like` search and no pagination state, no error handling, and no visual design beyond the skeleton components. Everything beyond that is my addition.

---

## Feature highlights

| Area | What was built |
|---|---|
| **Table** | Sortable columns (name, salary, country), sticky header, row-click drawer |
| **Pagination** | Page-size selector (10 / 25 / 50), URL-synced page state, prefetch of next page |
| **Infinite scroll** | Toggle between paginated table and infinite-scroll view |
| **Filtering** | Multi-status checkboxes, country dropdown, role dropdown, salary range with currency selector |
| **Search** | Debounced full-text search, disabled while fetching |
| **Grouping** | Group rows by Department, Employment Type, or Job Title — collapsible sections |
| **Saved filters** | Name, save, and restore any filter combination from localStorage |
| **Export** | Download the current filtered set as CSV or XLSX — respects all active filters |
| **Analytics bar** | Live stat cards (Active / Onboarding / Offboarded counts) that double as status-toggle buttons |
| **Add member modal** | Validated form (react-hook-form + zod) to add a new team member |
| **Person drawer** | Slide-in detail view for every row |
| **Dark / light theme** | System-aware toggle, persisted in localStorage |
| **404 page** | Graceful fallback for unknown routes |
| **Error boundaries** | Page-level and section-level boundaries with friendly fallbacks |
| **Skeleton loading** | Shimmer placeholders for table rows and analytics cards |
| **Accessibility** | Keyboard navigation, focus trapping in modals/drawers, ARIA roles, sr-only labels |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Styled Components v6 |
| Data fetching | TanStack Query v5 (stale-while-revalidate, background prefetch) |
| Routing | React Router v7 |
| Forms | react-hook-form v7 + Zod v4 |
| Virtualisation | TanStack Virtual v3 (infinite-scroll mode) |
| Export | xlsx library |
| Testing | Vitest + Testing Library + Playwright (e2e) |
| Components | Storybook v10 with a11y addon |
| Build | Vite 6 + SWC |
| Mock API | json-server v0 |
| CI | GitHub Actions (lint → typecheck → unit → e2e) |

---

## Project structure

```
src/
├── app/               # Router shell + app header
├── features/people/   # All People-page logic (atomic design)
│   ├── components/    # UI slices — AnalyticsBar, PeopleFilters, TableCard, …
│   ├── hooks/         # usePeopleQuery, usePeopleFilters, usePeopleInfinite, …
│   ├── services/      # peopleApi (fetch wrappers)
│   ├── types/         # Shared domain types
│   └── utils/         # exportData, formatSalary, grouping, sanitize, …
├── pages/             # Route-level page shells (add-edit, not-found)
├── shared/
│   ├── hooks/         # useIntersectionObserver, useLocalStorage, useColorScheme
│   └── ui/            # Generic shared components (Badge, Drawer, Modal, …)
├── theme/             # Design tokens, typography, dark/light palettes
├── types/             # Global domain types (Person)
└── ui-kit/            # Primitive components (Button, Table, Pagination, …)
```

---

## Getting started

### Requirements
- Node.js >= 18
- npm >= 10

### Run locally

```bash
npm install        # also generates the mock server data via postinstall
npm run dev        # starts Vite dev server + json-server in parallel
```

App: `http://localhost:5173`
API: `http://localhost:4002/people`

### Other scripts

```bash
npm run health       # lint + type-check + unit tests (all in parallel)
npm run test         # vitest in watch mode
npm run test:e2e     # Playwright end-to-end tests
npm run storybook    # Storybook component explorer on :6006
```

---

## API

The mock API is [json-server v0](https://github.com/typicode/json-server/tree/v0.17.4), generated on `npm install`.

Key endpoint used:

```
GET http://localhost:4002/people
  ?_page=1&_limit=25
  &name_like=alice
  &status_like=active|onboarding
  &country=Germany
  &jobTitle=Engineer
  &_sort=name&_order=asc
  &salary_gte=50000&salary_lte=120000&currency=USD
```

`X-Total-Count` response header drives pagination.

---

## Testing

```bash
npm run health-test          # unit tests with coverage
npm run test:e2e             # Playwright e2e suite
```

Coverage thresholds (vitest): statements 60%, branches 50%, functions 60%.

---

## CI

GitHub Actions runs on every push/PR to `main`:
1. Lint (`eslint`)
2. Type-check (`tsc`)
3. Unit tests (`vitest`)
4. E2E tests (`playwright` — Chromium)

Playwright report is uploaded as an artifact on failure.

---

## Deployment

The app is deployed to Vercel at [remote-frontend-hr-manager.vercel.app](https://remote-frontend-hr-manager.vercel.app).

> **Note:** The json-server mock API is a local-only development server and is not deployed. The live demo will show empty data or a connection error unless the API is replaced with a real backend.

---

## Original challenge instructions

<details>
<summary>Show original README</summary>

Hello there!

If you're reading this, it means you're now at the coding exercise step of our engineering hiring process.
We're really happy that you made it here and super appreciative of your time!

In this exercise you're asked to complete a feature in an existing React app.

If you have any questions, don't hesitate to reach out directly to [code_exercise@remote.com](mailto:code_exercise@remote.com).

**About the challenge:** This app shows a list of team members. Someone else started it, but they had an unexpected family emergency. You'll need to take it over and ship it!

**Expectations:**
- Finish the "People" page.
- Bonus: Add a new small feature of your choice to the app.
- It should be production-ready code.
- Walk us through your solution in a short video (5–10 min).

</details>

---

See [SOLUTION.md](SOLUTION.md) for a detailed write-up of the approach, trade-offs, and the production roadmap.
