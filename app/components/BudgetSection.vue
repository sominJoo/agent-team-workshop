<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBudgetStore } from '~/stores/budget'

const store = useBudgetStore()

const FILTERS = [
  { key: 'all',    label: '전체' },
  { key: 'unpaid', label: '미결제' },
  { key: 'paid',   label: '결제완료' },
] as const

onMounted(() => {
  store.load().then(() => store.subscribe())
})

const won = (n: number) => (n < 0 ? '-₩' : '₩') + Math.abs(n).toLocaleString('ko-KR')
/** 부호를 살려서 표기 — 절감은 -, 초과는 + */
const signed = (n: number) => (n > 0 ? '+' : n < 0 ? '-' : '') + '₩' + Math.abs(n).toLocaleString('ko-KR')

/**
 * 입력값에서 숫자만 남긴다. 콤마·공백을 넣어도 받아들인다.
 * 빈 값과 0은 모두 null로 본다 — 0원 결제란 없으므로 '아직 결제 전'을 뜻한다.
 */
function toAmount(v: string): number | null {
  const digits = v.replace(/[^0-9]/g, '')
  if (digits === '') return null
  const n = Number(digits)
  return n === 0 ? null : n
}

// ── 실제 사용액 인라인 입력 ──
//
// 모바일에서는 입력 후 다른 곳을 누르지 않고 그대로 벗어나는 일이 잦다.
// blur뿐 아니라 키보드 '완료'(Enter)에서도 저장되게 하고, 저장 결과를
// 눈으로 확인할 수 있도록 상태를 표시한다.
type SaveState = 'saving' | 'saved' | 'error'
const saveState = ref<Record<string, SaveState | undefined>>({})

async function saveActual(id: string, raw: string, current: number | null, el: HTMLInputElement) {
  const value = toAmount(raw)

  // 저장된 값과 화면 표시를 일치시킨다. '0'이나 '1,0 00' 처럼 입력해도
  // 실제 저장값(0 → 미결제)에 맞춰 칸을 다시 그린다.
  const show = (n: number | null) => { el.value = n === null ? '' : n.toLocaleString('ko-KR') }

  if (value === current) {
    show(current) // 값이 그대로면 저장하지 않고 표기만 정리한다
    return
  }

  saveState.value = { ...saveState.value, [id]: 'saving' }
  try {
    await store.updateExpense(id, { actual_amount: value })
    show(value)
    saveState.value = { ...saveState.value, [id]: 'saved' }
    setTimeout(() => {
      const next = { ...saveState.value }
      if (next[id] === 'saved') delete next[id]
      saveState.value = next
    }, 1800)
  } catch (e) {
    saveState.value = { ...saveState.value, [id]: 'error' }
    alert(e instanceof Error ? e.message : '저장에 실패했습니다.')
  }
}

/** 키보드 '완료'로 입력을 끝내면 blur가 일어나 저장으로 이어진다 */
function blurSelf(e: Event) {
  (e.target as HTMLInputElement).blur()
}

// ── 지출 추가 ──
const open = ref(false)
const form = ref({
  day: '1일차' as string,
  title: '',
  planned: '',
  actual: '',
  sourceId: '',
  paidBy: '',
  note: '',
  hasReceipt: false,
})

/** 선택한 출처가 개인결제를 허용하는지 — 운영비만 true */
const allowPersonal = computed(
  () => store.sources.find((s) => s.id === form.value.sourceId)?.allow_personal ?? false,
)
/** 선택한 출처의 현재 잔액 — 계산대에서 얼마까지 긁을지 판단하는 값 */
const pickedSummary = computed(() => store.summaries.find((s) => s.id === form.value.sourceId) || null)

const submitting = ref(false)

