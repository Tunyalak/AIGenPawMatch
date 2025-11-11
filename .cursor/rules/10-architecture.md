# Architecture & State

## Components
- Keep components **presentational** vs **container** where it helps clarity.
- Inputs/Outputs must be **typed**. Use signals-based `@Input()` when appropriate.
- Avoid passing observables deep into templates; map them to signals at the boundary.

## Services & Data Access
- HTTP logic lives in `data-access` services. Use Angular `HttpClient` with **typed** responses.
- Use **interceptors** for cross-cutting concerns (auth header, error mapping, retry).
- Avoid tight coupling; use interfaces for models, prefer composition over inheritance.

## State
- Local UI state → **signals**.
- Cross-feature/shared state → choose minimal solution (signals + services). Only use NgRx if you truly need global event-driven state.
- For async, prefer `fromObservable` to convert to signals when needed.

## Routing
- Use **standalone routes** with lazy loading.
- Co-locate route files with the feature folder.