# Reef

Reef is the reusable Nuxt layer that powers Manta Academy subject websites. It
extends [Docus](https://docus.dev) with the layouts, components, localization,
and interactive tool panel needed by the subject publishing workflow.

Students normally do not install or configure Reef directly. They create a
repository from [`subject-template`](https://github.com/MEA-RUN/subject-template),
write Markdown, configure optional tools, and push to `main`. The shared GitHub
Actions workflow builds and publishes the resulting site to the same
repository's `gh-pages` branch.

## Repository roles

| Repository | Purpose |
| --- | --- |
| [`reef`](https://github.com/MEA-RUN/reef) | Nuxt layer containing the subject UI and runtime behavior |
| [`subject-template`](https://github.com/MEA-RUN/subject-template) | Student-facing repository template |
| [`reef-site-template`](https://github.com/MEA-RUN/reef-site-template) | Minimal, machine-facing Nuxt application used during builds |
| [`actions`](https://github.com/MEA-RUN/actions) | Reusable workflow that assembles and deploys a subject site |
| [`tool-template`](https://github.com/MEA-RUN/tool-template) | Starting point for standalone interactive tools |

## Features

- Docus-based documentation pages and navigation
- Markdown content powered by Nuxt Content
- Optional English and French routes
- Mermaid diagrams and enhanced code blocks
- Responsive split-screen panel for interactive tools
- GitHub Pages-compatible asset and iframe paths
- Manta Academy branding with overridable Nuxt components and app config

## Localization

Reef detects localized content from the consuming project's directory
structure:

- `content/en` enables English;
- `content/fr` enables French;
- both directories enable the locale switcher;
- when neither directory exists, the i18n module is not loaded.

This keeps single-language subject sites free of unnecessary locale prefixes
and configuration.

## Interactive tools

The deployment workflow generates `public/tools/manifests.json` from the
subject repository's `metadata.yml`. A Markdown page can open a configured tool
in Reef's right-hand panel with the `tools` MDC component:

```mdc
:::tools{id="match"}
Open the matching tool
:::
```

Tools may come from a public GitHub repository or from a local directory in the
subject repository. See the
[`subject-template` documentation](https://github.com/MEA-RUN/subject-template)
for the manifest format.

## Using Reef as a Nuxt layer

The publishing workflow uses the dedicated site base, but Reef can also be
extended directly by another Nuxt application:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['github:MEA-RUN/reef'],
})
```

Files in the consuming project take precedence over files provided by the
layer, so its components, layouts, pages, public assets, and app configuration
can be overridden through standard Nuxt layer conventions.

## Development

Reef uses Bun 1.4:

```bash
bun install --frozen-lockfile
bun run dev
```

The development server is available at `http://localhost:3000`. Run the full
production build before submitting a change:

```bash
bun run build
```

The build output is written to `.output`.

## Main dependencies

- [Nuxt](https://nuxt.com)
- [Docus](https://docus.dev)
- [Nuxt Content](https://content.nuxt.com)
- [Nuxt UI](https://ui.nuxt.com)
- [Nuxt i18n](https://i18n.nuxtjs.org)
- [Mermaid](https://mermaid.js.org)

## License

Reef is available under the [MIT License](./LICENSE).
