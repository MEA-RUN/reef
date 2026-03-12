# Reef - Nuxt Documentation Layer

> A reusable Nuxt layer for creating documentation sites with Docus

This project is configured as a Nuxt layer that provides components, composables, layouts, and pages for building beautiful documentation sites with Markdown and Vue components.

## ✨ Features

- 🎨 **Beautiful Design** - Clean, modern documentation theme
- 📱 **Responsive** - Mobile-first responsive design
- 🌙 **Dark Mode** - Built-in dark/light mode support
- 🔍 **Search** - Full-text search functionality
- 📝 **Markdown Enhanced** - Extended markdown with custom components
- 🎨 **Customizable** - Easy theming and brand customization
- ⚡ **Fast** - Optimized for performance with Nuxt 4
- 🔧 **TypeScript** - Full TypeScript support
- 🧩 **Reusable Layer** - Can be extended by other Nuxt projects

## 🚀 Using as a Nuxt Layer

### Installation

**Option 1: Local File System**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '../path/to/reef-dev'
  ]
})
```

**Option 2: Git Repository**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'github:your-username/reef-dev'
  ]
})
```

**Option 3: npm Package**
```bash
npm install reef
```
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'reef'
  ]
})
```

### Development Mode

To develop this layer standalone:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Your documentation site will be running at `http://localhost:3000`

## 📁 What This Layer Provides

When you extend this layer, your project will have access to:

### **Components**
- `MermaidChart.vue` - Render Mermaid diagrams
- `ToolSelector.vue` - Interactive tool selector
- `AppFooter.vue` / `AppHeader.vue` - Default header and footer
- `ProsePre.vue` - Enhanced code block component
- `Tools.vue` - MDC tools component

### **Composables**
- `useMobileLayout()` - Mobile layout detection and utilities
- `useSidePanel()` - Side panel state management
- `useSubjectTools()` - Subject-specific tool management

### **Layouts**
- `default.vue` - Default page layout
- `docs.vue` - Documentation-specific layout

### **Pages**
- Multi-language routes with `[[lang]]/[...slug].vue`

### **Assets & Styling**
- Pre-configured Tailwind CSS with custom Manta theme colors
- MDC syntax highlighting (Material Theme)

### **Configuration**
- Nuxt UI theme with custom colors
- MDC with code highlighting (bash, TypeScript, Vue, etc.)
- Mermaid diagram support

## ⚡ Built with

This layer extends and includes:

- [Nuxt 4](https://nuxt.com) - The web framework
- [Docus Layer](https://www.npmjs.com/package/docus) - Documentation theme base
- [Nuxt Content (@nuxtjs/mdc)](https://content.nuxt.com/) - Markdown components
- [Nuxt UI](https://ui.nuxt.com) - UI components
- [Nuxt Icon](https://nuxt.com/modules/icon) - Icon component
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Mermaid](https://mermaid.js.org/) - Diagram rendering

## 🎨 Customization in Your Project

When extending this layer, you can override any component, composable, or page:

```
your-project/
├── nuxt.config.ts       # Extends 'reef'
├── app/
│   ├── components/      # Override layer components
│   └── composables/     # Override layer composables
├── content/             # Your documentation content
└── public/              # Your static assets
```

Any file you create in your project will take precedence over the layer's files.

## 📖 Documentation

For detailed documentation on:
- **Using Nuxt Layers**: [Nuxt Layers Guide](https://nuxt.com/docs/guide/going-further/layers)
- **Docus theme customization**: [Docus Documentation](https://docus.dev)
- **Markdown content**: [Nuxt Content](https://content.nuxt.com/)

## 🚀 Deployment

When deploying a project that extends this layer:

```bash
npm run build
```

The built files will be in the `.output` directory, ready for deployment to any hosting provider that supports Node.js.

## 📄 License

[MIT License](https://opensource.org/licenses/MIT) 