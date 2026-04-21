<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TabBar from './components/TabBar.vue'

// 应用主题
const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
  const html = document.documentElement
  html.classList.remove('theme-light', 'theme-dark')
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.add(prefersDark ? 'theme-dark' : 'theme-light')
  } else {
    html.classList.add(`theme-${theme}`)
  }
}

// 加载保存的主题
const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto'
  if (savedTheme) {
    applyTheme(savedTheme)
  } else {
    // 默认主题
    applyTheme('dark')
  }
}

// 监听系统主题变化
const setupThemeListener = () => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto'
    if (savedTheme === 'auto') {
      applyTheme('auto')
    }
  })
}

onMounted(() => {
  loadSavedTheme()
  setupThemeListener()
})
</script>

<template>
  <div id="app">
    <main class="main-content">
      <RouterView />
    </main>
    <TabBar />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.main-content {
  padding-bottom: 80px;
  min-height: 100vh;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
