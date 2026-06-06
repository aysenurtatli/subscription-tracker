<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { locale, t } = useI18n()
const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleLanguage = () => {
  locale.value = locale.value === 'tr' ? 'en' : 'tr'
}
</script>

<template>
  <div
    class="min-h-screen bg-canvas text-main selection:bg-main selection:text-canvas overflow-hidden"
  >
    <header class="border-b border-line/50 bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center hover:opacity-80 transition-opacity">
          <img
            :src="isDark ? '/subslean-dark.svg' : '/subslean-light.svg'"
            width="100"
            alt="Subslean Logo"
            class="mb-1 transition-opacity duration-200"
          />
        </router-link>

        <div class="flex items-center gap-3 md:gap-6">
          <div class="flex items-center gap-1">
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

          <div class="hidden md:block w-px h-5 bg-line"></div>

          <nav class="flex items-center gap-4">
            <router-link
              to="/login"
              class="hidden md:block text-sm font-medium text-muted hover:text-main transition-colors"
            >
              {{ $t('home.login') }}
            </router-link>
            <router-link
              to="/register"
              class="text-sm font-medium bg-main text-canvas px-4 py-2 rounded-md hover:bg-main/90 transition-transform active:scale-95"
            >
              {{ $t('home.startFree') }}
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <section class="relative pt-24 pb-32 px-6">
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-main/5 blur-[120px] rounded-full -z-10 pointer-events-none"
        ></div>

        <div class="max-w-4xl mx-auto text-center">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-medium text-muted mb-8"
          >
            <div class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>

              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            {{ $t('home.badge') }}
          </div>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            {{ $t('home.titleMain') }} <br class="hidden md:block" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-main to-[#11b981]">
              {{ $t('home.titleHighlight') }}
            </span>
            {{ $t('home.titleEnd') }}
          </h1>

          <p class="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {{ $t('home.description') }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link
              to="/login"
              class="w-full sm:w-auto text-base font-medium bg-main text-canvas px-8 py-3.5 rounded-lg hover:bg-main/90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {{ $t('home.startNow') }}
              <i class="pi pi-arrow-right text-sm"></i>
            </router-link>
            <a
              href="#features"
              class="w-full sm:w-auto text-base font-medium bg-surface border border-line text-main px-8 py-3.5 rounded-lg hover:bg-surface/80 transition-colors flex items-center justify-center gap-2"
            >
              {{ $t('home.learnMore') }}
            </a>
          </div>
        </div>
      </section>

      <section id="features" class="py-24 px-6 bg-surface/30 border-y border-line/50">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight mb-4">{{ $t('home.featuresTitle') }}</h2>
            <p class="text-muted">
              {{ $t('home.featuresDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              class="p-6 bg-canvas border border-line rounded-2xl hover:border-main/50 transition-colors"
            >
              <div
                class="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 text-main"
              >
                <i class="pi pi-wallet text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ $t('home.feature1Title') }}</h3>
              <p class="text-muted text-sm leading-relaxed">
                {{ $t('home.feature1Desc') }}
              </p>
            </div>

            <div
              class="p-6 bg-canvas border border-line rounded-2xl hover:border-main/50 transition-colors"
            >
              <div
                class="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 text-main"
              >
                <i class="pi pi-chart-pie text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ $t('home.feature2Title') }}</h3>
              <p class="text-muted text-sm leading-relaxed">
                {{ $t('home.feature2Desc') }}
              </p>
            </div>

            <div
              class="p-6 bg-canvas border border-line rounded-2xl hover:border-main/50 transition-colors"
            >
              <div
                class="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mb-6 text-main"
              >
                <i class="pi pi-sparkles text-xl"></i>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ $t('home.feature3Title') }}</h3>
              <p class="text-muted text-sm leading-relaxed">
                {{ $t('home.feature3Desc') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-32 px-6">
        <div
          class="max-w-4xl mx-auto text-center bg-surface text-main p-12 rounded-3xl relative overflow-hidden"
        >
          <div
            class="absolute -top-24 -right-24 w-64 h-64 bg-canvas/10 rounded-full blur-2xl"
          ></div>
          <div
            class="absolute -bottom-24 -left-24 w-64 h-64 bg-canvas/10 rounded-full blur-2xl"
          ></div>

          <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-6 relative z-10">
            {{ $t('home.ctaTitle') }}
          </h2>
          <p class="text-main/80 mb-8 max-w-xl mx-auto relative z-10">
            {{ $t('home.ctaDesc') }}
          </p>
          <router-link
            to="/register"
            class="inline-flex font-medium bg-[#11b981] text-surface px-8 py-3.5 rounded-lg hover:bg-[#0d8960] duration-200 transition-colors relative z-10"
          >
            {{ $t('home.createFreeAccount') }}
          </router-link>
        </div>
      </section>
    </main>

    <footer class="py-8 px-6 border-t border-line text-center text-sm text-muted">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; {{ new Date().getFullYear() }} {{ $t('home.copyright') }}</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-main transition-colors">{{ $t('home.terms') }}</a>
          <a href="#" class="hover:text-main transition-colors">{{ $t('home.privacy') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
