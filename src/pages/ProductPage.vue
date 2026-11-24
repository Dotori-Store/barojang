<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import logoUrl from '../assets/landing/logo.svg'
import '../styles/product-page.css'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const product = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const formattedPrice = computed(() =>
  product.value ? `${Number(product.value.price).toLocaleString('ko-KR')}원` : '',
)
const phoneHref = computed(() => `tel:${product.value?.phone?.replace(/[^0-9+]/g, '') || ''}`)

async function loadProduct() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`/api/public-product?slug=${encodeURIComponent(props.slug)}`)
    const result = await response.json()
    if (!response.ok) {
      throw new Error(response.status === 404 ? '존재하지 않는 상품 페이지입니다.' : result.error)
    }
    product.value = result.product
  } catch (error) {
    errorMessage.value = error.message || '상품 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProduct)
watch(() => props.slug, loadProduct)
</script>

<template>
  <div class="public-product-page">
    <p v-if="isLoading" class="public-product-page__status">상품 페이지를 불러오고 있어요.</p>

    <section v-else-if="errorMessage" class="public-product-page__error">
      <img :src="logoUrl" alt="바로온장" />
      <h1>{{ errorMessage }}</h1>
      <RouterLink to="/">홈으로</RouterLink>
    </section>

    <article v-else class="public-product">
      <header class="public-product__header">{{ product.shop_name }}</header>
      <img
        v-if="product.image_url"
        class="public-product__hero"
        :src="product.image_url"
        :alt="`${product.name} 상품 사진`"
      />

      <div class="public-product__summary">
        <p>{{ product.feature }}</p>
        <h1>{{ product.name }}</h1>
        <span>{{ product.origin }} · {{ product.weight }}</span>
        <strong>{{ formattedPrice }}</strong>
      </div>

      <div class="public-product__detail">
        <p class="public-product__market">{{ product.market_name }}</p>
        <h2>{{ product.shop_name }}</h2>
        <p class="public-product__description">{{ product.description }}</p>
        <img v-if="product.image_url" :src="product.image_url" :alt="`${product.name} 상세 사진`" />
        <p class="public-product__guide">배송비와 배송가능 여부는 전화로 확인해주세요.</p>
      </div>

      <footer class="public-product__footer">
        <a :href="phoneHref">전화로 주문하기 · {{ product.phone }}</a>
      </footer>
    </article>
  </div>
</template>
