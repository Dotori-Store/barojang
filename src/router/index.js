import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import CodeEntryPage from '../pages/CodeEntryPage.vue'
import MyPage from '../pages/MyPage.vue'
import BuilderPage from '../pages/BuilderPage.vue'
import ProductPage from '../pages/ProductPage.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/enter', name: 'code-entry', component: CodeEntryPage },
  { path: '/mypage', name: 'mypage', component: MyPage, meta: { requiresInvite: true } },
  { path: '/builder', name: 'builder', component: BuilderPage, meta: { requiresInvite: true } },
  { path: '/p/:id', name: 'product', component: ProductPage, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresInvite) {
    return true
  }

  if (import.meta.env.DEV) {
    return true
  }

  try {
    const response = await fetch('/api/session', { headers: { Accept: 'application/json' } })
    const result = response.ok ? await response.json() : { authenticated: false }

    if (result.authenticated) {
      return true
    }
  } catch {
    // 인증 확인 실패 시 보호 화면 진입을 허용하지 않는다.
  }

  return { name: 'landing', query: { invite: 'required' } }
})

export default router
