<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()
</script>

<template>
  <div v-if="store.modal" class="overlay">
    <button class="backdrop" @click="store.closeGame()" />
    <div class="sheet">
      <div class="handle" />
      <div class="header">
        <span class="no" :style="{ color: store.modal.color }">{{ store.modal.no }}</span>
        <span class="title-wrap">
          <span class="title">{{ store.modal.title }}</span>
          <span class="tag" :style="{ background: store.modal.tagBg, color: store.modal.tagFg }">{{ store.modal.tag }}</span>
        </span>
        <button class="close" @click="store.closeGame()">✕</button>
      </div>
      <div class="how" :style="{ boxShadow: `3px 3px 0 ${store.modal.color}` }">
        <div class="how-label">진행 방법</div>
        <div class="how-lines">
          <div v-for="(line, i) in store.modal.lines" :key="i" class="how-line">{{ line }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay { position: absolute; inset: 0; z-index: 20; background: rgba(20,20,20,.62); display: flex; align-items: flex-end; }
.backdrop { position: absolute; inset: 0; background: none; border: none; }
.sheet {
  position: relative; width: 100%; max-height: 82%; overflow-y: auto; background: #F5EEDC;
  border-top: 3px solid #1A1A1A; border-radius: 20px 20px 0 0; padding: 16px 16px 24px;
}
.handle { width: 44px; height: 5px; border-radius: 20px; background: #1A1A1A; opacity: .25; margin: 0 auto 14px; }
.header { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 14px; }
.no { font-family: 'Black Han Sans', sans-serif; font-size: 26px; line-height: 1; }
.title-wrap { flex: 1; }
.title { display: block; font-family: 'Black Han Sans', sans-serif; font-size: 24px; line-height: 1.15; }
.tag { display: inline-block; margin-top: 6px; font-size: 10.5px; font-weight: 900; padding: 4px 9px; border-radius: 20px; }
.close {
  flex: none; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #1A1A1A;
  background: #fff; font-size: 14px; font-weight: 900; line-height: 1;
}
.how { background: #fff; border: 3px solid #1A1A1A; border-radius: 10px; padding: 13px; }
.how-label { font-size: 10.5px; font-weight: 900; color: #888; margin-bottom: 8px; }
.how-lines { display: flex; flex-direction: column; gap: 7px; }
.how-line { font-size: 13px; font-weight: 600; color: #1A1A1A; line-height: 1.55; }
</style>
