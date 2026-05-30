<script setup lang="ts">
import { computed } from 'vue'
import { useSubscriptionStore } from '../store/useSubscription'
import { useI18n } from 'vue-i18n'

const store = useSubscriptionStore()
const { t } = useI18n()

const categoryColors: Record<string, string> = {
  entertainment: '#8b5cf6',
  software: '#3052ce',
  education: '#10b981',
  bills: '#ef4444',
  other: '#f59e0b'
}

const chartData = computed(() => {
  const total = store.totalMonthlyCost
  if (total === 0) return []

  const categoryTotals = store.subscriptions.reduce((acc: Record<string, number>, sub) => {
    const amountTRY = store.getPriceInTRY(sub.price, sub.currency || 'TRY')
    acc[sub.category] = (acc[sub.category] || 0) + amountTRY
    return acc
  }, {})

  return Object.keys(categoryTotals)
    .map(cat => ({
      id: cat,
      label: t(`categories.${cat}`),
      amount: categoryTotals[cat],
      percentage: ((categoryTotals[cat] / total) * 100).toFixed(1),
      color: categoryColors[cat] || '#94a3b8'
    }))
    .sort((a, b) => b.amount - a.amount)
})
</script>

<template>
  <div class="rounded-md border border-line bg-canvas p-5 h-full flex flex-col">

    <div class="flex justify-between items-start mb-6">
      <h2 class="text-[14px] font-semibold text-main flex items-center gap-2">
        <i class="pi pi-chart-bar text-muted"></i>
        {{ $t('dashboard.spending') || 'Harcama Dağılımı' }}
      </h2>
      <div class="text-right">
        <span class="block text-[11px] text-muted font-semibold uppercase tracking-wider mb-0.5">Toplam</span>
        <span class="text-lg font-bold text-main tracking-tight leading-none">
          {{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(store.totalMonthlyCost) }}
        </span>
      </div>
    </div>

    <template v-if="chartData.length > 0">
      <div class="flex w-full h-2.5 rounded-full overflow-hidden mb-6 bg-surface">
        <div
          v-for="item in chartData"
          :key="item.id"
          :style="{ width: `${item.percentage}%`, backgroundColor: item.color }"
          class="h-full transition-all duration-500 hover:brightness-110"
          :title="`${item.label}: %${item.percentage}`"
        ></div>
      </div>

      <div class="flex flex-col gap-2.5 mt-auto">
        <div v-for="item in chartData" :key="item.id" class="flex items-center justify-between group">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
            <span class="text-[13px] text-muted font-medium group-hover:text-main transition-colors">{{ item.label }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[13px] font-medium text-main">
              {{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount) }}
            </span>
            <span class="text-[12px] font-semibold text-muted w-10 text-right">%{{ item.percentage }}</span>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex-1 flex flex-col items-center justify-center text-muted border border-dashed border-line rounded-md bg-surface/30 mt-2">
      <i class="pi pi-receipt text-2xl opacity-40 mb-2"></i>
      <span class="text-[13px] font-medium">Veri bekleniyor...</span>
    </div>

  </div>
</template>
