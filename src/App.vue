<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const isStandalonePage = computed(() => ['landing', 'builder'].includes(route.name))
</script>

<template>
  <AppHeader v-if="!isStandalonePage" />
  <main :class="{ 'app-main': !isStandalonePage }">
    <RouterView />
  </main>
</template>
