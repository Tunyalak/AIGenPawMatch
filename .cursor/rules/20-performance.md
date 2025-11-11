# Performance & DX (Angular 19/20)

- Prefer **defer** blocks for below-the-fold content.
- Split routes by feature; leverage **standalone lazy loading**.
- Use **track by** keys in `@for` loops for large lists.
- Avoid heavy pipes; compute once in TS (signals/computed).
- Memoize expensive transforms with **computed()**.
- Images: define intrinsic sizes, lazy load non-critical images.
- Keep change detection cheap; push events from handlers to signals, don’t recalc in template expressions.