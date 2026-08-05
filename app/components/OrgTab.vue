<script setup lang="ts">
interface Member {
  role: string
  name: string
  initial: string
  color: string
}

const members: Member[] = [
  { role: '전무', name: '김예지', initial: '김', color: '#1B3A8C' },
  { role: '상무', name: '주소민', initial: '주', color: '#2FA9E0' },
  { role: '고문', name: '오민영', initial: '오', color: '#C4267E' },
]
</script>

<template>
  <div class="org">
    <div class="banner-wrap">
      <div class="banner">
        <div class="banner-top">2026 하계 워크샵</div>
        <div class="banner-title">워크샵 위원회</div>
      </div>
      <div class="banner-stem" />
    </div>

    <!-- 위원장 -->
    <div class="chief">
      <span class="chief-avatar">정</span>
      <div class="chief-info">
        <div class="chief-role">위원장</div>
        <div class="chief-name">정설화</div>
      </div>
      <div class="chief-actions">
        <a href="tel:01000000000" class="btn-call chief-call">전화</a>
        <a href="sms:01000000000" class="btn-sms chief-sms">문자</a>
      </div>
    </div>

    <!-- 나머지 위원 -->
    <div class="member-list">
      <div v-for="m in members" :key="m.name" class="member" :style="{ boxShadow: `3px 3px 0 ${m.color}` }">
        <span class="member-avatar" :style="{ background: m.color }">{{ m.initial }}</span>
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
    <div class="tab-bottom-space" />
  </div>
</template>

<style scoped>
.org { padding: 6px 14px 0; }

.banner-wrap { display: flex; flex-direction: column; align-items: center; margin-bottom: 12px; }
.banner {
  background: #1A1A1A; color: #F7D117; border-radius: 9px; padding: 9px 18px;
  text-align: center; box-shadow: 3px 3px 0 #E8402A;
}
.banner-top { font-size: 9.5px; font-weight: 900; opacity: .75; }
.banner-title { font-family: 'Black Han Sans', sans-serif; font-size: 20px; line-height: 1.2; }
.banner-stem { width: 3px; height: 14px; background: #1A1A1A; }

.chief {
  border: 3px solid #1A1A1A; border-radius: 10px; background: #F7D117; padding: 12px;
  box-shadow: 3px 3px 0 #1A1A1A; margin-bottom: 10px; display: flex; align-items: center; gap: 12px;
}
.chief-avatar {
  width: 52px; height: 52px; border-radius: 50%; background: #1A1A1A; color: #F7D117;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Black Han Sans', sans-serif; font-size: 22px;
}
.chief-info { flex: 1; }
.chief-role { font-size: 10px; font-weight: 900; color: #1A1A1A; opacity: .65; }
.chief-name { font-family: 'Black Han Sans', sans-serif; font-size: 24px; line-height: 1.1; }
.chief-actions { display: flex; flex-direction: column; gap: 5px; }

.member-list { display: flex; flex-direction: column; gap: 10px; }
.member {
  border: 3px solid #1A1A1A; border-radius: 10px; background: #fff; padding: 11px 12px;
  display: flex; align-items: center; gap: 11px;
}
.member-avatar {
  width: 42px; height: 42px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Jua', sans-serif; font-size: 17px;
}
.member-info { flex: 1; }
.member-role { font-size: 10px; font-weight: 900; }
.member-name { font-family: 'Jua', sans-serif; font-size: 19px; }

.btn-call {
  background: #2E9B4F; color: #fff; font-size: 11px; font-weight: 900;
  padding: 6px 10px; border-radius: 20px; border: 2px solid #1A1A1A; text-align: center;
}
.btn-sms {
  background: #EDE7D8; color: #1A1A1A; font-size: 11px; font-weight: 900;
  padding: 6px 10px; border-radius: 20px; border: 2px solid #1A1A1A; text-align: center;
}
.chief-call, .chief-sms { padding: 6px 11px; }
.chief-sms { background: #fff; }

.duty {
  margin-top: 12px; background: #fff; border: 3px dashed #1A1A1A; border-radius: 10px; padding: 11px 12px;
}
.duty-label { font-size: 11px; font-weight: 900; color: #888; margin-bottom: 6px; }
.duty-body { font-size: 12.5px; font-weight: 700; color: #333; line-height: 1.7; }

.note { font-size: 11px; font-weight: 700; color: #999; margin-top: 8px; }
.tab-bottom-space { height: 96px; }
</style>
