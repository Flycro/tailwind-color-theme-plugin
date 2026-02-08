import type { UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import colors from 'tailwindcss/colors'
import {
  defaultColors,
  generateTailwindThemeCSS,
  generateThemeCSS,
} from './generators'

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

export interface TailwindThemeOptions {
  colors?: Record<string, Color> & {
    primary?: Color
    secondary?: Color
    success?: Color
    info?: Color
    warning?: Color
    error?: Color
    neutral?: Color
  }
  customVariables?: Record<string, string>
  injectColors?: boolean
  prefix?: string
  extendTailwindTheme?: boolean
  includeSemanticColors?: boolean
  adaptiveShades?: boolean
}

export const TailwindThemePlugin = createUnplugin<TailwindThemeOptions | undefined>((options = {}) => {
  const config = defu(options, {
    colors: defaultColors,
    customVariables: {},
    injectColors: true,
    prefix: 'ui',
    extendTailwindTheme: true,
    includeSemanticColors: true,
    adaptiveShades: true
  })

  const plugins: UnpluginOptions[] = []

  if (config.extendTailwindTheme) {
    plugins.push({
      name: 'tailwind-theme:utilities',
      enforce: 'pre',
      async buildStart() {
        try {
          const fs = await import('fs')
          const path = await import('path')

          const themeCSS = generateTailwindThemeCSS(config.colors!, config.prefix, config.includeSemanticColors, config.adaptiveShades)
          const outputPath = path.resolve('node_modules/tailwind-color-theme-plugin/theme.css')

          fs.mkdirSync(path.dirname(outputPath), { recursive: true })
          fs.writeFileSync(outputPath, themeCSS)
        } catch (err) {
          console.warn('Failed to write theme.css for IntelliSense:', err)
        }
      },
      vite: {
        configResolved(resolvedConfig) {

        }
      },
      transform(code, id) {
        if (id.endsWith('.css') && code.includes('tailwind-color-theme-plugin/theme.css')) {
          const themeCSS = generateTailwindThemeCSS(config.colors!, config.prefix, config.includeSemanticColors, config.adaptiveShades)
          return code.replace('@import "tailwind-color-theme-plugin/theme.css";', themeCSS)
        }
        return null
      }
    })
  }

  plugins.push(tailwind() as unknown as UnpluginOptions)

  if (config.injectColors) {
    plugins.push({
      name: 'tailwind-theme:colors',
      resolveId(id) {
        if (id === 'virtual:tailwind-theme-colors') {
          return id
        }
      },
      load(id) {
        if (id === 'virtual:tailwind-theme-colors') {
          const css = generateThemeCSS(config.colors!, config.customVariables, config.prefix)
          return `
const css = ${JSON.stringify(css)};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-tailwind-theme', '');
  document.head.appendChild(style);
}

export default css;
`
        }
      }
    })
  }

  return plugins
})

export default TailwindThemePlugin.vite
