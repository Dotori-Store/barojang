import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import CodeEntryPage from '../pages/CodeEntryPage.vue'
import MyPage from '../pages/MyPage.vue'
import BuilderPage from '../pages/BuilderPage.vue'
import ProductPage from '../pages/ProductPage.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/enter', name: 'code-entry', component: CodeEntryPage },
  { path: '/mypage', name: 'mypage', component: MyPage },
  { path: '/builder', name: 'builder', component: BuilderPage },
  { path: '/p/:id', name: 'product', component: ProductPage, props: true },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
