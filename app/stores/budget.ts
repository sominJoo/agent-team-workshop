import { defineStore } from 'pinia'
import { useSupabase, type Card, type BudgetSource, type Expense } from '~/utils/supabase'

// ─────────────────────────────────────────────
// 예산 스토어
//
// 합계·잔액은 DB에 저장하지 않고 원본 행에서 매번 계산한다. 스프레드시트에서
// SUM 범위를 잘못 잡아 총합이 틀어졌던 문제를 구조적으로 차단하기 위해서다.
// 금액은 전부 원 단위 정수라 부동소수점 오차가 발생할 여지가 없다.
// ─────────────────────────────────────────────

/**
 * 카드 라벨 색. cards의 sort_order 순으로 배정한다 —
 * 카드가 늘어도 순환해서 쓰도록 두고, 개인카드는 별도 앰버 톤을 쓴다.
 */
const CARD_PALETTE = [
  { fg: '#2A4A8B', bg: 'rgba(42, 74, 139, .10)' },   // navy
  { fg: '#9E4368', bg: 'rgba(158, 67, 104, .10)' },  // plum
  { fg: '#4A7C59', bg: 'rgba(74, 124, 89, .10)' },   // green
  { fg: '#C4452F', bg: 'rgba(196, 69, 47, .10)' },   // red
]
export const PERSONAL_STYLE = { fg: '#A8791F', bg: '#FBF3DF' }

/** 지출 한 건이 예산에서 차지하는 금액. 결제 전이면 예산액을 그대로 잡아둔다. */
export function effectiveAmount(e: Expense): number {
  return e.actual_amount ?? e.planned_amount
}

export interface SourceSummary {
  id: string
  name: string
  cardId: string
  allowPersonal: boolean
  /** 배정액 */
  budget: number
  /** 실제 결제가 끝난 금액 */
  used: number
  /** 배정액 - 실제 사용액. 화면에 '남은 금액'으로 표시하는 값 */
  left: number
  /** 아직 결제되지 않은 예정 금액 */
  unpaid: number
  /** 예정분까지 반영한 여유 (left - unpaid) */
  available: number
  /** 실제 사용액이 배정액을 넘었는지 */
  over: boolean
}

export interface CardSummary {
  id: string
  name: string
  /** 카드 라벨 색 */
  style: { fg: string; bg: string }
  sources: SourceSummary[]
  budget: number
  /** 실제 사용액 */
  used: number
  /** 배정액 - 실제 사용액 */
  left: number
  unpaid: number
  /** 예정분까지 반영한 여유 */
  available: number
}

export type ExpenseFilter = 'all' | 'unpaid' | 'paid'

interface State {
  cards: Card[]
  sources: BudgetSource[]
  expenses: Expense[]
  loading: boolean
  error: string | null
  /** 연결 정보가 없으면 예산 기능 자체를 숨긴다 */
  enabled: boolean
  /** 목록 필터 */
  filter: ExpenseFilter
}

