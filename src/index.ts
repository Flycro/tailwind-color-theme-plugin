import { normalize } from 'pathe'
import type { UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import colors from 'tailwindcss/colors'

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

const defaultColors = {
  primary: 'green',
  secondary: 'blue', 
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
} as const

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

function getColor(color: keyof typeof colors, shade: typeof shades[number]): string {
  if (color in colors && typeof colors[color] === 'object' && shade in colors[color]) {
    return colors[color][shade] as string
  }
  return ''
}

function generateShades(key: string, value: string, prefix: string = 'ui', skipDefaults: boolean = false) {
  return `${shades.map(shade => {
    const colorVar = `--color-${value === 'neutral' ? 'old-neutral' : value}-${shade}`
    if (skipDefaults) {
      return `--${prefix}-color-${key}-${shade}: var(${colorVar});`
    } else {
      const fallbackColor = getColor(value as keyof typeof colors, shade)
      return `--${prefix}-color-${key}-${shade}: var(${colorVar}${fallbackColor ? `, ${fallbackColor}` : ''});`
    }
  }).join('\n  ')}`
}

function generateColor(key: string, shade: number, prefix: string = 'ui') {
  return `--${prefix}-${key}: var(--${prefix}-color-${key}-${shade});`
}

function generateUIVariables(prefix: string = 'ui') {
  return `  --${prefix}-text: var(--${prefix}-color-neutral-900);
  --${prefix}-text-dimmed: var(--${prefix}-color-neutral-400);
  --${prefix}-text-muted: var(--${prefix}-color-neutral-600);
  --${prefix}-text-toned: var(--${prefix}-color-neutral-700);
  --${prefix}-text-highlighted: var(--${prefix}-color-neutral-950);
  --${prefix}-text-inverted: var(--${prefix}-color-neutral-50);
  --${prefix}-bg: var(--${prefix}-color-neutral-50);
  --${prefix}-bg-muted: var(--${prefix}-color-neutral-100);
  --${prefix}-bg-elevated: white;
  --${prefix}-bg-accented: var(--${prefix}-color-neutral-200);
  --${prefix}-bg-inverted: var(--${prefix}-color-neutral-900);
  --${prefix}-border: var(--${prefix}-color-neutral-200);
  --${prefix}-border-muted: var(--${prefix}-color-neutral-100);
  --${prefix}-border-accented: var(--${prefix}-color-neutral-300);
  --${prefix}-border-inverted: var(--${prefix}-color-neutral-700);`
}

function generateUIVariablesDark(prefix: string = 'ui') {
  return `  --${prefix}-text: var(--${prefix}-color-neutral-100);
  --${prefix}-text-dimmed: var(--${prefix}-color-neutral-500);
  --${prefix}-text-muted: var(--${prefix}-color-neutral-400);
  --${prefix}-text-toned: var(--${prefix}-color-neutral-300);
  --${prefix}-text-highlighted: var(--${prefix}-color-neutral-50);
  --${prefix}-text-inverted: var(--${prefix}-color-neutral-900);
  --${prefix}-bg: var(--${prefix}-color-neutral-900);
  --${prefix}-bg-muted: var(--${prefix}-color-neutral-800);
  --${prefix}-bg-elevated: var(--${prefix}-color-neutral-800);
  --${prefix}-bg-accented: var(--${prefix}-color-neutral-700);
  --${prefix}-bg-inverted: var(--${prefix}-color-neutral-100);
  --${prefix}-border: var(--${prefix}-color-neutral-700);
  --${prefix}-border-muted: var(--${prefix}-color-neutral-800);
  --${prefix}-border-accented: var(--${prefix}-color-neutral-600);
  --${prefix}-border-inverted: var(--${prefix}-color-neutral-300);`
}

function generateThemeCSS(themeColors: Record<string, string>, customVars: Record<string, string> = {}, prefix: string = 'ui') {
  const { neutral, ...colorsWithoutNeutral } = themeColors
  const neutralColor = neutral || 'gray'
  
  const colorVars = Object.entries(themeColors).map(([key, value]) => generateShades(key, value, prefix)).join('\n  ')
  const customVarEntries = Object.entries(customVars).map(([key, value]) => `  --${prefix}-${key}: ${value};`).join('\n')
  const uiVars = generateUIVariables(prefix)
  const uiVarsDark = generateUIVariablesDark(prefix)
  
  const lightModeColors = Object.keys(colorsWithoutNeutral).map(key => generateColor(key, 500, prefix)).join('\n  ')
  const darkModeColors = Object.keys(colorsWithoutNeutral).map(key => generateColor(key, 400, prefix)).join('\n  ')

  return `@layer base {
  :root {
  ${colorVars}
${customVarEntries}
${uiVars}
  }
  :root, .light {
  ${lightModeColors}
  }
  .dark {
  ${darkModeColors}
${uiVarsDark}
  }
}`
}

function generateSemanticColorMappings(prefix: string = 'ui') {
  return `  --text-color-dimmed: var(--${prefix}-text-dimmed);
  --text-color-muted: var(--${prefix}-text-muted);
  --text-color-toned: var(--${prefix}-text-toned);
  --text-color-default: var(--${prefix}-text);
  --text-color-highlighted: var(--${prefix}-text-highlighted);
  --text-color-inverted: var(--${prefix}-text-inverted);
  --background-color-default: var(--${prefix}-bg);
  --background-color-muted: var(--${prefix}-bg-muted);
  --background-color-elevated: var(--${prefix}-bg-elevated);
  --background-color-accented: var(--${prefix}-bg-accented);
  --background-color-inverted: var(--${prefix}-bg-inverted);
  --background-color-border: var(--${prefix}-border);
  --border-color-default: var(--${prefix}-border);
  --border-color-muted: var(--${prefix}-border-muted);
  --border-color-accented: var(--${prefix}-border-accented);
  --border-color-inverted: var(--${prefix}-border-inverted);
  --border-color-bg: var(--${prefix}-bg);
  --ring-color-default: var(--${prefix}-border);
  --ring-color-muted: var(--${prefix}-border-muted);
  --ring-color-accented: var(--${prefix}-border-accented);
  --ring-color-inverted: var(--${prefix}-border-inverted);
  --ring-color-bg: var(--${prefix}-bg);
  --ring-offset-color-default: var(--${prefix}-border);
  --ring-offset-color-muted: var(--${prefix}-border-muted);
  --ring-offset-color-accented: var(--${prefix}-border-accented);
  --ring-offset-color-inverted: var(--${prefix}-border-inverted);
  --ring-offset-color-bg: var(--${prefix}-bg);
  --divide-color-default: var(--${prefix}-border);
  --divide-color-muted: var(--${prefix}-border-muted);
  --divide-color-accented: var(--${prefix}-border-accented);
  --divide-color-inverted: var(--${prefix}-border-inverted);
  --divide-color-bg: var(--${prefix}-bg);
  --outline-color-default: var(--${prefix}-border);
  --outline-color-inverted: var(--${prefix}-border-inverted);
  --stroke-color-default: var(--${prefix}-border);
  --stroke-color-inverted: var(--${prefix}-border-inverted);
  --fill-color-default: var(--${prefix}-border);
  --fill-color-inverted: var(--${prefix}-border-inverted);`
}

function parseThemeStaticOverrides(cssContent: string): Set<string> {
  const overriddenColors = new Set<string>()
  const themeStaticRegex = /@theme\s+static\s*\{([^}]+)\}/g
  let match
  
  while ((match = themeStaticRegex.exec(cssContent)) !== null) {
    const themeContent = match[1]
    const colorVarRegex = /--color-([a-zA-Z]+)-\d+\s*:/g
    let colorMatch
    
    while ((colorMatch = colorVarRegex.exec(themeContent)) !== null) {
      const colorName = colorMatch[1]
      overriddenColors.add(colorName)
    }
  }
  
  return overriddenColors
}

