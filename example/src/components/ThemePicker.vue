<template>
  <div class="space-y-6 text-center">
    <!-- Primary Colors -->
    <div>
      <h3 class="text-sm font-medium text-default mb-3 transition-colors duration-300">
        Primary Color
      </h3>
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="color in primaryColors"
          :key="color"
          :class="[
            'w-8 h-8 rounded-md border-2 transition-all duration-200',
            currentPrimary === color
              ? 'border-default shadow-md scale-110'
              : 'border-muted hover:border-default hover:scale-105'
          ]"
          :style="`background-color: var(--color-${color}-500)`"
          :title="color"
          @click="setPrimaryColor(color)"
        />
      </div>
    </div>

    <!-- Neutral Colors -->
    <div>
      <h3 class="text-sm font-medium text-default mb-3 transition-colors duration-300">
        Neutral Color
      </h3>
      
      <!-- Show current non-traditional neutral if detected -->
      <div v-if="!neutralColors.includes(currentNeutral)" class="mb-3">
        <div class="text-xs text-muted mb-2">Current (from config):</div>
        <div class="flex justify-center">
          <div class="flex items-center gap-2 px-3 py-2 text-xs rounded-md border bg-primary text-inverted border-primary">
            <div 
              class="w-4 h-4 rounded-sm border border-inverted"
              :style="`background-color: var(--color-${currentNeutral}-500)`"
            />
            {{ currentNeutral }}
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="neutral in neutralColors"
          :key="neutral"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-xs rounded-md border transition-all duration-200',
            currentNeutral === neutral
              ? 'bg-primary text-inverted border-primary'
              : 'bg-elevated text-default border-default hover:bg-muted'
          ]"
          @click="setNeutralColor(neutral)"
        >
          <div 
            class="w-4 h-4 rounded-sm border border-default"
            :style="`background-color: var(--color-${neutral === 'neutral' ? 'old-neutral' : neutral}-500)`"
          />
          {{ neutral }}
        </button>
      </div>
      <p class="text-xs text-muted mt-2 transition-colors duration-300">
        Changes the neutral color palette for text, backgrounds, and borders
      </p>
    </div>

    <!-- Theme Mode -->
    <div>
      <h3 class="text-sm font-medium text-default mb-3 transition-colors duration-300">
        Theme Mode
      </h3>
      <div class="flex gap-2 justify-center">
        <button
          v-for="mode in themeModes"
          :key="mode.value"
          :class="[
            'px-3 py-2 text-xs rounded-md border transition-all duration-200 flex items-center gap-2',
            currentMode === mode.value
              ? 'bg-primary text-inverted border-primary'
              : 'bg-elevated text-default border-default hover:bg-muted'
          ]"
          @click="setThemeMode(mode.value)"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import colors from 'tailwindcss/colors'

const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', 'slate', 'gray', 'zinc', 'neutral', 'stone']
const primaryColors = Object.keys(colors).filter(color =>
  !colorsToOmit.includes(color) && typeof colors[color as keyof typeof colors] === 'object'
)

const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const themeModes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

const currentPrimary = ref('green')
const currentNeutral = ref('gray')
const currentMode = ref('system')

const isDark = computed(() => {
  if (currentMode.value === 'system') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
  }
  return currentMode.value === 'dark'
})

function setPrimaryColor(color: string) {
  currentPrimary.value = color
  updatePrimaryColorVariables(color)
  localStorage.setItem('theme-primary', color)
}

function setNeutralColor(neutral: string) {
  currentNeutral.value = neutral
  updateNeutralColorVariables(neutral)
  localStorage.setItem('theme-neutral', neutral)
}

function setThemeMode(mode: string) {
  currentMode.value = mode
  updateThemeMode()
  localStorage.setItem('theme-mode', mode)
}

function updatePrimaryColorVariables(color: string) {
  const root = document.documentElement
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  shades.forEach((shade) => {
    root.style.setProperty(`--ui-color-primary-${shade}`, `var(--color-${color}-${shade})`)
  })
}

function updateNeutralColorVariables(neutral: string) {
  const root = document.documentElement
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  shades.forEach((shade) => {
    root.style.setProperty(`--ui-color-neutral-${shade}`, `var(--color-${neutral}-${shade})`)
  })
}

function updateThemeMode() {
  const htmlElement = document.documentElement

  if (currentMode.value === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    htmlElement.classList.toggle('dark', systemDark)
  } else {
    htmlElement.classList.toggle('dark', currentMode.value === 'dark')
  }
}

function setupSystemThemeListener() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (currentMode.value === 'system') {
        updateThemeMode()
      }
    })
  }
}

function detectCurrentColors() {
  const root = document.documentElement
  const currentPrimaryValue = getComputedStyle(root).getPropertyValue('--ui-color-primary-500').trim()
  
  for (const color of primaryColors) {
    const colorValue = getComputedStyle(root).getPropertyValue(`--color-${color}-500`).trim()
    if (colorValue && colorValue === currentPrimaryValue) {
      currentPrimary.value = color
      break
    }
  }
  
  const currentNeutralValue = getComputedStyle(root).getPropertyValue('--ui-color-neutral-500').trim()
  
  // First check traditional neutral colors
  for (const neutral of neutralColors) {
    let cssVarName = `--color-${neutral}-500`
    // Handle the special case where 'neutral' maps to 'old-neutral'
    if (neutral === 'neutral') {
      cssVarName = '--color-old-neutral-500'
    }
    
    const neutralValue = getComputedStyle(root).getPropertyValue(cssVarName).trim()
    if (neutralValue && neutralValue === currentNeutralValue) {
      currentNeutral.value = neutral
      break
    }
  }
  
  // If no traditional neutral color matched, check all primary colors
  if (!neutralColors.includes(currentNeutral.value)) {
    for (const color of primaryColors) {
      const colorValue = getComputedStyle(root).getPropertyValue(`--color-${color}-500`).trim()
      if (colorValue && colorValue === currentNeutralValue) {
        currentNeutral.value = color
        break
      }
    }
  }
}

onMounted(() => {
  const savedPrimary = localStorage.getItem('theme-primary')
  const savedNeutral = localStorage.getItem('theme-neutral')
  const savedMode = localStorage.getItem('theme-mode') || 'system'

  if (savedPrimary && primaryColors.includes(savedPrimary)) {
    currentPrimary.value = savedPrimary
    updatePrimaryColorVariables(savedPrimary)
  } else {
    detectCurrentColors()
  }

  if (savedNeutral && neutralColors.includes(savedNeutral)) {
    currentNeutral.value = savedNeutral
    updateNeutralColorVariables(savedNeutral)
  } else {
    detectCurrentColors()
  }

  if (themeModes.some(mode => mode.value === savedMode)) {
    currentMode.value = savedMode
    if (!localStorage.getItem('theme-mode')) {
      localStorage.setItem('theme-mode', 'system')
    }
    updateThemeMode()
  }

  setupSystemThemeListener()
})
</script>
