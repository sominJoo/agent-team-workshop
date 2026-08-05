<script setup lang="ts">
import { NAVY, SKY, PLUM } from '~/data/workshop'

interface Member {
  role: string
  name: string
  initial: string
  color: string
  /** 아바타 배경 (액센트의 저채도 틴트) */
  tint: string
}

const members: Member[] = [
  { role: '전무', name: '김예지', initial: '김', color: NAVY, tint: 'rgba(42,74,139,.10)' },
  { role: '상무', name: '주소민', initial: '주', color: SKY, tint: 'rgba(74,143,176,.12)' },
  { role: '고문', name: '오민영', initial: '오', color: PLUM, tint: 'rgba(158,67,104,.12)' },
]
</script>

<template>
  <div class="org">
    <!-- 조직도는 중앙 정렬 구조라 데스크톱에서도 폭을 제한한다 -->
    <div class="org-inner">
      <div class="eyebrow org-eyebrow">2026 하계 워크샵 · 워크샵 위원회</div>

      <!-- 위원장 -->
      <div class="chief">
        <span class="chief-avatar">정</span>
        <div class="chief-info">
          <div class="chief-role">위원장</div>
          <div class="chief-name">정설화</div>
        </div>
        <div class="chief-actions">
          <a href="tel:01000000000" class="chief-call">전화</a>
          <a href="sms:01000000000" class="chief-sms">문자</a>
        </div>
      </div>

      <!-- 나머지 위원 -->
      <div class="member-list">
        <div v-for="m in members" :key="m.name" class="member">
          <span class="member-avatar" :style="{ background: m.tint, color: m.color }">{{ m.initial }}</span>
          <div class="member-info">
            <div class="member-role" :style="{ color: m.color }">{{ m.role }}</div>
            <div class="member-name">{{ m.name }}</div>
          </div>
          <a href="tel:01000000000" class="btn-call">전화</a>
          <a href="sms:01000000000" class="btn-sms">문자</a>
        </div>
      </div>

      <div class="duty">
        <div class="duty-label">위원회 담당 업무</div>
        <div class="duty-body">일정 기획 · 조 편성 · 차량 배치 · 숙소 방배정 · 게임 진행</div>
      </div>

      <div class="note">* 연락처는 자리표시(010-0000-0000)입니다.</div>
    </div>
  </div>
</template>

<style scoped>
.org { padding: 18px 0 0; }
/* 가로형 행 카드가 늘어지지 않는 폭으로 제한 */
.org-inner { width: 100%; max-width: 620px; margin: 0 auto; }
.org-eyebrow { margin-bottom: 10px; }

/* ── 위원장 (다크 카드) ── */
.chief {
  background: var(--ink);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: var(--card-gap);
}
.chief-avatar {
  width: 50px;
  height: 50px;
  flex: none;
  border-radius: 50%;
  background: var(--amber);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 21px;
}
.chief-info { flex: 1; min-width: 0; }
.chief-role { font-size: 10px; font-weight: 800; letter-spacing: .08em; color: var(--muted-2); }
.chief-name {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 23px;
  line-height: 1.2;
  color: var(--paper);
  margin-top: 2px;
}
.chief-actions { display: flex; flex-direction: column; gap: 6px; }
.chief-call, .chief-sms {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 13px;
  border-radius: 20px;
  text-align: center;
  white-space: nowrap;
}
.chief-call { background: var(--amber); color: var(--ink); }
.chief-call:hover { color: var(--ink); }
.chief-sms { color: var(--paper); border: 1px solid rgba(246, 241, 230, .3); }
.chief-sms:hover { color: var(--paper); }

/* ── 위원 카드 ── */
.member-list { display: flex; flex-direction: column; gap: var(--card-gap); }
.member {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-card);
}
.member-avatar {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
}
.member-info { flex: 1; min-width: 0; }
.member-role { font-size: 10px; font-weight: 800; letter-spacing: .06em; }
.member-name { font-size: 17px; font-weight: 800; margin-top: 1px; }

.btn-call, .btn-sms {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  white-space: nowrap;
}
.btn-call { color: var(--green); border: 1px solid var(--green-line); }
.btn-call:hover { color: var(--green); }
.btn-sms { color: var(--muted); border: 1px solid var(--line-2); }
.btn-sms:hover { color: var(--ink-3); }

.duty {
  margin-top: 14px;
  border: 1px dashed var(--dash);
  border-radius: var(--radius);
  padding: 13px 14px;
}
.duty-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .06em;
  color: var(--muted);
  margin-bottom: 6px;
}
.duty-body { font-size: 12.5px; font-weight: 600; color: var(--ink-2); line-height: 1.7; }

.note { font-size: 10.5px; font-weight: 600; color: var(--muted-2); margin-top: 10px; }

/* ── 데스크톱 ── */
@media (min-width: 900px) {
  .org { padding-top: 24px; }
  .chief { padding: 20px; margin-bottom: 18px; }
  .chief-name { font-size: 27px; }
  /* 위원 카드는 1열 유지 — 가로형 행 레이아웃이라 다열로 쪼개면 버튼이 줄바꿈된다 */
  .duty { margin-top: 18px; }
}
</style>
