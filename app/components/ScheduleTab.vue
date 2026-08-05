<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'
import { RED, SKY, GREEN, PLUM, NAVY, GOLD, GRAY } from '~/data/workshop'

const store = useWorkshopStore()

interface Item {
  variant?: 'normal' | 'dashed' | 'game' | 'final'
  /** 좌측 시간 컬럼: 시작 / 종료(또는 '집결' 같은 메모) */
  time: string
  end?: string
  /** 카드 좌측 6px 원형 마커 */
  dot?: string
  title: string
  now?: boolean
  sub?: string
  /** 지도·자료 링크 (아웃라인 pill) */
  link?: { label: string; url: string; tone?: 'green' | 'navy' }
  /** 점선 카드 우측 보조 정보 */
  note?: string
  noteLink?: { label: string; url: string }
  action?: 'goMidRide' | 'goGame'
  actionLabel?: string
}

const day1: Item[] = [
  { time: '12:00', end: '13:00', dot: RED, title: '점심 식사', now: true, link: { label: '황해식당', url: 'https://naver.me/FeX2FAkV' } },
  { time: '13:00', end: '14:00', dot: SKY, title: '야외활동 진행', link: { label: '용문사 관광단지', url: 'https://naver.me/5PVaMKEf' } },
  { time: '14:00', end: '14:30', dot: GOLD, title: '카페', sub: '적당한 곳 들어가기' },
  { time: '14:30', end: '16:00', dot: PLUM, title: '숙소 입실 & 마트 장보기', sub: '마트조 / 간식조 / 송어조 분리 이동', action: 'goMidRide', actionLabel: '조별 차편 확인' },
  { variant: 'dashed', time: '16:00', end: '17:00', title: '개인 시간', noteLink: { label: '지온스테이', url: 'https://naver.me/G5kDtM7h' } },
  { time: '17:00', end: '18:00', dot: NAVY, title: '워크샵 발표', sub: '상반기 회고 / 하반기 계획 공유 · 숙소 내 TV 활용', link: { label: '발표 자료 (구글 슬라이드)', url: 'https://docs.google.com/presentation/', tone: 'navy' } },
  { time: '18:00', end: '20:00', dot: GREEN, title: '저녁식사 · 숙소 바베큐', link: { label: '지온스테이', url: 'https://naver.me/G5kDtM7h' } },
  { variant: 'game', time: '20:00', end: '21:00', title: '게임 진행', action: 'goGame', actionLabel: '게임 종목 보기 ›' },
  { variant: 'dashed', time: '21:00', title: '개인 자유시간', note: '지온스테이' },
]

const day2: Item[] = [
  { time: '08:30', end: '09:30', dot: GOLD, title: '아침 식사', sub: '라면 · 숙소 내' },
  { time: '09:30', end: '10:30', dot: GRAY, title: '개인 정비 시간' },
  { time: '10:30', end: '11:00', dot: PLUM, title: '숙소 정리', sub: '퇴실 준비 · 짐 정리' },
  { time: '11:00', end: '11:30', dot: SKY, title: '카페 이동' },
  { time: '11:30', end: '12:30', dot: RED, title: '카페', link: { label: '8코기네', url: 'https://map.naver.com/p/search/8코기네' } },
  { time: '12:30', end: '집결', dot: NAVY, title: '주유소 집결', link: { label: 'HD현대오일뱅크 백안주유소', url: 'https://naver.me/5OlU58Z0' } },
  { variant: 'final', time: '13:00', title: '해산 · 수고하셨습니다' },
]

// 데스크톱에서는 두 컬럼을 동시에 표시하고, 모바일에서는 선택된 Day만 표시한다.
const days: { day: 1 | 2; date: string; items: Item[] }[] = [
  { day: 1, date: '09.03 목', items: day1 },
  { day: 2, date: '09.04 금', items: day2 },
]

