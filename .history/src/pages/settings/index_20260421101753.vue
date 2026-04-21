<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'

const { selectedZodiac, zodiacList } = useZodiac()

interface UserSettings {
  nickname: string
  avatar: string
  birthdate: string
  email: string
  notifications: {
    dailyHoroscope: boolean
    matchUpdates: boolean
    communityPosts: boolean
  }
  theme: 'light' | 'dark' | 'auto'
  privacy: {
    shareData: boolean
    showOnlineStatus: boolean
  }
}

const settings = ref<UserSettings>({
  nickname: '星座爱好者',
  avatar: '🌟',
  birthdate: '1990-01-01',
  email: 'user@example.com',
  notifications: {
    dailyHoroscope: true,
    matchUpdates: true,
    communityPosts: false
  },
  theme: 'auto',
  privacy: {
    shareData: false,
    showOnlineStatus: true
  }
})

const selectedAvatar = ref('🌟')
const avatarOptions = ['🌟', '🌙', '⭐', '💫', '✨', '🌠', '🌌', '🌑']

const saveSettings = () => {
  // 应用主题设置
  applyTheme(settings.value.theme)
  // 这里可以实现保存设置的逻辑
  console.log('Settings saved:', settings.value)
  // 显示保存成功提示
  alert('设置已保存')
}

const applyTheme = (theme: string) => {
  const html = document.documentElement

  // 移除所有主题类
  html.classList.remove('theme-light', 'theme-dark')

  if (theme === 'light') {
    html.classList.add('theme-light')
  } else if (theme === 'dark') {
    html.classList.add('theme-dark')
  } else {
    // 自动模式：根据系统偏好设置
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      html.classList.add('theme-dark')
    } else {
      html.classList.add('theme-light')
    }
  }

  // 保存主题设置到本地存储
  localStorage.setItem('theme', theme)
}

// 页面加载时应用保存的主题
const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto') {
    settings.value.theme = savedTheme
    applyTheme(savedTheme)
  }
}

// 初始化时加载保存的主题
loadSavedTheme()

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？')) {
    settings.value = {
      nickname: '星座爱好者',
      avatar: '🌟',
      birthdate: '1990-01-01',
      email: 'user@example.com',
      notifications: {
        dailyHoroscope: true,
        matchUpdates: true,
        communityPosts: false
      },
      theme: 'auto',
      privacy: {
        shareData: false,
        showOnlineStatus: true
      }
    }
    selectedZodiac.value = '白羊座'
    selectedAvatar.value = '🌟'
    alert('设置已重置')
  }
}

const updateAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
  settings.value.avatar = avatar
}

const updateZodiac = (zodiac: string) => {
  selectedZodiac.value = zodiac
}
</script>

