<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()

// public/ 자산은 baseURL을 붙여야 서브경로 배포(GitHub Pages)에서도 해석된다
const introImage = `${useRuntimeConfig().app.baseURL}images/workshop-intro.png`
</script>

<template>
  <div
    v-if="store.intro !== 'done'"
    class="intro"
    :class="store.intro === 'out' ? 'intro-out' : 'intro-in'"
  >
    <img
      :src="introImage"
      alt="2026 에이전트팀 하계 워크샵"
      class="intro-image"
    >
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.intro-in { animation: introPop .62s cubic-bezier(.2, 1, .4, 1) both; }
.intro-out { animation: introOut .45s ease-in both; pointer-events: none; }

/* 이미지는 화면 비율에 맞춰 축소만 하고 잘리지 않게 유지 */
.intro-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
