<script setup>
import PagePlaceholder from '../components/PagePlaceholder.vue'
import { productPresets } from '../data/mockData.js'
</script>

<template>
  <PagePlaceholder
    title="상품 생성"
    description="상품 생성 흐름의 구조적 플레이스홀더입니다. 입력 UI와 기능은 아직 구현하지 않습니다."
  >
    <p class="placeholder-meta">준비된 목업 품목: {{ productPresets.map((item) => item.label).join(', ') }}</p>
  </PagePlaceholder>
</template>