export const useBudgetStore = defineStore('budget', {
  state: (): State => ({
    cards: [],
    sources: [],
    expenses: [],
    loading: false,
    error: null,
    enabled: true,
    filter: 'all',
  }),

  getters: {
    sourceMap(s): Record<string, BudgetSource> {
      return Object.fromEntries(s.sources.map((x) => [x.id, x]))
    },

    /** 카드 id → 라벨 색 */
    cardStyle(s): Record<string, { fg: string; bg: string }> {
      return Object.fromEntries(
        s.cards.map((c, i) => [c.id, CARD_PALETTE[i % CARD_PALETTE.length]!]),
      )
    },

    /** 예산 출처별 집계 */
    summaries(s): SourceSummary[] {
      return s.sources.map((src) => {
        const rows = s.expenses.filter((e) => e.source_id === src.id)
        // 남은 금액은 실제로 결제된 금액만 차감한다. 아직 안 나간 예정분은
        // unpaid로 따로 보여주고, 둘을 합친 여유는 available로 낸다.
        const used   = rows.reduce((a, e) => a + (e.actual_amount ?? 0), 0)
        const unpaid = rows.reduce((a, e) => a + (e.actual_amount === null ? e.planned_amount : 0), 0)
        const left   = src.amount - used
        return {
          id: src.id,
          name: src.name,
          cardId: src.card_id,
          allowPersonal: src.allow_personal,
          budget: src.amount,
          used,
          left,
          unpaid,
          available: left - unpaid,
          over: left < 0,
        }
      })
    },

    /** 카드별로 묶은 집계 */
    cardSummaries(): CardSummary[] {
      const byId = this.summaries as SourceSummary[]
      return (this.cards as Card[]).map((c) => {
        const sources = byId.filter((x) => x.cardId === c.id)
        const sum = (f: (x: SourceSummary) => number) => sources.reduce((a, x) => a + f(x), 0)
        const budget = sum((x) => x.budget)
        const used   = sum((x) => x.used)
        const unpaid = sum((x) => x.unpaid)
        const style = (this.cardStyle as Record<string, { fg: string; bg: string }>)[c.id]!
        return { id: c.id, name: c.name, style, sources, budget, used, left: budget - used, unpaid, available: budget - used - unpaid }
      })
    },

    /** 상단 요약 — 총 예산 / 실제 사용 / 실제 남은 금액 / 미결제 예정 */
    totals(s) {
      const budget = s.sources.reduce((a, x) => a + x.amount, 0)
      const paid   = s.expenses.reduce((a, e) => a + (e.actual_amount ?? 0), 0)
      const unpaid = s.expenses.reduce((a, e) => a + (e.actual_amount === null ? e.planned_amount : 0), 0)
      return {
        budget,
        paid,
        unpaid,
        /** 실제로 통장에 남은 금액 */
        left: budget - paid,
        /** 예정분까지 반영한 여유 */
        available: budget - paid - unpaid,
      }
    },

    /**
     * 목록 순서는 sort_order를 그대로 따른다 (같으면 입력 순서).
     * 결제 여부·날짜로 자동 정렬하지 않는다 — 어느 자리에 놓을지는 사람이 정한다.
     */
    rows(s): (Expense & { sourceName: string; payer: string; personal: boolean; payerStyle: { fg: string; bg: string }; diff: number | null })[] {
      const map = this.sourceMap as Record<string, BudgetSource>
      const cardName = Object.fromEntries(s.cards.map((c) => [c.id, c.name]))
      const style = this.cardStyle as Record<string, { fg: string; bg: string }>
      return [...s.expenses]
        .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at))
        .map((e) => {
          const src = map[e.source_id]
          const personal = !!e.paid_by
          return {
            ...e,
            sourceName: src?.name ?? e.source_id,
            // 개인카드로 냈으면 결제자를, 아니면 예산 출처가 속한 팀 카드를 보여준다
            payer: personal ? `개인카드 · ${e.paid_by}` : (cardName[src?.card_id ?? ''] ?? ''),
            personal,
            payerStyle: personal ? PERSONAL_STYLE : (style[src?.card_id ?? ''] ?? PERSONAL_STYLE),
            // 실제액이 있을 때만 예산 대비 차액을 낸다 (음수 = 절감)
            diff: e.actual_amount === null ? null : e.actual_amount - e.planned_amount,
          }
        })
    },

    /** 필터가 적용된 목록 — 화면은 이걸 그린다 */
    visibleRows(s) {
      const all = this.rows as { actual_amount: number | null }[]
      if (s.filter === 'unpaid') return all.filter((r) => r.actual_amount === null)
      if (s.filter === 'paid') return all.filter((r) => r.actual_amount !== null)
      return all
    },

    /** 필터 버튼에 붙일 건수 */
    counts(s) {
      const all = s.expenses
      return {
        all: all.length,
        unpaid: all.filter((e) => e.actual_amount === null).length,
        paid: all.filter((e) => e.actual_amount !== null).length,
      }
    },
  },

  actions: {
    setFilter(f: ExpenseFilter) {
      this.filter = f
    },

    /**
     * 목록에서 한 칸 이동. 이웃과 sort_order를 맞바꾼다.
     * 값이 같아 자리가 바뀌지 않는 경우를 대비해 이동 후 10 단위로 다시 매긴다.
     */
    async move(id: string, dir: -1 | 1) {
      const list = this.rows as { id: string }[]
      const i = list.findIndex((r) => r.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= list.length) return

      const next = [...list]
      const [moved] = next.splice(i, 1)
      next.splice(j, 0, moved!)

      const sb = useSupabase()
      if (!sb) return
      await Promise.all(
        next.map((r, idx) => sb.from('expenses').update({ sort_order: (idx + 1) * 10 }).eq('id', r.id)),
      )
      await this.load()
    },

    async load() {
      const sb = useSupabase()
      if (!sb) {
        this.enabled = false
        return
      }

      this.loading = true
      this.error = null
      try {
        const [cards, sources, expenses] = await Promise.all([
          sb.from('cards').select('*').order('sort_order'),
          sb.from('budget_sources').select('*').order('sort_order'),
          sb.from('expenses').select('*').eq('deleted', false).order('created_at'),
        ])
        const err = cards.error || sources.error || expenses.error
        if (err) throw err

        this.cards = (cards.data ?? []) as Card[]
        this.sources = (sources.data ?? []) as BudgetSource[]
        this.expenses = (expenses.data ?? []) as Expense[]
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '예산 정보를 불러오지 못했습니다.'
      } finally {
        this.loading = false
      }
    },

    /** 다른 기기에서 입력한 내용을 즉시 반영 */
    subscribe() {
      const sb = useSupabase()
      if (!sb) return
      sb.channel('budget')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => this.load())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_sources' }, () => this.load())
        .subscribe()
    },

    async addExpense(input: {
      day: string | null
      title: string
      planned_amount: number
      actual_amount: number | null
      source_id: string
      note: string | null
      paid_by: string | null
      has_receipt: boolean
    }) {
      const sb = useSupabase()
      if (!sb) return
      const { error } = await sb.from('expenses').insert(input)
      if (error) throw error
      await this.load()
    },

    async updateExpense(id: string, patch: Partial<Expense>) {
      const sb = useSupabase()
      if (!sb) return
      const { error } = await sb.from('expenses').update(patch).eq('id', id)
      if (error) throw error
      await this.load()
    },

    /** 물리 삭제 대신 플래그 — 잘못 지워도 기록이 남는다 */
    async removeExpense(id: string) {
      await this.updateExpense(id, { deleted: true })
    },
  },
})
