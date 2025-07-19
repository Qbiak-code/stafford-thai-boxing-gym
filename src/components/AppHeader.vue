<template>
  <v-app-bar app color="surface" elevation="2">
    <v-container class="d-flex align-center">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-toolbar-title class="font-weight-bold text-white">
          Stafford Thai Boxing Gym
        </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex">
        <v-btn v-for="item in navItems" :key="item.title" :to="item.to" class="mx-1" variant="text">
          {{ item.title }}
        </v-btn>
      </div>

      <v-btn color="secondary" to="/contact" class="ml-4 d-none d-md-flex">
        Join Now
      </v-btn>

      <v-app-bar-nav-icon class="d-md-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary :location="$vuetify.display.mobile ? 'top' : undefined" color="surface">
    <v-list>
      <v-list-item v-for="item in navItems" :key="item.title" :to="item.to" link>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})
const navItems = [
  { title: 'Home', to: '/', icon: 'home' },
  { title: 'About', to: '/about', icon: 'face' },
  { title: 'Timetable', to: '/timetable', icon: 'face' },
  { title: 'Gallery', to: '/gallery', icon: 'face' },
  { title: 'Contact', to: '/contact', icon: 'face' },
  { title: 'Member Zone', to: '/member/dashboard', icon: 'face' },
]
</script>
