<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()

function onQueryInput(e: Event) {
  store.setRoomQ((e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="room">
    <!-- 이름 검색 -->
    <div class="search">
      <input
        :value="store.roomQ"
        placeholder="이름 검색 (예: 김상우)"
        class="search-input"
        @input="onQueryInput"
      >
    </div>

    <!-- 숙소 정보 -->
    <div class="stay">
      <div class="stay-info">
        <div class="stay-label">숙소</div>
        <div class="stay-name">지온스테이</div>
      </div>
      <a href="https://naver.me/G5kDtM7h" target="_blank" rel="noopener" class="stay-map">지도 ›</a>
    </div>

    <div class="cards">
      <div v-for="(rm, i) in store.rooms" :key="i" class="card">
        <div class="card-head">
          <span class="dot" :style="{ background: rm.dot }" />
          <span class="title">{{ rm.title }}</span>
          <span class="count">{{ rm.count }}</span>
        </div>
        <div class="card-body">
          <div class="bed">{{ rm.bed }}</div>
          <div class="members">
            <span
              v-for="m in rm.members"
              :key="m.name"
              class="member"
              :style="{ background: m.bg, color: m.fg, borderColor: m.line }"
            >{{ m.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="note">* 여자 8명 방은 더블 침대 패드 5개 · 총 10인 기준입니다.</div>
  </div>
</template>

<style scoped>
.room { padding: 14px 0 0; }

.search {
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 10px 13px;
  margin-bottom: 12px;
}
.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--ink);
}

.stay { display: flex; gap: 9px; margin-bottom: 14px; }
.stay-info {
  flex: 1;
  background: var(--ink);
  border-radius: var(--radius-sm);
  padding: 11px 13px;
}
.stay-label { font-size: 9.5px; font-weight: 800; letter-spacing: .08em; color: var(--muted-2); }
.stay-name { font-size: 15px; font-weight: 800; color: var(--paper); margin-top: 2px; }
.stay-map {
  flex: none;
  display: flex;
  align-items: center;
  color: var(--green);
  border: 1px solid rgba(74, 124, 89, .35);
  border-radius: var(--radius-sm);
  padding: 0 16px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}
.stay-map:hover { color: var(--green); }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--card-gap);
  align-items: start;
}
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line-soft);
}
.dot { flex: none; width: 6px; height: 6px; border-radius: 50%; }
.title { font-size: 14px; font-weight: 800; }
.count { margin-left: auto; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.card-body { padding: 12px 14px; }
.bed { font-size: 11.5px; font-weight: 600; color: var(--muted); margin-bottom: 9px; }
.members { display: flex; flex-wrap: wrap; gap: 6px; }
.member {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 20px;
  border: 1px solid;
}

.note { font-size: 10.5px; font-weight: 600; color: var(--muted-2); margin-top: 10px; }

/* ── 데스크톱 ── */
@media (min-width: 900px) {
  .room { padding-top: 20px; }
  /* 검색 / 숙소 정보는 좌측에 붙여 폭 제한 */
  .search, .stay { max-width: 480px; }
  .stay { margin-bottom: 20px; }
  .title { font-size: 15px; }
}
</style>
