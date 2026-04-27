# Contributing to riyal

Thanks for your interest in contributing! This monorepo ships the [`riyal`](https://www.npmjs.com/package/riyal) npm package — the Saudi Riyal currency symbol (U+20C1) as a web font, CSS, React, React Native, Web Components, Tailwind plugin, Next.js helper, OG cards, and a CLI.

## Prerequisites

- Node.js **>= 20**
- pnpm **9.12** (`corepack enable && corepack prepare pnpm@9.12.0 --activate`)

## Setup

```bash
git clone https://github.com/pooyagolchian/riyal.git
cd riyal
pnpm install
```

## Common scripts

| Goal              | Command                                  |
| ----------------- | ---------------------------------------- |
| Build everything  | `pnpm build`                             |
| Run tests         | `pnpm test`                              |
| Watch the package | `pnpm --filter riyal dev` |
| Type-check        | `pnpm typecheck`                         |
| Lint / Format     | `pnpm lint && pnpm format`               |
| Add a changeset   | `pnpm changeset`                         |

## Code style

- Biome (tab indent, double quotes, semicolons, trailing commas, line width 100).
- Strict TypeScript with `noUncheckedIndexedAccess`. Avoid `as`-casts.
- React components must be SSR-safe (no top-level `window`).
- Web Components must guard with `typeof customElements !== "undefined"`.
- Default locale is `en-SA`, RTL locale is `ar-SA`. VAT default is 15%.

## Adding a new entry point

1. Add `src/<name>/index.ts(x)`.
2. Wire it into `tsup.config.ts` as a new entry.
3. Add the matching subpath to `exports` in `packages/riyal-symbol/package.json`.
4. Re-export public types from the entry's `index`.
5. Add tests (`*.test.ts(x)`) next to the source.

## Pull requests

1. Branch from `main` (`feat/...`, `fix/...`, `docs/...`).
2. Run `pnpm lint && pnpm test && pnpm typecheck` locally.
3. Add a changeset (`pnpm changeset`) for any user-facing change.
4. Open a PR; CI must be green.

## Releases

Releases are automated via Changesets. Do **not** run `npm publish` manually; the `release` workflow on `main` handles versioning and publishing.

## Reporting issues

Open an issue at <https://github.com/pooyagolchian/riyal/issues> with a minimal repro.

By contributing you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
