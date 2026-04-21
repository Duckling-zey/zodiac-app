<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'

const { selectedZodiac, getZodiacInfo } = useZodiac()

interface Post {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  zodiac: string
  likes: number
  comments: number
  timestamp: Date
  tags: string[]
}

const posts = ref<Post[]>([
  {
    id: 1,
    title: '白羊座的朋友们，你们最近运势如何？',
    content: '最近工作上遇到了一些挑战，但是感觉整体运势还是不错的。特别是在人际关系方面，遇到了很多贵人。想听听其他白羊座的朋友们最近的情况如何？',
    author: '白羊小能手',
    avatar: '🐏',
    zodiac: '白羊座',
    likes: 42,
    comments: 15,
    timestamp: new Date('2024-01-15T14:30:00'),
    tags: ['运势', '白羊座', '职场']
  },
  {
    id: 2,
    title: '天蝎座的恋爱指南',
    content: '作为一个天蝎座，我发现我们在恋爱中总是容易陷入深度思考，有时候会过度分析对方的行为。其实爱情需要更多的信任和包容，分享一些我的恋爱心得...',
    author: '天蝎守护者',
    avatar: '🦂',
    zodiac: '天蝎座',
    likes: 67,
    comments: 23,
    timestamp: new Date('2024-01-14T10:15:00'),
    tags: ['爱情', '天蝎座', '情感']
  },
  {
    id: 3,
    title: '处女座的完美主义如何平衡？',
    content: '作为处女座，我总是追求完美，无论是工作还是生活。但是最近发现这种完美主义有时候会让自己很疲惫，想听听大家有什么好的建议来平衡这种心态。',
    author: '处女 perfection',
    avatar: '👑',
    zodiac: '处女座',
    likes: 38,
    comments: 18,
    timestamp: new Date('2024-01-13T09:45:00'),
    tags: ['性格', '处女座', '自我提升']
  },
  {
    id: 4,
    title: '双鱼座的创意灵感来源',
    content: '双鱼座的朋友们，你们的创意灵感通常来自哪里？我发现自己在情绪波动的时候更容易产生创意，但是这种波动也会影响我的工作效率。',
    author: '双鱼梦想家',
    avatar: '🐟',
    zodiac: '双鱼座',
    likes: 53,
    comments: 21,
    timestamp: new Date('2024-01-12T16:20:00'),
    tags: ['创意', '双鱼座', '灵感']
  },
  {
    id: 5,
    title: '金牛座的理财之道',
    content: '金牛座的朋友们，你们都是怎么理财的？我最近开始学习投资，想听听大家的经验和建议。',
    author: '金牛财主',
    avatar: '🐂',
    zodiac: '金牛座',
    likes: 49,
    comments: 19,
    timestamp: new Date('2024-01-11T11:30:00'),
    tags: ['理财', '金牛座', '投资']
  }
])

const currentZodiac = computed(() => getZodiacInfo(selectedZodiac.value))

const filteredPosts = computed(() => {
  return posts.value.filter(post =>
    post.zodiac === selectedZodiac.value || post.tags.includes(selectedZodiac.value)
  )
})

const sortedPosts = computed(() => {
  return [...filteredPosts.value].sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  )
})

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const likePost = (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes++
  }
}

const showComments = (postId: number) => {
  // 这里可以实现显示评论的逻辑
  console.log('Show comments for post:', postId)
}
</script>

