<script setup lang="ts">
import Auth from '../components/Auth.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
    <div class="w-full max-w-6xl">
      <Auth initial-mode="login" />
    </div>
  </div>
</template>
