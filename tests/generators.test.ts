import { describe, it, expect } from 'vitest'
import {
  getColor,
  generateShades,
  generateColor,
  generateUIVariables,
  generateUIVariablesDark,
  generateThemeCSS,
  generateSemanticColorMappings,
  parseThemeStaticOverrides,
  generateTailwindThemeCSS,
  generateIntelliSenseCSS,
  defaultColors,
  shades,
} from '../src/generators'

describe('constants', () => {
  it('defaultColors has all expected keys', () => {
    expect(defaultColors).toEqual({
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate',
    })
  })

  it('shades contains all 11 standard Tailwind shades', () => {
    expect(shades).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])
    expect(shades).toHaveLength(11)
  })
})

describe('getColor', () => {
  it('returns color value for valid color and shade', () => {
    const color = getColor('red', 500)
    expect(color).toBeTruthy()
    expect(typeof color).toBe('string')
    expect(color.length).toBeGreaterThan(0)
  })

  it('returns a value for every shade of a valid color', () => {
    for (const shade of shades) {
      const color = getColor('blue', shade)
      expect(color).toBeTruthy()
      expect(typeof color).toBe('string')
      expect(color.length).toBeGreaterThan(0)
    }
  })

  it('returns empty string for invalid color', () => {
    expect(getColor('notacolor' as any, 500)).toBe('')
  })

  it('returns empty string for non-object color entries', () => {
    // 'black' and 'white' are strings in tailwindcss/colors, not shade objects
    expect(getColor('black' as any, 500)).toBe('')
  })

  it('returns different values for different shades', () => {
    const shade50 = getColor('green', 50)
    const shade900 = getColor('green', 900)
    expect(shade50).not.toBe(shade900)
  })
})