<template>
  <div class="community-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">星座社区</span>
      <span class="page-subtitle animate-slide-up">与同星座的朋友交流分享</span>
    </div>

    <div class="container">
      <!-- 社区导航 -->
      <div class="community-nav">
        <div class="nav-item active">
          <span class="nav-icon">🔥</span>
          <span class="nav-label">热门</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">⭐</span>
          <span class="nav-label">推荐</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">💬</span>
          <span class="nav-label">关注</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">📝</span>
          <span class="nav-label">发布</span>
        </div>
      </div>

      <!-- 功能导航卡片 -->
      <div class="feature-nav">
        <router-link to="/index" class="feature-card animate-slide-up">
          <span class="feature-icon">☀️</span>
          <span class="feature-label">每日运势</span>
          <span class="feature-desc">查看你的每日星座运势</span>
        </router-link>
        <router-link to="/match" class="feature-card animate-slide-up">
          <span class="feature-icon">❤️</span>
          <span class="feature-label">星座匹配</span>
          <span class="feature-desc">测试与其他星座的匹配度</span>
        </router-link>
        <router-link to="/personality" class="feature-card animate-slide-up">
          <span class="feature-icon">🧠</span>
          <span class="feature-label">性格分析</span>
          <span class="feature-desc">了解你的星座性格特点</span>
        </router-link>
        <router-link to="/ai" class="feature-card animate-slide-up">
          <span class="feature-icon">🤖</span>
          <span class="feature-label">AI问答</span>
          <span class="feature-desc">向AI咨询星座相关问题</span>
        </router-link>
        <router-link to="/knowledge" class="feature-card animate-slide-up">
          <span class="feature-icon">📚</span>
          <span class="feature-label">占星知识</span>
          <span class="feature-desc">学习占星学相关知识</span>
        </router-link>
        <router-link to="/calendar" class="feature-card animate-slide-up">
          <span class="feature-icon">📅</span>
          <span class="feature-label">星座日历</span>
          <span class="feature-desc">查看星座相关重要日期</span>
        </router-link>
        <router-link to="/test-center" class="feature-card animate-slide-up">
          <span class="feature-icon">📝</span>
          <span class="feature-label">星座测试</span>
          <span class="feature-desc">参加有趣的星座测试</span>
        </router-link>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-list">
        <div
          v-for="post in sortedPosts"
          :key="post.id"
          class="post-card animate-slide-up"
        >
          <div class="post-header">
            <div class="author-info">
              <div class="author-avatar">{{ post.avatar }}</div>
              <div class="author-details">
                <span class="author-name">{{ post.author }}</span>
                <span class="author-zodiac">{{ post.zodiac }}</span>
              </div>
            </div>
            <span class="post-time">{{ formatDate(post.timestamp) }}</span>
          </div>

          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-text">{{ post.content }}</p>
          </div>

          <div class="post-tags">
            <span
              v-for="(tag, index) in post.tags"
              :key="index"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="post-actions">
            <button
              class="action-btn like"
              @click="likePost(post.id)"
            >
              <span class="action-icon">❤️</span>
              <span class="action-count">{{ post.likes }}</span>
            </button>
            <button
              class="action-btn comment"
              @click="showComments(post.id)"
            >
              <span class="action-icon">💬</span>
              <span class="action-count">{{ post.comments }}</span>
            </button>
            <button class="action-btn share">
              <span class="action-icon">📤</span>
              <span class="action-label">分享</span>
            </button>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more">
          <button class="load-btn">加载更多</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-page {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.community-nav {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  box-shadow: var(--shadow-md);
}

.feature-nav {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  border-color: var(--primary);
  background: var(--bg-tertiary);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: var(--space-sm);
}

.feature-label {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
}

.feature-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.4;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  background: transparent;
  border: none;
}

.nav-item:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.nav-item.active {
  background: var(--bg-gradient);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
}

.nav-icon {
  font-size: 20px;
  margin-bottom: var(--space-xs);
}

.nav-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.post-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-white);
  box-shadow: var(--shadow-md);
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.author-zodiac {
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  align-self: flex-start;
}

.post-time {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.post-content {
  margin-bottom: var(--space-md);
}

.post-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.post-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.tag {
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
}

.post-actions {
  display: flex;
  gap: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: transparent;
  border: none;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--bg-secondary);
  color: var(--primary);
  transform: translateY(-1px);
}

.action-btn.like:hover {
  color: #ff4757;
}

.action-btn.comment:hover {
  color: #3742fa;
}

.action-btn.share:hover {
  color: #2ed573;
}

.action-icon {
  font-size: 16px;
}

.action-count {
  font-weight: var(--font-medium);
}

.action-label {
  font-weight: var(--font-medium);
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

.load-btn {
  padding: var(--space-md) var(--space-2xl);
  background: var(--bg-gradient);
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-white);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.load-btn:hover {
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

  .community-nav {
    padding: var(--space-xs);
  }

  .nav-item {
    padding: var(--space-sm);
  }

  .nav-icon {
    font-size: 16px;
  }

  .nav-label {
    font-size: 10px;
  }

  .post-card {
    padding: var(--space-md);
  }

  .author-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .post-title {
    font-size: var(--text-base);
  }

  .post-text {
    font-size: var(--text-sm);
  }

  .action-btn {
    font-size: var(--text-xs);
  }

  .action-icon {
    font-size: 14px;
  }
}
</style>
