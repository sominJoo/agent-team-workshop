import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────
// 예산 데이터용 Supabase 클라이언트
//
// 연결 정보는 .env(로컬) / Actions secret(배포)에서 온다. 값이 비어 있으면
// 예산 기능만 비활성화하고 나머지 앱은 그대로 동작해야 하므로 null을 돌려준다.
// ─────────────────────────────────────────────

export interface Card {
  id: string
  name: string
  sort_order: number
}

export interface BudgetSource {
  id: string
  name: string
  /** 배정액 (원 단위 정수) */
  amount: number
  card_id: string
  /** 개인카드 결제 허용 — 운영비만 true */
  allow_personal: boolean
  sort_order: number
}

export interface Expense {
  id: string
  day: string | null
  title: string
  /** 항목별 예산 */
  planned_amount: number
  /** 실제 사용액 — null이면 아직 결제 전 */
  actual_amount: number | null
  source_id: string
  note: string | null
  /** 개인카드 결제자 — null이면 팀 카드 결제 */
  paid_by: string | null
  has_receipt: boolean
  /** 목록 표시 순서. 10 단위로 매겨 사이에 끼워 넣을 여유를 둔다. */
  sort_order: number
  deleted: boolean
  created_at: string
}

let client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient | null {
  if (client) return client

  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig().public
  if (!supabaseUrl || !supabaseAnonKey) return null

  client = createClient(String(supabaseUrl), String(supabaseAnonKey), {
    auth: { persistSession: false },
  })
  return client
}
