// 2026 하계 워크샵 원본 데이터 (디자인 프로토타입 그대로 이식)

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
  head: string
  headFg: string
  shadow: string
}

export type Segment = 'go' | 'mid' | 'back'

export interface Room {
  title: string
  bed: string
  count: string
  head: string
  shadow: string
  members: string[]
}

export interface Game {
  no: string
  title: string
  summary: string
  tag: string
  type: string
  color: string
  lines: string[]
}

export const NAMES = [
  '박세종', '김상우', '주소민', '최영철', '김예지', '이혜윤', '황인용',
  '김태호', '채병철', '강이정', '윤지수', '오민영', '김우영', '정설화',
]

export const RIDES: Record<Segment, Ride[]> = {
  go: [
    { team: '서울', driver: '박세종', riders: '김상우, 주소민, 최영철', car: '자차', place: '경유 4곳', stops: [{ name: '팀장님댁', q: false }, { name: '천호동', q: '천호역' }, { name: '평창송어', url: 'https://naver.me/F88I0nRm' }, { name: '황해식당', url: 'https://naver.me/FeX2FAkV' }], head: '#E8402A', headFg: '#fff', shadow: '#E8402A' },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호', car: '자차', place: '성남 출발', head: '#2FA9E0', headFg: '#fff', shadow: '#2FA9E0' },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 출발', head: '#2E9B4F', headFg: '#fff', shadow: '#2E9B4F' },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 출발', head: '#C4267E', headFg: '#fff', shadow: '#C4267E' },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 출발', head: '#1B3A8C', headFg: '#fff', shadow: '#1B3A8C' },
  ],
  mid: [
    { team: '마트조 / 고기조', driver: '박세종', riders: '김상우, 주소민, 김우영', car: '자차', place: '양평 농민마트 / 한결축산 양평점', map: 'https://map.naver.com/p/search/양평 농민마트', head: '#E8402A', headFg: '#fff', shadow: '#E8402A' },
    { team: '간식조', driver: '김예지', riders: '정설화, 김태호', car: '자차', place: '양평물맑은시장 · 어무이맛양평해장국', stops: [{ name: '양평 물맑은시장', q: '양평물맑은시장' }, { name: '어무이맛양평해장국', url: 'https://naver.me/54Lbaz59' }], head: '#2FA9E0', headFg: '#fff', shadow: '#2FA9E0' },
    { team: '숙소조', driver: '채병철', riders: '최영철, 황인용', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', head: '#2E9B4F', headFg: '#fff', shadow: '#2E9B4F' },
    { team: '송어조', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '평창송어', map: 'https://naver.me/F88I0nRm', head: '#C4267E', headFg: '#fff', shadow: '#C4267E' },
    { team: '숙소조', driver: '오민영', riders: '이혜윤', car: '자차', place: '지온스테이(숙소)', map: 'https://naver.me/G5kDtM7h', head: '#1B3A8C', headFg: '#fff', shadow: '#1B3A8C' },
  ],
  back: [
    { team: '서울', driver: '박세종', riders: '김상우, 주소민, 최영철', car: '자차', place: '경유 2곳', stops: [{ name: '천호동', q: '천호역' }, { name: '팀장님댁', q: false }], head: '#E8402A', headFg: '#fff', shadow: '#E8402A' },
    { team: '성남', driver: '김예지', riders: '이혜윤, 황인용, 김태호(New!)', car: '자차', place: '성남 방면', head: '#2FA9E0', headFg: '#fff', shadow: '#2FA9E0' },
    { team: '인천', driver: '채병철', riders: '단독 이동', car: '자차', place: '인천 방면', head: '#2E9B4F', headFg: '#fff', shadow: '#2E9B4F' },
    { team: '수원', driver: '강이정', riders: '윤지수', car: '회사차 · 아반떼 179허8119', place: '수원 방면', head: '#C4267E', headFg: '#fff', shadow: '#C4267E' },
    { team: '수원', driver: '오민영', riders: '김우영, 정설화', car: '자차', place: '수원 방면', head: '#1B3A8C', headFg: '#fff', shadow: '#1B3A8C' },
  ],
}

export const ROOMS: Room[] = [
  { title: '1호실', bed: '더블 침대 1개 · 남자 2', count: '2명', head: '#1B3A8C', shadow: '#1B3A8C', members: ['최영철', '김상우'] },
  { title: '2호실', bed: '더블 침대 1개 · 남자 2', count: '2명', head: '#2FA9E0', shadow: '#2FA9E0', members: ['채병철', '김태호'] },
  { title: '3호실', bed: '더블 침대 1개 + 슈퍼싱글 1개 · 팀장님 + 남자 1', count: '3명', head: '#2E9B4F', shadow: '#2E9B4F', members: ['팀장님', '황인용'] },
  { title: '4호실', bed: '더블 침대 패드 5개 · 여자 8', count: '10명', head: '#C4267E', shadow: '#C4267E', members: ['주소민', '김예지', '이혜윤', '강이정', '윤지수', '오민영', '정설화'] },
]

export const GAMES: Game[] = [
  { no: '01', title: '인물 퀴즈', summary: '사진 보고 이름 맞추기 - 유명인', tag: '팀전', type: "team",color: '#E8402A', lines: ['사진을 보고 인물 이름을 맞히는 게임.', '유명인 사진으로 출제.', '팀별로 번갈아 답하고 정답 수를 합산.'] },
  { no: '02', title: '노래맞추기', summary: '전주 듣고 노래 맞추기', tag: '팀전', type: "team",color: '#2FA9E0', lines: ['전주를 듣고 노래 제목을 맞히는 게임.', '연령별 노래로 출제 — 연도 뽑기로 진행.', '먼저 맞힌 팀이 점수 획득.'] },
  { no: '03', title: '몸으로 말해요', summary: '제시어를 몸으로 설명', tag: '팀전', type: "team",color: '#2E9B4F', lines: ['제시어를 말 없이 몸으로 설명하고 팀원이 맞히는 게임.', '팀당 제한 시간 안에 맞힌 개수로 채점.'] },
  { no: '04', title: 'TMI 게임', summary: '익명 TMI 추리 · 개인전', tag: '개인전', type: "solo", color: '#C4267E', lines: ['각자 종이에 자기 관련 TMI 하나씩 적음.', '예:', '· 학창 시절 전교 1등 해봤다', '· 연예인과 사진 찍은 적 있다', '· 해외에서 길 잃은 적 있다', '· 하루에 라면 4개 먹어봤다', '진행자가 하나씩 읽고 누구 이야기인지 맞히기.', '사람들끼리 조금 친해지는 효과도 있고 준비도 거의 없음.'] },
]

// 게임 공개 시각: 2026-09-03 18:00 (month는 0-index라 8 = 9월)
export const GAME_OPEN_AT = new Date(2026, 8, 3, 18, 0, 0).getTime()

// 위원회 미리보기 코드
export const PREVIEW_CODE = '에이전트팀최고'
