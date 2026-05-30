import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./assets/css/main.css"
import App from './App.vue'
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import 'primeicons/primeicons.css'
import { i18n } from './i18n'
import ConfirmationService from 'primevue/confirmationservice'
const app = createApp(App)

app.use(createPinia())

app.use(i18n)

app.use(ConfirmationService)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    }
})

app.mount('#app')
