<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const { t, locale } = useI18n()
const router = useRouter() // YENİ: Router'ı kullanıma alıyoruz

const props = defineProps<{
  isRecovering?: boolean
  initialMode?: 'login' | 'register' // YENİ: Dışarıdan gelecek başlangıç modu
}>()

const emit = defineEmits(['recovery-done'])
const isDark = ref(false)

const loading = ref(false)
// Başlangıç değerini prop'tan alıyoruz
const viewMode = ref<'login' | 'register' | 'forgot' | 'update'>(props.initialMode || 'login')

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const rememberMe = ref(false)

// YENİ: Dışarıdan gelen initialMode değiştiğinde (örn: URL değiştiğinde) viewMode'u güncelle
watch(
  () => props.initialMode,
  (newMode) => {
    if (newMode && !props.isRecovering) {
      viewMode.value = newMode
      errorMessage.value = ''
      successMessage.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.isRecovering,
  (newVal) => {
    if (newVal) {
      viewMode.value = 'update'
    }
  },
  { immediate: true },
)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')

  const savedEmail = localStorage.getItem('subslean_remembered_email')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleLanguage = () => {
  locale.value = locale.value === 'tr' ? 'en' : 'tr'
}

// YENİ GÜNCELLEME: Artık sadece state değil, URL de değişiyor
const setMode = (mode: 'login' | 'register' | 'forgot') => {
  errorMessage.value = ''
  successMessage.value = ''
  password.value = ''
  confirmPassword.value = ''

  if (mode === 'login') {
    router.push('/login')
  } else if (mode === 'register') {
    router.push('/register')
  } else {
    // 'forgot' için URL değiştirmeden sadece görünümü değiştiriyoruz
    viewMode.value = mode
  }
}

const handleAuthAction = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (viewMode.value === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error

      if (rememberMe.value) {
        localStorage.setItem('subslean_remembered_email', email.value)
      } else {
        localStorage.removeItem('subslean_remembered_email')
      }
    }

    else if (viewMode.value === 'register') {
      if (password.value !== confirmPassword.value) {
        throw new Error(t('auth.passwordMismatch'))
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error

      // Kayıt başarılıysa view'u login'e çek, URL'yi de /login yap
      router.push('/login')
      password.value = ''
      confirmPassword.value = ''

      if (data.session === null) {
        successMessage.value = t('auth.checkEmail', 'Kayıt başarılı! Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edip hesabınızı onaylayın.')
      } else {
        successMessage.value = t('auth.success')
      }
    }

    else if (viewMode.value === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: window.location.origin, // Linke tıklayınca siteye geri döner
      })
      if (error) throw error

      successMessage.value = t('auth.resetEmailSent')
    }

    else if (viewMode.value === 'update') {
      if (password.value !== confirmPassword.value) {
        throw new Error(t('auth.passwordMismatch'))
      }
      const { error } = await supabase.auth.updateUser({
        password: password.value,
      })
      if (error) throw error

      successMessage.value = t('auth.passwordUpdated')
      setTimeout(() => {
        emit('recovery-done')
      }, 2000)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMessage.value = error.message || t('auth.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[75vh]">
    <div
      class="bg-canvas border border-line rounded-lg overflow-hidden w-full grid grid-cols-1 md:grid-cols-12 min-h-120"
    >
      <div
        class="md:col-span-5 bg-surface/50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-line"
      >

        <div>
          <div class="mb-8">
            <router-link to="/">
               <img :src="isDark ? '/subslean-dark.svg' : '/subslean-light.svg'" width="110" alt="Subslean Logo" class="hover:opacity-80 transition-opacity" />
            </router-link>
          </div>

          <h2 class="text-lg font-semibold text-main leading-snug mb-3 tracking-tight">
            {{ $t('auth.missionTitle') }}
          </h2>
          <p class="text-muted text-[13px] leading-relaxed">
            {{ $t('auth.missionDesc') }}
          </p>
        </div>

        <div class="space-y-3 pt-6 border-t border-line mt-8 md:mt-0">
          <div class="flex items-center gap-3 text-[13px] font-medium text-muted">
            <i class="pi pi-check text-main shrink-0"></i>
            <span>{{ $t('auth.feature1') }}</span>
          </div>
          <div class="flex items-center gap-3 text-[13px] font-medium text-muted">
            <i class="pi pi-check text-main shrink-0"></i>
            <span>{{ $t('auth.feature2') }}</span>
          </div>
          <div class="flex items-center gap-3 text-[13px] font-medium text-muted">
            <i class="pi pi-check text-main shrink-0"></i>
            <span>{{ $t('auth.feature3') }}</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-7 p-8 flex flex-col justify-center bg-canvas relative">
        <div class="absolute top-5 right-5 flex items-center gap-1 z-10">
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
        </div>

        <div class="max-w-sm w-full mx-auto mt-6 md:mt-0">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-main tracking-tight">
              {{
                viewMode === 'login'
                  ? $t('auth.welcome')
                  : viewMode === 'register'
                    ? $t('auth.createAccount')
                    : viewMode === 'forgot'
                      ? $t('auth.forgotPassword')
                      : $t('auth.updatePassword')
              }}
            </h3>
            <p class="text-muted text-[13px] mt-1">
              {{
                viewMode === 'login'
                  ? $t('auth.loginDesc')
                  : viewMode === 'register'
                    ? $t('auth.registerDesc')
                    : viewMode === 'forgot'
                      ? $t('auth.forgotPasswordDesc')
                      : $t('auth.updatePasswordDesc')
              }}
            </p>
          </div>

          <form @submit.prevent="handleAuthAction" class="flex flex-col gap-4">
            <div v-if="viewMode !== 'update'">
              <label class="block text-[13px] font-medium text-main mb-1.5">{{
                $t('auth.email')
              }}</label>
              <InputText
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :placeholder="$t('auth.email')"
                class="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
              />
            </div>

            <div v-if="viewMode !== 'forgot'">
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-[13px] font-medium text-main">
                  {{ viewMode === 'update' ? $t('auth.newPassword') : $t('auth.password') }}
                </label>
                <button
                  v-if="viewMode === 'login'"
                  @click="setMode('forgot')"
                  type="button"
                  tabindex="-1"
                  class="text-[12px] font-medium text-muted hover:text-main transition-colors focus:outline-none"
                >
                  {{ $t('auth.forgotPassword') }}
                </button>
              </div>
              <InputText
                v-model="password"
                type="password"
                required
                :autocomplete="viewMode === 'login' ? 'current-password' : 'new-password'"
                placeholder="••••••••"
                class="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
              />
            </div>

            <div v-if="viewMode === 'register' || viewMode === 'update'">
              <label class="block text-[13px] font-medium text-main mb-1.5">{{
                $t('auth.confirmPassword')
              }}</label>
              <InputText
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                placeholder="••••••••"
                class="w-full h-9 text-sm border border-line bg-surface rounded-md px-3 transition-colors duration-200 focus:border-main outline-none"
              />
            </div>

            <div v-if="viewMode === 'login'" class="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="remember"
                v-model="rememberMe"
                class="w-3.5 h-3.5 rounded border border-line bg-surface accent-main cursor-pointer"
              />
              <label
                for="remember"
                class="text-[12px] font-medium text-muted cursor-pointer select-none"
              >
                {{ $t('auth.rememberMe') }}
              </label>
            </div>

            <div
              v-if="errorMessage"
              class="flex items-start gap-2 text-red-500 text-[13px] font-medium bg-red-500/10 px-3 py-2.5 rounded-md border border-red-500/20 leading-snug"
            >
              <i class="pi pi-exclamation-triangle mt-0.5 shrink-0"></i>
              <span>{{ errorMessage }}</span>
            </div>
            <div
              v-if="successMessage"
              class="flex items-start gap-2 text-emerald-500 text-[13px] font-medium bg-emerald-500/10 px-3 py-2.5 rounded-md border border-emerald-500/20 leading-snug"
            >
              <i class="pi pi-check-circle mt-0.5 shrink-0"></i>
              <span>{{ successMessage }}</span>
            </div>

            <Button
              type="submit"
              :label="
                loading
                  ? $t('auth.loading')
                  : viewMode === 'login'
                    ? $t('auth.loginBtn')
                    : viewMode === 'register'
                      ? $t('auth.registerBtn')
                      : viewMode === 'forgot'
                        ? $t('auth.sendResetLink')
                        : $t('auth.updatePassword')
              "
              :loading="loading"
              class="w-full h-9 mt-1 bg-main text-canvas hover:bg-main/90 active:scale-[0.98] text-[13px] font-medium rounded-md transition-all duration-200 flex justify-center"
            />
          </form>

          <div v-if="viewMode !== 'update'" class="mt-6 text-center border-t border-line pt-5">
            <button
              v-if="viewMode === 'forgot'"
              @click="setMode('login')"
              class="text-[13px] text-muted hover:text-main transition-colors font-medium focus:outline-none"
            >
              &larr; {{ $t('auth.backToLogin') }}
            </button>
            <button
              v-else
              @click="setMode(viewMode === 'login' ? 'register' : 'login')"
              class="text-[13px] text-muted hover:text-main transition-colors font-medium focus:outline-none"
            >
              {{ viewMode === 'login' ? $t('auth.noAccount') : $t('auth.hasAccount') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
