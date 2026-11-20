<script setup>
import { demoCoinBalance } from '../data/mockData.js'
</script>

<template>
  <span class="coin-display" aria-label="시연용 남은 코인">
    남은 코인 {{ demoCoinBalance }}개
  </span>
</template>
