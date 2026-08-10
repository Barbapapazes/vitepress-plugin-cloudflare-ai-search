<script lang="ts" setup>
import type { Translations } from '@cloudflare/ai-search-snippet'
import options from 'virtual:vitepress-plugin-cloudflare-ai-search/options'
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './style.css'

type SearchModalElement = HTMLElement & {
  translations: Translations | null
  open: () => void
  close: () => void
}

const modalId = 'vitepress-plugin-cloudflare-ai-search-modal'
const { isDark } = useData()
const button = ref<HTMLButtonElement>()
const modalHost = ref<HTMLDivElement>()
const isOpen = ref(false)
const loadError = ref(false)
const buttonLabel = computed(
  () => options.translations?.searchButtonLabel ?? options.placeholder ?? 'Search',
)
const shortcut = computed(() => options.shortcut ?? 'k')
const shortcutKey = computed(() => shortcut.value.toUpperCase())
const ariaKeyshortcuts = computed(() => {
  const key = shortcut.value.toLowerCase()
  return options.useMetaKey === false
    ? `control+${key}`
    : `control+${key} meta+${key}`
})
const theme = computed(() => {
  if (options.theme !== undefined) {
    return options.theme
  }

  return isDark.value ? 'dark' : 'light'
})

let modal: SearchModalElement | undefined
let openWhenReady = false
let unmounting = false
let isLoading = false

function openModal() {
  if (!modal) {
    openWhenReady = true
    void loadModal()
    return
  }

  modal.open()
  isOpen.value = true
}

function handleModalClose() {
  isOpen.value = false
  if (!unmounting) {
    button.value?.focus()
  }
}

function configureModal(element: SearchModalElement) {
  const attributes: Record<string, string | number | boolean | undefined> = {
    'api-url': options.endpoint,
    'placeholder': options.placeholder,
    'max-results': options.maxResults,
    'max-render-results': options.maxRenderResults,
    'debounce-ms': options.debounceMs,
    'theme': theme.value,
    'shortcut': options.shortcut,
    'use-meta-key': options.useMetaKey,
    'hide-branding': options.hideBranding,
    'show-url': options.showUrl,
    'show-date': options.showDate,
    'hide-thumbnails': options.hideThumbnails,
    'group-by': options.groupBy,
    'see-more': options.seeMore,
    'disable-analytics': options.disableAnalytics,
  }

  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttribute(name, String(value))
    }
  }

  if (options.requestOptions !== undefined) {
    element.setAttribute('request-options', JSON.stringify(options.requestOptions))
  }

  element.translations = options.translations ?? null

  for (const [name, value] of Object.entries(options.cssVariables ?? {})) {
    if (typeof value === 'string') {
      element.style.setProperty(name, value)
    }
  }
}

async function loadModal() {
  if (modal || isLoading || unmounting) {
    return
  }

  isLoading = true
  loadError.value = false

  try {
    await import('@cloudflare/ai-search-snippet/search')
  }
  catch (error) {
    console.error('[vitepress-plugin-cloudflare-ai-search] failed to load Cloudflare AI Search.', error)
    openWhenReady = false
    isOpen.value = false
    loadError.value = true
    return
  }
  finally {
    isLoading = false
  }

  if (unmounting || !modalHost.value) {
    return
  }

  const element = document.createElement('search-modal-snippet') as SearchModalElement
  configureModal(element)
  element.addEventListener('close', handleModalClose)
  modalHost.value.appendChild(element)
  modal = element

  if (openWhenReady) {
    openWhenReady = false
    element.open()
    isOpen.value = true
  }
}

onMounted(() => {
  void loadModal()
})

watch(theme, value => modal?.setAttribute('theme', value))

onBeforeUnmount(() => {
  unmounting = true
  if (!modal) {
    return
  }

  modal.removeEventListener('close', handleModalClose)
  modal.close()
  modal.remove()
  modal = undefined
})
</script>

<template>
  <div class="VPNavBarSearch">
    <button
      ref="button"
      type="button"
      class="VPNavBarSearchButton"
      :aria-label="buttonLabel"
      :aria-keyshortcuts="ariaKeyshortcuts"
      :aria-expanded="isOpen"
      :aria-controls="modalId"
      :aria-describedby="loadError ? 'vitepress-plugin-cloudflare-ai-search-error' : undefined"
      :title="loadError ? 'Search is unavailable. Activate to retry.' : undefined"
      @click="openModal"
    >
      <span class="vpi-search" aria-hidden="true" />
      <span class="text">{{ buttonLabel }}</span>
      <span class="keys" aria-hidden="true">
        <kbd class="key-cmd">⌘</kbd>
        <kbd class="key-ctrl">Ctrl</kbd>
        <kbd>{{ shortcutKey }}</kbd>
      </span>
    </button>
    <span
      v-if="loadError"
      id="vitepress-plugin-cloudflare-ai-search-error"
      class="VPNavBarSearchError"
      role="status"
    >
      Search is unavailable. Activate the button to retry.
    </span>
    <div :id="modalId" ref="modalHost" class="VPNavBarSearchModal" />
  </div>
</template>
