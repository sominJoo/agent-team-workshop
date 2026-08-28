// 2026 하계 워크샵 원본 데이터 (디자인 프로토타입 v2 기준)

export interface Stop {
  name: string
  q?: string | false
  url?: string
}

export interface Ride {
  team: string
  driver: string
  riders: string
  car: string
  place: string
  stops?: Stop[]
  map?: string
  /** 카드 헤더 좌측 6px 원형 마커 색 */
  dot: string
}

export type Segment = 'go' | 'mid' | 'back'

export interface Room {
  title: string
  bed: string
  count: string
  /** 카드 헤더 성별 배지 */
  gender: '남자' | '여자'
  dot: string
  members: string[]
}

export interface Game {
  no: string
  title: string
  summary: string
  tag: string
  color: string
  lines: string[]
}

export interface Committee {
  /** chief: 위원장(다크 카드) · sub: 나머지 위원(일반 카드) */
  type: 'chief' | 'sub'
  role: string
  name: string
  /** 하이픈 포함 표기 — tel:/sms: 링크는 하이픈을 제거해서 만든다 */
  phone: string
  /** 역할 텍스트·아바타 액센트 (sub 전용, chief는 앰버 고정) */
  color?: string
  /** 아바타 배경 — 액센트의 저채도 틴트 (sub 전용) */
  tint?: string
}

// 액센트 팔레트 (main.css의 --red/--sky/... 와 동일)
export const RED = '#C4452F'
export const SKY = '#4A8FB0'
export const GREEN = '#4A7C59'
export const PLUM = '#9E4368'
export const NAVY = '#2A4A8B'
export const GOLD = '#D99A2B'
export const GRAY = '#B0AB9C'

export const NAMES = [
  '박세종', '김상우', '주소민', '최영철', '김예지', '이혜윤', '황인용',
  '김태호', '채병철', '강이정', '윤지수', '오민영', '김우영', '정설화',
  '배한솔', '장소라',
]

export const RIDES: Record<Segment, Ride[]> = {
  go: [
    { team: '서울', driver: '주소민', riders: '김상우, 박세종, 최영철', car: '자차 · 283노3449', place: '잠실 종합운동장역 1번 출구', map: 'https://map.naver.com/p/search/잠실종합운동장역', dot: RED },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호', car: '자차', place: '성남 출발', dot: SKY },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 출발', dot: GREEN },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 출발', dot: PLUM },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 출발', dot: NAVY },
  ],
  mid: [
    { team: '마트조 / 고기조', driver: '주소민', riders: '김상우, 박세종, 김우영', car: '자차 · 283노3449', place: '양평 농민마트 / 한결축산 양평점', map: 'https://map.naver.com/p/search/양평 농민마트', dot: RED },
    { team: '간식조', driver: '김예지', riders: '정설화, 김태호', car: '자차', place: '양평물맑은시장', map: 'https://map.naver.com/p/search/양평물맑은시장', dot: SKY },
    { team: '숙소조', driver: '채병철', riders: '최영철, 황인용', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', dot: GREEN },
    { team: '송어조', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '평창송어', map: 'https://naver.me/F88I0nRm', dot: PLUM },
    { team: '숙소조', driver: '오민영', riders: '이혜윤', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', dot: NAVY },
  ],
  back: [
    { team: '서울', driver: '주소민', riders: '김상우, 배한솔, 최영철', car: '자차 · 283노3449', place: '잠실 종합운동장역 1번 출구', map: 'https://map.naver.com/p/search/잠실종합운동장역', dot: RED },
    { team: '관악', driver: '장소라', riders: '박세종', car: '자차', place: '관악 방면', dot: GOLD },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호', car: '자차', place: '성남 방면', dot: SKY },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 방면', dot: GREEN },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 방면', dot: PLUM },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 방면', dot: NAVY },
  ],
}

export const ROOMS: Room[] = [
  { title: '1호실', bed: '더블 침대 1개', count: '2명', gender: '남자', dot: NAVY, members: ['김상우', '김태호'] },
  { title: '2호실', bed: '더블 침대 1개', count: '2명', gender: '여자', dot: SKY, members: ['이혜윤', '김예지'] },
  { title: '3호실', bed: '더블 침대 1개 + 슈퍼싱글 1개', count: '3명', gender: '여자', dot: GREEN, members: ['오민영', '정설화', '장소라'] },
  { title: '4호실', bed: '더블 침대 1개 + 침대 패드 2개(관리실)', count: '4명', gender: '남자', dot: RED, members: ['최영철', '박세종', '황인용', '채병철'] },
  { title: '5호실', bed: '더블 침대 패드 5개', count: '10명', gender: '여자', dot: PLUM, members: ['김우영', '윤지수', '주소민', '강이정', '배한솔'] },
]

// GAMES는 여기 없다.
//
// 저장소가 public이라 평문으로 두면 github.com에서 그대로 읽힌다. 평문 원본은
// data/games.source.json(gitignore)에 있고, 커밋되는 것은 위원회 코드로 암호화한
// app/data/games.enc.json뿐이다. 코드를 입력하면 브라우저가 복호화한다.
//   → 데이터 수정 후에는 npm run encrypt 로 암호문을 다시 만들어야 한다.

export const COMMITTEE: Committee[] = [
  { type: 'chief', role: '위원장', name: '정설화', phone: '010-9049-6133' },
  { type: 'sub', role: '전무', name: '김예지', phone: '010-4105-1927', color: NAVY, tint: 'rgba(42,74,139,.10)' },
  { type: 'sub', role: '상무', name: '주소민', phone: '010-4527-6649', color: SKY, tint: 'rgba(74,143,176,.12)' },
]

// 워크샵 시작일: 2026-09-03 (month는 0-index라 8 = 9월)
export const WORKSHOP_START = new Date(2026, 8, 3, 0, 0, 0)

// 게임 공개 예정 시각: 2026-09-03 18:00 — 카운트다운 표시용.
//
// 이 시각이 지나도 잠금이 저절로 풀리지는 않는다. 게임 데이터가 암호화되어 있어
// 코드 없이는 복호화할 키가 없기 때문이다. 공개 시점에 위원회가 코드를 공지한다.
export const GAME_OPEN_AT = new Date(2026, 8, 3, 18, 0, 0).getTime()
