<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSubscriptionStore, type Subscription } from '../store/useSubscription'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const store = useSubscriptionStore()
const { t } = useI18n()
const confirm = useConfirm()

const getLogoUrl = (domain?: string, name?: string) => {
  if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  return `https://ui-avatars.com/api/?name=${name || '?'}&background=random&color=fff&bold=true&format=svg`
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(value)
}

const currencies = [
  { label: '₺ TRY', value: 'TRY' },
  { label: '$ USD', value: 'USD' },
  { label: '€ EUR', value: 'EUR' },
]

const displayEditDialog = ref(false)
const editData = ref<Subscription>({
  id: '',
  name: '',
  price: 0,
  currency: 'TRY',
  category: '',
  domain: '',
})

const categories = computed(() => [
  { label: t('categories.entertainment'), value: 'entertainment' },
  { label: t('categories.software'), value: 'software' },
  { label: t('categories.education'), value: 'education' },
  { label: t('categories.bills'), value: 'bills' },
  { label: t('categories.other'), value: 'other' },
])

const openEdit = (sub: Subscription) => {
  editData.value = { ...sub }
  displayEditDialog.value = true
}

const saveEdit = () => {
  if (!editData.value.name || !editData.value.price || !editData.value.category) return
  store.updateSubscription(editData.value)
  displayEditDialog.value = false
}

const confirmDelete = (id: string, name: string) => {
  confirm.require({
    message: `${name} aboneliğini silmek istediğinize emin misiniz?`,
    header: 'Aboneliği Sil',
    icon: 'pi pi-exclamation-triangle text-red-500',
    rejectLabel: t('edit.cancel') || 'İptal',
    acceptLabel: 'Sil',
    accept: () => {
      store.removeSubscription(id)
    }
  })
}

const searchQuery = ref('')
const filterCategory = ref('all')
const sortOrder = ref('default')

const filterOptions = computed(() => [
  { label: t('categories.all'), value: 'all' },
  ...categories.value,
])

const sortOptions = computed(() => [
  { label: t('sort.default'), value: 'default' },
  { label: t('sort.priceAsc'), value: 'priceAsc' },
  { label: t('sort.priceDesc'), value: 'priceDesc' },
])

const displayedSubscriptions = computed(() => {
  let result = [...store.subscriptions]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((sub) => sub.name.toLowerCase().includes(query))
  }

  if (filterCategory.value !== 'all') {
    result = result.filter((sub) => sub.category === filterCategory.value)
  }

  if (sortOrder.value === 'priceAsc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'priceDesc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})
</script>

