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

const navItems: { key: Tab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'game', label: '게임' },
  { key: 'ride', label: '차편' },
  { key: 'room', label: '방배정' },
  { key: 'org', label: '위원회' },
]
</script>

<template>
  <div class="app">
    <!-- 헤더 (sticky) -->
    <header class="header-wrap">
      <div class="header-stripe">
        <span style="background:#4A8FB0" /><span style="background:#D99A2B" /><span style="background:#C4452F" />
        <span style="background:#4A7C59" /><span style="background:#9E4368" /><span style="background:#2A4A8B" />
      </div>
      <div class="container">
        <div class="header">
          <div class="header-titles">
            <div class="eyebrow">2026 에이전트팀 · 지온스테이</div>
            <div class="header-title">하계 워크샵</div>
          </div>

          <!-- 데스크톱 네비 (헤더 내 가로 탭) -->
          <nav class="nav-wide" aria-label="주요 메뉴">
            <button
              v-for="n in navItems"
              :key="n.key"
              class="nav-wide-btn"
              :class="{ 'is-active': store.tab === n.key }"
              :aria-current="store.tab === n.key ? 'page' : undefined"
              @click="store.setTab(n.key)"
            >{{ n.label }}</button>
          </nav>

          <div class="header-dday">
            <div class="header-dday-val">{{ store.dday }}</div>
            <div class="header-dday-sub">{{ store.ddaySub }}</div>
          </div>
        </div>이
      </div>
    </header>

    <main class="main">
      <div class="container">
        <!-- 공지 -->
        <button class="notice" @click="store.goMidRide()">
          <span class="notice-tag">공지</span>
          <span class="notice-text">마트조 · 간식조 · 송어조 편성 확인해주세요</span>
          <span class="chev">›</span>
        </button>

        <!-- 나 선택 (차편/방배정 탭에서만) -->
        <div v-if="store.showMePicker" class="me-picker">
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

        <!-- 탭 콘텐츠 -->
        <ScheduleTab v-if="store.tab === 'schedule'" />
        <GameTab v-else-if="store.tab === 'game'" />
        <RideTab v-else-if="store.tab === 'ride'" />
        <RoomTab v-else-if="store.tab === 'room'" />
        <OrgTab v-else-if="store.tab === 'org'" />
      </div>
    </main>

    <!-- 인트로 / 게임 모달 -->
    <IntroSplash />
    <GameModal />

    <!-- 모바일 하단 네비 -->
    <nav class="nav" aria-label="주요 메뉴">
      <button
        v-for="n in navItems"
        :key="n.key"
        class="nav-btn"
        :class="{ 'is-active': store.tab === n.key }"
        :aria-current="store.tab === n.key ? 'page' : undefined"
        @click="store.setTab(n.key)"
      >{{ n.label }}</button>
    </nav>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
}

/* ── 헤더 ── */
.header-wrap {
  position: sticky;
  top: 0;
  z-index: 6;
  background: rgba(246, 241, 230, .94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--hairline);
}
.header-stripe { display: flex; height: 3px; }
.header-stripe span { flex: 1; }
.header {
  padding: 14px 0 13px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.header-titles { min-width: 0; }
.header-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: clamp(25px, 3vw, 34px);
  line-height: 1.15;
  color: var(--red);
  margin-top: 3px;
  white-space: nowrap;
}
.header-dday { flex: none; text-align: right; }
.header-dday-val {
  font-family: 'Black Han Sans', sans-serif;
  font-size: clamp(20px, 2vw, 26px);
  line-height: 1;
  color: var(--ink);
}
.header-dday-sub {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--muted);
  margin-top: 3px;
  letter-spacing: .04em;
}

/* 데스크톱 네비 — 900px 이상에서만 노출 */
.nav-wide { display: none; }
.nav-wide-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 7px 15px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--muted);
  white-space: nowrap;
  transition: color .14s ease, background .14s ease, border-color .14s ease;
}
.nav-wide-btn:hover { color: var(--ink); background: var(--paper-2); }
.nav-wide-btn.is-active {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

/* ── 본문 ── */
.main {
  flex: 1;
  padding-bottom: var(--bottom-space);
}

/* ── 공지 ── */
.notice {
  width: 100%;
  margin: 14px 0 0;
  background: var(--paper-2);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  padding: 11px 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}
.notice-tag {
  flex: none;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--red);
  border: 1px solid rgba(196, 69, 47, .35);
  padding: 3px 7px;
  border-radius: 20px;
}
.notice-text {
  flex: 1;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-2);
  line-height: 1.4;
}
.chev { flex: none; font-size: 14px; color: var(--muted-3); }

/* ── 나 선택 ── */
.me-picker {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
}
.me-label { flex: none; font-size: 10.5px; font-weight: 700; color: var(--muted); }
.me-list {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  display: flex;
  gap: 6px;
  padding-bottom: 2px;
}
.me-list::-webkit-scrollbar { height: 0; }
.me-chip {
  flex: none;
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 20px;
  border: 1px solid var(--line-2);
  white-space: nowrap;
}

/* ── 하단 네비 (모바일) ── */
.nav {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 10;
  background: rgba(246, 241, 230, .94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--hairline);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 10px 6px calc(16px + env(safe-area-inset-bottom));
}
.nav-btn {
  background: none;
  border: none;
  text-align: center;
  padding: 3px 0;
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-2);
}
.nav-btn.is-active { color: var(--red); }

/* ── 태블릿 이상 ── */
@media (min-width: 640px) {
  .me-list { flex-wrap: wrap; overflow-x: visible; }
}

/* ── 데스크톱: 헤더 네비로 전환, 하단 네비 숨김 ── */
@media (min-width: 900px) {
  .header { padding: 16px 0 15px; }
  .nav-wide { display: flex; gap: 4px; flex: 1; justify-content: center; }
  .nav { display: none; }
  .notice { margin-top: 20px; }
}
</style>
