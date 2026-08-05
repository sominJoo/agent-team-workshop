<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()
</script>

<template>
  <div v-if="store.modal" class="overlay">
    <button class="backdrop" aria-label="닫기" @click="store.closeGame()" />
    <div class="sheet">
      <div class="handle" />
      <div class="header">
        <span class="no" :style="{ color: store.modal.color }">{{ store.modal.no }}</span>
        <span class="title-wrap">
          <span class="title">{{ store.modal.title }}</span>
          <span class="tag" :style="{ color: store.modal.tagFg, borderColor: store.modal.tagLine }">{{ store.modal.tag }}</span>
        </span>
        <button class="close" @click="store.closeGame()">✕</button>
      </div>
      <div class="how">
        <div class="how-label">진행 방법</div>
        <div class="how-lines">
          <div v-for="(line, i) in store.modal.lines" :key="i" class="how-line">{{ line }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 모바일: 하단 바텀시트 */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(20, 22, 28, .5);
  display: flex;
  align-items: flex-end;
}
.backdrop { position: absolute; inset: 0; background: none; border: none; }
.sheet {
  position: relative;
  width: 100%;
  max-height: 82vh;
  overflow-y: auto;
  background: var(--paper);
  border-radius: 22px 22px 0 0;
  padding: 14px 18px 26px;
  animation: fadeUp .22s ease both;
}
.handle {
  width: 40px;
  height: 4px;
  border-radius: 20px;
  background: rgba(32, 36, 44, .18);
  margin: 0 auto 16px;
}
.header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.no { font-family: 'Black Han Sans', sans-serif; font-size: 22px; line-height: 1.2; }
.title-wrap { flex: 1; min-width: 0; }
.title {
  display: block;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 23px;
  line-height: 1.25;
  color: var(--ink);
}
.tag {
  display: inline-block;
  margin-top: 7px;
  font-size: 10px;
  font-weight: 800;
  border: 1px solid;
  padding: 4px 10px;
  border-radius: 20px;
}
.close {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--line-2);
  background: var(--card);
  font-size: 13px;
  color: var(--ink-3);
  line-height: 1;
}
.how {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
}
.how-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--muted);
  margin-bottom: 9px;
}
.how-lines { display: flex; flex-direction: column; gap: 7px; }
.how-line {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-2);
  line-height: 1.6;
  text-wrap: pretty;
}

/* ── 데스크톱: 화면 중앙 다이얼로그 ── */
@media (min-width: 900px) {
  .overlay { align-items: center; justify-content: center; padding: 32px; }
  .sheet {
    width: 100%;
    max-width: 560px;
    max-height: 80vh;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 24px 60px rgba(32, 36, 44, .28);
  }
  /* 드래그 핸들은 바텀시트 전용 요소 */
  .handle { display: none; }
  .title { font-size: 26px; }
}
</style>
