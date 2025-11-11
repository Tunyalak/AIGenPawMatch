# How to Prompt the Assistant (for Angular in this repo)

When generating code, FOLLOW these constraints:
1. Prefer **standalone** components and **signals**.
2. Use **@if/@for** control flow; avoid legacy structural directives unless needed.
3. Type everything (models, inputs/outputs, HTTP responses).
4. For lists, include `track` in `@for` and move heavy transforms into TS using `computed()`.
5. Testing examples should use **standalone TestBed**.
6. Suggest **a11y** improvements with each UI change (labels, roles, focus mgmt).
7. Include **import paths** that match this project’s structure.
8. If a change increases bundle size, propose a **lazy** alternative.