<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import stepLineUrl from '../assets/builder/step-line.svg'
import uploadUrl from '../assets/builder/upload.svg'
import aiStarUrl from '../assets/builder/ai-star.svg'
import aiRefreshUrl from '../assets/builder/ai-refresh.svg'
import aiProcessingStarUrl from '../assets/builder/ai-processing-star.svg'
import aiStyleCleanUrl from '../assets/builder/ai-style-clean.png'
import aiStyleStudioUrl from '../assets/builder/ai-style-studio.png'
import aiStyleTableUrl from '../assets/builder/ai-style-table.png'
import modalCloseUrl from '../assets/builder/modal-close.svg'
import dummyProductUrl from '../assets/builder/dummy-product.png'
import dummyQrUrl from '../assets/builder/dummy-qr.svg'
import downloadUrl from '../assets/builder/download.svg'
import linkUrl from '../assets/builder/link.svg'
import '../styles/builder.css'

const initialForm = {
  name: '',
  price: '',
  weight: '',
  origin: '',
  feature: '',
  description: '',
  shopName: '',
  marketName: '',
  phone: '',
}

const currentView = ref(1)
const form = reactive({ ...initialForm })
const isFilled = (value) => value.trim().length > 0
const isAiModalOpen = ref(false)
const aiModalStep = ref('styles')
const selectedAiStyle = ref('clean')
const aiCopyState = ref('idle')
let aiPreviewTimer
let aiCopyTimer

const aiStyles = [
  { id: 'clean', label: '깔끔한 배경', image: aiStyleCleanUrl },
  { id: 'studio', label: '스튜디오 연출', image: aiStyleStudioUrl },
  { id: 'table', label: '식탁 분위기', image: aiStyleTableUrl },
]
const selectedAiStyleImage = computed(
  () => aiStyles.find((style) => style.id === selectedAiStyle.value)?.image ?? aiStyleCleanUrl,
)

const isStepOneValid = computed(() =>
  [form.name, form.price, form.weight, form.origin].every(isFilled),
)

const isStepTwoValid = computed(() =>
  [form.feature, form.description].every(isFilled),
)

const isStepThreeValid = computed(() =>
  [form.shopName, form.marketName, form.phone].every(isFilled),
)

const formattedPrice = computed(() => {
  const price = form.price.trim()
  return price.endsWith('원') ? price : `${price}원`
})

