-- ─────────────────────────────────────────────
-- 초기 데이터 — 기존 스프레드시트 내용을 그대로 옮긴 것
-- schema.sql 실행 후 한 번만 돌린다.
-- ─────────────────────────────────────────────

insert into cards (id, name, sort_order) values
  ('a1', '에이전트1팀 카드', 1),
  ('a2', '에이전트2팀 카드', 2)
on conflict (id) do update set name = excluded.name, sort_order = excluded.sort_order;

-- allow_personal: 운영비만 개인카드 결제 가능. 워크샵비·회식비는 팀 카드 전용.
insert into budget_sources (id, name, amount, card_id, allow_personal, sort_order) values
  ('workshop', '워크샵비',            1400000, 'a1', false, 1),
  ('meal_a1',  '회식비 - 에이전트1',   810000, 'a1', false, 2),
  ('ops_a1',   '운영비 - 에이전트1',   450000, 'a1', true,  3),
  ('meal_a2',  '회식비 - 에이전트2',   360000, 'a2', false, 4),
  ('ops_a2',   '운영비 - 에이전트2',   200000, 'a2', true,  5)
on conflict (id) do update
  set name = excluded.name, amount = excluded.amount, card_id = excluded.card_id,
      allow_personal = excluded.allow_personal, sort_order = excluded.sort_order;

-- planned_amount = 항목별 예산 / actual_amount = 실제 사용액(결제 전이면 null)
-- 숙소와 온라인 구매물품만 결제가 끝나 실제액이 채워져 있다.
insert into expenses (day, title, planned_amount, actual_amount, source_id, note) values
  (null,    '숙소',              451928, 451928, 'workshop', null),
  ('1일차', '숙소 추가금',        210000, null,   'workshop', '기준 6인 / 7인 이상 인당 20,000 · 바베큐 11인 이상 50,000'),
  ('1일차', '외부 활동 및 주차비', 120000, null,   'meal_a2',  '시장 주전부리 70,000 · 양평해장국 33,000(1인분 11,000) · 주차 15,000(1대 3,000)'),
  ('1일차', '점심',              380000, null,   'workshop', '인당 20,000 · 파전/막걸리 등 사이드 100,000'),
  ('1일차', '송어회',            100000, null,   'workshop', '6인분(1인분 15,000) · 매운탕 2개(2인분 5,000)'),
  ('1일차', '커피',              140000, null,   'meal_a2',  null),
  ('1일차', '마트',              810000, null,   'meal_a1',  null),
  ('1일차', '온라인 구매물품',    103320, 103320, 'ops_a1',   null),
  ('1일차', '게임 부상',           90000, null,   'ops_a1',   '네이버페이 상품권 · 1인 30,000 · 워크샵 종료 후 결제'),
  ('1일차', '게임 부상',           60000, null,   'ops_a2',   '네이버페이 상품권 · 1인 30,000 · 워크샵 종료 후 결제'),
  ('1일차', '비밀~',              70000, null,   'ops_a2',   '현장 오프라인 결제'),
  ('2일차', '커피',              140000, null,   'workshop', null),
  ('2일차', '교통비',            120000, null,   'workshop', '차량 운행자 교통비 지급건(4대)');

-- 검산: 배정 3,220,000 / 사용 2,795,248 / 잔액 424,752
--       카드 a1 배정 2,660,000 · 사용 2,405,248 · 잔액 254,752
--       카드 a2 배정   560,000 · 사용   390,000 · 잔액 170,000
select
  c.name                                              as 카드,
  sum(b.amount)                                       as 배정,
  coalesce(sum(e.used), 0)                            as 사용,
  sum(b.amount) - coalesce(sum(e.used), 0)            as 잔액
from cards c
join budget_sources b on b.card_id = c.id
left join (
  select source_id, sum(amount) as used
  from expenses where not deleted group by source_id
) e on e.source_id = b.id
group by c.id, c.name, c.sort_order
order by c.sort_order;
