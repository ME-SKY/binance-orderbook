import { createApp } from 'vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
// import './style.css'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.use(Vuetify)


createApp(App).use(Vuetify).use(store).use(router).mount('#app')
