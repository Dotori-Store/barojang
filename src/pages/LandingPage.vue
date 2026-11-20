<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InviteCodeModal from '../components/InviteCodeModal.vue'
import logoUrl from '../assets/landing/logo.svg'
import tokenUrl from '../assets/landing/token.svg'
import userProfileUrl from '../assets/landing/user-profile.svg'
import heroOrangeUrl from '../assets/landing/hero-orange.png'
import heroFishUrl from '../assets/landing/hero-fish.png'
import heroBerriesUrl from '../assets/landing/hero-berries.png'
import heroAnchovyUrl from '../assets/landing/hero-anchovy.png'
import mobileScreenUrl from '../assets/landing/mobile-screen.png'
import heroQrUrl from '../assets/landing/hero-qr.svg'
import storeOwnerUrl from '../assets/landing/store-owner.png'
import problemPhotoUrl from '../assets/landing/problem-photo.png'
import problemPageUrl from '../assets/landing/problem-page.png'
import problemPhoneUrl from '../assets/landing/problem-phone.png'
import productFormUrl from '../assets/landing/product-form.png'
import aiTangerineUrl from '../assets/landing/ai-tangerine.jpg'
import checkUrl from '../assets/landing/check.svg'
import copyUrl from '../assets/landing/copy.svg'
import resultMobileUrl from '../assets/landing/result-mobile.png'
import resultCardUrl from '../assets/landing/result-card.png'
import resultPackageUrl from '../assets/landing/result-package.png'
import resultQrUrl from '../assets/landing/result-qr.svg'
import dotUrl from '../assets/landing/dot.svg'
import '../styles/landing.css'

const isInviteModalOpen = ref(false)
const hasInviteCodeError = ref(false)
const inviteCodeErrorMessage = ref('올바른 코드가 아닙니다')
const isInviteCodeLoading = ref(false)
const route = useRoute()
const router = useRouter()

function openInviteModal() {
  hasInviteCodeError.value = false
  isInviteModalOpen.value = true
}

function closeInviteModal() {
  isInviteModalOpen.value = false
  hasInviteCodeError.value = false
}

function clearInviteCodeError() {
  hasInviteCodeError.value = false
}

async function submitInviteCode(code) {
  clearInviteCodeError()
  isInviteCodeLoading.value = true

  try {
    const response = await fetch('/api/invite-code/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      hasInviteCodeError.value = true
      inviteCodeErrorMessage.value =
        response.status === 401 ? '올바른 코드가 아닙니다' : '인증 중 문제가 발생했습니다'
      return
    }

    const result = await response.json()
    await router.push(result.redirectTo || '/builder')
  } catch {
    hasInviteCodeError.value = true
    inviteCodeErrorMessage.value = '인증 중 문제가 발생했습니다'
  } finally {
    isInviteCodeLoading.value = false
  }
}

