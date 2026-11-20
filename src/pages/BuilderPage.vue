<script setup>
import { reactive } from 'vue'
import { productPresets } from '../data/mockData.js'
import stepLineUrl from '../assets/builder/step-line.svg'
import '../styles/builder.css'

const form = reactive({
  category: '',
  name: '',
  price: '',
  weight: '',
  origin: '',
})
</script>

<template>
  <div class="builder-page">
    <header class="builder-header">
      <RouterLink to="/" class="builder-header__brand">바로온장</RouterLink>
    </header>

    <main class="builder-main">
      <div class="builder-heading">
        <h1>무엇을 판매하시나요?</h1>

        <ol class="builder-steps" aria-label="상품 만들기 진행 단계">
          <img class="builder-steps__line" :src="stepLineUrl" alt="" aria-hidden="true" />
          <li class="builder-steps__item builder-steps__item--active" aria-current="step">1</li>
          <li class="builder-steps__item">2</li>
          <li class="builder-steps__item">3</li>
        </ol>
      </div>

      <form class="product-form" @submit.prevent>
        <div class="product-form__fields">
          <div class="product-field">
            <label for="product-category">판매 품목</label>
            <select
              id="product-category"
              v-model="form.category"
              class="product-field__control product-field__select"
              :class="{ 'is-placeholder': !form.category }"
            >
              <option value="" disabled>품목을 선택해 주세요</option>
              <option v-for="preset in productPresets" :key="preset.id" :value="preset.id">
                {{ preset.label }}
              </option>
            </select>
          </div>

          <div class="product-field">
            <label for="product-name">상품명</label>
            <input
              id="product-name"
              v-model="form.name"
              class="product-field__control"
              type="text"
              placeholder="예: 국물용 멸치"
              autocomplete="off"
            />
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
            />
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
            />
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
            />
          </div>
        </div>

        <div class="product-form__bottom">
          <button class="product-form__next" type="submit">다음</button>
        </div>
      </form>
    </main>
  </div>
</template>
