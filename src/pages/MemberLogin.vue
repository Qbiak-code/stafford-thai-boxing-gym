<template>
  <div class="member-login-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Member Portal Login</h1>
    </div>

    <section class="section auth-section">
      <authenticator>
        <template v-slot="{ user, signOut }">
          <div v-if="user">
            <h2>Welcome, {{ user.username || user.attributes.email }}!</h2>
            <p>You are now logged in to the Member Portal.</p>
            <p>User ID: {{ user.userId }}</p>
            <button @click="signOut" class="btn btn-primary">Sign Out</button>
            <router-link to="/member/dashboard" class="btn btn-secondary"
              >Go to Dashboard</router-link
            >
          </div>
        </template>
      </authenticator>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue"
import "@aws-amplify/ui-vue/styles.css"
</script>

<style scoped>
.member-login-page {
  padding: 40px 20px;
  text-align: center;
  background-color: #1a1a1a;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-hero {
  margin-bottom: 30px;
}

.auth-section {
  max-width: 500px;
  width: 100%;
  background-color: #2c2c2c;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

amplify-authenticator {
  --amplify-colors-brand-primary-80: #e74c3c;
  --amplify-colors-brand-primary-60: #c0392b;
  --amplify-colors-brand-primary-10: #a52a22;
  --amplify-colors-font-inverse: white;
  --amplify-components-tabs-item-color: #e0e0e0;
  --amplify-components-tabs-item-active-border-color: #e74c3c;
}
</style>
