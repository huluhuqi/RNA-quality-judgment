import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './assets/style.css'
import './assets/theme.css'

import { handleError } from './core/error/errorHandler'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.config.errorHandler = (err, vm, info) => {
    handleError(err, 'VUE_ERROR', info)
}

window.onerror = (message, source, lineno, colno, error) => {
    handleError(error || new Error(message), 'VUE_ERROR', `${source}:${lineno}:${colno}`)
}

app.mount('#app')
