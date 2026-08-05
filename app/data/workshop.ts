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
]

export const RIDES: Record<Segment, Ride[]> = {
  go: [
    { team: '서울', driver: '박세종', riders: '김상우, 주소민, 최영철', car: '자차', place: '경유 4곳', stops: [{ name: '팀장님댁', q: false }, { name: '천호동', q: '천호역' }, { name: '평창송어', url: 'https://naver.me/F88I0nRm' }, { name: '황해식당', url: 'https://naver.me/FeX2FAkV' }], dot: RED },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호', car: '자차', place: '성남 출발', dot: SKY },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 출발', dot: GREEN },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 출발', dot: PLUM },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 출발', dot: NAVY },
  ],
  mid: [
    { team: '마트조 / 고기조', driver: '박세종', riders: '김상우, 주소민, 김우영', car: '자차', place: '양평 농민마트 / 한결축산 양평점', map: 'https://map.naver.com/p/search/양평 농민마트', dot: RED },
    { team: '간식조', driver: '김예지', riders: '정설화, 김태호', car: '자차', place: '양평물맑은시장 · 어무이맛양평해장국', stops: [{ name: '양평 물맑은시장', q: '양평물맑은시장' }, { name: '어무이맛양평해장국', url: 'https://naver.me/54Lbaz59' }], dot: SKY },
    { team: '숙소조', driver: '채병철', riders: '최영철, 황인용', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', dot: GREEN },
    { team: '송어조', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '평창송어', map: 'https://naver.me/F88I0nRm', dot: PLUM },
    { team: '숙소조', driver: '오민영', riders: '이혜윤', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', dot: NAVY },
  ],
  back: [
    { team: '서울', driver: '박세종', riders: '김상우, 주소민, 최영철', car: '자차', place: '경유 2곳', stops: [{ name: '천호동', q: '천호역' }, { name: '팀장님댁', q: false }], dot: RED },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호(New!)', car: '자차', place: '성남 방면', dot: SKY },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 방면', dot: GREEN },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 방면', dot: PLUM },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 방면', dot: NAVY },
  ],
}

export const ROOMS: Room[] = [
  { title: '1호실', bed: '더블 침대 1개 · 남자 2', count: '2명', dot: NAVY, members: ['최영철', '김상우'] },
  { title: '2호실', bed: '더블 침대 1개 · 남자 2', count: '2명', dot: SKY, members: ['채병철', '김태호'] },
  { title: '3호실', bed: '더블 침대 1개 + 슈퍼싱글 1개 · 팀장님 + 남자 1', count: '3명', dot: GREEN, members: ['팀장님', '황인용'] },
  { title: '4호실', bed: '더블 침대 패드 5개 · 여자 8', count: '10명', dot: PLUM, members: ['주소민', '김예지', '이혜윤', '강이정', '윤지수', '오민영', '정설화'] },
]

export const GAMES: Game[] = []

// 게임 공개 시각: 2026-09-03 18:00 (month는 0-index라 8 = 9월)
export const GAME_OPEN_AT = new Date(2026, 8, 3, 18, 0, 0).getTime()

// 위원회 미리보기 코드
export const PREVIEW_CODE = '***REMOVED***'
