# Changesets

This repo uses Changesets to manage versions and releases (no CI).

Basic workflow:

- Add a changeset when you make a change that should trigger a release:
  - `pnpm changeset` (or `npx changeset`) and follow the prompts.
- When ready to release:
  - Run locally: `pnpm version` then `pnpm release`

Notes:

- Base branch is `master`
- Packages are discovered under `packages/*`
- Publishing uses `changeset publish`, which publishes all packages with version bumps
