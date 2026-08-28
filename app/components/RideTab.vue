<script setup lang="ts">
import { useWorkshopStore } from '~/stores/workshop'

const store = useWorkshopStore()

const segs = [
  { key: 'go' as const, label: '출발' },
  { key: 'mid' as const, label: '중간' },
  { key: 'back' as const, label: '귀가' },
]
</script>

<template>
  <div class="ride">
    <!-- 내 차편 배너 -->
    <div v-if="store.myRide" class="my-ride">
      <div class="my-ride-label">내 차편</div>
      <div class="my-ride-line">{{ store.myRide.line }}</div>
      <div class="my-ride-sub">{{ store.myRide.sub }}</div>
    </div>

    <!-- 구간 세그먼트 (트랙 안에서 이동) -->
    <div class="segs">
      <button
        v-for="s in segs"
        :key="s.key"
        class="seg"
        :class="{ 'is-active': store.seg === s.key }"
        @click="store.setSeg(s.key)"
      >{{ s.label }}</button>
    </div>

    <div class="cards">
      <div v-for="(r, i) in store.rides" :key="i" class="card">
        <div class="card-head">
          <span class="dot" :style="{ background: r.dot }" />
          <span class="team">{{ r.team }}</span>
          <span class="car">{{ r.car }}</span>
        </div>
        <div class="card-body">
          <div class="driver-row">
            <span class="driver-badge">운전</span>
            <span class="driver-name">{{ r.driver }}</span>
          </div>
          <div class="riders">탑승 · {{ r.riders }}</div>
          <div class="place">{{ r.place }}</div>

          <div class="stops">
            <template v-for="(st, si) in r.stops" :key="si">
              <a v-if="st.has" :href="st.url" target="_blank" rel="noopener" class="stop-link">
                <span class="stop-no">{{ st.n }}</span>{{ st.name }} ›
              </a>
              <span v-else class="stop-none">
                <span class="stop-no-none">{{ st.n }}</span>{{ st.name }}
              </span>
            </template>
            <span v-if="r.noStops" class="stop-none">{{ r.noStopsLabel }}</span>
          </div>

          <div v-if="r.mine" class="mine">내가 탑승하는 차량</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ride { padding: 14px 0 0; }

.my-ride {
  background: var(--amber-bg);
  border: 1px solid var(--amber-line);
  border-radius: var(--radius);
  padding: 12px 14px;
  margin-bottom: 14px;
}
.my-ride-label { font-size: 10px; font-weight: 800; letter-spacing: .06em; color: var(--amber-fg); }
.my-ride-line { font-size: 15px; font-weight: 800; margin-top: 3px; }
.my-ride-sub { font-size: 11.5px; font-weight: 600; color: var(--muted); margin-top: 3px; }

/* 세그먼트 컨트롤 */
.segs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  background: var(--track);
  border-radius: 20px;
  padding: 3px;
}
.seg {
  flex: 1;
  padding: 8px 0;
  border-radius: 18px;
  border: none;
  font-size: 12.5px;
  font-weight: 800;
  background: transparent;
  color: var(--muted);
  transition: background .14s ease, color .14s ease;
}
.seg.is-active { background: var(--card); color: var(--ink); }

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
.team { font-size: 14px; font-weight: 800; }
.car { margin-left: auto; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.card-body { padding: 12px 14px; }

.driver-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.driver-badge {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--muted);
  border: 1px solid var(--line-2);
  padding: 2px 7px;
  border-radius: 20px;
}
.driver-name { font-size: 13.5px; font-weight: 800; }
.riders { font-size: 12px; font-weight: 600; color: var(--ink-3); line-height: 1.5; }
.place { font-size: 12px; font-weight: 700; color: var(--navy); margin-top: 5px; }

.stops { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.stop-link, .stop-none {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.stop-link { color: var(--green); border: 1px solid var(--green-line); }
.stop-link:hover { color: var(--green); }
.stop-none { color: var(--muted-2); border: 1px dashed var(--dash); }
.stop-no { font-size: 9.5px; color: var(--muted-2); }
.stop-no-none { font-size: 9.5px; }

.mine {
  margin-top: 9px;
  background: var(--amber-bg);
  border-radius: 9px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  color: var(--amber-fg);
}

/* ── 데스크톱 ── */
@media (min-width: 900px) {
  .ride { padding-top: 20px; }
  /* 내 차편 배너와 구간 선택은 전체 폭을 쓰지 않도록 제한 */
  .my-ride, .segs { max-width: 480px; }
  .segs { margin-bottom: 20px; }
  .team { font-size: 15px; }
}
</style>
