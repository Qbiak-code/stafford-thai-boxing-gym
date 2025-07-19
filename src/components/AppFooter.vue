<template>
  <v-footer color="surface" class="py-5">
    <v-container>
      <v-row justify="center" class="text-center">
        <v-col cols="12">
          <v-img src="/logo.png" height="60" contain class="mx-auto mb-3" />
        </v-col>
        <v-col cols="12" md="8">
          <p>&copy; {{ new Date().getFullYear() }} Stafford Muay Thai. The Art of Eight Limbs. All Rights Reserved.</p>
          <p class="mt-2 text-grey-darken-1">
            Built by Fil. Powered by Vue.js & Vuetify.
          </p>
        </v-col>
        <v-col cols="12" class="mt-3">
          <v-btn icon="mdi-facebook" class="mx-2" variant="text"></v-btn>
          <v-btn icon="mdi-instagram" class="mx-2" variant="text"></v-btn>
          <v-btn icon="mdi-youtube" class="mx-2" variant="text"></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
