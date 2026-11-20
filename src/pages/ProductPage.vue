<script setup>
import PagePlaceholder from '../components/PagePlaceholder.vue'
import { mockProduct } from '../data/mockData.js'

defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <PagePlaceholder
    eyebrow="공개 경로 플레이스홀더"
    :title="mockProduct.name"
    :description="`상품 ID: ${id} · 공개 데이터와 전화 주문 기능은 이후 단계에서 연결합니다.`"
  />
</template>
