<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '../supabase'
import type { Session } from '@supabase/supabase-js'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  session: Session
}>()

const { locale, t } = useI18n()
const isDark = ref(false)

const userEmail = computed(() => props.session?.user?.email || 'Kullanıcı')
const avatarUrl = computed(
  () =>
    `https://ui-avatars.com/api/?name=${userEmail.value}&background=random&color=fff&bold=true&format=svg`
)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleLanguage = () => {
  locale.value = locale.value === 'tr' ? 'en' : 'tr'
}

const menu = ref()

const toggleMenu = (event: Event) => {
  menu.value.toggle(event)
}

const displayPasswordDialog = ref(false)
const newPassword = ref('')
const confirmNewPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isUpdating = ref(false)

const openPasswordDialog = () => {
  newPassword.value = ''
  confirmNewPassword.value = ''
  passwordError.value = ''
  passwordSuccess.value = ''
  displayPasswordDialog.value = true
}

const changePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (newPassword.value !== confirmNewPassword.value) {
    passwordError.value = t('auth.passwordMismatch') || 'Şifreler eşleşmiyor.'
    return
  }

  if (newPassword.value.length < 6) {
    passwordError.value = 'Şifre en az 6 karakter olmalıdır.'
    return
  }

  isUpdating.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })
    if (error) throw error

    passwordSuccess.value = t('auth.passwordUpdated') || 'Şifreniz başarıyla güncellendi!'

    setTimeout(() => {
      displayPasswordDialog.value = false
    }, 1500)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    passwordError.value = error.message
  } finally {
    isUpdating.value = false
  }
}
// ---------------------------------

const menuItems = computed(() => [
  {
    label: t('profile.changePassword'),
    icon: 'pi pi-key',
    command: () => {
      openPasswordDialog()
    },
  },
  {
    label: t('app.logout') || 'Çıkış Yap',
    icon: 'pi pi-sign-out',
    command: async () => {
      await supabase.auth.signOut()
    },
  },
])
</script>

<template>
  <header
    class="flex justify-between items-start md:items-center mb-8 gap-6 border-b border-line pb-5"
  >
    <div class="flex flex-col">
      <img src="/prune.svg" width="100" alt="Prune Logo" class="mb-1" />
      <p class="text-muted text-[13px] font-medium">{{ $t('app.subtitle') }}</p>
    </div>

    <div class="flex items-center gap-2 w-full md:w-auto justify-end">

      <Button
        :label="locale === 'tr' ? 'EN' : 'TR'"
        text
        class="text-muted hover:text-main text-[13px] font-bold w-9 h-9 p-0 transition-colors hover:bg-surface rounded-md"
        @click="toggleLanguage"
      />
      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        text
        class="text-muted hover:text-main w-9 h-9 p-0 transition-colors hover:bg-surface rounded-md"
        @click="toggleDarkMode"
      />

      <button
        @click="toggleMenu"
        class="ml-2 focus:outline-none transition-transform hover:scale-105"
        title="Profil Menüsü"
      >
        <img
          :src="avatarUrl"
          alt="Profil"
          class="w-9 h-9 rounded-md border border-line object-cover"
        />
      </button>

      <Menu
        ref="menu"
        id="overlay_menu"
        :model="menuItems"
        :popup="true"
        class="mt-2 border border-line rounded-md shadow-sm bg-canvas overflow-hidden min-w-[200px]"
        :pt="{ root: { class: 'p-0' }, menu: { class: 'p-1' } }"
      >
        <template #start>
          <div class="px-3 py-3 border-b border-line bg-surface/50 mb-1">
            <span class="block text-[12px] font-medium text-muted uppercase tracking-wide">Hesap</span>
            <span class="block text-[13px] font-semibold text-main truncate mt-0.5">{{ userEmail }}</span>
          </div>
        </template>

        <template #item="{ item }">
          <a
            class="flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer group"
            :class="item.icon === 'pi pi-sign-out' ? 'hover:bg-red-500/10' : 'hover:bg-surface'"
            @click="item.command"
          >
            <i
              :class="[
                item.icon,
                item.icon === 'pi pi-sign-out' ? 'group-hover:text-red-500' : 'group-hover:text-main'
              ]"
              class="text-muted transition-colors mr-3 text-sm"
            ></i>
            <span
              class="text-[13px] font-medium text-main transition-colors"
              :class="item.icon === 'pi pi-sign-out' ? 'group-hover:text-red-500' : 'group-hover:text-main'"
            >{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>
    <Dialog
      v-model:visible="displayPasswordDialog"
      modal
      :header="$t('profile.title')"
      :style="{ width: '24rem', maxWidth: '95vw' }"
      :pt="{
        header: { class: 'border-b border-line px-5 py-4 bg-canvas' },
        content: { class: 'px-5 py-5 bg-canvas' },
      }"
    >
      <form @submit.prevent="changePassword" class="flex flex-col gap-4">
        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('profile.newPassword') }}</label>
          <InputText
            v-model="newPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium text-main mb-1.5">{{ $t('profile.confirmPassword') }}</label>
          <InputText
            v-model="confirmNewPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
          />
        </div>


        <div class="flex gap-2 mt-2">
          <Button
            :label="$t('edit.cancel')"
            text
            type="button"
            class="flex-1 text-muted hover:text-main h-9 text-[13px] font-medium transition-colors bg-surface/50 border border-line rounded-md"
            @click="displayPasswordDialog = false"
          />
          <Button
            type="submit"
            :label="isUpdating ? $t('auth.loading') : $t('profile.saveButton')"
            :loading="isUpdating"
            class="flex-1 h-9 bg-main text-canvas hover:bg-main/90 active:scale-[0.98] text-[13px] font-medium rounded-md transition-all duration-200 flex justify-center"
          />
        </div>
      </form>
    </Dialog>
  </header>
</template>
