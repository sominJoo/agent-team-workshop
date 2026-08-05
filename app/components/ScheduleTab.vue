<script setup lang="ts">
import { computed } from 'vue'
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()

interface Item {
  variant?: 'normal' | 'game' | 'dashed' | 'final'
  time: string
  to?: string
  timeNote?: string
  sideBg?: string
  sideFg?: string
  shadow?: string
  title: string
  titleColor?: string
  now?: boolean
  sub?: string
  link?: { label: string; url: string; bg: string; fg: string }
  action?: 'goMidRide' | 'goGame'
  actionLabel?: string
  actionBg?: string
  actionFg?: string
}

const GREEN = { bg: '#2E9B4F', fg: '#fff' }
const YELLOW = { bg: '#F7D117', fg: '#1A1A1A' }

const day1: Item[] = [
  { time: '12:00', to: '~13:00', sideBg: '#E8402A', sideFg: '#fff', shadow: '#E8402A', title: '점심 식사', now: true, link: { label: '황해식당', url: 'https://naver.me/FeX2FAkV', ...GREEN } },
  { time: '13:00', to: '~14:00', sideBg: '#2FA9E0', sideFg: '#fff', shadow: '#2FA9E0', title: '야외활동 진행', link: { label: '용문사 관광단지', url: 'https://naver.me/5PVaMKEf', ...GREEN } },
  { time: '14:00', to: '~14:30', sideBg: '#F7D117', sideFg: '#1A1A1A', shadow: '#F7D117', title: '카페 ☕', sub: '적당한 곳 들어가기' },
  { time: '14:30', to: '~16:00', sideBg: '#C4267E', sideFg: '#fff', shadow: '#C4267E', title: '숙소 입실 & 마트 장보기', sub: '마트조 / 간식조 / 송어조 분리 이동', action: 'goMidRide', actionLabel: '🚗 조별 차편 확인', actionBg: '#C4267E', actionFg: '#fff' },
  { time: '16:00', to: '~17:00', sideBg: '#EDE7D8', sideFg: '#1A1A1A', shadow: '#999', title: '개인 시간', link: { label: '지온스테이', url: 'https://naver.me/G5kDtM7h', ...GREEN } },
  { time: '17:00', to: '~18:00', sideBg: '#1B3A8C', sideFg: '#fff', shadow: '#1B3A8C', title: '워크샵 발표', sub: '상반기 회고 / 하반기 계획 공유 · 숙소 내 TV 활용', link: { label: '📊 발표 자료 (구글 슬라이드)', url: 'https://docs.google.com/presentation/', ...YELLOW } },
  { time: '18:00', to: '~20:00', sideBg: '#2E9B4F', sideFg: '#fff', shadow: '#2E9B4F', title: '저녁식사 🔥 숙소 바베큐', link: { label: '지온스테이', url: 'https://naver.me/G5kDtM7h', ...GREEN } },
  { variant: 'game', time: '20:00', to: '~21:00', title: '게임 진행 ⭐', action: 'goGame', actionLabel: '게임 종목 보기 ›' },
  { variant: 'dashed', time: '21:00', title: '개인 자유시간', sub: '지온스테이' },
]

const day2: Item[] = [
  { time: '08:30', to: '~09:30', sideBg: '#F7D117', sideFg: '#1A1A1A', shadow: '#F7D117', title: '아침 식사 🍜', sub: '라면 · 숙소 내' },
  { time: '09:30', to: '~10:30', sideBg: '#EDE7D8', sideFg: '#1A1A1A', shadow: '#999', title: '개인 정비 시간' },
  { time: '10:30', to: '~11:00', sideBg: '#C4267E', sideFg: '#fff', shadow: '#C4267E', title: '숙소 정리', sub: '퇴실 준비 · 짐 정리' },
  { time: '11:00', to: '~11:30', sideBg: '#2FA9E0', sideFg: '#fff', shadow: '#2FA9E0', title: '카페 이동 🚗' },
  { time: '11:30', to: '~12:30', sideBg: '#E8402A', sideFg: '#fff', shadow: '#E8402A', title: '카페 ☕', link: { label: '8코기네', url: 'https://map.naver.com/p/search/8코기네', ...GREEN } },
  { time: '12:30', timeNote: '집결', sideBg: '#1B3A8C', sideFg: '#fff', shadow: '#1B3A8C', title: '주유소 집결 ⛽', link: { label: 'HD현대오일뱅크 백안주유소', url: 'https://naver.me/5OlU58Z0', ...GREEN } },
  { variant: 'final', time: '13:00', title: '해산 👋 수고하셨습니다!' },
]

const items = computed(() => (store.day === 1 ? day1 : day2))

function onAction(a: 'goMidRide' | 'goGame') {
  if (a === 'goMidRide') store.goMidRide()
  else store.goGame()
}
</script>