describe('generateShades', () => {
  it('generates CSS variables for all 11 shades', () => {
    const result = generateShades('primary', 'green')
    for (const shade of shades) {
      expect(result).toContain(`--ui-color-primary-${shade}:`)
    }
  })

  it('uses fallback colors by default', () => {
    const result = generateShades('primary', 'green')
    // Should have var(--color-green-500, <color>) format with fallback
    expect(result).toMatch(/var\(--color-green-\d+, .+\)/)
  })

  it('skips fallback colors when skipDefaults is true', () => {
    const result = generateShades('primary', 'green', 'ui', true)
    // Should have var(--color-green-500) format without fallback
    expect(result).not.toMatch(/#[0-9a-fA-F]{6}/)
    expect(result).toMatch(/var\(--color-green-\d+\)/)
  })

  it('respects custom prefix', () => {
    const result = generateShades('primary', 'green', 'theme')
    expect(result).toContain('--theme-color-primary-')
    expect(result).not.toContain('--ui-color-primary-')
  })

  it('maps neutral to old-neutral in color variable reference', () => {
    const result = generateShades('neutral', 'neutral')
    expect(result).toContain('--color-old-neutral-')
    expect(result).not.toContain('var(--color-neutral-')
  })

  it('does not map non-neutral values to old-neutral', () => {
    const result = generateShades('neutral', 'slate')
    expect(result).toContain('--color-slate-')
    expect(result).not.toContain('old-neutral')
  })
})

describe('generateColor', () => {
  it('generates correct adaptive color variable', () => {
    expect(generateColor('primary', 500)).toBe(
      '--ui-primary: var(--ui-color-primary-500);'
    )
  })

  it('works with shade 400 for dark mode', () => {
    expect(generateColor('primary', 400)).toBe(
      '--ui-primary: var(--ui-color-primary-400);'
    )
  })

  it('respects custom prefix', () => {
    expect(generateColor('primary', 500, 'theme')).toBe(
      '--theme-primary: var(--theme-color-primary-500);'
    )
  })
})

describe('generateUIVariables', () => {
  it('generates all expected UI variables with default prefix', () => {
    const result = generateUIVariables()
    expect(result).toContain('--ui-text:')
    expect(result).toContain('--ui-text-dimmed:')
    expect(result).toContain('--ui-text-muted:')
    expect(result).toContain('--ui-text-toned:')
    expect(result).toContain('--ui-text-highlighted:')
    expect(result).toContain('--ui-text-inverted:')
    expect(result).toContain('--ui-bg:')
    expect(result).toContain('--ui-bg-muted:')
    expect(result).toContain('--ui-bg-elevated: white;')
    expect(result).toContain('--ui-bg-accented:')
    expect(result).toContain('--ui-bg-inverted:')
    expect(result).toContain('--ui-border:')
    expect(result).toContain('--ui-border-muted:')
    expect(result).toContain('--ui-border-accented:')
    expect(result).toContain('--ui-border-inverted:')
  })

  it('uses neutral color references', () => {
    const result = generateUIVariables()
    expect(result).toContain('var(--ui-color-neutral-')
  })

  it('respects custom prefix', () => {
    const result = generateUIVariables('theme')
    expect(result).toContain('--theme-text:')
    expect(result).toContain('var(--theme-color-neutral-')
    expect(result).not.toContain('--ui-')
  })
})

describe('generateUIVariablesDark', () => {
  it('generates all expected dark mode UI variables', () => {
    const result = generateUIVariablesDark()
    expect(result).toContain('--ui-text:')
    expect(result).toContain('--ui-text-dimmed:')
    expect(result).toContain('--ui-bg-elevated:')
    expect(result).toContain('--ui-border:')
  })

  it('uses darker neutral shades for backgrounds', () => {
    const result = generateUIVariablesDark()
    expect(result).toContain('--ui-bg: var(--ui-color-neutral-900)')
    expect(result).toContain('--ui-bg-muted: var(--ui-color-neutral-800)')
  })

  it('uses lighter neutral shades for text', () => {
    const result = generateUIVariablesDark()
    expect(result).toContain('--ui-text: var(--ui-color-neutral-100)')
  })

  it('bg-elevated is not white in dark mode (unlike light mode)', () => {
    const result = generateUIVariablesDark()
    expect(result).toContain('--ui-bg-elevated: var(--ui-color-neutral-800)')
    expect(result).not.toContain('--ui-bg-elevated: white')
  })

  it('respects custom prefix', () => {
    const result = generateUIVariablesDark('theme')
    expect(result).toContain('--theme-text:')
    expect(result).not.toContain('--ui-')
  })
})

describe('generateThemeCSS', () => {
  const minimalColors = { primary: 'green', neutral: 'slate' }

  it('wraps output in @layer base', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain('@layer base {')
  })

  it('includes :root, .light, and .dark selectors', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain(':root {')
    expect(result).toContain(':root, .light {')
    expect(result).toContain('.dark {')
  })

  it('includes shade variables for all configured colors', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain('--ui-color-primary-500:')
    expect(result).toContain('--ui-color-neutral-500:')
  })

  it('generates light mode colors at shade 500', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain('--ui-primary: var(--ui-color-primary-500)')
  })

  it('generates dark mode colors at shade 400', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain('--ui-primary: var(--ui-color-primary-400)')
  })

  it('excludes neutral from light/dark mode adaptive variables', () => {
    const result = generateThemeCSS(minimalColors)
    // neutral should not have a --ui-neutral adaptive variable
    expect(result).not.toContain('--ui-neutral:')
  })

  it('includes custom variables', () => {
    const result = generateThemeCSS(minimalColors, { 'border-radius': '8px' })
    expect(result).toContain('--ui-border-radius: 8px;')
  })

  it('respects custom prefix', () => {
    const result = generateThemeCSS(minimalColors, {}, 'theme')
    expect(result).toContain('--theme-color-primary-')
    expect(result).not.toContain('--ui-')
  })

  it('includes UI variables (light and dark)', () => {
    const result = generateThemeCSS(minimalColors)
    expect(result).toContain('--ui-text:')
    expect(result).toContain('--ui-bg:')
    expect(result).toContain('--ui-border:')
  })
})

