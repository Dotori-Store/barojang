<script setup>
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <AppHeader v-if="route.name !== 'landing'" />
  <main :class="{ 'app-main': route.name !== 'landing' }">
    <RouterView />
  </main>
</template>