function getUserOverriddenColors(cssFiles: string[] = []): Set<string> {
  const overriddenColors = new Set<string>()
  
  try {
    const fs = require('fs')
    const commonCssFiles = [
      'src/style.css',
      'src/styles.css', 
      'src/index.css',
      'styles/globals.css',
      'app/globals.css'
    ]
    
    const filesToCheck = cssFiles.length > 0 ? cssFiles : commonCssFiles
    
    for (const cssFile of filesToCheck) {
      try {
        if (fs.existsSync(cssFile)) {
          const cssContent = fs.readFileSync(cssFile, 'utf-8')
          const fileOverrides = parseThemeStaticOverrides(cssContent)
          fileOverrides.forEach(color => overriddenColors.add(color))
        }
      } catch (err) {
        continue
      }
    }
  } catch (err) {
    return overriddenColors
  }
  
  return overriddenColors
}

function generateTailwindThemeCSS(themeColors: Record<string, string>, prefix: string = 'ui', includeSemantics: boolean = true, adaptiveShades: boolean = true) {
  const { neutral, ...colorsWithoutNeutral } = themeColors
  const neutralColor = neutral || 'gray'
  const overriddenColors = getUserOverriddenColors()
  const usedColors = new Set(Object.values(themeColors))
  
  const colorVars = Object.entries(themeColors).map(([key, value]) => {
    const skipDefaults = overriddenColors.has(value)
    return generateShades(key, value, prefix, skipDefaults)
  }).join('\n  ')
  
  const allAvailableColors = Object.keys(colors).filter(color => 
    !['inherit', 'current', 'transparent', 'black', 'white'].includes(color) &&
    !overriddenColors.has(color) &&
    !usedColors.has(color)
  )
  
  const defaultColorVars = allAvailableColors.map(color => {
    return shades.map(shade => {
      const colorValue = getColor(color as keyof typeof colors, shade)
      return colorValue ? `--color-${color}-${shade}: ${colorValue};` : ''
    }).filter(Boolean).join('\n  ')
  }).join('\n  ')
  
  const uiVars = generateUIVariables(prefix)
  const uiVarsDark = generateUIVariablesDark(prefix)
  const lightModeColors = Object.keys(colorsWithoutNeutral).map(key => generateColor(key, 500, prefix)).join('\n  ')
  const darkModeColors = Object.keys(colorsWithoutNeutral).map(key => 
    generateColor(key, adaptiveShades ? 400 : 500, prefix)
  ).join('\n  ')
  
  const shadeVars = Object.entries(themeColors).map(([key, value]) => {
    const shadeEntries = shades.map(shade => {
      return `\t--color-${key}-${shade}: var(--${prefix}-color-${key}-${shade});`
    }).join('\n')
    return shadeEntries
  }).join('\n')
  
  const semanticVars = Object.keys(colorsWithoutNeutral).map(key => 
    `\t--color-${key}: var(--${prefix}-${key});`
  ).join('\n')
  
  const adaptiveVars = Object.keys(colorsWithoutNeutral).map(key => 
    `\t--color-${key}-DEFAULT: var(--${prefix}-${key});`
  ).join('\n')

  const semanticMappings = includeSemantics ? `\t--text-color-dimmed: var(--${prefix}-text-dimmed);
\t--text-color-muted: var(--${prefix}-text-muted);
\t--text-color-toned: var(--${prefix}-text-toned);
\t--text-color-default: var(--${prefix}-text);
\t--text-color-highlighted: var(--${prefix}-text-highlighted);
\t--text-color-inverted: var(--${prefix}-text-inverted);
\t--background-color-default: var(--${prefix}-bg);
\t--background-color-muted: var(--${prefix}-bg-muted);
\t--background-color-elevated: var(--${prefix}-bg-elevated);
\t--background-color-accented: var(--${prefix}-bg-accented);
\t--background-color-inverted: var(--${prefix}-bg-inverted);
\t--border-color-default: var(--${prefix}-border);
\t--border-color-muted: var(--${prefix}-border-muted);
\t--border-color-accented: var(--${prefix}-border-accented);
\t--border-color-inverted: var(--${prefix}-border-inverted);` : ''

  const result = `
@theme default inline {
${shadeVars}
${semanticVars}
${adaptiveVars}
${semanticMappings}
}

@layer base {
  :root {
  ${colorVars}
  ${defaultColorVars}
${uiVars}
  }
  :root, .light {
  ${lightModeColors}
  }
  .dark {
  ${darkModeColors}
${uiVarsDark}
  }
}

`

  return result
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