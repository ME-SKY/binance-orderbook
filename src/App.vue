<script setup>
import {onMounted} from 'vue'
import Header from './components/Header.vue'
import { useOrderBookStore } from "@store/orderbook";

onMounted(async () => {
    await useOrderBookStore().fetchOrderBook();
});
</script>

<template>
  <v-app>
    <v-app-bar app>
      <Header />
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
