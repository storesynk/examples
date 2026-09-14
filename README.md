# Storesynk Examples

Example storefronts built with [Storesynk](https://storesynk.com): Shopify commerce rendered
with the `@storesynk/*` web components on the framework of your choice.

Each example is a standalone project with its own `package.json`, lockfile and README. There
is no shared workspace, so you can copy, fork or import any folder on its own.

## Examples

| Example | Stack | Packages |
| --- | --- | --- |
| [`nextjs`](./nextjs) | Next.js 16 (App Router), React 19, Tailwind 4 | `@storesynk/next`, `@storesynk/core` |

## Requirements

- Node 24
- A Shopify store with the [Headless](https://apps.shopify.com/headless) sales channel
  installed, and its store domain plus **public** Storefront API token
- The Storesynk app installed on the store, for bundles, volume discounts, add-ons and other
  offers to show up

## Getting started

```sh
cd nextjs
cp .env.example .env.local   # set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN
npm ci
npm run dev                  # http://localhost:3000
```

Each example's README covers its full setup, including running it in a CodeSandbox Devbox.

## Adding an example

Create a new top-level folder that installs and runs on its own. Pin `@storesynk/*` to
published versions (no `workspace:` or `file:` links), include a `.env.example`, a README,
and a `.codesandbox/tasks.json` if it should open in CodeSandbox. Then add a row to the
table above.
