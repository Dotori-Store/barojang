<script setup>
import { computed, onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import AppHeader from '../components/AppHeader.vue'
import downloadUrl from '../assets/builder/download.svg'
import linkUrl from '../assets/builder/link.svg'
import '../styles/mypage.css'

const product = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const qrCodeUrl = ref('')
const copyFeedback = ref('')
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

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

function openDeleteModal() {
  deleteError.value = ''
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  if (isDeleting.value) return
  isDeleteModalOpen.value = false
  deleteError.value = ''
}

async function deleteProduct() {
  if (isDeleting.value) return

  isDeleting.value = true
  deleteError.value = ''

  try {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '상품 페이지를 삭제하지 못했습니다.')

    product.value = null
    qrCodeUrl.value = ''
    copyFeedback.value = ''
    isDeleteModalOpen.value = false
  } catch (error) {
    deleteError.value = error.message
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadProduct)
</script>

<template>
  <div class="mypage">
    <AppHeader />

    <main class="mypage__main">
      <section v-if="isLoading" class="mypage-product">
        <h1>상품 정보를 확인하고 있어요.</h1>
      </section>

      <section v-else-if="errorMessage" class="mypage-product mypage-product--message">
        <h1>상품 정보를 불러오지 못했어요.</h1>
        <p>{{ errorMessage }}</p>
        <button class="mypage-product__action" type="button" @click="loadProduct">다시 시도</button>
      </section>

      <section v-else-if="!product" class="mypage-product mypage-product--message">
        <h1>아직 생성된 가게 페이지가 없어요.</h1>
        <RouterLink class="mypage-product_start" to="/builder">시작하기</RouterLink>
      </section>

      <section v-else class="mypage-product">
        <h1>
          상품 페이지가 만들어졌어요.<br />
          고객에게 공유해보세요.
        </h1>

        <div class="mypage-product__share">
          <img class="mypage-product__qr" :src="qrCodeUrl" alt="상품 공개 주소 QR코드" />
          <a class="mypage-product__url" :href="publicUrl" target="_blank" rel="noopener">
            {{ publicUrl }}
          </a>
          <div class="mypage-product__share-actions">
            <button type="button" @click="downloadQrCode">
              QR코드 받기
              <img :src="downloadUrl" alt="" aria-hidden="true" />
            </button>
            <button type="button" @click="copyUrl">
              {{ copyFeedback || '주소 복사하기' }}
              <img :src="linkUrl" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        <RouterLink class="mypage-product__action" :to="`/p/${product.public_slug}`" target="_blank">
          상품 페이지 보기
        </RouterLink>
        <button class="mypage-product__delete" type="button" @click="openDeleteModal">
          삭제하기
        </button>
      </section>
    </main>

    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="mypage-delete-modal"
        role="presentation"
        @click.self="closeDeleteModal"
      >
        <section
          class="mypage-delete-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
          aria-describedby="delete-product-description"
        >
          <h2 id="delete-product-title">상품 페이지를 삭제하시겠어요?</h2>
          <p id="delete-product-description">
            삭제하면 기존 주소와 QR 코드를 더 이상 사용할 수 없어요.
          </p>
          <p v-if="deleteError" class="mypage-delete-modal__error" role="alert">
            {{ deleteError }}
          </p>
          <div class="mypage-delete-modal__actions">
            <button type="button" :disabled="isDeleting" @click="closeDeleteModal">취소</button>
            <button
              class="mypage-delete-modal__confirm"
              type="button"
              :disabled="isDeleting"
              @click="deleteProduct"
            >
              {{ isDeleting ? '삭제 중...' : '삭제하기' }}
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
