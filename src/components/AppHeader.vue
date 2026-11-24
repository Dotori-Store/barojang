<script setup>
import logoUrl from '../assets/landing/logo.svg'
import tokenUrl from '../assets/landing/token.svg'
import userProfileUrl from '../assets/landing/user-profile.svg'
import '../styles/app-header.css'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink class="app-header__logo" to="/" aria-label="바로온장 홈">
        <img :src="logoUrl" alt="바로온장" />
      </RouterLink>

      <div class="app-header__account">
        <div class="app-header__coin" aria-label="시연용 남은 코인 8개">
          <img :src="tokenUrl" alt="" aria-hidden="true" />
          <span class="app-header__coin-number">8</span>
          <span class="app-header__coin-unit">코인</span>
        </div>
        <RouterLink
          class="app-header__profile-link"
          to="/mypage"
          aria-label="마이페이지"
        >
          <img class="app-header__profile" :src="userProfileUrl" alt="" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
