<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'
import { RED, SKY, GREEN } from '~/data/workshop'

const store = useWorkshopStore()

const teams = [
  { name: 'A팀', count: '3명', color: RED },
  { name: 'B팀', count: '4명', color: SKY },
  { name: 'C팀', count: '4명', color: GREEN },
]
const ranks = [
  { rank: '1', team: 'A팀', color: RED },
  { rank: '2', team: 'B팀', color: SKY },
  { rank: '3', team: 'C팀', color: GREEN },
]

function onCodeKey(e: KeyboardEvent) {
  if (e.key === 'Enter') store.checkCode()
}
function onCodeInput(e: Event) {
  store.onCode((e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="game">
    <!-- 잠금 상태 -->
    <div v-if="!store.unlocked" class="lock-wrap">
      <div class="lock-card">
        <div class="lock-eyebrow">LOCKED</div>
        <div class="lock-title">게임 정보는<br>아직 비공개</div>
        <div class="lock-desc">09.03(목) 18:00에 열립니다</div>

        <div class="countdown">
          <div class="countdown-label">공개까지</div>
          <div class="countdown-val">{{ store.countdown }}</div>
        </div>

        <button v-if="!store.askCode" class="preview-btn" @click="store.showCode()">위원회 미리보기</button>

        <div v-else class="code-box">
          <div class="code-label">위원회 코드 입력</div>
          <div class="code-row">
            <input
              :value="store.codeInput"
              placeholder="코드를 입력하세요"
              class="code-input"
              @input="onCodeInput"
              @keydown="onCodeKey"
            >
            <button class="code-submit" @click="store.checkCode()">확인</button>
          </div>
          <div v-if="store.codeErr" class="code-err">코드가 올바르지 않습니다</div>
        </div>
      </div>
    </div>

    <!-- 공개 상태 -->
    <div v-else>
      <div class="hero">
        <div class="hero-title">팀대항 게임</div>
        <div class="hero-sub">09.03(목) 20:00 ~ 21:00 · 지온스테이<br>참여 11명 · 3팀 · 진행: 위원회</div>
      </div>

      <div class="section-head">
        <span class="section-title">게임 종목</span>
        <span class="section-hint">카드를 누르면 진행 방법</span>
      </div>
      <div class="game-list">
        <button v-for="g in store.games" :key="g.no" class="game-item" @click="store.openGame(g.index)">
          <span class="game-no" :style="{ color: g.color }">{{ g.no }}</span>
          <span class="game-body">
            <span class="game-title">{{ g.title }}</span>
            <span class="game-summary">{{ g.summary }}</span>
          </span>
          <span class="tag" :style="{ color: g.tagFg, borderColor: g.tagLine }">{{ g.tag }}</span>
          <span class="chev">›</span>
        </button>
      </div>

      <!-- 팀 구성 / 순위표 — 데스크톱에서는 좌우 2열 -->
      <div class="summary">
        <div class="summary-col">
          <div class="section-head">
            <span class="section-title">팀 구성</span>
            <span class="section-hint">참여 11명 · 3팀 (3 / 4 / 4)</span>
          </div>
          <div class="teams">
            <div v-for="t in teams" :key="t.name" class="team">
              <div class="team-name" :style="{ color: t.color }">{{ t.name }}</div>
              <div class="team-count">{{ t.count }}</div>
            </div>
          </div>

          <div class="prize">
            <div class="prize-label">부상</div>
            <div class="prize-body">1인당 네이버포인트 교환권 3만원</div>
          </div>
        </div>

        <div class="summary-col">
          <div class="section-title standalone">순위표</div>
          <div class="rank-table">
            <div class="rank-head">
              <div>순위</div><div>팀</div><div class="center">승</div><div class="center">점수</div>
            </div>
            <div v-for="r in ranks" :key="r.rank" class="rank-row">
              <div class="rank-no" :style="{ color: r.color }">{{ r.rank }}</div>
              <div class="rank-team">{{ r.team }}</div>
              <div class="center rank-val">—</div>
              <div class="center rank-val">—</div>
            </div>
          </div>
          <div class="note">* 3팀 리그로 진행하며 대진표는 따로 없습니다. 개인전 종목은 팀 점수에서 제외.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game { padding: 18px 0 0; }

/* ── 잠금 ── */
.lock-wrap { display: flex; justify-content: center; }
.lock-card {
  width: 100%;
  max-width: 420px;
  margin-top: 60px;
  background: var(--ink);
  border-radius: 18px;
  padding: 28px 22px;
  text-align: center;
}
.lock-eyebrow { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; color: var(--muted-2); }
.lock-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 22px;
  color: var(--paper);
  margin-top: 10px;
  line-height: 1.35;
}
.lock-desc { font-size: 12px; font-weight: 600; color: var(--muted-2); margin-top: 8px; }

.countdown {
  margin-top: 20px;
  border-top: 1px solid rgba(246, 241, 230, .14);
  padding-top: 16px;
}
.countdown-label { font-size: 9.5px; font-weight: 800; letter-spacing: .1em; color: var(--muted-2); }
.countdown-val {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 27px;
  line-height: 1.2;
  color: var(--amber);
  margin-top: 4px;
}
.preview-btn {
  margin-top: 18px;
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-decoration: underline;
}

.code-box { margin-top: 18px; background: var(--paper); border-radius: var(--radius-sm); padding: 12px; }
.code-label {
  font-size: 10px; font-weight: 800; letter-spacing: .06em;
  color: var(--muted); margin-bottom: 8px; text-align: left;
}
.code-row { display: flex; gap: 8px; }
.code-input {
  flex: 1; min-width: 0;
  border: 1px solid rgba(32, 36, 44, .16);
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  background: var(--card);
}
.code-submit {
  flex: none;
  background: var(--ink);
  color: var(--paper);
  border: none;
  border-radius: 9px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 800;
}
.code-err { margin-top: 8px; font-size: 11px; font-weight: 700; color: var(--red); text-align: left; }

/* ── 공개 ── */
.hero { margin-bottom: 16px; }
.hero-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 25px;
  color: var(--red);
  line-height: 1.15;
}
.hero-sub { font-size: 11.5px; font-weight: 600; color: var(--muted); margin-top: 5px; line-height: 1.5; }

.section-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
.section-title { font-size: 13px; font-weight: 800; color: var(--ink); }
.section-title.standalone { display: block; margin-bottom: 10px; }
.section-hint { font-size: 10.5px; font-weight: 600; color: var(--muted-2); }

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--card-gap);
  margin-bottom: 22px;
}
.game-item {
  width: 100%;
  text-align: left;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-card);
  transition: border-color .14s ease;
}
.game-item:hover { border-color: var(--line-2); }
.game-no { flex: none; font-family: 'Black Han Sans', sans-serif; font-size: 17px; }
.game-body { flex: 1; min-width: 0; }
.game-title { display: block; font-size: 15px; font-weight: 800; color: var(--ink); }
.game-summary { display: block; font-size: 10.5px; font-weight: 600; color: var(--muted); margin-top: 2px; }
.tag {
  flex: none;
  font-size: 10px;
  font-weight: 800;
  border: 1px solid;
  padding: 4px 9px;
  border-radius: 20px;
  white-space: nowrap;
}
.chev { flex: none; font-size: 14px; color: var(--muted-3); }

