# Solution write-up

## How I approached the challenge

When I picked up the repo the starter had a table that rendered a flat list of people with a `name_like` search — no pagination state, no filter composition, no error handling, and no design beyond the raw components. My first move was to understand the full surface area of the Figma spec before writing a single line of feature code.

From there I worked outside-in:

1. **Data layer first** — locked down the API contract with json-server, wrote the `peopleApi` service with proper query-string composition, and wrapped everything in TanStack Query so I never had to write loading/error state by hand.
2. **Filter state as the single source of truth** — all filters live in the URL via `useSearchParams`. That gives browser history, shareable links, and correct back-button behaviour for free.
3. **UI components as consumers** — every UI component is a pure consumer of the filter state; it dispatches actions, it never owns state.

---

## Technical decisions

### TanStack Query for data fetching

The starter used raw `useEffect` + `useState`. I replaced it with TanStack Query because:
- **Stale-while-revalidate** — the table stays populated during refetches instead of flashing a spinner.
- **Background prefetch** — after the current page loads, I prefetch the next one so pagination feels instant.
- **Deduplication** — the AnalyticsBar shares the same cache key as the table, so switching tabs costs zero extra requests.
- **Infinite scroll** — `useInfiniteQuery` handles cursor management; I only needed a `useIntersectionObserver` sentinel at the bottom of the list.

### URL as filter state

Every filter — search, status, country, salary range, sort, page — is stored in `URLSearchParams`. This means:
- Refreshing the page restores the exact view.
- Sharing a URL shares the exact filtered view.
- Browser back/forward works as expected.

The only exception is `viewMode` (table vs infinite scroll) which I intentionally kept in component state — it's a UI preference, not a shareable data state.

### Salary filter design

The salary filter has a non-obvious complexity: the json-server `_gte` / `_lte` operators are field-level, but salary values are stored as numbers while the currency is a separate field. I solved this by:
1. Filtering by `currency` as an exact match (or "All" to skip).
2. Filtering `salary_gte` / `salary_lte` only when both handles are moved off the defaults.
3. The Apply button is deliberately disabled until the user changes at least one value — avoids accidental no-op filter applications.

### Saved filters

Saved filters are persisted to `localStorage` via a custom `useLocalStorage` hook. Each entry stores the full filter payload (search, statuses, country, role, salary range, groupBy). Constraints:
- Maximum 10 saved filters (shown as disabled state in the UI).
- Case-insensitive duplicate name detection.
- The active saved filter name appears in the trigger button.

### Export (bonus feature)

The export fetches **all matching records** (no pagination) by calling the API without `_page` / `_limit`. I expose CSV and XLSX via a split-button format picker. The `xlsx` library handles both formats from the same in-memory data structure. The export always respects the currently active filters.

### Grouping

Client-side grouping runs as a pure transform over the page data. I chose client-side because:
- The mock API has no server-side grouping capability.
- The grouped data is always a subset of the paginated response — no extra requests.
- The grouping key (department, employment type, job title) is determined at render time, so the transform is O(n) over the current page.

Trade-off: with a real API I would push grouping to the server and use `GROUP BY` with aggregate counts, not client-side transforms.

### Component architecture (atomic design)

```
ui-kit/          ← atoms: Button, Table, Pagination, SearchInput, …
shared/ui/       ← molecules: Badge, Drawer, Modal, FilterChip, …
features/people/components/  ← organisms: PeopleFilters, TableCard, AnalyticsBar, …
features/people/page.tsx     ← page template
```

This keeps each layer independently testable and story-book-able. Every `ui-kit` primitive has a `.stories.tsx` and a `.test.tsx`.

---

## Accessibility

- **Focus trapping** in the modal and drawer via a custom `trapFocus` utility — Tab cycles within the overlay, Escape closes it.
- **sr-only labels** on icon buttons (sort arrows, close buttons, theme toggle).
- **ARIA roles**: the drawer uses `role="dialog"` + `aria-modal="true"`, the analytics bar uses `role="status"` for live regions.
- **Keyboard sort**: sort headers are `<button>` elements that cycle `asc → desc → none` on Enter/Space.
- **Color contrast**: all foreground/background token pairs meet WCAG AA (4.5:1) in both light and dark themes.
- Tested with the Storybook `@storybook/addon-a11y` plugin on every primitive.

---

## Trade-offs made

| Decision | What I chose | What I traded away |
|---|---|---|
| Filter state location | URL params | Simpler `useState` — but URL is strictly better for UX |
| Grouping | Client-side | Zero extra requests; loses server aggregates at scale |
| Export | Fetch-all then write | Simple; breaks for very large datasets (>50k rows) |
| Mock API | json-server regex for OR-status | Works; a real API would use proper query arrays |
| Dark mode | CSS variables + data-theme attr | Could have used SC ThemeProvider fully; CSS vars are faster at runtime |
| Infinite scroll | TanStack Virtual + useInfiniteQuery | Higher complexity than a simple list; correct at scale |

---

## Scaling toward production

### Replace the mock API

The `peopleApi.ts` service is the only file that knows about json-server. Swapping it for a real REST or GraphQL endpoint requires changing only that file — all hooks and components consume typed domain objects.

### Auth & multi-tenancy

Add an auth provider above `<App />` and thread a tenant ID through the query keys. TanStack Query's per-query cache means different tenants never share data.

### Virtualisation at scale

The table currently renders all rows in the DOM. For >500 rows, switch the paginated view to use TanStack Virtual as well (already in use for infinite scroll).

### Real export pipeline

For datasets >10k rows, move export to a server job: client sends filter params → server streams a presigned S3 URL → client polls and downloads. The `exportPeople` util is already isolated so this is a one-file change.

### Saved filters backend sync

Right now saved filters live in `localStorage` (device-local). To make them per-user, POST them to a `/me/saved-filters` endpoint and swap `useLocalStorage` for a TanStack Query mutation — the `useSavedFilters` hook is the only change point.

### Observability

Add `@opentelemetry/sdk-web` for Core Web Vitals instrumentation. The TanStack Query `onError` callbacks are already the right place to send error events to a logging service.

### SSR / SEO

This is a client-rendered SPA — fine for an internal HR tool. For a public-facing directory, migrate to React Router's data loaders (already using v7) or Next.js App Router. The data layer (TanStack Query + service layer) is portable.

---

## If I had more time

- **Real e2e test coverage** — the Playwright suite covers the happy path; I'd add filter, export, and error-boundary tests.
- **Optimistic updates** for Add Member — show the new row immediately, roll back on API failure.
- **Keyboard shortcuts** — `Cmd+K` search focus, `Cmd+E` export, `Cmd+S` save filter.
- **Column visibility toggle** — let users hide columns they don't need.
- **Bulk actions** — select multiple rows for export or status change.
- **Full Storybook coverage** — stories exist for primitives; organism stories (PeopleFilters, TableCard) still need mocked query providers.
- **Migrate colors to SC ThemeProvider** — CSS variables work but are untyped; typed theme tokens would catch mis-spelt variable names at compile time.

---

## AI usage

I used Claude as a pair-programming accelerator throughout:
- Generating boilerplate (styled-component wrappers, test scaffolds).
- Sanity-checking API query string composition for json-server edge cases.
- Suggesting accessible ARIA patterns for focus trapping.
- Writing the xlsx export utility.

All architecture decisions, component structure, and trade-offs are mine. AI saved ~30% of the time on mechanical tasks, letting me focus on the product decisions that matter.
