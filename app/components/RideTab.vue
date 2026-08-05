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

    <!-- 구간 세그먼트 -->
    <div class="segs">
      <button
        v-for="s in segs"
        :key="s.key"
        class="seg"
        :style="{ background: store.seg === s.key ? '#1A1A1A' : '#fff', color: store.seg === s.key ? '#F7D117' : '#1A1A1A' }"
        @click="store.setSeg(s.key)"
      >{{ s.label }}</button>
    </div>

    <div class="cards">
      <div v-for="(r, i) in store.rides" :key="i" class="card" :style="{ boxShadow: `3px 3px 0 ${r.shadow}` }">
        <div class="card-head" :style="{ background: r.head, color: r.headFg }">
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
              <a v-if="st.has" :href="st.url" target="_blank" class="stop-link">
                <span class="stop-no">{{ st.n }}</span>📍 {{ st.name }}
              </a>
              <span v-else class="stop-none">
                <span class="stop-no-none">{{ st.n }}</span>{{ st.name }}
              </span>
            </template>
            <span v-if="r.noStops" class="stop-undecided">📍 집결 장소 미정</span>
          </div>

          <div v-if="r.mine" class="mine-badge">⭐ 내가 탑승하는 차량</div>
        </div>
      </div>
    </div>

    <div class="tab-bottom-space" />
  </div>
</template>

<style scoped>
.ride { padding: 6px 14px 0; }

.my-ride {
  background: #F7D117; border: 3px solid #1A1A1A; border-radius: 10px;
  padding: 11px 13px; box-shadow: 3px 3px 0 #1A1A1A; margin-bottom: 12px;
}
.my-ride-label { font-size: 9.5px; font-weight: 900; color: #1A1A1A; opacity: .7; }
.my-ride-line { font-family: 'Jua', sans-serif; font-size: 17px; margin-top: 2px; }
.my-ride-sub { font-size: 11.5px; font-weight: 700; color: #444; margin-top: 3px; }

.segs { display: flex; gap: 7px; margin-bottom: 12px; }
.seg {
  flex: 1; padding: 8px 0; border-radius: 20px; border: 3px solid #1A1A1A;
  font-size: 12.5px; font-weight: 900;
}

.cards { display: flex; flex-direction: column; gap: 10px; }
.card { border: 3px solid #1A1A1A; border-radius: 10px; background: #fff; overflow: hidden; }
.card-head {
  display: flex; align-items: center; gap: 8px; padding: 8px 11px;
  border-bottom: 3px solid #1A1A1A;
}
.team { font-family: 'Jua', sans-serif; font-size: 15px; }
.car { margin-left: auto; font-size: 10.5px; font-weight: 900; background: rgba(0,0,0,.18); padding: 3px 8px; border-radius: 20px; }
.card-body { padding: 10px 11px; }

.driver-row { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
.driver-badge {
  width: 26px; height: 26px; border-radius: 50%; background: #1A1A1A; color: #F7D117;
  display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;
}
.driver-name { font-size: 13.5px; font-weight: 800; }
.riders { font-size: 12px; font-weight: 600; color: #555; line-height: 1.5; }
.place { font-size: 12px; font-weight: 700; color: #1B3A8C; margin-top: 5px; }

.stops { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.stop-link, .stop-none, .stop-undecided {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 800;
  padding: 5px 9px; border-radius: 20px; white-space: nowrap;
}
.stop-link { background: #2E9B4F; color: #fff; border: 2px solid #1A1A1A; }
.stop-none { background: #fff; color: #777; border: 2px dashed #1A1A1A; }
.stop-undecided { background: #fff; color: #888; border: 2px dashed #1A1A1A; }
.stop-no {
  background: #fff; color: #2E9B4F; width: 14px; height: 14px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900;
}
.stop-no-none {
  background: #EDE7D8; width: 14px; height: 14px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900;
}
.mine-badge {
  margin-top: 8px; background: #F7D117; border: 2px solid #1A1A1A; border-radius: 7px;
  padding: 5px 9px; font-size: 11px; font-weight: 900;
}

.tab-bottom-space { height: 96px; }
</style>