function onAction(a: 'goMidRide' | 'goGame') {
  if (a === 'goMidRide') store.goMidRide()
  else store.goGame()
}
</script>

<template>
  <div>
    <!-- 포스터 히어로 -->
    <section class="hero">
      <div class="hero-poster">
        <img src="/images/workshop-intro.png" alt="2026 하계 워크샵 포스터">
      </div>
      <div class="hero-copy">함께 웃고, 쉬고, 더 가까워지는 하루</div>
      <div class="hero-meta">2026.09.03(목) – 09.04(금) · 양평 지온스테이</div>
    </section>

    <!-- Day 토글 (모바일 전용) -->
    <div class="day-toggle">
      <button
        v-for="d in days"
        :key="d.day"
        class="day-btn"
        :class="{ 'is-active': store.day === d.day }"
        @click="store.setDay(d.day)"
      >
        <div class="day-label">DAY {{ d.day }}</div>
        <div class="day-date">{{ d.date }}</div>
      </button>
    </div>

    <div class="days">
      <section
        v-for="d in days"
        :key="d.day"
        class="day-col"
        :class="{ 'is-active': store.day === d.day }"
      >
        <!-- 컬럼 헤더 (데스크톱 전용) -->
        <div class="day-head">
          <span class="day-head-no">DAY {{ d.day }}</span>
          <span class="day-head-date">{{ d.date }}</span>
        </div>

        <div class="timeline">
          <div v-for="(it, i) in d.items" :key="i" class="row">
            <!-- 좌측 시간 -->
            <div class="time">
              <div class="time-start">{{ it.time }}</div>
              <div v-if="it.end" class="time-end">{{ it.end }}</div>
            </div>

            <!-- 게임 진행 (다크 카드) -->
            <div v-if="it.variant === 'game'" class="card-dark">
              <div class="dark-title accent">{{ it.title }}</div>
              <button class="dark-btn" @click="onAction('goGame')">{{ it.actionLabel }}</button>
            </div>

            <!-- 해산 (다크 카드) -->
            <div v-else-if="it.variant === 'final'" class="card-dark final">
              <div class="dark-title">{{ it.title }}</div>
            </div>

            <!-- 개인 시간 (점선 카드) -->
            <div v-else-if="it.variant === 'dashed'" class="card-dashed">
              <span class="title">{{ it.title }}</span>
              <a v-if="it.noteLink" :href="it.noteLink.url" target="_blank" rel="noopener" class="dashed-note">{{ it.noteLink.label }} ›</a>
              <span v-else-if="it.note" class="dashed-note">{{ it.note }}</span>
            </div>

            <!-- 일반 카드 -->
            <div v-else class="card">
              <div class="card-title-row">
                <span class="dot" :style="{ background: it.dot }" />
                <span class="title">{{ it.title }}</span>
                <span v-if="it.now" class="now">NOW</span>
              </div>
              <div v-if="it.sub" class="sub">{{ it.sub }}</div>
              <a
                v-if="it.link"
                :href="it.link.url"
                target="_blank"
                rel="noopener"
                class="pill"
                :class="it.link.tone === 'navy' ? 'pill-navy' : 'pill-green'"
              >{{ it.link.label }} ›</a>
              <button v-if="it.action" class="action" @click="onAction(it.action)">
                {{ it.actionLabel }}<span class="chev">›</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ── 히어로 ── */
.hero { padding: 16px 0 0; }
.hero-poster {
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 132px;
  background: var(--ink);
}
.hero-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 32% 66%;
  display: block;
}
.hero-copy {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 17px;
  line-height: 1.3;
  color: var(--ink);
  margin-top: 11px;
}
.hero-meta { font-size: 11.5px; font-weight: 600; color: var(--muted); margin-top: 4px; }

/* ── Day 토글 (모바일) ── */
.day-toggle { display: flex; gap: 8px; padding: 12px 0 16px; }
.day-btn {
  flex: 1;
  text-align: left;
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
}
.day-btn.is-active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.day-label { font-size: 9.5px; font-weight: 800; letter-spacing: .08em; opacity: .7; }
.day-date { font-size: 15px; font-weight: 800; margin-top: 2px; }

