import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export type Subscription = {
  id?: string
  name: string
  price: number
  category: string
  currency: string
  domain?: string | null
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref<Subscription[]>([])

  const isLoading = ref(false)
  const exchangeRates = ref<Record<string, number>>({ TRY: 1, USD: 0.031, EUR: 0.028 })

  const fetchExchangeRates = async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY')
      const data = await res.json()
      exchangeRates.value = data.rates
    } catch (e) {
      console.error('Kur bilgileri çekilemedi, sistem varsayılanları kullanıyor.')
    }
  }

  fetchExchangeRates()

  const getPriceInTRY = (price: number, currency: string) => {
    if (currency === 'TRY') return price
    const rate = exchangeRates.value[currency] || 1
    const calculated = price / rate
    return Number(calculated.toFixed(2))
  }

  const totalMonthlyCost = computed(() => {
    const total = subscriptions.value.reduce((acc, sub) => {
      return acc + getPriceInTRY(sub.price, sub.currency || 'TRY')
    }, 0)
    return Number(total.toFixed(2))
  })

 const fetchSubscriptions = async () => {
    isLoading.value = true
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) subscriptions.value = data || []
    isLoading.value = false
  }
const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
        category: sub.category,
        domain: sub.domain,
        user_id: authData.user.id
      }])
      .select()
      .single()

    if (!error && data) subscriptions.value.unshift(data)
  }

 const updateSubscription = async (sub: Subscription) => {
    if (!sub.id) return
    const { error } = await supabase
      .from('subscriptions')
      .update({
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
        category: sub.category,
        domain: sub.domain
      })
      .eq('id', sub.id)

    if (!error) {
      const index = subscriptions.value.findIndex(s => s.id === sub.id)
      if (index !== -1) subscriptions.value[index] = { ...sub }
    }
  }

  const removeSubscription = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions').delete().eq('id', id)
    if (!error) {
      subscriptions.value = subscriptions.value.filter(s => s.id !== id)
    }
  }
  return {
    subscriptions,
    isLoading,
    totalMonthlyCost,
    exchangeRates,
    getPriceInTRY,
    fetchSubscriptions,
    addSubscription,
    updateSubscription,
    removeSubscription
  }
})
