# Testing

- Use **Jest** or **Vitest**; prefer TestBed with standalone components.
- Test public API & interaction, not private internals.
- For components, test:
  - render of critical states
  - input/output behavior
  - accessibility roles/labels
- For services, test:
  - pure logic sync tests first
  - HTTP via HttpTestingController
- Aim for fast, isolated tests; e2e reserved for user-critical flows.