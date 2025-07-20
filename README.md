# Tailwind Color Theme Plugin

A reusable Vite plugin for Tailwind CSS 4 theming with dynamic color configuration. Inspired by Nuxt UI's theming system and made framework-agnostic.

## Features

- Dynamic color theming with CSS variables
- Built-in dark/light mode support with adaptive shade shifting
- Semantic color utilities (text-default, bg-muted, border-accented)
- Custom CSS variables injection
- Framework agnostic (works with Vue, React, Svelte, etc.)
- Powered by Vite and Unplugin
- TypeScript support
- User @theme override detection

## Installation

```bash
npm install tailwind-color-theme-plugin
```

## Basic Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindTheme from 'tailwind-color-theme-plugin'

export default defineConfig({
  plugins: [
    tailwindTheme({
      colors: {
        primary: 'sky',
        secondary: 'purple',
        success: 'green',
        warning: 'orange',
        error: 'red',
        neutral: 'gray'
      }
    })
  ]
})
```

### CSS Setup

Import Tailwind and the theme CSS:

```css
/* src/style.css */
@import "tailwindcss";
@import "tailwind-color-theme-plugin/theme.css";
```

Override colors using Tailwind 4's @theme syntax:

```css
@theme static {
  --color-green-500: #00FFFF;
  --color-green-600: #00E6E6;
}
```

## Configuration Options

```typescript
interface TailwindThemeOptions {
  colors?: {
    primary?: string
    secondary?: string
    success?: string
    info?: string
    warning?: string
    error?: string
    neutral?: 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  }
  customVariables?: Record<string, string>
  injectColors?: boolean
  prefix?: string
  extendTailwindTheme?: boolean
  includeSemanticColors?: boolean
  adaptiveShades?: boolean
}
```

### Configuration Options

- `colors` - Theme color configuration using Tailwind color names
- `customVariables` - Additional CSS variables to inject
- `injectColors` - Whether to inject colors via JavaScript (default: true)
- `prefix` - CSS variable prefix (default: 'ui')
- `extendTailwindTheme` - Enable Tailwind theme extension (default: true)
- `includeSemanticColors` - Include semantic utilities (default: true)
- `adaptiveShades` - Enable adaptive shade shifting in dark mode (default: true)

## Using Theme Colors

### Tailwind Utilities

```html
<!-- Theme colors with shades -->
<button class="bg-primary-500 text-white">Primary Button</button>
<div class="text-secondary-600 border-success-300">Colored content</div>

<!-- Adaptive colors (automatically shift shades in dark mode) -->
<button class="bg-primary text-inverted">Adaptive Button</button>
<div class="text-secondary border-success">Adaptive content</div>

<!-- Semantic utilities -->
<p class="text-default">Default text</p>
<p class="text-muted">Muted text</p>
<div class="bg-elevated border-default">Elevated card</div>
<div class="bg-muted border-accented">Muted card</div>
```

### Generated CSS Variables

```css
/* Theme colors */
--ui-primary: /* adaptive primary color */
--ui-secondary: /* adaptive secondary color */
--ui-color-primary-500: /* primary 500 shade */

/* Semantic colors */
--ui-text: /* default text color */
--ui-text-muted: /* muted text color */
--ui-bg: /* default background */
--ui-bg-elevated: /* elevated background */
--ui-border: /* default border color */
```

## Dark Mode & Adaptive Shades

The plugin automatically handles dark mode with adaptive shade shifting:

- **Light mode**: Primary uses shade 500
- **Dark mode**: Primary uses shade 400 (lighter for better contrast)

Toggle dark mode:

```javascript
document.documentElement.classList.toggle('dark')
```

Disable adaptive shades:

```typescript
tailwindTheme({
  adaptiveShades: false // Use same shade in both light and dark mode
})
```

## Semantic Color System

Framework-agnostic semantic utilities:

### Text Colors
- `text-default` - Primary text
- `text-muted` - Secondary text  
- `text-toned` - Subtle text
- `text-dimmed` - Disabled text
- `text-highlighted` - Emphasized text
- `text-inverted` - Inverted text

### Background Colors
- `bg-default` - Default background
- `bg-muted` - Muted background
- `bg-elevated` - Elevated/card background
- `bg-accented` - Accented background
- `bg-inverted` - Inverted background

### Border Colors
- `border-default` - Default border
- `border-muted` - Muted border
- `border-accented` - Accented border
- `border-inverted` - Inverted border

## Custom Variables

Inject additional CSS variables:

```typescript
tailwindTheme({
  customVariables: {
    'border-radius': '0.5rem',
    'font-family': '"Inter", sans-serif',
    'spacing-unit': '4px'
  }
})
```

Available as `--ui-border-radius`, `--ui-font-family`, etc.

## User Theme Overrides

The plugin automatically detects user @theme overrides and excludes those colors from generation:

```css
@theme static {
  --color-green-500: #00FFFF;
  --color-green-600: #00E6E6;
}
```

## Example Project

Check out the `example/` directory for a complete implementation showing:

- Color palette showcase
- Semantic design system demonstration
- Dark mode functionality
- Dynamic theme switching with ThemePicker component
- Tailwind 4 @theme syntax usage

The example includes a ThemePicker component that demonstrates how to build dynamic color switching functionality.

## Framework Integration

### Vue.js

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindTheme from 'tailwind-color-theme-plugin'

export default defineConfig({
  plugins: [vue(), tailwindTheme()]
})
```

### React

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindTheme from 'tailwind-color-theme-plugin'

export default defineConfig({
  plugins: [react(), tailwindTheme()]
})
```

### Svelte

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindTheme from 'tailwind-color-theme-plugin'

export default defineConfig({
  plugins: [svelte(), tailwindTheme()]
})
```

## Requirements

- Vite 6.0+ or 7.0+
- Tailwind CSS 4.0+
- Node.js 18+

## Repository

- **GitHub**: [https://github.com/Flycro/tailwind-color-theme-plugin](https://github.com/Flycro/tailwind-color-theme-plugin)
- **NPM**: [https://www.npmjs.com/package/tailwind-color-theme-plugin](https://www.npmjs.com/package/tailwind-color-theme-plugin)

## License

MIT