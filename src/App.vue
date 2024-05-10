<script setup>
import {onMounted} from 'vue'
import Header from './components/Header.vue'
import { useOrderBookStore } from "@store/orderbook";

onMounted(async () => {
    await useOrderBookStore().fetchOrderBook();
});
</script>

<template>
  <v-app class="application">
    <v-app-bar app>
      <Header />
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main class="content">
      <v-container fluid class="content__container">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.application {
  overflow-y: hidden;
  background-color: #f5f5f5;
  border: 1px solid red;
  max-height: 100dvh;
}

.content {
  flex: 0 0 100%;
  /* max-height: 100%; */
  border: 1px solid blue;
  /* max-height: calc(100% - 64px); */
  overflow-y: hidden;
}

.content__container {
  height: 100%;
}
</style>
