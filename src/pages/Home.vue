<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden" style="height: 90vh">
      <!-- Background Image with Multiple Overlays -->
      <div class="absolute inset-0">
        <!-- Base image -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"></div>

        <!-- Additional gradient overlay for depth -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"
        ></div>

        <!-- Subtle colored gradient -->
        <div class="absolute inset-0 hero-gradient-overlay"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-20 flex items-center justify-center h-full">
        <div class="container mx-auto px-6 text-center">
          <h1
            ref="headline"
            class="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-white drop-shadow-2xl"
          >
            Master the Art of
            <span class="gradient-text-hero">Eight Limbs</span>
          </h1>

          <h2 class="text-xl md:text-3xl lg:text-4xl font-light mb-12 text-gray-100 drop-shadow-lg">
            Join Stafford's Premier Muay Thai Gym
          </h2>

          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <router-link
              to="/timetable"
              class="group inline-flex items-center px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl btn-glow transform hover:scale-105"
            >
              <span>View Timetable</span>
              <svg
                class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </router-link>

            <router-link
              to="/contact"
              class="group inline-flex items-center px-8 py-4 bg-red-700 hover:bg-red-800 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Start Training</span>
              <svg
                class="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="container">
        <div class="welcome-grid">
          <!-- Content -->
          <div class="welcome-content">
            <h2 class="section-title">
              Welcome to
              <span class="gradient-text">Stafford Thaiboxing Gym</span>
            </h2>

            <p class="lead-text">
              We are more than just a gym; we are a <strong class="text-gold">community</strong>
              dedicated to the practice and philosophy of Muay Thai. Whether you're a complete
              beginner or a seasoned competitor, our world-class coaches are here to guide you on
              your journey.
            </p>

            <p class="supporting-text">
              We focus on <span class="text-red">technique</span>,
              <span class="text-gold">conditioning</span>, and
              <span class="text-red">mental discipline</span> to help you achieve your goals.
            </p>

            <!-- Feature highlights -->
            <div class="features-grid">
              <div class="feature-card feature-primary">
                <div class="feature-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 class="feature-title">Expert Training</h3>
              </div>

              <div class="feature-card feature-secondary">
                <div class="feature-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 class="feature-title">Community</h3>
              </div>

              <div class="feature-card feature-tertiary">
                <div class="feature-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="feature-title">All Levels</h3>
              </div>
            </div>
          </div>

          <!-- Image -->
          <div class="welcome-image">
            <div class="image-container">
              <img
                src="https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images//colynary-media-inAxUskIN-I-unsplash.jpg"
                alt="Muay Thai Training"
                class="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Training Philosophy Section -->
    <section class="philosophy-section">
      <div class="container">
        <div class="philosophy-content">
          <h2 class="section-title-center">The Art of Eight Limbs</h2>
          <p class="lead-text-center">
            Muay Thai utilises punches, kicks, elbows, and knees, making it one of the most
            comprehensive striking arts. Our training emphasises proper technique, respect for
            tradition, and personal development both inside and outside the ring.
          </p>

          <div class="philosophy-grid">
            <div class="philosophy-column">
              <h3 class="column-title">What You'll Learn</h3>
              <ul class="philosophy-list">
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Fundamental striking techniques
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Defensive movements and clinch work
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Sparring fundamentals and safety
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Physical and mental conditioning
                </li>
              </ul>
            </div>

            <div class="philosophy-column">
              <h3 class="column-title">Training Benefits</h3>
              <ul class="philosophy-list">
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Improved fitness and coordination
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Increased confidence and discipline
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Stress relief and mental clarity
                </li>
                <li class="list-item">
                  <span class="list-bullet"></span>
                  Supportive community environment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section" v-if="!authStore.isAuthenticated">
      <div class="container">
        <div class="cta-content">
          <h2 class="section-title-center">Start Your Journey Today</h2>
          <p class="cta-text">
            Whether you're looking to get fit, learn self-defence, or compete at the highest level,
            we have the right programme for you.
          </p>
          <div class="cta-buttons">
            <router-link to="/contact" class="btn btn-primary btn-lg">
              Book Trial Class
            </router-link>
            <router-link to="/classes" class="btn btn-ghost btn-lg"> View Classes </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { gsap } from "gsap"
import { useAuthStore } from "@/stores/auth"
const authStore = useAuthStore()

const headline = ref<HTMLElement | null>(null)

onMounted(() => {
  if (headline.value) {
    gsap.from(headline.value, {
      duration: 1.5,
      opacity: 0,
      y: -50,
      ease: "power3.out",
    })
  }
})
</script>

<style scoped>
/* Welcome Section */
.welcome-section {
  padding: 5rem 0;
  background-color: var(--bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .welcome-grid {
    grid-template-columns: 1.4fr 1fr;
  }
}

.welcome-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

.lead-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.supporting-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.text-gold {
  color: var(--accent-gold);
  font-weight: 600;
}

.text-red {
  color: var(--accent-red);
  font-weight: 600;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  text-align: center;
  padding: 2rem 1.5rem;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.feature-primary:hover {
  border-color: var(--accent-gold);
}

.feature-secondary:hover {
  border-color: var(--accent-red);
}

.feature-tertiary:hover {
  border-color: var(--text-secondary);
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.feature-primary .feature-icon {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.feature-secondary .feature-icon {
  background-color: var(--accent-red);
  color: var(--text-primary);
}

.feature-tertiary .feature-icon {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.feature-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Welcome Image */
.welcome-image {
  position: relative;
}

.image-container {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.image-container::before {
  content: "";
  position: absolute;
  inset: -0.5rem;
  background: var(--gradient-primary);
  border-radius: 1.5rem;
  opacity: 0.2;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.image-container:hover::before {
  opacity: 0.3;
}

.hero-image {
  position: relative;
  z-index: 2;
  width: 100%;
  height: auto;
  aspect-ratio: 5/6;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: var(--shadow-strong);
  transition: transform 0.3s ease;
}

.image-container:hover .hero-image {
  transform: scale(1.02);
}

/* Training Philosophy Section */
.philosophy-section {
  padding: 4rem 0;
  background-color: var(--bg-primary);
}

.philosophy-content {
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
}

.section-title-center {
  font-size: clamp(1.875rem, 5vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.lead-text-center {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.philosophy-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: left;
}

@media (min-width: 768px) {
  .philosophy-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.philosophy-column {
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.philosophy-column:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.column-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.philosophy-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  display: flex;
  align-items: flex-start;
  color: var(--text-secondary);
  line-height: 1.5;
}

.list-bullet {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--accent-gold);
  border-radius: 50%;
  margin-top: 0.5rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

/* Call to Action Section */
.cta-section {
  padding: 4rem 0;
  background-color: var(--bg-secondary);
}

.cta-content {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.cta-text {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

.hero-section {
  background:
    linear-gradient(135deg, var(--bg-primary), rgba(28, 28, 28, 0.3)),
    url("https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images//hero-bg.jpg")
      center/cover;
}
</style>