<template>
  <div class="rounded-md border border-line bg-canvas overflow-hidden flex flex-col h-full">

    <div class="px-5 py-4 border-b border-line flex justify-between items-center bg-surface/50 shrink-0">
      <h2 class="text-[15px] font-semibold text-main flex items-center gap-2">
        <i class="pi pi-list text-muted"></i>
        {{ $t('list.title') }}
      </h2>
      <span class="text-xs font-medium text-muted bg-surface px-2.5 py-1 rounded-md border border-line">
        {{ displayedSubscriptions.length }} / {{ store.subscriptions.length }}
      </span>
    </div>

    <div class="px-5 py-4 border-b border-line flex flex-col md:flex-row gap-4 justify-between items-center bg-canvas shrink-0">
      <div class="relative w-full md:w-1/3">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10"></i>
        <InputText
          v-model="searchQuery"
          :placeholder="$t('list.searchPlaceholder')"
          class="w-full pl-10 h-9 text-sm bg-surface border border-line transition-colors duration-200 focus:border-main focus:ring-0 outline-none rounded-md"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Select
          v-model="filterCategory"
          :options="filterOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('list.categoryPlaceholder')"
          class="w-full sm:w-40 h-9 flex items-center px-3 border border-line bg-surface text-sm rounded-md transition-colors duration-200 focus:border-main"
        />
        <Select
          v-model="sortOrder"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('list.sortPlaceholder')"
          class="w-full sm:w-44 h-9 flex items-center px-3 border border-line bg-surface text-sm rounded-md transition-colors duration-200 focus:border-main"
        />
      </div>
    </div>

    <div class="overflow-y-auto custom-scroll max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-220px)]">
      <ul v-if="displayedSubscriptions.length > 0" class="flex flex-col">
        <li
          v-for="sub in displayedSubscriptions"
          :key="sub.id"
          class="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-line last:border-none transition-colors duration-200 hover:bg-surface gap-4 sm:gap-0"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-canvas rounded-md border border-line shrink-0">
              <img
                :src="getLogoUrl(sub.domain, sub.name)"
                :alt="sub.name"
                class="w-5 h-5 object-contain"
              />
            </div>

            <div class="flex flex-col">
              <span class="font-medium text-main text-[15px]">{{ sub.name }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-muted/50"></span>
                <span class="text-xs text-muted">{{ $t(`categories.${sub.category}`) }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
            <div class="flex flex-col items-end">
              <span class="font-semibold text-main text-[15px]">
                {{ formatCurrency(sub.price, sub.currency || 'TRY') }}
              </span>
              <span
                v-if="sub.currency && sub.currency !== 'TRY'"
                class="text-xs text-muted mt-0.5"
              >
                ~ {{ formatCurrency(store.getPriceInTRY(sub.price, sub.currency), 'TRY') }}
              </span>
            </div>

            <div class="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              <Button
                icon="pi pi-pencil"
                text
                title="Düzenle"
                class="text-muted hover:text-main p-1.5 w-8 h-8 rounded-md transition-colors"
                @click="openEdit(sub)"
              />
              <Button
                icon="pi pi-trash"
                text
                title="Sil"
                class="text-muted hover:text-red-500 p-1.5 w-8 h-8 rounded-md transition-colors"
                @click="confirmDelete(sub.id, sub.name)"
              />
            </div>
          </div>
        </li>
      </ul>

      <div v-else-if="store.subscriptions.length === 0" class="flex flex-col items-center justify-center py-16 text-muted">
        <i class="pi pi-inbox text-2xl text-muted/50 mb-3"></i>
        <p class="text-sm">{{ $t('list.emptyTotal') }}</p>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16 text-muted">
        <i class="pi pi-filter-slash text-2xl text-muted/50 mb-3"></i>
        <p class="text-sm">{{ $t('list.emptySearch') }}</p>
        <Button
          :label="$t('list.clearFilters')"
          text
          class="mt-3 text-main hover:underline text-sm p-0"
          @click="searchQuery = ''; filterCategory = 'all'; sortOrder = 'default'"
        />
      </div>
    </div>
    <Dialog
      v-model:visible="displayEditDialog"
      modal
      :header="$t('edit.title')"
      :style="{ width: '26rem', maxWidth: '95vw' }"
      :pt="{
        header: { class: 'border-b border-line px-5 py-4 bg-canvas' },
        content: { class: 'px-5 py-5 bg-canvas' },
        footer: { class: 'border-t border-line px-5 py-4 bg-surface flex justify-end gap-2' },
      }"
    >
      <div class="flex flex-col gap-5">
        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.nameLabel') }}</label>
          <InputText
            v-model="editData.name"
            class="w-full h-9 text-sm border border-line bg-surface rounded-md transition-colors duration-200 focus:border-main focus:ring-0 outline-none px-3"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.categoryLabel') }}</label>
          <Select
            v-model="editData.category"
            :options="categories"
            optionLabel="label"
            optionValue="value"
            class="w-full h-9 flex items-center text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('form.priceLabel') }}</label>
          <div class="flex gap-2">
            <InputNumber
              v-model="editData.price"
              mode="currency"
              :currency="editData.currency"
              locale="tr-TR"
              class="flex-1"
              inputClass="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
            />
            <Select
              v-model="editData.currency"
              :options="currencies"
              optionValue="value"
              optionLabel="label"
              class="w-24 h-9 flex items-center border border-line bg-surface px-2 text-sm rounded-md transition-colors duration-200 focus:border-main"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          :label="$t('edit.cancel')"
          text
          class="text-muted hover:text-main px-4 py-2 text-sm font-medium transition-colors"
          @click="displayEditDialog = false"
        />
        <Button
          :label="$t('edit.save')"
          class="bg-main border border-main text-canvas hover:bg-main/90 text-sm font-medium rounded-md px-4 py-2 transition-colors"
          @click="saveEdit"
        />
      </template>
    </Dialog>

    <ConfirmDialog
      :style="{ width: '26rem', maxWidth: '95vw' }"
      :pt="{
        header: { class: 'border-b border-line px-5 py-4 bg-canvas' },
        content: { class: 'px-5 py-5 text-main bg-canvas flex items-center gap-3 text-sm' },
        footer: { class: 'border-t border-line px-5 py-4 bg-surface flex justify-end gap-2' },
        acceptButton: { class: 'bg-red-600 hover:bg-red-700 border-none text-white text-sm font-medium rounded-md px-4 py-2 transition-colors' },
        rejectButton: { class: 'text-muted hover:text-main px-4 py-2 text-sm font-medium bg-transparent border-none transition-colors' }
      }"
    ></ConfirmDialog>
  </div>
</template>


<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
}
.custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
}
:global(.dark) .custom-scroll:hover::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>
