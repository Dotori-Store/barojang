<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import '../styles/invite-code-modal.css'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '올바른 코드가 아닙니다',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'input', 'submit'])
const inviteCode = ref('')
const inputElement = ref(null)

function closeModal() {
  if (props.loading) {
    return
  }

  emit('close')
}

function submitModal() {
  if (!inviteCode.value.trim() || props.loading) {
    return
  }

  emit('submit', inviteCode.value)
}

function updateInviteCode() {
  emit('input')
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    if (isOpen) {
      inviteCode.value = ''
      await nextTick()
      inputElement.value?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="invite-modal"
      role="presentation"
      @click.self="closeModal"
      @keydown="handleKeydown"
    >
      <section
        class="invite-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        aria-describedby="invite-modal-description"
      >
        <h2 id="invite-modal-title">초대코드를 입력하세요</h2>

        <form class="invite-modal__form" @submit.prevent="submitModal">
          <label class="invite-modal__field">
            <span class="invite-modal__label">초대코드</span>
            <input
              ref="inputElement"
              v-model="inviteCode"
              type="password"
              name="invite-code"
              autocomplete="one-time-code"
              :disabled="loading"
              :aria-invalid="hasError"
              :aria-describedby="hasError ? 'invite-code-error' : undefined"
              @input="updateInviteCode"
            />
            <span v-if="hasError" id="invite-code-error" class="invite-modal__error">
              {{ errorMessage }}
            </span>
          </label>

          <p id="invite-modal-description" class="invite-modal__description">
            이 서비스는 시범운영중이며 초대코드를 받은 사용자만 이용가능합니다.
          </p>

          <button
            class="invite-modal__submit"
            type="submit"
            :disabled="!inviteCode.trim() || loading"
          >
            {{ loading ? '확인 중...' : '확인' }}
          </button>
        </form>
      </section>
    </div>
  </Teleport>
</template>
