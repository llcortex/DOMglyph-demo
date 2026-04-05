# domglyph-demo

`domglyph-demo` is a standalone sample application that shows how an outside consumer would use DOMglyph in a normal React project. It is intentionally small, but it still includes the full loop: install packages, render AI-readable UI, inspect the runtime, and validate the contract in tests.

The demo screen is a simple customer account management flow with:

- a profile form
- a preferences section
- a recent orders table
- status feedback banners
- a delete confirmation dialog
- a runtime debug panel
- an AI View toggle that reveals the `data-ai-*` metadata in the UI

## What this repo teaches

This project is meant to answer the practical beginner questions:

- What do I install?
- What does a DOMglyph screen look like in a real app?
- Where do the `data-ai-*` attributes come from?
- How does the runtime know what actions and forms exist?
- How do I test that my UI stays AI-readable?

## Packages used

| Package | How this demo uses it |
| --- | --- |
| `@domglyph/tokens` | Seeds the app theme with the published `colorTokens` from DOMglyph. |
| `@domglyph/primitives` | Provides layout and low-level building blocks like `Box`, `Stack`, `Text`, `ButtonBase`, and `InputBase`. |
| `@domglyph/components` | Provides higher-level UI like `ActionButton`, `FormField`, `StatusBanner`, `ConfirmDialog`, and `DataTable`. |
| `@domglyph/ai-contract` | Adds explicit `data-ai-*` attributes and semantic roles/states to screens, sections, fields, and actions. |
| `@domglyph/runtime` | Installs the browser runtime so the app can expose screen context, form schema, actions, and recent events. |
| `@domglyph/testing` | Validates AI metadata and component compliance inside Vitest tests. |

## Project structure

```txt
domglyph-demo/
  src/
    app/
      App.tsx
      main.tsx
    components/
      AIInspectorToggle.tsx
      CustomerProfileForm.tsx
      MetadataPill.tsx
      OrdersTable.tsx
      PreferencesCard.tsx
      RuntimeDebugPanel.tsx
    data/
      mockCustomer.ts
      mockOrders.ts
    styles/
      theme.css
    tests/
      app.test.tsx
      setup.ts
    types/
      global.d.ts
  README.md
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

## Install and run

Normal consumer usage:

```bash
pnpm install
pnpm dev
```

If you prefer npm:

```bash
npm install
npm run dev
```

Build and test:

```bash
pnpm build
pnpm test
```

## How the app is configured

### 1. Install the published packages

The demo uses published package versions `2.1.0`:

```json
{
  "@domglyph/ai-contract": "2.1.0",
  "@domglyph/components": "2.1.0",
  "@domglyph/primitives": "2.1.0",
  "@domglyph/runtime": "2.1.0",
  "@domglyph/testing": "2.1.0",
  "@domglyph/tokens": "2.1.0"
}
```

That is the important point of this repo: it consumes DOMglyph the way an external adopter would, through package imports.

### 2. Bootstrap the runtime

[`src/app/main.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/app/main.tsx) installs the runtime when the app loads:

```ts
const runtime = installDOMglyphRuntime(window);

if (runtime) {
  window.__DOMGLYPH__ = runtime;
}
```

Important detail: `@domglyph/runtime@1.1.0` installs `window.DOMGLYPH__`. This demo also assigns `window.__DOMGLYPH__` as a friendly alias because that is an easy console shape to teach in examples.

### 3. Annotate the screen and sections

[`src/app/App.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/app/App.tsx) uses `createAIAttributes(...)` from `@domglyph/ai-contract` to mark:

- the main screen as `customer-profile`
- the entity as `customer`
- the entity id as `customer-001`
- each major region as a named section

That is what lets the runtime answer questions like “what screen is visible?” and “what actions are available here?”

### 4. Mix primitives and components

The demo intentionally uses both layers:

- primitives for layout, search input, and utility controls
- higher-level components for the main form, actions, banners, dialog, and table

That keeps the package roles clear for a new adopter.

### 5. Theme with tokens

[`src/app/App.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/app/App.tsx) combines:

- `primitiveTheme` from `@domglyph/primitives`
- `colorTokens` from `@domglyph/tokens`
- a few local CSS variables for spacing and typography

Why the local variables? In `@domglyph/tokens@1.1.0`, the public token export is currently `colorTokens`. This demo uses those published colors directly and layers local spacing/typography values around them so the UI still feels complete and readable.

## What the screen includes

### Profile form

[`src/components/CustomerProfileForm.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/components/CustomerProfileForm.tsx) demonstrates:

- `FormField`
- required fields
- validation feedback
- form-level metadata
- a submit action with explicit intent

### Preferences section

[`src/components/PreferencesCard.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/components/PreferencesCard.tsx) demonstrates:

- a second form on the same screen
- section-level metadata
- native select fields with explicit `data-ai-*`
- a second save action

### Recent orders table

