-- ─────────────────────────────────────────────
-- 002 — 지출 목록 순서를 데이터로 관리
--
-- 결제 여부·날짜로 자동 정렬하던 것을 sort_order 컬럼으로 대체한다.
-- 자동 규칙은 새 항목이 어디로 튈지 예측하기 어려워서, 목록 순서는
-- 직접 지정하고 결제 여부는 화면 필터로 거르는 편이 낫다.
--
-- 값은 10 단위로 매긴다. 두 항목 사이에 끼워 넣을 때 재정렬 없이 중간값을 쓸 수 있다.
-- ─────────────────────────────────────────────

alter table expenses
  add column if not exists sort_order integer not null default 0;

-- 기존 행에는 지금 화면에 보이던 순서를 그대로 초기값으로 넣는다
with ordered as (
  select
    id,
    row_number() over (
      order by
        case when actual_amount is null then 0 else 1 end,
        case day
          when '1일차'  then 1
          when '2일차'  then 2
          when '종료 후' then 3
          else 0
        end,
        created_at
    ) * 10 as rn
  from expenses
  where not deleted
)
update expenses e
set sort_order = o.rn
from ordered o
where e.id = o.id;

create index if not exists expenses_sort_idx on expenses (sort_order) where not deleted;

-- 확인
select sort_order, day, title, planned_amount, actual_amount
from expenses where not deleted order by sort_order;
