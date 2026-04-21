<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/index', label: '运势', icon: '☀️' },
  { path: '/match', label: '匹配', icon: '❤️' },
  { path: '/personality', label: '性格', icon: '🧠' },
  { path: '/horoscope', label: '星盘', icon: '🔮' },
  { path: '/ai', label: 'AI', icon: '🌟' },
  { path: '/community', label: '社区', icon: '💬' },
  { path: '/knowledge', label: '知识', icon: '📚' },
  { path: '/calendar', label: '日历', icon: '📅' },
  { path: '/test-center', label: '测试', icon: '📝' },
  { path: '/settings', label: '设置', icon: '⚙️' }
]
</script>

<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: route.path === tab.path }"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: var(--bg-primary);
  box-shadow: 0 -2px 10px var(--shadow-sm);
  z-index: 100;
  border-top: 1px solid var(--border-light);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-muted);
  transition: all var(--transition-normal);
  padding: 4px 12px;
  border-radius: var(--radius-md);
  height: 100%;
  justify-content: center;
}

.tab-item:hover {
  background: var(--bg-secondary);
}

.tab-item.active {
  color: var(--primary);
  background: linear-gradient(135deg, rgba(121, 40, 202, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%);
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 4px;
  transition: transform var(--transition-normal);
}

.tab-item.active .tab-icon {
  transform: scale(1.1);
}

.tab-label {
  font-size: 12px;
  font-weight: var(--font-medium);
}

@media (max-width: 480px) {
  .tab-bar {
    height: 56px;
  }

  .tab-icon {
    font-size: 18px;
  }

  .tab-label {
    font-size: 11px;
  }
}
</style>
