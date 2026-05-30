<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSubscriptionStore } from '../store/useSubscription'
import { useI18n } from 'vue-i18n'
import { supabase } from '../supabase'

import AutoComplete from 'primevue/autocomplete'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'

const store = useSubscriptionStore()
const { t } = useI18n()

// Kategoriler
const categories = computed(() => [
  { label: t('categories.entertainment'), value: 'entertainment' },
  { label: t('categories.software'), value: 'software' },
  { label: t('categories.education'), value: 'education' },
  { label: t('categories.bills'), value: 'bills' },
  { label: t('categories.other'), value: 'other' },
])

const currencies = [
  { label: '₺ TRY', value: 'TRY' },
  { label: '$ USD', value: 'USD' },
  { label: '€ EUR', value: 'EUR' },
]

const formData = ref({
  price: null as number | null,
  currency: 'TRY',
  category: '',
  domain: '',
})

type ServiceOption = { name: string; domain: string; category: string }
const selectedService = ref<ServiceOption | string>('')
const filteredServices = ref<ServiceOption[]>([])

const searchService = async (event: { query: string }) => {
  const query = event.query.toLowerCase()
  if (!query.trim().length) return
  const { data } = await supabase.from('services').select('*').ilike('name', `%${query}%`).limit(5)
  filteredServices.value = data || []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLogoUrl = (option: any) => {
  if (typeof option === 'object' && option.domain)
    return `https://www.google.com/s2/favicons?domain=${option.domain}&sz=128`
  return `https://ui-avatars.com/api/?name=${option.name || '?'}&background=random&color=fff&bold=true&format=svg`
}

const onServiceSelect = (event: { value: ServiceOption }) => {
  formData.value.category = event.value.category
  formData.value.domain = event.value.domain
}

const handleSubmit = () => {
  const finalName =
    typeof selectedService.value === 'string' ? selectedService.value : selectedService.value.name
  const finalDomain =
    typeof selectedService.value === 'object' ? selectedService.value.domain : null

  if (!finalName || !formData.value.price || !formData.value.category) return

  store.addSubscription({
    name: finalName,
    price: formData.value.price,
    currency: formData.value.currency,
    category: formData.value.category,
    domain: finalDomain || undefined,
  })

  selectedService.value = ''
  formData.value = { price: null, currency: 'TRY', category: '', domain: '' }
}
</script>

<template>
  <div class="rounded-md border border-line bg-canvas overflow-hidden">
    <div class="px-5 py-4 border-b border-line bg-surface/50">
      <h2 class="text-[14px] font-semibold text-main flex items-center gap-2">
        <i class="pi pi-plus-circle text-muted"></i>
        {{ $t('form.title') }}
      </h2>
    </div>

    <div class="p-5">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.nameLabel') }}</label>
          <AutoComplete
            v-model="selectedService"
            :suggestions="filteredServices"
            @complete="searchService"
            @item-select="onServiceSelect"
            optionLabel="name"
            :placeholder="$t('form.namePlaceholder')"
            class="w-full"
            inputClass="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-3">
                <img :src="getLogoUrl(slotProps.option)" class="w-5 h-5 object-contain" />
                <span class="text-main font-medium text-[14px]">{{ slotProps.option.name }}</span>
              </div>
            </template>
          </AutoComplete>
        </div>

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.categoryLabel') }}</label>
          <Select
            v-model="formData.category"
            :options="categories"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('form.categoryPlaceholder')"
            class="w-full h-9 flex items-center text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.priceLabel') }}</label>
          <div class="flex gap-2">
            <InputNumber
              v-model="formData.price"
              mode="currency"
              :currency="formData.currency"
              locale="tr-TR"
              placeholder="0,00"
              class="flex-1"
              inputClass="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
            />
            <Select
              v-model="formData.currency"
              :options="currencies"
              optionValue="value"
              optionLabel="label"
              class="w-24 h-9 flex items-center border border-line bg-surface px-2 text-sm rounded-md transition-colors duration-200 focus:border-main"
            />
          </div>
        </div>

        <Button
          type="submit"
          :label="$t('form.saveButton')"
          icon="pi pi-check"
          class="w-full mt-2 h-9 bg-main text-canvas hover:bg-main/90 active:scale-[0.98] text-[13px] font-medium rounded-md transition-all duration-200 flex justify-center"
        />

      </form>
    </div>
  </div>
</template>
