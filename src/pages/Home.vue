<template>
  <div>
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="80vh"
      dark
    >
      <v-container>
        <h1 ref="headline" class="text-h2 font-weight-bold mb-4 text-shadow">
          Master the Art of Eight Limbs
        </h1>
        <h2 class="text-h5 font-weight-light mb-8 text-shadow">
          Join Stafford's Premier Muay Thai Gym
        </h2>
        <v-btn color="secondary" size="large" to="/timetable">View Timetable</v-btn>
      </v-container>
    </v-sheet>

    <v-container class="my-12">
      <v-row align="center">
        <v-col cols="12" md="6">
          <h2 class="text-h4 font-weight-bold mb-4">Welcome to Stafford Muay Thai</h2>
          <p class="text-body-1">
            We are more than just a gym; we are a community dedicated to the practice and philosophy of Muay Thai. Whether you're a complete beginner or a seasoned competitor, our world-class coaches are here to guide you on your journey. We focus on technique, conditioning, and mental discipline to help you achieve your goals.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="https://picsum.photos/id/111/800/600" class="rounded-lg elevation-8" aspect-ratio="1.5"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const headline = ref(null)

onMounted(() => {
  gsap.from(headline.value, {
    duration: 1.5,
    opacity: 0,
    y: -50,
    ease: 'power3.out',
  })
})
</script>

<style scoped>
.hero-section {
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('@/assets/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
