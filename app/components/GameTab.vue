<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'
import { computed } from 'vue'

const store = useWorkshopStore()

const teams = [
  { name: 'A팀', count: '3명', color: '#E8402A' },
  { name: 'B팀', count: '4명', color: '#2FA9E0' },
  { name: 'C팀', count: '4명', color: '#2E9B4F' },
]
const ranks = [
  { rank: '1', team: 'A팀', color: '#E8402A' },
  { rank: '2', team: 'B팀', color: '#2FA9E0' },
  { rank: '3', team: 'C팀', color: '#2E9B4F' },
]

function onCodeKey(e: KeyboardEvent) {
  if (e.key === 'Enter') store.checkCode()
}
const teamGames = computed(() =>
  store.games.filter(game => game.type === 'team'),
)

const soloGames = computed(() =>
  store.games.filter(game => game.type === 'solo'),
)
</script>

<template>
  <div class="game">
    <!-- 잠금 상태 -->
    <div v-if="!store.unlocked" class="lock-wrap">
      <div class="lock-card">
        <div class="lock-emoji">🔒</div>
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
              @input="store.onCode(($event.target as HTMLInputElement).value)"
              @keydown="onCodeKey"
            >
            <button class="code-submit" @click="store.checkCode()">확인</button>
          </div>
          <div v-if="store.codeErr" class="code-err">코드가 올바르지 않습니다</div>
        </div>
      </div>
      <div class="tab-bottom-space" />
    </div>

    <!-- 공개 상태 -->
    <div v-else>
      <!-- 팀 게임 -->
      <div class="game-hero">
        <div class="game-hero-title">팀대항 게임</div>
        <div class="game-hero-sub">09.03(목) 20:00 ~ 21:00 · 참여 11명 · 3팀 · 진행: 위원회</div>
      </div>

      <div class="section-head">
        <span class="section-title">게임 종목</span>
        <span class="section-hint">카드를 누르면 진행 방법</span>
      </div>
      <div class="game-list">
        <button v-for="g in teamGames" :key="g.no" class="game-item" :style="{ boxShadow: `3px 3px 0 ${g.color}` }" @click="store.openGame(g.index)">
          <span class="game-no" :style="{ color: g.color }">{{ g.no }}</span>
          <span class="game-item-body">
            <span class="game-item-title">{{ g.title }}</span>
            <span class="game-item-summary">{{ g.summary }}</span>
          </span>
          <span class="game-tag" :style="{ background: g.tagBg, color: g.tagFg }">{{ g.tag }}</span>
          <span class="game-arrow">›</span>
        </button>
      </div>
      <!-- 개인 게임 -->
      <div class="game-hero">
        <div class="game-hero-title">개인전 게임</div>
      </div>

      <div class="section-head">
        <span class="section-title">게임 종목</span>
        <span class="section-hint">카드를 누르면 진행 방법</span>
      </div>
      <div class="game-list">
        <button v-for="g in soloGames" :key="g.no" class="game-item" :style="{ boxShadow: `3px 3px 0 ${g.color}` }" @click="store.openGame(g.index)">
          <span class="game-no" :style="{ color: g.color }">{{ g.no }}</span>
          <span class="game-item-body">
            <span class="game-item-title">{{ g.title }}</span>
            <span class="game-item-summary">{{ g.summary }}</span>
          </span>
          <span class="game-tag" :style="{ background: g.tagBg, color: g.tagFg }">{{ g.tag }}</span>
          <span class="game-arrow">›</span>
        </button>
      </div>

      <div class="section-head">
        <span class="section-title">팀 구성</span>
        <span class="section-hint">참여 11명 · 3팀 (3 / 4 / 4)</span>
      </div>
      <div class="teams">
        <div v-for="t in teams" :key="t.name" class="team" :style="{ background: t.color }">
          <div class="team-name">{{ t.name }}</div>
          <div class="team-count">{{ t.count }}</div>
        </div>
      </div>

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
      <div class="note">* 3팀 리그로 진행하며 대진표는 따로 없습니다. TMI 게임은 개인전이라 팀 점수에서 제외.</div>

      <div class="prize">
        <span class="prize-emoji">🎁</span>
        <div>
          <div class="prize-label">부상</div>
          <div class="prize-body">1인당 네이버포인트 교환권 3만원</div>
        </div>
      </div>

      <div class="tab-bottom-space" />
    </div>
  </div>
</template>

<style scoped>
.game { padding: 6px 14px 0; }

