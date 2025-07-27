<template>
  <div>
    <!-- Hero Section -->
    <section
      class="hero-section flex items-center justify-center text-center relative overflow-hidden"
      style="height: 80vh"
    >
      <div class="container mx-auto px-4 relative z-10 transparent">
        <h1 ref="headline" class="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg text-white">
          Master the Art of Eight Limbs
        </h1>
        <h2
          class="text-xl md:text-2xl font-light mb-8 text-shadow text-gray-100 dark:text-gray-200"
        >
          Join Stafford's Premier Muay Thai Gym
        </h2>
        <router-link
          to="/timetable"
          class="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
        >
          View Timetable
        </router-link>
      </div>
    </section>

    <!-- Welcome Section -->
    <div class="container mx-auto px-4 py-16 transition-colors duration-200">
      <div class="flex flex-col md:flex-row items-center gap-12">
        <div class="md:w-1/2">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Welcome to Stafford Thai Boxing Gym</h2>
          <p class="text-lg leading-relaxed">
            We are more than just a gym; we are a community dedicated to the practice and philosophy
            of Muay Thai. Whether you're a complete beginner or a seasoned competitor, our
            world-class coaches are here to guide you on your journey. We focus on technique,
            conditioning, and mental discipline to help you achieve your goals.
          </p>
        </div>
        <div class="md:w-1/2">
          <img
            src="https://picsum.photos/id/111/800/600"
            alt="Muay Thai Training"
            class="w-full rounded-lg shadow-2xl aspect-[3/2] object-cover"
          />
        </div>
      </div>
    </div>
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