describe('generateSemanticColorMappings', () => {
  it('generates text semantic mappings', () => {
    const result = generateSemanticColorMappings()
    expect(result).toContain('--text-color-dimmed:')
    expect(result).toContain('--text-color-muted:')
    expect(result).toContain('--text-color-toned:')
    expect(result).toContain('--text-color-default:')
    expect(result).toContain('--text-color-highlighted:')
    expect(result).toContain('--text-color-inverted:')
  })

  it('generates background semantic mappings', () => {
    const result = generateSemanticColorMappings()
    expect(result).toContain('--background-color-default:')
    expect(result).toContain('--background-color-muted:')
    expect(result).toContain('--background-color-elevated:')
    expect(result).toContain('--background-color-accented:')
    expect(result).toContain('--background-color-inverted:')
    expect(result).toContain('--background-color-border:')
  })

  it('generates border semantic mappings', () => {
    const result = generateSemanticColorMappings()
    expect(result).toContain('--border-color-default:')
    expect(result).toContain('--border-color-muted:')
    expect(result).toContain('--border-color-accented:')
    expect(result).toContain('--border-color-inverted:')
    expect(result).toContain('--border-color-bg:')
  })

  it('generates ring, ring-offset, divide, outline, stroke, fill mappings', () => {
    const result = generateSemanticColorMappings()
    expect(result).toContain('--ring-color-default:')
    expect(result).toContain('--ring-offset-color-default:')
    expect(result).toContain('--divide-color-default:')
    expect(result).toContain('--outline-color-default:')
    expect(result).toContain('--stroke-color-default:')
    expect(result).toContain('--fill-color-default:')
  })

  it('references UI variables with correct prefix', () => {
    const result = generateSemanticColorMappings()
    expect(result).toContain('var(--ui-text-dimmed)')
    expect(result).toContain('var(--ui-bg)')
    expect(result).toContain('var(--ui-border)')
  })

  it('respects custom prefix', () => {
    const result = generateSemanticColorMappings('theme')
    expect(result).toContain('var(--theme-text-dimmed)')
    expect(result).toContain('var(--theme-bg)')
    expect(result).not.toContain('var(--ui-')
  })
})

describe('parseThemeStaticOverrides', () => {
  it('returns empty set for CSS without @theme static blocks', () => {
    const result = parseThemeStaticOverrides('.foo { color: red; }')
    expect(result.size).toBe(0)
  })

  it('returns empty set for empty string', () => {
    const result = parseThemeStaticOverrides('')
    expect(result.size).toBe(0)
  })

  it('extracts color names from @theme static block', () => {
    const css = `@theme static {
      --color-red-500: #ef4444;
      --color-red-600: #dc2626;
      --color-blue-500: #3b82f6;
    }`
    const result = parseThemeStaticOverrides(css)
    expect(result.has('red')).toBe(true)
    expect(result.has('blue')).toBe(true)
    expect(result.size).toBe(2)
  })

  it('handles multiple @theme static blocks', () => {
    const css = `
      @theme static { --color-red-500: #ef4444; }
      .foo { color: red; }
      @theme static { --color-green-500: #22c55e; }
    `
    const result = parseThemeStaticOverrides(css)
    expect(result.has('red')).toBe(true)
    expect(result.has('green')).toBe(true)
  })

  it('does not match non-color variables in @theme static', () => {
    const css = `@theme static {
      --font-sans: "Inter", sans-serif;
    }`
    const result = parseThemeStaticOverrides(css)
    expect(result.size).toBe(0)
  })

  it('does not match @theme (non-static) blocks', () => {
    const css = `@theme {
      --color-red-500: #ef4444;
    }`
    const result = parseThemeStaticOverrides(css)
    expect(result.size).toBe(0)
  })
})