<template>
  <div>
    <!-- Day 토글 -->
    <div class="day-toggle">
      <button
        class="day-btn"
        :style="{ background: store.day === 1 ? '#1B3A8C' : '#F5EEDC', color: store.day === 1 ? '#fff' : '#1A1A1A' }"
        @click="store.setDay(1)"
      >
        <div class="day-label">DAY 1</div>
        <div class="day-date">09.03 목</div>
      </button>
      <button
        class="day-btn"
        :style="{ background: store.day === 2 ? '#1B3A8C' : '#F5EEDC', color: store.day === 2 ? '#fff' : '#1A1A1A' }"
        @click="store.setDay(2)"
      >
        <div class="day-label">DAY 2</div>
        <div class="day-date">09.04 금</div>
      </button>
    </div>

    <div class="timeline">
      <template v-for="(it, i) in items" :key="i">
        <!-- 게임 진행 특수 카드 -->
        <div v-if="it.variant === 'game'" class="card game-card" :style="{ boxShadow: '3px 3px 0 #F7D117' }">
          <div class="side" style="background:#F7D117;color:#1A1A1A">
            <div class="side-main">{{ it.time }}</div>
            <div class="side-sub">{{ it.to }}</div>
          </div>
          <div class="body">
            <div class="game-title">{{ it.title }}</div>
            <button class="game-go" @click="onAction('goGame')">{{ it.actionLabel }}</button>
          </div>
        </div>

        <!-- 점선 카드 (개인 자유시간) -->
        <div v-else-if="it.variant === 'dashed'" class="dashed-card">
          <div class="dashed-time">{{ it.time }}</div>
          <div class="dashed-title">{{ it.title }}</div>
          <div class="dashed-note">{{ it.sub }}</div>
        </div>

        <!-- 해산 특수 카드 -->
        <div v-else-if="it.variant === 'final'" class="final-card">
          <div class="final-time">{{ it.time }}</div>
          <div class="final-title">{{ it.title }}</div>
        </div>

        <!-- 일반 카드 -->
        <div v-else class="card" :style="{ boxShadow: `3px 3px 0 ${it.shadow}` }">
          <div class="side" :style="{ background: it.sideBg, color: it.sideFg }">
            <div class="side-main">{{ it.time }}</div>
            <div class="side-sub">{{ it.timeNote || it.to }}</div>
          </div>
          <div class="body">
            <div class="title-row">
              <span v-if="it.now" class="now-badge">NOW</span>
              <span class="title" :style="it.titleColor ? { color: it.titleColor } : {}">{{ it.title }}</span>
            </div>
            <div v-if="it.sub" class="sub">{{ it.sub }}</div>
            <a v-if="it.link" :href="it.link.url" target="_blank" class="pill" :style="{ background: it.link.bg, color: it.link.fg }">
              <template v-if="!it.link.label.startsWith('📊')">📍 </template>{{ it.link.label }} ›
            </a>
            <button v-if="it.action" class="action-btn" :style="{ background: it.actionBg, color: it.actionFg }" @click="onAction(it.action)">
              {{ it.actionLabel }}<span class="action-arrow">›</span>
            </button>
          </div>
        </div>
      </template>

      <div class="tab-bottom-space" />
    </div>
  </div>
</template>

<style scoped>
.day-toggle { display: flex; gap: 8px; padding: 6px 14px 12px; }
.day-btn { flex: 1; text-align: left; border: 3px solid #1A1A1A; border-radius: 9px; padding: 8px 10px; }
.day-label { font-size: 9.5px; font-weight: 900; opacity: .75; }
.day-date { font-family: 'Jua', sans-serif; font-size: 16px; }

.timeline { padding: 0 14px; display: flex; flex-direction: column; gap: 10px; }

.card {
  border: 3px solid #1A1A1A; border-radius: 10px; background: #fff;
  overflow: hidden; display: flex;
}
.side {
  flex: none; width: 66px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 12px 0;
  border-right: 3px solid #1A1A1A;
}
.side-main { font-family: 'Black Han Sans', sans-serif; font-size: 19px; line-height: 1; }
.side-sub { font-size: 9px; font-weight: 700; opacity: .8; }
.body { flex: 1; padding: 11px 12px; }

.title-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.title { font-family: 'Jua', sans-serif; font-size: 17px; color: #1A1A1A; }
.now-badge {
  background: #1A1A1A; color: #F7D117; font-size: 9px; font-weight: 900;
  padding: 2px 6px; border-radius: 20px;
}
.sub { font-size: 11.5px; font-weight: 600; color: #666; margin: 2px 0 4px; }

.pill {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 6px;
  font-size: 11.5px; font-weight: 800; padding: 5px 9px; border-radius: 20px;
  border: 2px solid #1A1A1A; white-space: nowrap;
}
.action-btn {
  width: 100%; margin-top: 8px; border: 2px solid #1A1A1A; border-radius: 20px;
  padding: 6px 10px; font-size: 11.5px; font-weight: 900;
  display: flex; align-items: center; gap: 6px; text-align: left;
}
.action-arrow { margin-left: auto; }

/* 게임 진행 카드 */
.game-card { background: #1A1A1A; }
.game-title {
  font-family: 'Black Han Sans', sans-serif; font-size: 20px; color: #F7D117;
  text-shadow: 2px 2px 0 #E8402A;
}
.game-go {
  margin-top: 7px; background: #F7D117; color: #1A1A1A; font-size: 11px;
  font-weight: 900; padding: 5px 10px; border-radius: 20px; border: 2px solid #F7D117;
}

/* 점선 카드 */
.dashed-card {
  border: 3px dashed #1A1A1A; border-radius: 10px; background: #fff;
  display: flex; align-items: center; gap: 10px; padding: 11px 12px;
}
.dashed-time { font-family: 'Black Han Sans', sans-serif; font-size: 18px; }
.dashed-title { font-family: 'Jua', sans-serif; font-size: 16px; }
.dashed-note { margin-left: auto; font-size: 11px; font-weight: 700; color: #888; }

/* 해산 카드 */
.final-card {
  border: 3px solid #1A1A1A; border-radius: 10px; background: #1A1A1A;
  box-shadow: 3px 3px 0 #F7D117; display: flex; align-items: center;
  gap: 10px; padding: 13px 14px;
}
.final-time { font-family: 'Black Han Sans', sans-serif; font-size: 19px; color: #F7D117; }
.final-title { font-family: 'Black Han Sans', sans-serif; font-size: 20px; color: #fff; }

.tab-bottom-space { height: 96px; }
</style>
