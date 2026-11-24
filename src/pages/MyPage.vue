<script setup>
import { computed, onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import AppHeader from '../components/AppHeader.vue'
import downloadUrl from '../assets/builder/download.svg'
import linkUrl from '../assets/builder/link.svg'
import '../styles/builder.css'
import '../styles/mypage.css'

const product = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const qrCodeUrl = ref('')
const copyFeedback = ref('')

const publicUrl = computed(() =>
  product.value?.public_slug
    ? new URL(`/p/${product.value.public_slug}`, window.location.origin).href
    : '',
)

async function loadProduct() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('/api/products', { headers: { Accept: 'application/json' } })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '상품 정보를 불러오지 못했습니다.')

    product.value = result.product
    if (product.value?.public_slug) {
      qrCodeUrl.value = await QRCode.toDataURL(publicUrl.value, {
        width: 400,
        margin: 2,
        color: { dark: '#13161C', light: '#FFFFFF' },
      })
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copyFeedback.value = '복사했어요.'
  } catch {
    copyFeedback.value = '주소를 길게 눌러 복사해 주세요.'
  }
}

function downloadQrCode() {
  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = `barojang-${product.value.public_slug}-qr.png`
  link.click()
}

onMounted(loadProduct)
</script>

<template>
  <div class="mypage">
    <AppHeader />

    <main class="mypage__main">
      <section v-if="isLoading" class="builder-complete">
        <h1>상품 정보를 확인하고 있어요.</h1>
      </section>

      <section v-else-if="errorMessage" class="builder-complete mypage__message">
        <h1>상품 정보를 불러오지 못했어요.</h1>
        <p>{{ errorMessage }}</p>
        <button class="builder-complete__home" type="button" @click="loadProduct">다시 시도</button>
      </section>

      <section v-else-if="!product" class="builder-complete mypage__message">
        <h1>아직 발행한 상품이 없어요.<br />상품페이지를 만들어주세요.</h1>
        <RouterLink class="builder-complete__home" to="/builder">시작하기</RouterLink>
      </section>

      <section v-else class="builder-complete">
        <h1>
          상품 페이지가 만들어졌어요.<br />
          고객에게 공유해보세요.
        </h1>

        <div class="builder-complete__share">
          <img class="builder-complete__qr" :src="qrCodeUrl" alt="상품 공개 주소 QR코드" />
          <a class="builder-complete__url" :href="publicUrl" target="_blank" rel="noopener">
            {{ publicUrl }}
          </a>
          <button type="button" @click="downloadQrCode">
            QR코드 받기
            <img :src="downloadUrl" alt="" aria-hidden="true" />
          </button>
          <button type="button" @click="copyUrl">
            {{ copyFeedback || '주소 복사하기' }}
            <img :src="linkUrl" alt="" aria-hidden="true" />
          </button>
        </div>

        <RouterLink class="builder-complete__home" :to="`/p/${product.public_slug}`">
          상품 페이지 보기
        </RouterLink>
      </section>
    </main>
  </div>
</template>