async function submit() {
  const planned = toAmount(form.value.planned)
  if (!form.value.title.trim()) return alert('항목명을 입력해주세요.')
  if (!form.value.sourceId) return alert('예산 출처를 선택해주세요.')
  if (planned === null) return alert('예산 금액을 입력해주세요.')

  submitting.value = true
  try {
    await store.addExpense({
      day: form.value.day || null,
      title: form.value.title.trim(),
      planned_amount: planned,
      actual_amount: toAmount(form.value.actual),
      source_id: form.value.sourceId,
      note: form.value.note.trim() || null,
      paid_by: allowPersonal.value && form.value.paidBy.trim() ? form.value.paidBy.trim() : null,
      has_receipt: form.value.hasReceipt,
    })
    form.value = { day: '1일차', title: '', planned: '', actual: '', sourceId: '', paidBy: '', note: '', hasReceipt: false }
    open.value = false
  } catch (e) {
    alert(e instanceof Error ? e.message : '저장에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}

</script>

<template>
  <section v-if="store.enabled" class="budget">
    <div class="eyebrow">워크샵 예산 · 위원회 전용</div>

    <div v-if="store.error" class="err">{{ store.error }}</div>
    <div v-else-if="store.loading && !store.sources.length" class="loading">불러오는 중…</div>

    <template v-else>
      <!-- ── 상단 요약 ── -->
      <div class="totals">
        <div class="total-main">
          <div class="total-label">실제 남은 금액</div>
          <div class="total-value">{{ won(store.totals.left) }}</div>
          <div class="total-sub">
            총 예산 {{ won(store.totals.budget) }} · 사용 {{ won(store.totals.paid) }}
          </div>
        </div>
        <div class="total-side">
          <div class="side-row">
            <span>미결제 예정</span><b>{{ won(store.totals.unpaid) }}</b>
          </div>
        </div>
      </div>

      <!-- ── 카드별 예산 출처 ── -->
      <div class="cards">
        <div v-for="c in store.cardSummaries" :key="c.id" class="card">
          <div class="card-head">
            <span class="card-dot" :style="{ background: c.style.fg }" />
            <span class="card-name" :style="{ color: c.style.fg }">{{ c.name }}</span>
            <span class="card-left" :class="{ minus: c.left < 0 }">{{ won(c.left) }} 남음</span>
          </div>
          <div class="src-list">
            <div v-for="s in c.sources" :key="s.id" class="src" :class="{ over: s.over }">
              <div class="src-top">
                <span class="src-name">{{ s.name }}</span>
                <span class="src-left" :class="{ minus: s.left < 0 }">{{ won(s.left) }}</span>
              </div>
              <!-- 막대는 실제 결제된 금액만 반영한다 (미결제 예정분 제외) -->
              <div class="bar">
                <span class="bar-fill" :style="{ width: Math.min(100, s.budget ? (s.used / s.budget) * 100 : 0) + '%' }" />
              </div>
              <div class="src-meta">
                예산 {{ won(s.budget) }} · 실제 사용 {{ won(s.used) }}
                <template v-if="s.unpaid"> · 예정 {{ won(s.unpaid) }}</template>
                <span v-if="s.allowPersonal" class="tag-personal">개인결제 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 지출 내역 ── -->
      <div class="list-head">
        <span class="list-title">지출 내역</span>
        <button class="add-btn" @click="open = !open">{{ open ? '닫기' : '+ 지출 추가' }}</button>
      </div>

      <div class="filters">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          class="filter"
          :class="{ on: store.filter === f.key }"
          @click="store.setFilter(f.key)"
        >{{ f.label }} <b>{{ store.counts[f.key] }}</b></button>
      </div>

      <!-- 입력 폼 -->
      <div v-if="open" class="form">
        <div class="field-row">
          <select v-model="form.day" class="input day">
            <option value="1일차">1일차</option>
            <option value="2일차">2일차</option>
            <option value="종료 후">종료 후</option>
            <option value="">사전</option>
          </select>
          <input v-model="form.title" class="input" placeholder="항목명 (필수)" />
        </div>

        <select v-model="form.sourceId" class="input">
          <option value="" disabled>예산 출처 선택 (필수)</option>
          <option v-for="s in store.sources" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>

        <!-- 출처를 고르면 그 자리에서 잔액을 보여준다 — 계산대에서 얼마까지 긁을지 판단 -->
        <div v-if="pickedSummary" class="picked" :class="{ minus: pickedSummary.left < 0 }">
          잔액 <b>{{ won(pickedSummary.left) }}</b>
          <span v-if="pickedSummary.unpaid"> · 이 중 미결제 {{ won(pickedSummary.unpaid) }}</span>
        </div>

        <div class="field-row">
          <input v-model="form.planned" class="input" inputmode="numeric" placeholder="예산 금액 (필수)" />
          <input v-model="form.actual" class="input" inputmode="numeric" placeholder="실제 사용액 (선택)" />
        </div>

        <input v-if="allowPersonal" v-model="form.paidBy" class="input" placeholder="개인카드 결제자 (팀 카드면 비워두세요)" />
        <input v-model="form.note" class="input" placeholder="비고 (선택)" />

        <label class="check">
          <input v-model="form.hasReceipt" type="checkbox" />
          영수증 확보함
        </label>

        <button class="submit" :disabled="submitting" @click="submit">
          {{ submitting ? '저장 중…' : '추가' }}
        </button>
      </div>

      <!-- 목록 (입력 순서) -->
      <div class="rows">
        <div v-for="r in store.visibleRows" :key="r.id" class="row">
          <div class="row-top">
            <span v-if="r.day" class="day-chip">{{ r.day }}</span>
            <span class="row-title">{{ r.title }}</span>
          </div>

          <div class="row-src">
            {{ r.sourceName }}
            <span v-if="r.payer" class="tag" :style="{ color: r.payerStyle.fg, background: r.payerStyle.bg }">{{ r.payer }}</span>
            <span v-if="r.has_receipt" class="tag receipt">영수증</span>
          </div>

          <div class="amounts">
            <div class="amt">
              <span class="amt-label">예산</span>
              <span class="amt-value">{{ won(r.planned_amount) }}</span>
            </div>
            <div class="amt">
              <span class="amt-label">실제</span>
              <input
                class="amt-input"
                :class="{ empty: r.actual_amount === null, [saveState[r.id] ?? '']: !!saveState[r.id] }"
                inputmode="numeric"
                enterkeyhint="done"
                :value="r.actual_amount === null ? '' : r.actual_amount.toLocaleString('ko-KR')"
                placeholder="미결제"
                @blur="saveActual(r.id, ($event.target as HTMLInputElement).value, r.actual_amount, $event.target as HTMLInputElement)"
                @keyup.enter="blurSelf"
              />
              <span v-if="saveState[r.id]" class="save-state" :class="saveState[r.id]">
                {{ saveState[r.id] === 'saving' ? '저장 중' : saveState[r.id] === 'saved' ? '저장됨' : '실패' }}
              </span>
            </div>
            <div v-if="r.diff !== null && r.diff !== 0" class="diff" :class="{ over: r.diff > 0 }">
              {{ signed(r.diff) }}
            </div>
          </div>

          <div v-if="r.note" class="row-note">{{ r.note }}</div>
        </div>
      </div>

      <div v-if="!store.visibleRows.length" class="empty">해당하는 지출이 없습니다.</div>

      <div class="note">
        * 실제 사용액을 비워두면 예산 금액이 그대로 잡혀 있는 것으로 계산됩니다.
      </div>
    </template>
  </section>
</template>

<style scoped>
.budget { margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--line); }
.err, .loading { font-size: 12px; font-weight: 700; color: var(--muted); padding: 14px 0; }
.err { color: var(--red); }

/* ── 상단 요약 ── */
.totals { display: flex; flex-direction: column; gap: 8px; margin: 10px 0 14px; }
.total-main { background: var(--ink); border-radius: var(--radius-lg); padding: 16px; }
.total-label { font-size: 10px; font-weight: 800; letter-spacing: .08em; color: var(--muted-2); }
.total-value {
  font-family: 'Black Han Sans', sans-serif;
  font-size: 30px;
  line-height: 1.15;
  color: var(--paper);
  margin-top: 3px;
}
.total-sub { font-size: 11px; font-weight: 700; color: var(--muted-2); margin-top: 5px; }
.total-side {
  display: flex;
  gap: 8px;
}
.side-row {
  flex: 1;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.side-row span { font-size: 10px; font-weight: 800; color: var(--muted); letter-spacing: .04em; }
.side-row b { font-size: 14px; font-weight: 800; color: var(--ink); }
.side-row.minus b { color: var(--red); }

/* ── 카드별 출처 ── */
.cards { display: flex; flex-direction: column; gap: var(--card-gap); }
.card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 14px; }
.card-head { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; }
.card-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; }
.card-name { font-size: 13.5px; font-weight: 800; }
.card-left { margin-left: auto; font-size: 12px; font-weight: 800; color: var(--green); }
.card-left.minus { color: var(--red); }

.src-list { display: flex; flex-direction: column; gap: 11px; }
.src-top { display: flex; align-items: baseline; gap: 8px; }
.src-name { font-size: 12px; font-weight: 700; color: var(--ink-2); }
.src-left { margin-left: auto; font-size: 12.5px; font-weight: 800; }
.src-left.minus { color: var(--red); }
.bar { height: 5px; border-radius: 3px; background: var(--track); margin: 5px 0 4px; overflow: hidden; }
.bar-fill { display: block; height: 100%; background: var(--navy); border-radius: 3px; }
.src.over .bar-fill { background: var(--red); }
.src-meta { font-size: 10.5px; font-weight: 600; color: var(--muted); line-height: 1.7; }
.tag-personal {
  display: inline-block;
  white-space: nowrap;
  margin-left: 6px;
  font-size: 9.5px;
  font-weight: 800;
  color: var(--green);
  border: 1px solid var(--green-line);
  border-radius: 20px;
  padding: 1px 6px;
}

/* ── 목록 헤더 ── */
.list-head { display: flex; align-items: center; margin: 18px 0 9px; }
.list-title { font-size: 12px; font-weight: 800; color: var(--ink-2); }
.list-title b { color: var(--navy); }
.add-btn {
  margin-left: auto;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 13px;
  border-radius: 20px;
  border: 1px solid var(--navy-line);
  color: var(--navy);
  background: transparent;
  cursor: pointer;
}

.filters { display: flex; gap: 6px; margin-bottom: 10px; }
.filter {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--line-2);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}
.filter b { color: var(--muted-2); margin-left: 2px; }
.filter.on { background: var(--ink); border-color: var(--ink); color: var(--paper); }
.filter.on b { color: var(--amber); }