/* 모바일: 선택된 Day 컬럼만 표시 */
.day-col { display: none; }
.day-col.is-active { display: block; }
.day-head { display: none; }

/* ── 타임라인 ── */
.timeline { display: flex; flex-direction: column; gap: var(--card-gap); }
.row { display: flex; gap: 12px; }
.time { flex: none; width: 44px; padding-top: 13px; text-align: right; }
.time-start { font-size: 13px; font-weight: 800; color: var(--ink); }
.time-end { font-size: 10px; font-weight: 600; color: var(--muted-2); margin-top: 1px; }

.card {
  flex: 1;
  min-width: 0;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 13px 14px;
  box-shadow: var(--shadow-card);
}
.card-title-row { display: flex; align-items: center; gap: 7px; }
.dot { flex: none; width: 6px; height: 6px; border-radius: 50%; }
.title { font-size: 15px; font-weight: 800; color: var(--ink); }
.now {
  margin-left: auto;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--red);
}
.sub { font-size: 11.5px; font-weight: 600; color: var(--muted); margin-top: 5px; line-height: 1.5; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 9px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  max-width: 100%;
}
.pill-green { color: var(--green); border: 1px solid var(--green-line); }
.pill-green:hover { color: var(--green); }
.pill-navy { color: var(--navy); border: 1px solid var(--navy-line); }
.pill-navy:hover { color: var(--navy); }

.action {
  width: 100%;
  margin-top: 10px;
  background: var(--paper-2);
  color: var(--ink);
  border: 1px solid var(--line-2);
  border-radius: 10px;
  padding: 8px 11px;
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;
}
.chev { margin-left: auto; color: var(--muted-3); }

/* ── 점선 카드 ── */
.card-dashed {
  flex: 1;
  min-width: 0;
  border: 1px dashed var(--dash);
  border-radius: var(--radius);
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dashed-note {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-2);
  white-space: nowrap;
}
.dashed-note:hover { color: var(--ink-3); }

/* ── 다크 카드 (게임 / 해산) ── */
.card-dark {
  flex: 1;
  min-width: 0;
  background: var(--ink);
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow-dark);
}
.card-dark.final { padding: 15px 14px; box-shadow: none; }
.dark-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 19px;
  line-height: 1.2;
  color: var(--paper);
}
.dark-title.accent { color: var(--amber); }
.dark-btn {
  margin-top: 9px;
  background: transparent;
  color: var(--paper);
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 20px;
  border: 1px solid rgba(246, 241, 230, .35);
}

/* ── 태블릿: 1열 유지하되 카드가 과도하게 늘어나지 않게 가독 폭 제한 ── */
@media (min-width: 640px) and (max-width: 899px) {
  .days, .day-toggle { max-width: 620px; }
}

/* ── 데스크톱: 히어로 확대 + Day 2열 ── */
@media (min-width: 900px) {
  .hero { padding-top: 20px; }
  .hero-poster { height: 260px; }
  .hero-copy { font-size: 24px; margin-top: 14px; }
  .hero-meta { font-size: 13px; }

  .day-toggle { display: none; }

  .days {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    align-items: start;
    padding-top: 24px;
  }
  .day-col { display: block; }

  .day-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 0 0 12px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--hairline);
  }
  .day-head-no {
    font-family: 'Black Han Sans', sans-serif;
    font-size: 16px;
    color: var(--ink);
    letter-spacing: .02em;
  }
  .day-head-date { font-size: 13px; font-weight: 700; color: var(--muted); }

  .time { width: 50px; }
  .time-start { font-size: 14px; }
  .title { font-size: 16px; }
}

@media (min-width: 1200px) {
  .days { gap: 32px; }
  .hero-poster { height: 300px; }
}
</style>
