<template>
  <v-container class="my-12">
    <h1 class="text-h3 font-weight-bold text-center mb-8">About Our Gym</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-img src="https://picsum.photos/id/211/800/600" class="rounded-lg elevation-8 mb-4"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-h4 mb-4">Our Story</h2>
        <p class="text-body-1">
          Founded in [Year], Stafford Muay Thai was born from a passion for the sport and a desire to build a strong, supportive community. We believe that Muay Thai is for everyone, regardless of age, gender, or fitness level. Our mission is to provide the highest quality instruction in a safe and welcoming environment.
        </p>
      </v-col>
    </v-row>

    <h2 class="text-h3 font-weight-bold text-center my-12">Meet The Coaches</h2>
    <v-row>
      <v-col cols="12" md="4" sm="6" v-for="coach in coaches" :key="coach.name">
        <v-card class="text-center" hover>
          <v-img :src="coach.img" height="300px" cover></v-img>
          <v-card-title>{{ coach.name }}</v-card-title>
          <v-card-subtitle>{{ coach.title }}</v-card-subtitle>
          <v-card-text>{{ coach.bio }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const coaches = [
  { name: 'Head Coach Name', title: 'Head Coach & Founder', bio: 'A brief bio about the coach, their experience, and their passion.', img: 'https://picsum.photos/id/1005/400/400' },
  { name: 'Assistant Coach', title: 'Muay Thai Instructor', bio: 'Specialises in beginner techniques and fitness conditioning.', img: 'https://picsum.photos/id/1011/400/400' },
  { name: 'Strength Coach', title: 'Strength & Conditioning', bio: 'Focuses on building the power and endurance needed for combat sports.', img: 'https://picsum.photos/id/1025/400/400' },
]
</script>