/* 잠금 */
.lock-wrap { }
.lock-card {
  margin-top: 70px; background: #1A1A1A; border-radius: 14px; padding: 26px 20px;
  box-shadow: 4px 4px 0 #E8402A; text-align: center;
}
.lock-emoji { font-size: 38px; }
.lock-title {
  font-family: 'Black Han Sans', sans-serif; font-size: 23px; color: #F7D117;
  text-shadow: 2px 2px 0 #E8402A; margin-top: 10px; line-height: 1.25;
}
.lock-desc { font-size: 12.5px; font-weight: 700; color: #bbb; margin-top: 10px; line-height: 1.6; }
.countdown { margin-top: 18px; background: #F7D117; border-radius: 10px; padding: 12px; }
.countdown-label { font-size: 9.5px; font-weight: 900; color: #1A1A1A; opacity: .6; }
.countdown-val { font-family: 'Black Han Sans', sans-serif; font-size: 28px; line-height: 1.15; color: #1A1A1A; }
.preview-btn { margin-top: 16px; background: none; border: none; font-size: 11px; font-weight: 800; color: #777; text-decoration: underline; }

.code-box { margin-top: 16px; background: #fff; border: 3px solid #1A1A1A; border-radius: 10px; padding: 11px; text-align: left; }
.code-label { font-size: 10px; font-weight: 900; color: #888; margin-bottom: 7px; }
.code-row { display: flex; gap: 7px; }
.code-input {
  flex: 1; min-width: 0; border: 2px solid #1A1A1A; border-radius: 7px;
  padding: 7px 9px; font-size: 13px; font-weight: 700; outline: none;
}
.code-submit {
  flex: none; background: #1A1A1A; color: #F7D117; border: 2px solid #1A1A1A;
  border-radius: 7px; padding: 7px 12px; font-size: 12px; font-weight: 900;
}
.code-err { margin-top: 7px; font-size: 11px; font-weight: 800; color: #E8402A; }

/* 공개 */
.game-hero { background: #1A1A1A; border-radius: 12px; padding: 14px; box-shadow: 3px 3px 0 #E8402A; margin-bottom: 12px; }
.game-hero-title { font-family: 'Black Han Sans', sans-serif; font-size: 26px; color: #F7D117; text-shadow: 2px 2px 0 #E8402A; line-height: 1.1; }
.game-hero-sub { font-size: 11.5px; font-weight: 700; color: #bbb; margin-top: 5px; }

.section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; }
.section-title { font-family: 'Jua', sans-serif; font-size: 15px; }
.section-title.standalone { display: block; margin-bottom: 8px; }
.section-hint { font-size: 10.5px; font-weight: 800; color: #888; }

.game-list { display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px; }
.game-item {
  width: 100%; text-align: left; background: #fff; border: 3px solid #1A1A1A;
  border-radius: 10px; padding: 11px 12px; display: flex; align-items: center; gap: 11px;
}
.game-no { font-family: 'Black Han Sans', sans-serif; font-size: 20px; }
.game-item-body { flex: 1; }
.game-item-title { display: block; font-family: 'Jua', sans-serif; font-size: 16px; color: #1A1A1A; }
.game-item-summary { display: block; font-size: 10.5px; font-weight: 700; color: #888; margin-top: 2px; }
.game-tag { flex: none; font-size: 10px; font-weight: 900; padding: 4px 8px; border-radius: 20px; }
.game-arrow { flex: none; font-size: 14px; font-weight: 900; color: #1A1A1A; }

.teams { display: flex; gap: 8px; margin-bottom: 16px; }
.team { flex: 1; color: #fff; border: 3px solid #1A1A1A; border-radius: 9px; padding: 10px 9px; text-align: center; box-shadow: 3px 3px 0 #1A1A1A; }
.team-name { font-size: 9.5px; font-weight: 900; opacity: .85; }
.team-count { font-family: 'Black Han Sans', sans-serif; font-size: 22px; line-height: 1.2; }

.rank-table { background: #fff; border: 3px solid #1A1A1A; border-radius: 10px; overflow: hidden; box-shadow: 3px 3px 0 #F7D117; }
.rank-head, .rank-row { display: grid; grid-template-columns: 44px 1fr 60px 60px; align-items: center; }
.rank-head { background: #1A1A1A; color: #fff; font-size: 10.5px; font-weight: 900; padding: 7px 10px; }
.rank-row { padding: 9px 10px; border-bottom: 2px solid #EDE7D8; }
.rank-row:last-child { border-bottom: none; }
.rank-no { font-family: 'Black Han Sans', sans-serif; font-size: 16px; }
.rank-team { font-size: 13px; font-weight: 800; }
.rank-val { font-size: 12.5px; font-weight: 700; }
.center { text-align: center; }

.note { font-size: 11px; font-weight: 700; color: #999; margin-top: 8px; }
.prize {
  margin-top: 16px; background: #F7D117; border: 3px solid #1A1A1A; border-radius: 10px;
  padding: 12px; box-shadow: 3px 3px 0 #1A1A1A; display: flex; align-items: center; gap: 12px;
}
.prize-emoji { font-size: 26px; }
.prize-label { font-size: 10px; font-weight: 900; opacity: .65; }
.prize-body { font-family: 'Jua', sans-serif; font-size: 17px; line-height: 1.3; }

.tab-bottom-space { height: 96px; }
</style>
