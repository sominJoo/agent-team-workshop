<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useWorkshopStore } from '~/stores/workshop'
import type { Tab } from '~/stores/workshop'

const store = useWorkshopStore()

let timer: ReturnType<typeof setInterval>
let i1: ReturnType<typeof setTimeout>
let i2: ReturnType<typeof setTimeout>

onMounted(() => {
  timer = setInterval(() => store.tick(), 1000)
  i1 = setTimeout(() => (store.intro = 'out'), 1900)
  i2 = setTimeout(() => (store.intro = 'done'), 2380)
})
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(i1)
  clearTimeout(i2)
})

const navItems: { key: Tab; icon: string; label: string }[] = [
  { key: 'schedule', icon: '📅', label: '일정' },
  { key: 'game', icon: '🎯', label: '게임' },
  { key: 'ride', icon: '🚗', label: '차편' },
  { key: 'room', icon: '🛏️', label: '방배정' },
  { key: 'org', icon: '👥', label: '위원회' },
]
</script>

<template>
  <div class="stage">
    <div class="phone">
      <div class="sc">
        <!-- 헤더 (sticky) -->
        <div class="header-wrap">
          <div class="header-stripe">
            <span style="background:#2FA9E0" /><span style="background:#F7D117" /><span style="background:#E8402A" />
            <span style="background:#2E9B4F" /><span style="background:#C4267E" /><span style="background:#1B3A8C" />
          </div>
          <div class="header">
            <div>
              <div class="header-brand">2026 에이전트팀 · 지온스테이</div>
              <div class="header-title">하계 워크샵</div>
            </div>
            <div class="header-dday">
              D-29
              <div class="header-dday-sub">09.03 START</div>
            </div>
          </div>
        </div>

        <!-- 공지 -->
        <button class="notice" @click="store.goMidRide()">
          <span class="notice-tag">공지</span>
          <span class="notice-text">마트조 · 간식조 · 송어조 편성 확인해주세요!</span>
          <span class="notice-arrow">›</span>
        </button>

        <!-- 나 선택 (차편/방배정 탭에서만) -->
        <div v-if="store.showMePicker" class="me-picker">
          <div class="me-box">
            <span class="me-label">나는</span>
            <div class="me-list">
              <button
                v-for="p in store.people"
                :key="p.name"
                class="me-chip"
                :style="{ background: p.bg, color: p.fg }"
                @click="store.pickMe(p.name)"
              >{{ p.name }}</button>
            </div>
          </div>
        </div>

        <!-- 탭 콘텐츠 -->
        <ScheduleTab v-if="store.tab === 'schedule'" />
        <GameTab v-else-if="store.tab === 'game'" />
        <RideTab v-else-if="store.tab === 'ride'" />
        <RoomTab v-else-if="store.tab === 'room'" />
        <OrgTab v-else-if="store.tab === 'org'" />
      </div>

      <!-- 인트로 / 게임 모달 -->
      <IntroSplash />
      <GameModal />

      <!-- 하단 네비 -->
      <div class="nav">
        <button
          v-for="n in navItems"
          :key="n.key"
          class="nav-btn"
          @click="store.setTab(n.key)"
        >
          <div class="nav-icon">{{ n.icon }}</div>
          <div class="nav-label" :style="{ color: store.tab === n.key ? '#E8402A' : '#8a8a8a' }">{{ n.label }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage {
  min-height: 100vh; display: flex; align-items: flex-start; justify-content: center;
  padding: 28px 12px;
}
.phone {
  width: 390px; height: 844px; position: relative; overflow: hidden;
  background: #F5EEDC; border: 3px solid #1A1A1A; border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0,0,0,.28);
}

/* 헤더 */
.header-wrap { position: sticky; top: 0; z-index: 6; background: #F5EEDC; }
.header-stripe { display: flex; height: 9px; }
.header-stripe span { flex: 1; }
.header {
  padding: 12px 16px 11px; border-bottom: 3px solid #1A1A1A;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.header-brand { font-family: 'Jua', sans-serif; font-size: 11.5px; letter-spacing: .4px; color: #1B3A8C; }
.header-title {
  font-family: 'Black Han Sans', sans-serif; font-size: 27px; line-height: 1.05; color: #E8402A;
  text-shadow: 2px 2px 0 #F7D117, 3.5px 3.5px 0 #1A1A1A;
}
.header-dday {
  flex: none; background: #1A1A1A; color: #F7D117; font-family: 'Black Han Sans', sans-serif;
  font-size: 19px; padding: 7px 9px; border-radius: 5px; text-align: center; line-height: 1;
}
.header-dday-sub { font-family: 'Gothic A1', sans-serif; font-size: 8.5px; font-weight: 700; color: #fff; margin-top: 3px; }

/* 공지 */
.notice {
  width: calc(100% - 28px); margin: 12px 14px 0; background: #F7D117;
  border: 3px solid #1A1A1A; border-radius: 9px; padding: 9px 12px;
  display: flex; align-items: center; gap: 9px; box-shadow: 3px 3px 0 #1A1A1A; text-align: left;
}
.notice-tag { flex: none; background: #E8402A; color: #fff; font-size: 10px; font-weight: 900; padding: 3px 7px; border-radius: 20px; }
.notice-text { flex: 1; font-size: 12.5px; font-weight: 700; color: #1A1A1A; }
.notice-arrow { flex: none; font-size: 14px; font-weight: 900; color: #1A1A1A; }

/* 나 선택 */
.me-picker { padding: 0 14px 8px; margin-top: 12px; }
.me-box {
  display: flex; align-items: center; gap: 7px; background: #fff;
  border: 3px solid #1A1A1A; border-radius: 9px; padding: 7px 10px;
}
.me-label { flex: none; font-size: 11px; font-weight: 900; color: #888; }
.me-list { flex: 1; overflow-x: auto; display: flex; gap: 5px; padding-bottom: 1px; }
.me-list::-webkit-scrollbar { height: 0; }
.me-chip {
  flex: none; font-size: 11px; font-weight: 800; padding: 4px 9px; border-radius: 20px;
  border: 2px solid #1A1A1A; white-space: nowrap;
}

/* 하단 네비 */
.nav {
  position: absolute; left: 0; right: 0; bottom: 0; background: #F5EEDC;
  border-top: 3px solid #1A1A1A; display: grid; grid-template-columns: repeat(5, 1fr);
  padding: 8px 4px 12px;
}
.nav-btn { background: none; border: none; text-align: center; padding: 2px 0; }
.nav-icon { font-size: 16px; }
.nav-label { font-size: 9px; font-weight: 900; }
</style>
