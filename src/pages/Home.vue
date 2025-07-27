<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- Hero Section -->
    <section
      class="hero-section relative overflow-hidden"
      style="height: 90vh"
    >
      <!-- Background Image with Multiple Overlays -->
      <div class="absolute inset-0">
        <!-- Base image -->
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        ></div>

        <!-- Primary overlay - different for light/dark -->
        <div class="absolute inset-0 bg-hero-pattern dark:bg-hero-pattern-dark"></div>

        <!-- Additional gradient overlay for depth -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/20 dark:to-gray-950/40"></div>

        <!-- Subtle animated gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 animate-pulse-soft"></div>
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

          <h2 class="text-xl md:text-3xl lg:text-4xl font-light mb-12 text-gray-100 dark:text-gray-200 drop-shadow-lg">
            Join Stafford's Premier Muay Thai Gym
          </h2>

          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <router-link
              to="/timetable"
              class="group inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-strong hover:shadow-glow btn-glow transform hover:scale-105"
            >
              <span>View Timetable</span>
              <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </router-link>

            <router-link
              to="/contact"
              class="group inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-strong hover:shadow-glow-red transform hover:scale-105"
            >
              <span>Start Training</span>
              <svg class="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Floating elements for visual interest -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-float" style="animation-delay: -3s;"></div>
    </section>

    <!-- Welcome Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <!-- Content -->
          <div class="lg:w-1/2 space-y-8">
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white">
              Welcome to
              <span class="gradient-text">Stafford Thaiboxing Gym</span>
            </h2>

            <p class="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              We are more than just a gym; we are a <strong class="text-primary-500">community</strong> dedicated to the practice and philosophy
              of Muay Thai. Whether you're a complete beginner or a seasoned competitor, our
              world-class coaches are here to guide you on your journey.
            </p>

            <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              We focus on <span class="text-secondary-500 font-semibold">technique</span>,
              <span class="text-primary-500 font-semibold">conditioning</span>, and
              <span class="text-secondary-500 font-semibold">mental discipline</span> to help you achieve your goals.
            </p>

            <!-- Feature highlights -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div class="text-center p-6 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
                <div class="w-12 h-12 bg-primary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="font-display text-lg font-bold text-primary-700 dark:text-primary-300">Expert Training</h3>
              </div>

              <div class="text-center p-6 rounded-2xl bg-secondary-50 dark:bg-secondary-950/30 border border-secondary-200 dark:border-secondary-800">
                <div class="w-12 h-12 bg-secondary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 class="font-display text-lg font-bold text-secondary-700 dark:text-secondary-300">Community</h3>
              </div>

              <div class="text-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div class="w-12 h-12 bg-gray-600 dark:bg-gray-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="font-display text-lg font-bold text-gray-700 dark:text-gray-300">All Levels</h3>
              </div>
            </div>
          </div>

          <!-- Image -->
          <div class="lg:w-1/2">
            <div class="relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <img
                src="https://picsum.photos/id/111/800/600"
                alt="Muay Thai Training"
                class="relative w-full rounded-2xl shadow-strong aspect-[4/3] object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { gsap } from "gsap"

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
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.text-shadow-lg {
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
}

.hero-section {
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(59, 130, 246, 0.3)),
    url("/src/assets/hero-bg.jpg") center/cover;

  .transparent {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
</style>
