import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import Vue from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'
// import store from './store'
const piniaStore = createPinia()

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(vuetify)
    .use(piniaStore)
    .use(router)
    .mount('#app')
