<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import type { Session } from '@supabase/supabase-js'
import { useSubscriptionStore } from '../store/useSubscription'
import AppHeader from '../components/AppHeader.vue'
import SubscriptionForm from '../components/SubscriptionForm.vue'
import SummaryCard from '../components/SummaryCard.vue'
import SummaryChart from '../components/SummaryChart.vue'
import SubscriptionList from '../components/SubscriptionList.vue'
import AppFooter from '../components/AppFooter.vue'

const session = ref<Session | null>(null)
const store = useSubscriptionStore()

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  if (session.value) {
    store.fetchSubscriptions()
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <AppHeader :session="session" />
    <main>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
        <div class="lg:col-span-2">
          <SubscriptionList />
        </div>
        <div class="lg:col-span-1 flex flex-col gap-6 sticky top-6">
          <SummaryCard class="mb-0!" />
          <SummaryChart />
          <SubscriptionForm />
        </div>
      </div>
    </main>
    <AppFooter class="mt-8" />
  </div>
</template>