const goTo = (view) => {
  currentView.value = view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openAiModal = () => {
  aiModalStep.value = 'styles'
  selectedAiStyle.value = 'clean'
  isAiModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeAiModal = () => {
  window.clearTimeout(aiPreviewTimer)
  isAiModalOpen.value = false
  document.body.style.overflow = ''
}

const startAiPreview = () => {
  aiModalStep.value = 'loading'
  window.clearTimeout(aiPreviewTimer)
  aiPreviewTimer = window.setTimeout(() => {
    aiModalStep.value = 'result'
  }, 1200)
}

const startAiCopy = () => {
  if (aiCopyState.value === 'loading') return

  aiCopyState.value = 'loading'
  window.clearTimeout(aiCopyTimer)
  aiCopyTimer = window.setTimeout(() => {
    aiCopyState.value = 'done'
  }, 1200)
}

const resetAiCopy = () => {
  window.clearTimeout(aiCopyTimer)
  aiCopyState.value = 'idle'
}

onBeforeUnmount(() => {
  window.clearTimeout(aiPreviewTimer)
  window.clearTimeout(aiCopyTimer)
  document.body.style.overflow = ''
})

const resetBuilder = () => {
  resetAiCopy()
  Object.assign(form, initialForm)
  goTo(1)
}
</script>

<template>
  <div class="builder-page">
    <header class="builder-header">
      <RouterLink to="/" class="builder-header__brand">바로온장</RouterLink>
    </header>

    <main v-if="currentView === 1" class="builder-main">
      <div class="builder-heading">
        <h1>무엇을 판매하시나요?</h1>

        <ol class="builder-steps" aria-label="상품 만들기 진행 단계">
          <img class="builder-steps__line" :src="stepLineUrl" alt="" aria-hidden="true" />
          <li class="builder-steps__item builder-steps__item--active" aria-current="step">1</li>
          <li class="builder-steps__item">2</li>
          <li class="builder-steps__item">3</li>
        </ol>
      </div>

      <form class="product-form" @submit.prevent="isStepOneValid && goTo(2)">
        <div class="product-form__fields">
          <div class="product-field">
            <label for="product-name">상품명</label>
            <input
              id="product-name"
              v-model="form.name"
              class="product-field__control"
              type="text"
              placeholder="예: 국물용 멸치"
              autocomplete="off"
              :aria-invalid="!isFilled(form.name)"
              aria-describedby="product-name-error"
            />
            <p v-if="!isFilled(form.name)" id="product-name-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="product-price">판매 가격</label>
            <input
              id="product-price"
              v-model="form.price"
              class="product-field__control"
              type="text"
              inputmode="numeric"
              placeholder="예: 15,000원"
              autocomplete="off"
              :aria-invalid="!isFilled(form.price)"
              aria-describedby="product-price-error"
            />
            <p v-if="!isFilled(form.price)" id="product-price-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="product-weight">중량 / 용량</label>
            <input
              id="product-weight"
              v-model="form.weight"
              class="product-field__control"
              type="text"
              placeholder="예: 500g"
              autocomplete="off"
              :aria-invalid="!isFilled(form.weight)"
              aria-describedby="product-weight-error"
            />
            <p v-if="!isFilled(form.weight)" id="product-weight-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="product-origin">원산지</label>
            <input
              id="product-origin"
              v-model="form.origin"
              class="product-field__control"
              type="text"
              placeholder="예: 국내산"
              autocomplete="off"
              :aria-invalid="!isFilled(form.origin)"
              aria-describedby="product-origin-error"
            />
            <p v-if="!isFilled(form.origin)" id="product-origin-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>
        </div>

        <div class="product-form__bottom">
          <button class="product-form__next" type="submit" :disabled="!isStepOneValid">다음</button>
        </div>
      </form>
    </main>

    <main v-else-if="currentView === 2" class="builder-main">
      <div class="builder-heading">
        <h1>상품사진과 소개</h1>

        <ol class="builder-steps" aria-label="상품 만들기 진행 단계">
          <img class="builder-steps__line" :src="stepLineUrl" alt="" aria-hidden="true" />
          <li class="builder-steps__item">1</li>
          <li class="builder-steps__item builder-steps__item--active" aria-current="step">2</li>
          <li class="builder-steps__item">3</li>
        </ol>
      </div>

      <form class="product-form" @submit.prevent="isStepTwoValid && goTo(3)">
        <div class="product-form__fields product-form__fields--step-two">
          <div class="product-field">
            <span class="product-field__label">상품 사진</span>
            <div class="builder-upload" aria-label="DUMMY 상품 이미지 사용">
              <img :src="uploadUrl" alt="" aria-hidden="true" />
              <div>
                <strong>상품 사진을 올려주세요</strong>
                <p>사진 1장 · 휴대폰 사진도 좋아요</p>
              </div>
            </div>
            <button
              class="builder-ai-button builder-ai-button--wide"
              type="button"
              @click="openAiModal"
            >
              <img :src="aiStarUrl" alt="" aria-hidden="true" />
              <span>AI로 사진 꾸미기</span>
            </button>
          </div>

          <div class="product-field">
            <label for="product-feature">상품특징</label>
            <input
              id="product-feature"
              v-model="form.feature"
              class="product-field__control"
              type="text"
              placeholder="예: 국물 맛이 진한 국내산 멸치"
              autocomplete="off"
              :aria-invalid="!isFilled(form.feature)"
              aria-describedby="product-feature-error"
            />
            <p v-if="!isFilled(form.feature)" id="product-feature-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="product-description">상품소개</label>
            <textarea
              id="product-description"
              v-model="form.description"
              class="product-field__control product-field__textarea"
              placeholder="국물용으로 쓰기 좋은 멸치입니다.&#10;육수 낼 때 사용하면 좋고, 여러 요리에 쓸 수 있어요."
              :aria-invalid="!isFilled(form.description)"
              aria-describedby="product-description-error"
            ></textarea>
            <p
              v-if="!isFilled(form.description)"
              id="product-description-error"
              class="product-field__error"
            >
              필수항목입니다.
            </p>
            <div class="builder-ai-copy">
              <p>AI가 소개글을 다듬어 드려요.</p>
              <button
                class="builder-ai-button"
                :class="{ 'builder-ai-button--restore': aiCopyState === 'done' }"
                type="button"
                :disabled="aiCopyState === 'loading'"
                @click="aiCopyState === 'done' ? resetAiCopy() : startAiCopy()"
              >
                <img
                  :src="aiCopyState === 'done' ? aiRefreshUrl : aiStarUrl"
                  alt=""
                  aria-hidden="true"
                />
                <span v-if="aiCopyState === 'idle'">AI로 글 다듬기</span>
                <span v-else-if="aiCopyState === 'loading'">다듬는 중...</span>
                <span v-else>원래대로</span>
              </button>
            </div>
          </div>
        </div>

        <div class="product-form__bottom">
          <button class="product-form__next" type="submit" :disabled="!isStepTwoValid">다음</button>
        </div>
      </form>
    </main>

    <main v-else-if="currentView === 3" class="builder-main">
      <div class="builder-heading builder-heading--compact">
        <h1>가게 정보 입력</h1>

        <ol class="builder-steps" aria-label="상품 만들기 진행 단계">
          <img class="builder-steps__line" :src="stepLineUrl" alt="" aria-hidden="true" />
          <li class="builder-steps__item">1</li>
          <li class="builder-steps__item">2</li>
          <li class="builder-steps__item builder-steps__item--active" aria-current="step">3</li>
        </ol>
      </div>

      <form class="product-form" @submit.prevent="isStepThreeValid && goTo('preview')">
        <div class="product-form__fields product-form__fields--step-three">
          <div class="product-field">
            <label for="shop-name">가게 이름이 무엇인가요?</label>
            <input
              id="shop-name"
              v-model="form.shopName"
              class="product-field__control"
              type="text"
              placeholder="사장님의 가게명 입력"
              autocomplete="organization"
              :aria-invalid="!isFilled(form.shopName)"
              aria-describedby="shop-name-error"
            />
            <p v-if="!isFilled(form.shopName)" id="shop-name-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="market-name">가게는 어느 시장에 있나요?</label>
            <input
              id="market-name"
              v-model="form.marketName"
              class="product-field__control"
              type="text"
              placeholder="예: 죽도시장"
              autocomplete="off"
              :aria-invalid="!isFilled(form.marketName)"
              aria-describedby="market-name-error"
            />
            <p v-if="!isFilled(form.marketName)" id="market-name-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>

          <div class="product-field">
            <label for="order-phone">주문전화는 무엇인가요?</label>
            <input
              id="order-phone"
              v-model="form.phone"
              class="product-field__control"
              type="tel"
              placeholder="주문 받으실 전화번호 입력"
              autocomplete="tel"
              :aria-invalid="!isFilled(form.phone)"
              aria-describedby="order-phone-error"
            />
            <p v-if="!isFilled(form.phone)" id="order-phone-error" class="product-field__error">
              필수항목입니다.
            </p>
          </div>
        </div>

        <div class="product-form__bottom">
          <button class="product-form__next" type="submit" :disabled="!isStepThreeValid">
            미리보기
          </button>
        </div>
      </form>
    </main>

    <main v-else-if="currentView === 'preview'" class="builder-preview">
      <h1>상품 페이지 미리보기</h1>

      <section class="dummy-product" aria-label="DUMMY 상품 페이지 미리보기">
        <header class="dummy-product__header">{{ form.shopName }}</header>
        <img class="dummy-product__hero" :src="dummyProductUrl" alt="DUMMY 상품 이미지" />

        <div class="dummy-product__summary">
          <p>{{ form.feature }}</p>
          <h2>{{ form.name }}</h2>
          <span>{{ form.origin }} · {{ form.weight }}</span>
          <strong>{{ formattedPrice }}</strong>
        </div>

        <div class="dummy-product__detail">
          <p class="dummy-product__market">{{ form.marketName }}</p>
          <h3>{{ form.shopName }}</h3>
          <p class="dummy-product__description">{{ form.description }}</p>
          <img :src="dummyProductUrl" alt="DUMMY 상품 상세 이미지" />
          <p class="dummy-product__guide">배송비와 배송가능 여부는 전화로 확인해주세요.</p>
        </div>

        <footer class="dummy-product__footer">
          <a :href="`tel:${form.phone}`">전화로 주문하기</a>
        </footer>
      </section>

      <div class="builder-preview__buttons">
        <button type="button" class="product-form__next" @click="goTo('complete')">발행하기</button>
        <button type="button" class="builder-button-secondary" @click="resetBuilder">다시 만들기</button>
      </div>
    </main>

    <main v-else class="builder-complete">
      <h1>
        상품 페이지가 만들어졌어요.<br />
        고객에게 공유해보세요.
      </h1>

      <div class="builder-complete__share">
        <img class="builder-complete__qr" :src="dummyQrUrl" alt="DUMMY QR코드" />
        <button type="button">
          QR코드 받기
          <img :src="downloadUrl" alt="" aria-hidden="true" />
        </button>
        <button type="button">
          주소 복사하기
          <img :src="linkUrl" alt="" aria-hidden="true" />
        </button>
      </div>

      <RouterLink class="builder-complete__home" to="/">홈으로</RouterLink>
    </main>

    <div
      v-if="isAiModalOpen"
      class="ai-modal-overlay"
      role="presentation"
      @click.self="closeAiModal"
    >
      <section
        class="ai-modal"
        :class="{ 'ai-modal--loading': aiModalStep === 'loading' }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`ai-modal-title-${aiModalStep}`"
      >
        <div class="ai-modal__handle" aria-hidden="true"></div>

        <template v-if="aiModalStep === 'styles'">
          <header class="ai-modal__header">
            <h2 id="ai-modal-title-styles">AI로 사진 꾸미기</h2>
            <button type="button" aria-label="닫기" @click="closeAiModal">
              <img :src="modalCloseUrl" alt="" aria-hidden="true" />
            </button>
          </header>
          <p class="ai-modal__intro">원하는 사진 분위기를 선택해 주세요.</p>

          <div class="ai-style-list">
            <button
              v-for="style in aiStyles"
              :key="style.id"
              class="ai-style-card"
              :class="{ 'ai-style-card--selected': selectedAiStyle === style.id }"
              type="button"
              :aria-pressed="selectedAiStyle === style.id"
              @click="selectedAiStyle = style.id"
            >
              <img :src="style.image" :alt="`${style.label} 미리보기`" />
              <span>{{ style.label }}</span>
            </button>
          </div>

          <p class="ai-modal__coin">꾸미기 1회에 코인 1개 사용 · 보유 3개</p>
          <button class="ai-modal__primary" type="button" @click="startAiPreview">
            이 스타일로 꾸미기
          </button>
        </template>

        <template v-else-if="aiModalStep === 'loading'">
          <header class="ai-modal__header">
            <h2 id="ai-modal-title-loading">사진을 꾸미고 있어요</h2>
            <button type="button" aria-label="닫기" @click="closeAiModal">
              <img :src="modalCloseUrl" alt="" aria-hidden="true" />
            </button>
          </header>
          <p class="ai-modal__intro">상품 사진을 분위기에 맞게 연출하고 있어요.</p>

          <div class="ai-modal__loading">
            <img :src="aiProcessingStarUrl" alt="" aria-hidden="true" />
            <strong>상품 사진을 준비하고 있어요</strong>
            <p>잠시만 기다려 주세요</p>
          </div>
        </template>

        <template v-else>
          <header class="ai-modal__header ai-modal__header--result">
            <h2 id="ai-modal-title-result">사진이 완성되었어요!</h2>
            <button type="button" aria-label="닫기" @click="closeAiModal">
              <img :src="modalCloseUrl" alt="" aria-hidden="true" />
            </button>
          </header>
          <p class="ai-modal__intro">사진을 확인하고 사용할 이미지를 선택하세요.</p>

          <div class="ai-result-list">
            <figure class="ai-result-card">
              <img :src="aiStyleCleanUrl" alt="원본 상품 사진" />
              <figcaption>원본</figcaption>
            </figure>
            <figure class="ai-result-card ai-result-card--selected">
              <img :src="selectedAiStyleImage" alt="꾸민 상품 사진" />
              <figcaption>꾸민 사진</figcaption>
            </figure>
          </div>

          <div class="ai-modal__result-actions">
            <button class="ai-modal__primary ai-modal__primary--compact" type="button" @click="closeAiModal">
              이 사진 사용하기
            </button>
            <button class="ai-modal__secondary" type="button" @click="closeAiModal">
              원본 사진 사용하기
            </button>
          </div>
          <p class="ai-modal__note">생성된 사진이 마음에 들지 않으면 원본을 사용하세요.</p>
        </template>
      </section>
    </div>
  </div>
</template>
