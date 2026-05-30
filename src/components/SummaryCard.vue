<script setup lang="ts">
import { useSubscriptionStore } from '../store/useSubscription'
const store = useSubscriptionStore()
</script>

<template>
  <div class="bg-canvas border border-line px-6 py-4 rounded-md flex items-center justify-between">
    <span class="text-muted text-sm font-semibold uppercase tracking-wide">
      {{ $t('app.totalExpense') }}
    </span>
    <span class="text-main text-xl font-bold">
      {{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(store.totalMonthlyCost) }}
    </span>
  </div>
</template>
