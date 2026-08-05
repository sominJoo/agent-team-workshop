<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()
// 원본은 스플래시 이미지였으나 에셋 미포함 → 동일 애니메이션의 CSS 텍스트 스플래시로 대체
const introImage = '/images/workshop-intro.png'
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
  position: absolute; inset: 0; z-index: 60; background: #1A1A1A;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; overflow: hidden;
}
.intro-in { animation: introPop .62s cubic-bezier(.2,1.4,.4,1) both; }
.intro-out { animation: introOut .65s ease-in both; pointer-events: none; }

.intro-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.stripe { display: flex; width: 180px; height: 10px; border-radius: 6px; overflow: hidden; }
.stripe span { flex: 1; }
.brand { font-family: 'Jua', sans-serif; font-size: 13px; letter-spacing: .4px; color: #2FA9E0; }
.headline {
  font-family: 'Black Han Sans', sans-serif; font-size: 46px; line-height: 1.05; color: #E8402A;
  text-shadow: 2px 2px 0 #F7D117, 4px 4px 0 #fff;
}

</style>
