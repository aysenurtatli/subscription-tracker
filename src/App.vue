<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'

import { useSubscriptionStore } from './store/useSubscription'

import Auth from './components/Auth.vue'
import AppHeader from './components/AppHeader.vue'
import SubscriptionForm from './components/SubscriptionForm.vue'
import SummaryCard from './components/SummaryCard.vue'
import SummaryChart from './components/SummaryChart.vue'
import SubscriptionList from './components/SubscriptionList.vue'
import AppFooter from './components/AppFooter.vue'

const session = ref<Session | null>(null)
const store = useSubscriptionStore()

// Şifre sıfırlama durumunu tutuyoruz
const isRecovering = ref(false)

// EN KRİTİK NOKTA: Dinleyiciyi onMounted dışına, kodun en başına aldık!
// Böylece Supabase ne kadar hızlı olursa olsun olayı kaçıramayız.
supabase.auth.onAuthStateChange((event, _session) => {
  if (event === 'PASSWORD_RECOVERY') {
    isRecovering.value = true
  }

  session.value = _session

  if (session.value && !isRecovering.value) {
    store.fetchSubscriptions()
  } else if (!session.value) {
    store.subscriptions = []
  }
})

onMounted(() => {
  // Sayfa yüklendiğinde yedek olarak mevcut session'ı kontrol ediyoruz
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    if (session.value && !isRecovering.value) store.fetchSubscriptions()
  })
})
</script>

<template>
  <div class="min-h-screen bg-canvas text-main p-4 md:p-8 transition-colors duration-200">
    <div class="max-w-6xl mx-auto">

      <Auth
        v-if="!session || isRecovering"
        :is-recovering="isRecovering"
        @recovery-done="isRecovering = false"
      />

      <div v-else>
        <AppHeader :session="session" />
        <main>
           <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
             <div class="lg:col-span-2">
               <SubscriptionList />
             </div>
             <div class="lg:col-span-1 flex flex-col gap-6 sticky top-6">
               <SummaryCard class="!mb-0" />
               <SummaryChart />
               <SubscriptionForm />
             </div>
           </div>
        </main>
        <AppFooter class="mt-8" />
      </div>

    </div>
  </div>
</template>
