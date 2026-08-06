<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean; src: string; alt: string }>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

// ssr: false 프로젝트라 document 직접 접근이 안전하다
watch(() => props.open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" role="dialog" aria-modal="true" :aria-label="alt">
      <button class="backdrop" aria-label="닫기" @click="emit('close')" />
      <img class="full" :src="src" :alt="alt">
      <button class="close" aria-label="닫기" @click="emit('close')">✕</button>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(20, 22, 28, .82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.backdrop { position: absolute; inset: 0; background: none; border: none; }
.full {
  position: relative;
  max-width: 100%;
  /* 우측 상단 닫기 버튼과 겹치지 않도록 여유를 둔다 */
  max-height: calc(100dvh - 96px);
  object-fit: contain;
  border-radius: var(--radius);
  animation: fadeUp .22s ease both;
}
.close {
  position: absolute;
  top: calc(14px + env(safe-area-inset-top));
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(246, 241, 230, .3);
  background: rgba(20, 22, 28, .5);
  color: var(--paper);
  font-size: 14px;
  line-height: 1;
}

@media (min-width: 900px) {
  .overlay { padding: 40px; }
  .full { max-height: calc(100dvh - 120px); }
  .close { top: 24px; right: 24px; }
}
</style>