<template>
  <div class="settings-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">个性化设置</span>
      <span class="page-subtitle animate-slide-up">定制你的星座体验</span>
    </div>

    <div class="container">
      <div class="settings-card animate-slide-up">
        <!-- 个人资料设置 -->
        <div class="settings-section">
          <h3 class="section-title">个人资料</h3>
          <div class="profile-settings">
            <div class="avatar-setting">
              <label class="setting-label">头像</label>
              <div class="avatar-options">
                <div
                  v-for="avatar in avatarOptions"
                  :key="avatar"
                  class="avatar-option"
                  :class="{ selected: selectedAvatar === avatar }"
                  @click="updateAvatar(avatar)"
                >
                  {{ avatar }}
                </div>
              </div>
            </div>
            <div class="setting-item">
              <label class="setting-label">昵称</label>
              <input
                v-model="settings.nickname"
                type="text"
                class="setting-input"
                placeholder="输入你的昵称"
              />
            </div>
            <div class="setting-item">
              <label class="setting-label">生日</label>
              <input
                v-model="settings.birthdate"
                type="date"
                class="setting-input"
              />
            </div>
            <div class="setting-item">
              <label class="setting-label">邮箱</label>
              <input
                v-model="settings.email"
                type="email"
                class="setting-input"
                placeholder="输入你的邮箱"
              />
            </div>
            <div class="setting-item">
              <label class="setting-label">星座</label>
              <select
                v-model="selectedZodiac"
                class="setting-select"
                @change="updateZodiac(selectedZodiac)"
              >
                <option v-for="zodiac in zodiacList" :key="zodiac" :value="zodiac">
                  {{ zodiac }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="settings-section">
          <h3 class="section-title">通知设置</h3>
          <div class="notification-settings">
            <div class="setting-item toggle">
              <label class="setting-label">每日运势提醒</label>
              <div class="toggle-switch">
                <input
                  v-model="settings.notifications.dailyHoroscope"
                  type="checkbox"
                  class="toggle-input"
                  id="dailyHoroscope"
                />
                <label class="toggle-label" for="dailyHoroscope"></label>
              </div>
            </div>
            <div class="setting-item toggle">
              <label class="setting-label">匹配更新提醒</label>
              <div class="toggle-switch">
                <input
                  v-model="settings.notifications.matchUpdates"
                  type="checkbox"
                  class="toggle-input"
                  id="matchUpdates"
                />
                <label class="toggle-label" for="matchUpdates"></label>
              </div>
            </div>
            <div class="setting-item toggle">
              <label class="setting-label">社区动态提醒</label>
              <div class="toggle-switch">
                <input
                  v-model="settings.notifications.communityPosts"
                  type="checkbox"
                  class="toggle-input"
                  id="communityPosts"
                />
                <label class="toggle-label" for="communityPosts"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- 主题设置 -->
        <div class="settings-section">
          <h3 class="section-title">主题设置</h3>
          <div class="theme-settings">
            <div class="setting-item">
              <label class="setting-label">主题模式</label>
              <div class="theme-options">
                <div
                  class="theme-option"
                  :class="{ selected: settings.theme === 'light' }"
                  @click="settings.theme = 'light'"
                >
                  <span class="theme-icon">☀️</span>
                  <span class="theme-name">浅色</span>
                </div>
                <div
                  class="theme-option"
                  :class="{ selected: settings.theme === 'dark' }"
                  @click="settings.theme = 'dark'"
                >
                  <span class="theme-icon">🌙</span>
                  <span class="theme-name">深色</span>
                </div>
                <div
                  class="theme-option"
                  :class="{ selected: settings.theme === 'auto' }"
                  @click="settings.theme = 'auto'"
                >
                  <span class="theme-icon">🔄</span>
                  <span class="theme-name">自动</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div class="settings-section">
          <h3 class="section-title">隐私设置</h3>
          <div class="privacy-settings">
            <div class="setting-item toggle">
              <label class="setting-label">分享使用数据</label>
              <div class="toggle-switch">
                <input
                  v-model="settings.privacy.shareData"
                  type="checkbox"
                  class="toggle-input"
                  id="shareData"
                />
                <label class="toggle-label" for="shareData"></label>
              </div>
            </div>
            <div class="setting-item toggle">
              <label class="setting-label">显示在线状态</label>
              <div class="toggle-switch">
                <input
                  v-model="settings.privacy.showOnlineStatus"
                  type="checkbox"
                  class="toggle-input"
                  id="showOnlineStatus"
                />
                <label class="toggle-label" for="showOnlineStatus"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- 关于应用 -->
        <div class="settings-section">
          <h3 class="section-title">关于应用</h3>
          <div class="about-settings">
            <div class="setting-item">
              <label class="setting-label">应用版本</label>
              <span class="setting-value">1.0.0</span>
            </div>
            <div class="setting-item">
              <label class="setting-label">开发者</label>
              <span class="setting-value">星座团队</span>
            </div>
            <div class="setting-item">
              <label class="setting-label">联系我们</label>
              <a href="mailto:contact@zodiacapp.com" class="setting-link">contact@zodiacapp.com</a>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="settings-actions">
          <button class="action-btn save" @click="saveSettings">
            保存设置
          </button>
          <button class="action-btn reset" @click="resetSettings">
            重置设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: var(--space-2xl);
}

.hero-section {
  background: var(--bg-gradient);
  padding: var(--space-2xl) var(--space-md);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-white);
  display: block;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.9);
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.settings-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.settings-card:hover {
  box-shadow: var(--shadow-lg);
}

.settings-section {
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-light);
}

.settings-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.section-title::before {
  content: '•';
  color: var(--primary);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.profile-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.avatar-setting {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.setting-label {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.avatar-options {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid var(--border-light);
}

.avatar-option:hover {
  transform: scale(1.1);
  border-color: var(--primary);
}

.avatar-option.selected {
  border-color: var(--primary);
  background: var(--bg-gradient);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.setting-item.toggle {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
}

.setting-input {
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
}

.setting-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.setting-input::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.setting-select::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.setting-select {
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.setting-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.setting-value {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.setting-link {
  font-size: var(--text-base);
  color: var(--primary);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.setting-link:hover {
  text-decoration: underline;
  transform: translateY(-1px);
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 34px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: var(--text-white);
  border-radius: 50%;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-label {
  background-color: var(--primary);
  border-color: var(--primary);
}

.toggle-input:checked + .toggle-label:before {
  transform: translateX(30px);
}

/* 主题选项 */
.theme-options {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.theme-option {
  flex: 1;
  min-width: 100px;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.theme-option:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.theme-option.selected {
  border-color: var(--primary);
  background: var(--bg-gradient);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
}

.theme-icon {
  font-size: 24px;
}

.theme-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* 操作按钮 */
.settings-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.action-btn {
  flex: 1;
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.action-btn.save {
  background: var(--bg-gradient);
  color: var(--text-white);
}

.action-btn.reset {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease;
}

.animate-slide-up {
  animation: slideUp 0.6s ease;
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-xl) var(--space-md);
  }

  .settings-card {
    padding: var(--space-md);
  }

  .settings-actions {
    flex-direction: column;
  }

  .theme-options {
    flex-direction: column;
  }

  .theme-option {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
