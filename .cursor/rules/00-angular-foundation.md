# Angular Foundation (v20-ready)

**Goal:** Ensure generated/edited code follows Angular 20 conventions with standalone APIs, signals-first, and modern control-flow.

## Conventions
- Use **standalone components**; avoid NgModules for new code.
- Prefer **signals** over RxJS for local component state; expose computed signals for derived values.
- Use **inject()** for DI in components/services; avoid constructor parameters when not needed for readability.
- Prefer **OnPush/zoneless** patterns. When using zones, still avoid unnecessary change detection.
- Use **@defer**, **@if / @for / @switch** (Angular control flow) instead of *ngIf/*ngFor.
- Use **typed forms** with `NonNullableFormBuilder` and `FormControl<T>`.
- Prefer **functional route guards/resolvers**.
- Use **standalone TestBed** utilities for tests.

## File Structure
- `src/app/` uses feature-first structure.
  - `feature-x/` → `ui/`, `data-access/`, `feature/`, `util/` subfolders.
- Barrel files only where helpful; avoid deep re-export trees.

## Styling
- Use SCSS. Prefer tokens/variables and utility classes for spacing/size.
- Host-level styles live with the component (avoid global leakage).

## Accessibility
- All interactive elements must be reachable by keyboard and announced by screen readers (use ARIA only when native semantics are insufficient).