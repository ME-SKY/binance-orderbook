<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentRoute = ref(route.path)

const navigate = (path) => {
    if (path !== currentRoute.value) {
        router.push(path)
    }
}
</script>

<template>
   
        <v-toolbar-title>
            <v-img src="path-to-your-logo.png" alt="Logo"></v-img>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn text to="/orderbook">OrderBook</v-btn>
            <v-btn text to="/settings">Settings</v-btn>
        </v-toolbar-items>
   
</template>



<style scoped>
/* Add scoped styles for Header here */
</style>
