<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()
const featuresSection = ref<HTMLElement>()

// Redirect to todos if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace({ name: 'todos' })
  }
})

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">✨ Organize your life efficiently</span>
          </div>
          <h1 class="hero-title">Welcome to <span class="title-accent">Todo App</span></h1>
          <p class="hero-description">
            A modern and intuitive todo management system designed to help you stay organized,
            productive, and in control of your daily tasks. Built with cutting-edge technology for
            the best user experience.
          </p>
          <div class="hero-actions">
            <Button
              label="Get Started"
              icon="pi pi-arrow-right"
              class="hero-btn primary-btn"
              size="large"
              @click="$router.push({ name: 'todos' })"
            />
            <Button
              label="Learn More"
              icon="pi pi-info-circle"
              class="hero-btn secondary-btn"
              size="large"
              outlined
              @click="scrollToFeatures"
            />
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card">
            <div class="card-header">
              <div class="card-controls">
                <span class="control red"></span>
                <span class="control yellow"></span>
                <span class="control green"></span>
              </div>
            </div>
            <div class="card-content">
              <div class="mock-todo completed">
                <i class="pi pi-check-circle"></i>
                <span>Review project proposal</span>
              </div>
              <div class="mock-todo">
                <i class="pi pi-circle"></i>
                <span>Schedule team meeting</span>
              </div>
              <div class="mock-todo">
                <i class="pi pi-circle"></i>
                <span>Update documentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2 class="section-title">Everything you need to stay organized</h2>
          <p class="section-description">
            Powerful features designed to make task management effortless and enjoyable
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon create">
              <i class="pi pi-plus-circle"></i>
            </div>
            <h3 class="feature-title">Quick Creation</h3>
            <p class="feature-description">
              Add new todos instantly with our streamlined interface. Set due dates, priorities, and
              descriptions with just a few clicks.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon filter">
              <i class="pi pi-filter"></i>
            </div>
            <h3 class="feature-title">Smart Filtering</h3>
            <p class="feature-description">
              Find exactly what you need with advanced filtering options. Sort by status, due dates,
              priorities, and custom criteria.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon responsive">
              <i class="pi pi-mobile"></i>
            </div>
            <h3 class="feature-title">Responsive Design</h3>
            <p class="feature-description">
              Access your todos from anywhere, on any device. Optimized for desktop, tablet, and
              mobile experiences.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon secure">
              <i class="pi pi-shield"></i>
            </div>
            <h3 class="feature-title">Secure & Private</h3>
            <p class="feature-description">
              Your data is protected with industry-standard security measures. Private by design
              with robust authentication.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon realtime">
              <i class="pi pi-bolt"></i>
            </div>
            <h3 class="feature-title">Real-time Updates</h3>
            <p class="feature-description">
              Changes sync instantly across all your devices. Never lose track of your progress with
              real-time synchronization.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon analytics">
              <i class="pi pi-chart-line"></i>
            </div>
            <h3 class="feature-title">Progress Tracking</h3>
            <p class="feature-description">
              Monitor your productivity with built-in analytics. Track completion rates and identify
              patterns in your workflow.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to get organized?</h2>
          <p class="cta-description">
            Join thousands of users who have transformed their productivity with our todo app.
          </p>
          <Button
            label="Start Organizing Today"
            icon="pi pi-arrow-right"
            class="cta-btn"
            size="large"
            @click="$router.push({ name: 'todos' })"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  min-height: calc(100vh - 70px);
  background: #ffffff;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(90, 109, 130, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(102, 124, 154, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
}

.badge-text {
  background: linear-gradient(135deg, #667c9a, #5a6d82);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0;
}

.title-accent {
  background: linear-gradient(135deg, #5a6d82, #667c9a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn {
  height: 56px;
  padding: 0 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border: none;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(90, 109, 130, 0.3);
}

.secondary-btn {
  border-color: #5a6d82;
  color: #5a6d82;
}

.secondary-btn:hover {
  background: #5a6d82;
  color: white;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  border: 1px solid #e2e8f0;
}

.card-header {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red {
  background: #ef4444;
}
.control.yellow {
  background: #f59e0b;
}
.control.green {
  background: #22c55e;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mock-todo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.mock-todo.completed {
  background: #f0f9ff;
  border-color: #22c55e;
}

.mock-todo.completed span {
  text-decoration: line-through;
  opacity: 0.7;
}

.mock-todo i {
  color: #5a6d82;
  font-size: 1.125rem;
}

.mock-todo.completed i {
  color: #22c55e;
}

.mock-todo span {
  color: #374151;
  font-weight: 500;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: white;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
}

.section-description {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5a6d82, #667c9a);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.feature-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  font-size: 2rem;
  color: white;
}

.feature-icon.create {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}
.feature-icon.filter {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}
.feature-icon.responsive {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}
.feature-icon.secure {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}
.feature-icon.realtime {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
.feature-icon.analytics {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.feature-description {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 30% 40%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.025em;
}

.cta-description {
  font-size: 1.25rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
}

.cta-btn {
  height: 56px;
  padding: 0 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  background: white;
  color: #1e293b;
  border: none;
  transition: all 0.2s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 4rem 0;
  }

  .hero-container {
    padding: 0 1rem;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-btn {
    width: 100%;
    justify-content: center;
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-section {
    padding: 4rem 0;
  }

  .cta-section {
    padding: 3rem 0;
  }
}
</style>