.empty { font-size: 11.5px; font-weight: 700; color: var(--muted-2); padding: 18px 0; text-align: center; }

/* ── 입력 폼 ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 7px;
  background: var(--paper-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px;
  margin-bottom: 11px;
}
.field-row { display: flex; gap: 7px; }
.field-row .input { flex: 1; min-width: 0; }
.input {
  font-size: 12.5px;
  font-weight: 600;
  padding: 9px 11px;
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  background: var(--card);
  color: var(--ink);
  width: 100%;
}
.input.day { flex: none; width: 84px; }
.picked {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-2);
  background: var(--amber-bg);
  border-radius: var(--radius-sm);
  padding: 8px 11px;
}
.picked b { color: var(--amber-fg); }
.picked.minus b { color: var(--red); }
.check { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: var(--ink-2); }
.submit {
  font-size: 12.5px;
  font-weight: 800;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: var(--paper);
  border: none;
  cursor: pointer;
  margin-top: 2px;
}
.submit:disabled { opacity: .55; }

/* ── 지출 행 ── */
.rows { display: flex; flex-direction: column; gap: 7px; }
.row { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 11px 13px; }
.row-top { display: flex; align-items: center; gap: 7px; }
.day-chip {
  font-size: 9.5px;
  font-weight: 800;
  color: var(--muted);
  border: 1px solid var(--line-2);
  border-radius: 20px;
  padding: 1px 7px;
}
.row-title { font-size: 13.5px; font-weight: 800; flex: 1; min-width: 0; }
.row-src { font-size: 10.5px; font-weight: 700; color: var(--muted); margin-top: 3px; }
.tag {
  display: inline-block;
  white-space: nowrap;
  margin-left: 5px;
  font-size: 9.5px;
  font-weight: 800;
  color: var(--navy);
  background: rgba(42, 74, 139, .10);
  border-radius: 20px;
  padding: 1px 6px;
}
.tag.receipt { color: var(--green); background: rgba(74, 124, 89, .10); }

