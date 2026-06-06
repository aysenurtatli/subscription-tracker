<script setup lang="ts">
import { useRouter } from 'vue-router'
import { supabase } from './supabase'
import { useSubscriptionStore } from './store/useSubscription'

const router = useRouter()
const store = useSubscriptionStore()

// Supabase oturum değişikliklerini merkezi olarak dinle
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
    // Giriş yapıldığında Dashboard'a yönlendir
    router.push('/dashboard')
  } else if (event === 'SIGNED_OUT') {
    // Çıkış yapıldığında verileri temizle ve tanıtım sayfasına yönlendir
    store.subscriptions = []
    router.push('/')
  } else if (event === 'PASSWORD_RECOVERY') {
    // Şifre yenileme linki tıklandığında
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-canvas text-main transition-colors duration-200">
    <!-- Router'daki path neyse o view buraya yerleşecek -->
    <router-view />
  </div>
</template>
