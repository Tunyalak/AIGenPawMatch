# Tooling & Quality Gates

- ESLint rules: `@angular-eslint` with recommended configs; fail CI on lint errors.
- TypeScript: `strict` true; disallow `any` unless justified.
- Prettier for formatting; single source of truth for style.
- Commit messages follow **Conventional Commits**.
- PRs must include:
  - checklist for a11y, performance, tests
  - before/after screenshots for UI changes