.amounts { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
.amt { display: flex; align-items: baseline; gap: 5px; }
.amt-label { font-size: 9.5px; font-weight: 800; color: var(--muted-2); letter-spacing: .04em; }
.amt-value { font-size: 12.5px; font-weight: 800; color: var(--ink-2); }
.amt-input {
  width: 96px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink);
  padding: 4px 8px;
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  background: var(--card);
}
.amt-input.empty { border-style: dashed; color: var(--muted); }
.amt-input.saving { border-color: var(--amber-line); background: var(--amber-bg); }
.amt-input.saved  { border-color: var(--green); }
.amt-input.error  { border-color: var(--red); }
.save-state { font-size: 9.5px; font-weight: 800; }
.save-state.saving { color: var(--amber-fg); }
.save-state.saved  { color: var(--green); }
.save-state.error  { color: var(--red); }
.diff { margin-left: auto; font-size: 11.5px; font-weight: 800; color: var(--green); }
.diff.over { color: var(--red); }
.row-note { font-size: 10.5px; font-weight: 600; color: var(--muted); margin-top: 6px; line-height: 1.6; }

.note { font-size: 10.5px; font-weight: 600; color: var(--muted-2); margin-top: 11px; }

/* ── 데스크톱 ── */
@media (min-width: 900px) {
  .totals { flex-direction: row; align-items: stretch; }
  .total-main { flex: 1; }
  .total-side { flex-direction: column; width: 210px; }
  .cards { flex-direction: row; }
  .card { flex: 1; }
}
</style>