describe('generateTailwindThemeCSS', () => {
  const minimalColors = { primary: 'green', neutral: 'slate' }

  it('includes @theme default inline block', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    expect(result).toContain('@theme default inline {')
  })

  it('includes @layer base block', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    expect(result).toContain('@layer base {')
  })

  it('includes shade variables in @theme block', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    expect(result).toContain('--color-primary-500: var(--ui-color-primary-500)')
    expect(result).toContain('--color-neutral-500: var(--ui-color-neutral-500)')
  })

  it('includes semantic color variable in @theme block', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    expect(result).toContain('--color-primary: var(--ui-primary)')
  })

  it('includes DEFAULT adaptive variable in @theme block', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    expect(result).toContain('--color-primary-DEFAULT: var(--ui-primary)')
  })

  it('uses shade 400 in dark mode with adaptiveShades enabled', () => {
    const result = generateTailwindThemeCSS(minimalColors, 'ui', true, true)
    expect(result).toContain('.dark {')
    expect(result).toContain('--ui-primary: var(--ui-color-primary-400)')
  })

  it('uses shade 500 in dark mode with adaptiveShades disabled', () => {
    const result = generateTailwindThemeCSS(minimalColors, 'ui', true, false)
    // Both light and dark should use 500
    const darkSection = result.split('.dark {')[1]
    expect(darkSection).toContain('--ui-primary: var(--ui-color-primary-500)')
  })

  it('includes semantic mappings when includeSemantics is true', () => {
    const result = generateTailwindThemeCSS(minimalColors, 'ui', true)
    expect(result).toContain('--text-color-default:')
    expect(result).toContain('--background-color-default:')
    expect(result).toContain('--border-color-default:')
  })

  it('excludes semantic mappings when includeSemantics is false', () => {
    const result = generateTailwindThemeCSS(minimalColors, 'ui', false)
    expect(result).not.toContain('--text-color-default:')
    expect(result).not.toContain('--background-color-default:')
  })

  it('respects custom prefix', () => {
    const result = generateTailwindThemeCSS(minimalColors, 'theme')
    expect(result).toContain('--theme-color-primary-')
    expect(result).toContain('var(--theme-primary)')
  })

  it('includes default Tailwind color values for non-theme colors', () => {
    const result = generateTailwindThemeCSS(minimalColors)
    // Colors not in themeColors should be output as static values (oklch or hex)
    expect(result).toMatch(/--color-red-\d+: .+;/)
  })
})

describe('generateIntelliSenseCSS', () => {
  const minimalColors = { primary: 'green', neutral: 'slate' }

  it('wraps output in @theme default block', () => {
    const result = generateIntelliSenseCSS(minimalColors)
    expect(result).toContain('@theme default {')
  })

  it('includes header comment', () => {
    const result = generateIntelliSenseCSS(minimalColors)
    expect(result).toContain('IntelliSense helper')
    expect(result).toContain('Generated automatically - do not edit manually')
  })

  it('includes color shades for each theme color', () => {
    const result = generateIntelliSenseCSS(minimalColors)
    for (const shade of shades) {
      expect(result).toContain(`--color-primary-${shade}:`)
      expect(result).toContain(`--color-neutral-${shade}:`)
    }
  })

  it('includes base color and DEFAULT variables', () => {
    const result = generateIntelliSenseCSS(minimalColors)
    expect(result).toContain('--color-primary: var(--ui-primary)')
    expect(result).toContain('--color-primary-DEFAULT: var(--ui-primary)')
  })

  it('includes semantic entries when includeSemantics is true', () => {
    const result = generateIntelliSenseCSS(minimalColors, 'ui', true)
    expect(result).toContain('--text-color-default:')
    expect(result).toContain('--background-color-default:')
    expect(result).toContain('--border-color-default:')
  })

  it('excludes semantic entries when includeSemantics is false', () => {
    const result = generateIntelliSenseCSS(minimalColors, 'ui', false)
    expect(result).not.toContain('--text-color-default:')
    expect(result).not.toContain('--background-color-default:')
  })

  it('respects custom prefix', () => {
    const result = generateIntelliSenseCSS(minimalColors, 'theme')
    expect(result).toContain('var(--theme-primary)')
    expect(result).toContain('var(--theme-color-primary-')
    expect(result).not.toContain('var(--ui-')
  })
})