[`src/components/OrdersTable.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/components/OrdersTable.tsx) demonstrates:

- `DataTable`
- row-level entity ids
- table metadata
- a direct `InputBase` filter field

### Status and delete flow

[`src/app/App.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/app/App.tsx) demonstrates:

- `StatusBanner`
- success and error feedback
- `ConfirmDialog`
- destructive action metadata

## Runtime inspection

The runtime debug panel in the UI reads:

- `getScreenContext()`
- `getAvailableActions()`
- `getRecentEvents()`
- `getFormSchema("customer-profile-form")`

You can also run these directly in the browser console:

```js
window.__DOMGLYPH__.getScreenContext()
window.__DOMGLYPH__.getAvailableActions()
window.__DOMGLYPH__.getRecentEvents()
window.__DOMGLYPH__.getFormSchema("customer-profile-form")
```

The panel is implemented in [`src/components/RuntimeDebugPanel.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/components/RuntimeDebugPanel.tsx).

## AI View

Use the “Show AI View” toggle in the app header.

When enabled, the screen reveals inline metadata pills showing values like:

- `data-ai-id`
- `data-ai-role`
- `data-ai-action`
- `data-ai-state`
- `data-ai-screen`
- `data-ai-section`

This makes the contract visible without opening DevTools, which is useful when you are first learning how domglyph markup works.

## What AI sees

This is the general shape of the rendered markup:

```html
<main
  data-ai-id="customer-profile-screen"
  data-ai-role="screen"
  data-ai-screen="customer-profile"
  data-ai-entity="customer"
  data-ai-entity-id="customer-001"
>
  <form
    id="customer-profile-form"
    data-ai-id="customer-profile-form"
    data-ai-role="form"
    data-ai-section="profile-form"
  >
    <input
      id="customer-email"
      data-ai-id="customer-email"
      data-ai-role="field"
      data-ai-field-type="email"
      data-ai-required="true"
    />

    <button
      data-ai-id="save-profile-button"
      data-ai-role="action"
      data-ai-action="save-profile"
    >
      Save profile
    </button>
  </form>
</main>
```

## Testing and validation

[`src/tests/app.test.tsx`](/Users/nishchay/Desktop/Workspace/DOMglyph-demo/src/tests/app.test.tsx) shows a few small but useful patterns:

- assert that important elements expose `data-ai-*`
- validate a node with domglyph matchers
- run component compliance checks
- verify that the runtime registers actions and extracts a form schema

This is intentionally not a huge test suite. The goal is to show the testing shape a consumer app would start with.

## Architecture

```txt
React screen and forms
  ↓
domglyph primitives and components
  ↓
data-ai-* contract from @domglyph/ai-contract
  ↓
Runtime discovery via @domglyph/runtime
  ↓
Debug panel, console inspection, and tests
```

## Local development with unreleased domglyph packages

For normal usage, stick to the published `1.1.0` versions in `package.json`.

If you need to test this demo against a local domglyph checkout, use one of these approaches:

### Option 1. `pnpm link`

In the domglyph package repo:

```bash
cd path/to/domglyph
pnpm --filter @domglyph/components link --global
pnpm --filter @domglyph/primitives link --global
pnpm --filter @domglyph/ai-contract link --global
pnpm --filter @domglyph/runtime link --global
pnpm --filter @domglyph/testing link --global
pnpm --filter @domglyph/tokens link --global
```

In this repo:

```bash
pnpm link --global @domglyph/components
pnpm link --global @domglyph/primitives
pnpm link --global @domglyph/ai-contract
pnpm link --global @domglyph/runtime
pnpm link --global @domglyph/testing
pnpm link --global @domglyph/tokens
```

### Option 2. `file:` dependencies

Point each dependency at the built package directory from your local domglyph checkout. This is useful if you want the dependency source to be obvious in `package.json`.

## How this helps someone start building with domglyph

This demo shows the core idea clearly:

- components are still ordinary React components
- AI-readable semantics live in stable `data-ai-*` attributes
- actions and fields carry explicit intent instead of only visual labels
- runtime APIs make the UI inspectable from the outside
- tests can validate the contract before regressions ship

If you wanted to build a new screen from scratch, the pattern is:

1. Create a screen root with `data-ai-screen`, `data-ai-entity`, and `data-ai-entity-id`.
2. Group important regions with `data-ai-section`.
3. Render actions and fields with domglyph components or explicit `createAIAttributes(...)`.
4. Install the runtime once at app startup.
5. Add tests for the important metadata and runtime behavior.

## Common extension points

- Add another screen by creating a new root with a different `data-ai-screen` value.
- Add a new action by rendering an `ActionButton` with a stable action id.
- Add a new table by giving `DataTable` a distinct `entity` and row ids.
- Add custom fields by using `createAIAttributes(...)` on native inputs or your own components.

## Next steps

After you understand this repo, move on to:

- domglyph package documentation
- `PHILOSOPHY.md`
- additional package-level examples
- your own first screen, starting from the profile form in this demo
