// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1whO_JtwrJzht3sOAFnvKccjqRUQYQo8",
  authDomain: "orderbook-963fd.firebaseapp.com",
  projectId: "orderbook-963fd",
  storageBucket: "orderbook-963fd.appspot.com",
  messagingSenderId: "1073100151573",
  appId: "1:1073100151573:web:cab79a52b0b7b6e0f1271c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
    theme: {
        defaultTheme: 'dark'
    }
})

createApp(App)
    .use(vuetify)
    .use(piniaStore)
    .use(router)
    .mount('#app')