.teams { display: flex; gap: 9px; margin-bottom: 22px; }
.team {
  flex: 1;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 12px 10px;
  text-align: center;
}
.team-name { font-size: 10px; font-weight: 800; letter-spacing: .06em; }
.team-count { font-family: 'Black Han Sans', sans-serif; font-size: 20px; line-height: 1.3; }

.rank-table {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}
.rank-head, .rank-row { display: grid; grid-template-columns: 44px 1fr 56px 56px; align-items: center; }
.rank-head {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--muted);
  padding: 9px 12px;
  border-bottom: 1px solid rgba(32, 36, 44, .08);
}
.rank-row { padding: 11px 12px; border-bottom: 1px solid rgba(32, 36, 44, .06); }
.rank-row:last-child { border-bottom: none; }
.rank-no { font-family: 'Black Han Sans', sans-serif; font-size: 15px; }
.rank-team { font-size: 13px; font-weight: 700; }
.rank-val { font-size: 12.5px; color: var(--muted-2); }
.center { text-align: center; }

.note { font-size: 10.5px; font-weight: 600; color: var(--muted-2); margin-top: 9px; line-height: 1.6; }

/* 1열로 쌓일 때(<900px) 팀 구성 블록과 순위표 블록이 붙지 않도록 행 간격을 준다 */
.summary { display: grid; gap: 22px; align-items: start; }

.prize {
  margin-top: 16px;
  background: var(--amber-bg);
  border: 1px solid var(--amber-line);
  border-radius: var(--radius);
  padding: 14px;
}
.prize-label { font-size: 10px; font-weight: 800; letter-spacing: .06em; color: var(--amber-fg); }
.prize-body { font-size: 15px; font-weight: 800; line-height: 1.4; margin-top: 3px; }

/* ── 데스크톱 ── */
@media (min-width: 900px) {
  .game { padding-top: 24px; }
  .hero { margin-bottom: 24px; }
  .hero-title { font-size: 34px; }
  .hero-sub { font-size: 13px; }
  .section-title { font-size: 15px; }

  /* 종목 4개가 2×2로 떨어지도록 2열 고정 (auto-fill이면 3+1로 갈라진다) */
  .game-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }
}
</style>
