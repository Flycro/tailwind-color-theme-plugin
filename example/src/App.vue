<template>
  <div class="min-h-screen bg-default transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-default mb-4 transition-colors duration-300">
            <span class="text-primary">Tailwind</span> Theme Plugin Demo
          </h1>
          <p class="text-muted mb-6 transition-colors duration-300">
            A reusable Vite plugin for Tailwind 4 theming with dynamic color configuration inspired by Nuxt UI
          </p>

          <!-- Theme Picker -->
          <div class="mt-8 p-6 bg-elevated border border-default rounded-lg transition-colors duration-300">
            <h3 class="text-lg font-semibold text-default mb-4 transition-colors duration-300">
              Theme Picker
            </h3>
            <p class="text-muted mb-6 transition-colors duration-300">
              Customize your theme with different colors and modes, just like Nuxt UI
            </p>
            <ThemePicker />
          </div>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <!-- Primary Color Showcase -->
            <div class="bg-elevated border border-default rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Primary Color System
                </h3>
                <p class="text-muted text-sm">
                  Demonstrates primary color usage across different shades
                </p>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 bg-primary-300 rounded" />
                  <span class="text-sm text-default font-mono">bg-primary-300</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 bg-primary-500 rounded" />
                  <span class="text-sm text-default font-mono">bg-primary-500</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 bg-primary-700 rounded" />
                  <span class="text-sm text-default font-mono">bg-primary-700</span>
                </div>
              </div>
              <button class="bg-primary hover:bg-primary-600 text-inverted px-4 py-2 rounded-lg text-sm transition-colors mt-4 w-full">
                Adaptive Primary Button
              </button>
            </div>

            <!-- Semantic Colors Showcase -->
            <div class="bg-elevated border border-default rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Semantic Colors
                </h3>
                <p class="text-muted text-sm">
                  Framework-agnostic semantic color utilities
                </p>
              </div>
              <div class="space-y-3">
                <div class="bg-default p-3 rounded border border-default">
                  <span class="text-default text-sm font-mono">bg-default</span>
                </div>
                <div class="bg-muted p-3 rounded border border-muted">
                  <span class="text-default text-sm font-mono">bg-muted</span>
                </div>
                <div class="bg-elevated p-3 rounded border border-default">
                  <span class="text-default text-sm font-mono">bg-elevated</span>
                </div>
                <div class="bg-accented p-3 rounded border border-accented">
                  <span class="text-default text-sm font-mono">bg-accented</span>
                </div>
              </div>
            </div>

            <!-- Text Hierarchy Showcase -->
            <div class="bg-elevated border border-default rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Text Hierarchy
                </h3>
                <p class="text-muted text-sm">
                  Semantic text colors for consistent typography
                </p>
              </div>
              <div class="space-y-3">
                <p class="text-highlighted text-sm font-mono">
                  text-highlighted
                </p>
                <p class="text-default text-sm font-mono">
                  text-default
                </p>
                <p class="text-toned text-sm font-mono">
                  text-toned
                </p>
                <p class="text-muted text-sm font-mono">
                  text-muted
                </p>
                <p class="text-dimmed text-sm font-mono">
                  text-dimmed
                </p>
                <div class="bg-primary p-2 rounded mt-3">
                  <p class="text-inverted text-sm font-mono">
                    text-inverted
                  </p>
                </div>
              </div>
            </div>

            <!-- Color Variants Showcase -->
            <div class="bg-elevated border border-default rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Color Variants
                </h3>
                <p class="text-muted text-sm">
                  All theme colors with consistent utilities
                </p>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button class="bg-primary text-inverted px-3 py-2 rounded text-xs transition-colors">
                  Primary
                </button>
                <button class="bg-secondary text-inverted px-3 py-2 rounded text-xs transition-colors">
                  Secondary
                </button>
                <button class="bg-success text-inverted px-3 py-2 rounded text-xs transition-colors">
                  Success
                </button>
                <button class="bg-warning text-inverted px-3 py-2 rounded text-xs transition-colors">
                  Warning
                </button>
                <button class="bg-error text-inverted px-3 py-2 rounded text-xs transition-colors col-span-2">
                  Error
                </button>
              </div>
            </div>

            <!-- Border System Showcase -->
            <div class="bg-elevated border border-default rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Border System
                </h3>
                <p class="text-muted text-sm">
                  Semantic border colors that adapt to themes
                </p>
              </div>
              <div class="space-y-3">
                <div class="p-3 border border-default rounded">
                  <span class="text-sm font-mono text-default">border-default</span>
                </div>
                <div class="p-3 border border-muted rounded">
                  <span class="text-sm font-mono text-default">border-muted</span>
                </div>
                <div class="p-3 border border-accented rounded">
                  <span class="text-sm font-mono text-default">border-accented</span>
                </div>
                <div class="p-3 border-2 border-primary rounded">
                  <span class="text-sm font-mono text-default">border-primary</span>
                </div>
              </div>
            </div>

            <!-- Dark Mode Adaptation -->
            <div class="bg-muted border border-accented rounded-lg shadow-md p-6 transition-colors duration-300">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-default mb-2">
                  Dark Mode Adaptation
                </h3>
                <p class="text-toned text-sm">
                  All colors automatically adapt between light and dark themes
                </p>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">Light Mode Shade:</span>
                  <span class="text-sm font-mono text-toned">primary-500</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-default">Dark Mode Shade:</span>
                  <span class="text-sm font-mono text-toned">primary-400</span>
                </div>
                <div class="bg-primary p-3 rounded mt-3">
                  <span class="text-inverted text-sm">This adapts automatically</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Adaptive Shade Examples -->
          <div class="mt-8 p-6 bg-elevated border border-default rounded-lg transition-colors duration-300">
            <div class="text-center mb-6">
              <h3 class="text-lg font-semibold text-default mb-2 transition-colors duration-300">
                Adaptive Shade Shifting Demo
              </h3>
              <p class="text-muted text-sm transition-colors duration-300">
                Colors automatically adjust their shade for optimal contrast in light and dark themes
              </p>
            </div>

            <!-- Adaptive Colors Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <div class="w-20 h-20 mx-auto rounded-xl bg-primary transition-colors duration-300 mb-3 shadow-sm"></div>
                <div class="text-sm font-mono text-default mb-1">bg-primary</div>
                <div class="text-xs text-muted">500 → 400</div>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 mx-auto rounded-xl bg-secondary transition-colors duration-300 mb-3 shadow-sm"></div>
                <div class="text-sm font-mono text-default mb-1">bg-secondary</div>
                <div class="text-xs text-muted">500 → 400</div>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 mx-auto rounded-xl bg-success transition-colors duration-300 mb-3 shadow-sm"></div>
                <div class="text-sm font-mono text-default mb-1">bg-success</div>
                <div class="text-xs text-muted">500 → 400</div>
              </div>
            </div>

            <!-- Fixed vs Adaptive Comparison -->
            <div class="pt-6 border-t border-default">
              <h4 class="text-sm font-semibold text-default mb-4 text-center transition-colors duration-300">
                Fixed vs Adaptive Comparison
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-sm text-muted mb-3 transition-colors duration-300">
                    Fixed Shade
                  </div>
                  <div class="h-16 rounded-lg bg-primary-500 transition-colors duration-300 mb-2 shadow-sm"></div>
                  <div class="text-xs font-mono text-toned">bg-primary-500</div>
                  <div class="text-xs text-dimmed mt-1">Always uses shade 500</div>
                </div>
                <div class="text-center">
                  <div class="text-sm text-muted mb-3 transition-colors duration-300">
                    Adaptive Shade
                  </div>
                  <div class="h-16 rounded-lg bg-primary transition-colors duration-300 mb-2 shadow-sm"></div>
                  <div class="text-xs font-mono text-toned">bg-primary</div>
                  <div class="text-xs text-dimmed mt-1">Automatically adjusts</div>
                </div>
              </div>
              <div class="mt-4 p-3 bg-muted rounded-lg text-center">
                <p class="text-xs text-toned transition-colors duration-300">
                  Switch to dark mode using the Theme Picker to see the difference
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Palette -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-default mb-6">
            Color Palette
          </h2>
          <div v-for="color in colors" :key="color" class="mb-6">
            <h3 class="text-lg font-medium text-default mb-3 capitalize">
              {{ color }}
            </h3>
            <div class="flex rounded-lg overflow-hidden shadow-sm border border-default">
              <div
                v-for="shade in shades"
                :key="shade"
                class="flex-1 h-16 flex items-end justify-center pb-2"
                :style="`background-color: var(--ui-color-${color}-${shade})`"
              >
                <span class="text-xs font-medium" :class="shade < 500 ? 'text-gray-800' : 'text-white'">
                  {{ shade }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ThemePicker from './components/ThemePicker.vue'

const colors = ['primary', 'secondary', 'success', 'warning', 'error']
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

onMounted(() => {

})
</script>
