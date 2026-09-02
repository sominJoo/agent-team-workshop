-- ─────────────────────────────────────────────
-- 워크샵 예산 관리 스키마
--
-- 금액은 전부 원 단위 정수(integer)로만 다룬다. 소수를 쓰지 않으므로
-- 반올림 오차가 발생할 여지가 없다. 합계·잔액은 저장하지 않고 앱에서
-- 원본 행으로 매번 계산한다 — 시트의 SUM 범위 실수 같은 오류를 구조적으로 차단.
-- ─────────────────────────────────────────────

-- 결제 카드
-- 예산 출처는 반드시 어느 한 카드에 속한다. 현장에서 "이 지출은 어느 카드로
-- 긁어야 하는가"가 출처 선택만으로 결정되어야 하므로 별도 테이블로 둔다.
create table if not exists cards (
  id          text primary key,              -- 'a1', 'a2'
  name        text    not null,              -- '에이전트1팀 카드'
  sort_order  integer not null default 0
);

-- 예산 출처 (배정액)
create table if not exists budget_sources (
  id          text primary key,              -- 'workshop', 'meal_a1' 같은 코드
  name        text    not null,              -- 화면 표기명 ('워크샵비')
  amount      integer not null check (amount >= 0),
  card_id     text    not null references cards(id),
  -- 개인카드 결제 허용 여부. 운영비만 true — 워크샵비·회식비는 반드시 팀 카드로 긁어야 한다.
  allow_personal boolean not null default false,
  sort_order  integer not null default 0
);

-- 지출 항목
create table if not exists expenses (
  id          uuid primary key default gen_random_uuid(),
  day         text,                          -- '1일차' | '2일차' | null(사전 지출)
  title       text    not null,

  -- 항목별 예산과 실제 사용액을 분리한다. 실제액으로 예산을 덮으면
  -- 항목별로 얼마를 아꼈는지/넘겼는지 알 수 없게 된다.
  -- actual_amount가 null이면 아직 결제 전(예정)이라는 뜻이다.
  planned_amount integer not null check (planned_amount >= 0),
  actual_amount  integer          check (actual_amount  >= 0),

  source_id   text    not null references budget_sources(id),
  note        text,

  -- 개인카드로 결제한 경우 그 사람 이름. null이면 예산 출처의 팀 카드로 결제.
  -- 워크샵 후 정산 대상을 뽑는 근거가 된다.
  paid_by     text,

  -- 영수증 확보 여부 (사진은 보관하지 않고 확보 체크만 한다)
  has_receipt boolean not null default false,

  -- 실제 삭제 대신 플래그. 잘못 지워도 기록이 남는다.
  deleted     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists expenses_source_idx on expenses (source_id) where not deleted;
create index if not exists expenses_created_idx on expenses (created_at);

-- updated_at 자동 갱신
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists expenses_touch on expenses;
create trigger expenses_touch before update on expenses
  for each row execute function touch_updated_at();

-- 개인카드 결제 가능 여부 검증
-- CHECK 제약은 다른 테이블을 참조할 수 없어 트리거로 막는다. 화면에서 걸러도
-- DB가 한 번 더 막아야 잘못된 데이터가 남지 않는다.
create or replace function check_personal_payment() returns trigger as $$
declare
  allowed boolean;
  src     text;
begin
  if new.paid_by is null or btrim(new.paid_by) = '' then
    return new;
  end if;

  select allow_personal, name into allowed, src
  from budget_sources where id = new.source_id;

  if not allowed then
    raise exception '개인 결제가 허용되지 않는 예산 출처입니다: % (팀 카드로 결제해야 합니다)', src;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists expenses_check_personal on expenses;
create trigger expenses_check_personal before insert or update on expenses
  for each row execute function check_personal_payment();

-- ─────────────────────────────────────────────
-- RLS — 별도 인증 없이 팀 내부에서 쓰는 관리자 화면이라
-- anon 키로 읽기·쓰기를 허용한다. 물리 삭제는 막고 소프트 삭제만 쓴다.
-- ─────────────────────────────────────────────
alter table cards          enable row level security;
alter table budget_sources enable row level security;
alter table expenses       enable row level security;

drop policy if exists cards_read     on cards;
drop policy if exists sources_read   on budget_sources;
drop policy if exists sources_write  on budget_sources;
drop policy if exists expenses_read  on expenses;
drop policy if exists expenses_write on expenses;
drop policy if exists expenses_edit  on expenses;

create policy cards_read     on cards          for select to anon using (true);
create policy sources_read   on budget_sources for select to anon using (true);
create policy sources_write  on budget_sources for update to anon using (true) with check (true);
create policy expenses_read  on expenses       for select to anon using (true);
create policy expenses_write on expenses       for insert to anon with check (true);
create policy expenses_edit  on expenses       for update to anon using (true) with check (true);

-- 실시간 동기화 (여러 기기에서 동시 입력)
alter publication supabase_realtime add table expenses;
alter publication supabase_realtime add table budget_sources;
