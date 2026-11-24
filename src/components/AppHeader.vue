<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoUrl from '../assets/landing/logo.svg'
import tokenUrl from '../assets/landing/token.svg'
import userProfileUrl from '../assets/landing/user-profile.svg'
import '../styles/app-header.css'

const route = useRoute()
const router = useRouter()
const profileTooltip = ref('')
let profileTooltipTimer

function showProfileTooltip(message) {
  window.clearTimeout(profileTooltipTimer)
  profileTooltip.value = message
  profileTooltipTimer = window.setTimeout(() => {
    profileTooltip.value = ''
  }, 2600)
}

async function handleProfileClick() {
  profileTooltip.value = ''

  try {
    const sessionResponse = await fetch('/api/session', { headers: { Accept: 'application/json' } })
    const session = sessionResponse.ok ? await sessionResponse.json() : { authenticated: false }

    if (!session.authenticated) {
      await router.push({ name: 'landing', query: { invite: 'required' } })
      return
    }

    const productResponse = await fetch('/api/products', { headers: { Accept: 'application/json' } })
    if (!productResponse.ok) throw new Error('Could not load product')
    const result = await productResponse.json()

    if (result.product) {
      if (route.name !== 'mypage') await router.push('/mypage')
      return
    }

    showProfileTooltip('상품페이지를 만들어주세요.')
  } catch {
    await router.push({ name: 'landing', query: { invite: 'required' } })
  }
}

onBeforeUnmount(() => window.clearTimeout(profileTooltipTimer))
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
        <a
          class="app-header__profile-link"
          href="/mypage"
          aria-label="마이페이지"
          @click.prevent="handleProfileClick"
        >
          <img class="app-header__profile" :src="userProfileUrl" alt="" aria-hidden="true" />
          <span v-if="profileTooltip" class="app-header__profile-tooltip" role="status">
            {{ profileTooltip }}
          </span>
        </a>
      </div>
    </div>
  </header>
</template>
