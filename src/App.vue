<script setup>
import Header from './components/Header.vue';

</script>

<template>
  <v-app class="application">
    <v-app-bar app>
      <Header />
    </v-app-bar>

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
  max-height: 100dvh;
}

.content {
  flex: 0 0 100%;
  overflow-y: hidden;
}

.content__container {
  /* display: flex; */
  /* align-items: center; */
  height: 100%;
}
</style>
