-- ─────────────────────────────────────────────
-- 001 — 항목별 금액을 '예산'과 '실제 사용'으로 분리
--
-- 기존에는 amount 하나로 관리하면서 결제 시 값을 덮어썼다. 그러면 원래
-- 잡아둔 예산이 사라져 항목별 절감/초과를 볼 수 없다. 두 컬럼으로 나눈다.
--
--   planned_amount — 항목별 예산 (필수)
--   actual_amount  — 실제 사용 금액 (결제 전에는 null)
--
-- actual_amount가 null인지로 결제 여부가 드러나므로 status 컬럼은 제거한다.
-- ─────────────────────────────────────────────

alter table expenses rename column amount to planned_amount;

alter table expenses
  add column if not exists actual_amount integer check (actual_amount >= 0);

-- 이미 결제가 끝난 건(숙소·온라인 구매물품)은 예산액을 실제액으로 옮긴다
update expenses set actual_amount = planned_amount where status = 'paid';

alter table expenses drop column if exists status;

-- 검산: 예산 2,795,248 / 실제 사용 555,248 / 미결제 예정 2,240,000
select
  sum(planned_amount)                                   as 예산합계,
  coalesce(sum(actual_amount), 0)                       as 실제사용,
  sum(planned_amount) filter (where actual_amount is null) as 미결제예정,
  count(*)                                              as 건수
from expenses where not deleted;
