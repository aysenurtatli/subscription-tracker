import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase' // Supabase yolunun doğru olduğundan emin ol

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // Sayfa bileşenlerini "Lazy Load" ile yüklüyoruz (Performans için en iyisi)
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true } // Sadece giriş YAPMAMIŞ kişiler görebilir
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true } // Sadece giriş YAPMIŞ kişiler görebilir
    },
    // ... diğer rotalar
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register', // YENİ ROTA
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
// ...
  ]
})

// Bekçi (Navigation Guard): Her sayfa geçişinden önce burası çalışır
router.beforeEach(async (to, from, next) => {
  // Supabase'den anlık oturum durumunu çekiyoruz
  const { data: { session } } = await supabase.auth.getSession()

  // 1. Kural: Sayfa giriş gerektiriyorsa ve oturum YOKSA -> Login'e yolla
  if (to.meta.requiresAuth && !session) {
    next({ name: 'login' })
  }
  // 2. Kural: Sayfa misafir gerektiriyorsa (örn: Login) ve oturum VARSA -> Dashboard'a yolla
  else if (to.meta.requiresGuest && session) {
    next({ name: 'dashboard' })
  }
  // 3. Kural: Sorun yoksa -> Gitmek istediği sayfaya devam etsin
  else {
    next()
  }
})

export default router
