<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()
</script>

<template>
  <div class="room">
    <!-- 검색 -->
    <div class="search">
      <span class="search-icon">🔎</span>
      <input
        :value="store.roomQ"
        placeholder="이름 검색 (예: 김상우)"
        class="search-input"
        @input="store.setRoomQ(($event.target as HTMLInputElement).value)"
      >
    </div>

    <!-- 숙소 정보 -->
    <div class="stay">
      <div class="stay-info">
        <div class="stay-label">숙소</div>
        <div class="stay-name">지온스테이</div>
      </div>
      <a href="https://naver.me/G5kDtM7h" target="_blank" class="stay-map">📍 지도</a>
    </div>

    <div class="cards">
      <div v-for="(rm, i) in store.rooms" :key="i" class="card" :style="{ boxShadow: `3px 3px 0 ${rm.shadow}` }">
        <div class="card-head" :style="{ background: rm.head }">
          <span class="title">{{ rm.title }}</span>
          <span class="count">{{ rm.count }}</span>
        </div>
        <div class="card-body">
          <div class="bed">{{ rm.bed }}</div>
          <div class="members">
            <span v-for="m in rm.members" :key="m.name" class="member" :style="{ background: m.bg, color: m.fg }">{{ m.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="note">* 여자 8명 방은 더블 침대 패드 5개 · 총 10인 기준입니다.</div>
    <div class="tab-bottom-space" />
  </div>
</template>

<style scoped>
.room { padding: 6px 14px 0; }

.search {
  display: flex; align-items: center; gap: 8px; background: #fff; border: 3px solid #1A1A1A;
  border-radius: 9px; padding: 8px 11px; margin-bottom: 12px; box-shadow: 3px 3px 0 #1A1A1A;
}
.search-icon { font-size: 14px; }
.search-input { flex: 1; border: none; outline: none; font-size: 13px; font-weight: 700; background: transparent; }

.stay { display: flex; gap: 8px; margin-bottom: 12px; }
.stay-info { flex: 1; background: #1B3A8C; color: #fff; border: 3px solid #1A1A1A; border-radius: 9px; padding: 9px 11px; }
.stay-label { font-size: 9.5px; font-weight: 900; opacity: .75; }
.stay-name { font-family: 'Jua', sans-serif; font-size: 15px; }
.stay-map {
  flex: none; display: flex; align-items: center; background: #2E9B4F; color: #fff;
  border: 3px solid #1A1A1A; border-radius: 9px; padding: 0 13px; font-size: 12px; font-weight: 900; white-space: nowrap;
}

.cards { display: flex; flex-direction: column; gap: 10px; }
.card { border: 3px solid #1A1A1A; border-radius: 10px; background: #fff; overflow: hidden; }
.card-head {
  display: flex; align-items: center; gap: 8px; padding: 9px 11px; color: #fff;
  border-bottom: 3px solid #1A1A1A;
}
.title { font-family: 'Jua', sans-serif; font-size: 16px; }
.count { margin-left: auto; font-size: 10.5px; font-weight: 900; background: rgba(0,0,0,.2); padding: 3px 8px; border-radius: 20px; }
.card-body { padding: 10px 11px; }
.bed { font-size: 11.5px; font-weight: 700; color: #888; margin-bottom: 7px; }
.members { display: flex; flex-wrap: wrap; gap: 6px; }
.member { font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 20px; border: 2px solid #1A1A1A; }

.note { font-size: 11px; font-weight: 700; color: #999; margin-top: 10px; }
.tab-bottom-space { height: 96px; }
</style>