watch(
  () => route.query.invite,
  (invite) => {
    if (invite === 'required') {
      openInviteModal()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="landing">
    <header class="landing-header">
      <div class="landing-header__inner">
        <RouterLink class="landing-header__logo" to="/" aria-label="바로온장 홈">
          <img :src="logoUrl" alt="바로온장" />
        </RouterLink>

        <div class="landing-header__account">
          <div class="landing-coin" aria-label="시연용 남은 코인 8개">
            <img :src="tokenUrl" alt="" aria-hidden="true" />
            <span class="landing-coin__number">8</span>
            <span class="landing-coin__unit">코인</span>
          </div>
          <img class="landing-header__profile" :src="userProfileUrl" alt="사용자 프로필" />
        </div>
      </div>
    </header>

    <section class="landing-hero" aria-labelledby="landing-hero-title">
      <div class="landing-hero__copy">
        <h1 id="landing-hero-title" class="landing-hero__title">
          우리 가게 상품을<br />
          모바일로 홍보하고 판매하세요
        </h1>
        <p class="landing-hero__description">
          상품 정보만 입력하세요.<br />
          상품사진과 모바일 페이지까지 한번에 만들어 드려요.
        </p>
        <button class="landing-button" type="button" @click="openInviteModal">시작하기</button>
        <p class="landing-hero__note">디자인 경험 없이도, 복잡한 쇼핑몰 없이도 OK!</p>
      </div>

      <div class="landing-hero__product landing-hero__product--orange" aria-hidden="true">
        <img :src="heroOrangeUrl" alt="" />
      </div>
      <div class="landing-hero__product landing-hero__product--fish" aria-hidden="true">
        <img :src="heroFishUrl" alt="" />
      </div>
      <div class="landing-hero__product landing-hero__product--berries" aria-hidden="true">
        <img :src="heroBerriesUrl" alt="" />
      </div>
      <div class="landing-hero__product landing-hero__product--anchovy" aria-hidden="true">
        <img :src="heroAnchovyUrl" alt="" />
      </div>
    </section>

    <div class="landing-showcase" aria-hidden="true">
      <div class="landing-showcase__mobile">
        <img :src="mobileScreenUrl" alt="" />
      </div>
      <img class="landing-showcase__qr" :src="heroQrUrl" alt="" />
    </div>

    <section class="landing-intro" aria-labelledby="landing-intro-title">
      <div class="landing-intro__top">
        <div class="landing-intro__heading">
          <p class="landing-intro__eyebrow">장사하기 바쁜 사장님을 위해 준비했어요.</p>
          <h2 id="landing-intro-title">
            좋은 상품은 있는데,<br />
            온라인 소개가 막막하셨죠?
          </h2>
        </div>

        <div class="landing-intro__message">
          <div class="landing-intro__owner" aria-hidden="true">
            <img :src="storeOwnerUrl" alt="" />
          </div>
          <p>
            이제 상품을 만드는 일에 집중하세요.<br />
            온라인에 소개하는 일은 바로온장이<br />
            도와드릴게요.
          </p>
        </div>
      </div>

      <div class="landing-problem-list">
        <article class="landing-problem-card">
          <h3>사진을 예쁘게 찍기<br />어려워요.</h3>
          <p>상품의 매력이 드러나는 이미지 연출</p>
          <img :src="problemPhotoUrl" alt="" aria-hidden="true" />
        </article>
        <article class="landing-problem-card">
          <h3>상세페이지는 처음이라<br />막막해요.</h3>
          <p>정보만 넣으면 완성되는 간편한 상품 페이지</p>
          <img :src="problemPageUrl" alt="" aria-hidden="true" />
        </article>
        <article class="landing-problem-card">
          <h3>쇼핑몰 운영까지는<br />부담돼요.</h3>
          <p>링크 하나로 소개하고 전화로만 주문받기</p>
          <img :src="problemPhoneUrl" alt="" aria-hidden="true" />
        </article>
      </div>
    </section>

    <section class="landing-steps" aria-labelledby="landing-steps-title">
      <div class="landing-section-heading">
        <h2 id="landing-steps-title">어려운 준비 없이, 딱 3단계면 충분해요</h2>
        <p>상품 정보가 우리 가게만의 온라인 주문 페이지로 만들어져요.</p>
      </div>

      <div class="landing-step-list">
        <article class="landing-step-card">
          <p class="landing-step-card__number">01</p>
          <h3>상품정보 입력</h3>
          <p class="landing-step-card__description">
            상품명과 가격, 소개하고 싶은<br />
            우리 상품의 특징을 알려주세요.
          </p>
          <img class="landing-step-card__form" :src="productFormUrl" alt="상품정보 입력 화면 예시" />
        </article>

        <article class="landing-step-card">
          <p class="landing-step-card__number">02</p>
          <h3>AI 상품 이미지 생성</h3>
          <p class="landing-step-card__description">
            상품의 매력을 살려줄 이미지를<br />
            AI로 자연스럽게 만들어드려요.
          </p>
          <div class="landing-step-card__ai-image">
            <img :src="aiTangerineUrl" alt="AI로 연출한 감귤 상품 이미지" />
            <span>✦&nbsp; AI 생성 이미지</span>
          </div>
        </article>

        <article class="landing-step-card">
          <p class="landing-step-card__number">03</p>
          <h3>상품 페이지 발행</h3>
          <p class="landing-step-card__description">
            완성된 페이지를 확인하고<br />
            링크와 QR코드로 바로 공유하세요.
          </p>
          <div class="landing-publish-preview">
            <div class="landing-publish-preview__product">
              <img :src="aiTangerineUrl" alt="" aria-hidden="true" />
              <strong>제주 햇살 감귤</strong>
              <strong>19,900원</strong>
            </div>
            <div class="landing-publish-preview__content">
              <div class="landing-publish-preview__status">
                <span class="landing-publish-preview__check">
                  <img :src="checkUrl" alt="" aria-hidden="true" />
                </span>
                <strong>발행 준비 완료</strong>
              </div>
              <p>내 상품 페이지가 생겼어요.</p>
              <span class="landing-publish-preview__copy">
                링크 복사하기
                <img :src="copyUrl" alt="" aria-hidden="true" />
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="landing-results" aria-labelledby="landing-results-title">
      <div class="landing-section-heading">
        <h2 id="landing-results-title">소개부터 주문 연결까지, 하나의 페이지로.</h2>
        <p>고객에게는 보기 쉽게, 사장님에게는 쓰기 쉽게 만들었어요.</p>
      </div>

      <div class="landing-result-list">
        <article class="landing-result-card landing-result-card--olive">
          <div>
            <h3>손안에서 만나는<br />우리 가게 상품</h3>
            <p>
              상품 사진과 설명, 가격까지.<br />
              휴대폰에서 보기 좋은 페이지로<br />
              깔끔하게 소개하세요.
            </p>
          </div>
          <div class="landing-result-card__visual landing-result-card__visual--mobile" aria-hidden="true">
            <img class="landing-result-card__mobile" :src="resultMobileUrl" alt="" />
          </div>
          <p class="landing-result-card__caption">
            <img :src="dotUrl" alt="" aria-hidden="true" />
            링크와 QR 코드로 간편하게 공유
          </p>
        </article>

        <article class="landing-result-card landing-result-card--blue">
          <div>
            <h3>전화로 간편하게 주문하고<br />집으로 배송</h3>
            <p>
              쇼핑몰 주문이 어려웠던 고객은<br />
              익숙한 전화로 주문하고<br />
              배송받을 수 있어요.
            </p>
          </div>
          <img class="landing-result-card__visual" :src="resultPackageUrl" alt="" aria-hidden="true" />
          <p class="landing-result-card__caption">
            <img :src="dotUrl" alt="" aria-hidden="true" />
            상점 페이지에서 버튼만 누르면 주문 가능
          </p>
        </article>

        <article class="landing-result-card landing-result-card--beige">
          <div>
            <h3>어디든 홍보할 수 있는<br />우리 가게만의 QR 코드</h3>
            <p>
              우리 가게 주소를 담은 QR코드로<br />
              쉽게 공유하고 누구나 주문 가능하게<br />
              해줘요.
            </p>
          </div>
          <img class="landing-result-card__visual" :src="resultQrUrl" alt="" aria-hidden="true" />
          <p class="landing-result-card__caption">
            <img :src="dotUrl" alt="" aria-hidden="true" />
            링크와 QR 코드로 간편하게 공유
          </p>
        </article>
      </div>
    </section>

    <section class="landing-final" aria-labelledby="landing-final-title">
      <div class="landing-final__overlay" aria-hidden="true"></div>
      <div class="landing-final__content">
        <div>
          <h2 id="landing-final-title">좋은 상품이 더 많은 손님을 만나도록</h2>
          <p>첫 상품 페이지, 바로온장과 함께 만들어보세요.</p>
        </div>
        <button class="landing-button" type="button" @click="openInviteModal">시작하기</button>
      </div>
    </section>

    <footer class="landing-footer">
      <strong>바로온장</strong>
      <p>좋은 상품을 간편하게 알리는 한 페이지.</p>
      <small>© itswave. All rights reserved.</small>
    </footer>

    <InviteCodeModal
      :open="isInviteModalOpen"
      :has-error="hasInviteCodeError"
      :error-message="inviteCodeErrorMessage"
      :loading="isInviteCodeLoading"
      @close="closeInviteModal"
      @input="clearInviteCodeError"
      @submit="submitInviteCode"
    />
  </div>
</template>
