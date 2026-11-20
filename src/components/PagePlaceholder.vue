<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '1단계 준비 화면',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="page-placeholder">
    <p class="page-placeholder__eyebrow">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <slot />
  </section>
</template>
