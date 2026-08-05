import { defineStore } from 'pinia'
import {
  NAMES, RIDES, ROOMS, GAMES, GAME_OPEN_AT, PREVIEW_CODE,
  type Segment,
} from '~/data/workshop'

export type Tab = 'schedule' | 'game' | 'ride' | 'room' | 'org'
export type IntroPhase = 'in' | 'out' | 'done'

interface State {
  tab: Tab
  day: 1 | 2
  me: string | null
  seg: Segment
  roomQ: string
  game: number | null
  forceOpen: boolean
  now: number
  intro: IntroPhase
  askCode: boolean
  codeInput: string
  codeErr: boolean
}

const pad = (n: number) => (n < 10 ? '0' : '') + n

export const useWorkshopStore = defineStore('workshop', {
  state: (): State => ({
    tab: 'schedule',
    day: 1,
    me: null,
    seg: 'go',
    roomQ: '',
    game: null,
    forceOpen: false,
    now: Date.now(),
    intro: 'in',
    askCode: false,
    codeInput: '',
    codeErr: false,
  }),

  getters: {
    names: () => NAMES,

    showMePicker: (s) => s.tab === 'ride' || s.tab === 'room',
    hasMe: (s) => !!s.me,

    // 사람 선택 칩
    people(s): { name: string; bg: string; fg: string }[] {
      return NAMES.map((n) => ({
        name: n,
        bg: s.me === n ? '#1A1A1A' : '#fff',
        fg: s.me === n ? '#F7D117' : '#1A1A1A',
      }))
    },

    // 현재 구간의 차편 (내 차편 우선 정렬 + 경유지 링크 계산)
    rides(s) {
      const seg = RIDES[s.seg] || RIDES.go
      const list = seg.map((r) => {
        const mine = !!s.me && (r.driver === s.me || (r.riders || '').indexOf(s.me) >= 0)
        const raw = r.stops || (r.map ? [{ name: r.place, url: r.map }] : [])
        const stops = raw.map((st, i) => {
          const linkable = st.q !== false
          const url = st.url || (linkable ? 'https://map.naver.com/p/search/' + encodeURIComponent(String(st.q || st.name)) : '#')
          return { n: String(i + 1), name: st.name, url, has: linkable, no: !linkable }
        })
        return { ...r, mine, stops, noStops: stops.length === 0 }
      })
      if (s.me) list.sort((a, b) => (b.mine ? 1 : 0) - (a.mine ? 1 : 0))
      return list
    },

    // 내 차편 요약 배너
    myRide(): { line: string; sub: string } | null {
      if (!this.me) return null
      const r = this.rides.find((x) => x.mine)
      if (r) {
        return {
          line: r.driver === this.me ? `${r.team} · 내가 운전` : `${r.team} · ${r.driver} 차량`,
          sub: `${r.car} · ${r.place}`,
        }
      }
      return { line: `${this.me}님 배정 없음`, sub: '이 구간에는 배정된 차량이 없습니다.' }
    },

    // 방배정 (검색어/내 이름 하이라이트)
    rooms(s) {
      const q = (s.roomQ || '').trim()
      return ROOMS.map((rm) => ({
        title: rm.title,
        bed: rm.bed,
        count: rm.count,
        head: rm.head,
        shadow: rm.shadow,
        members: rm.members.map((n) => {
          const hit = (q && n.indexOf(q) >= 0) || (!q && s.me === n)
          return { name: n, bg: hit ? '#F7D117' : '#EDE7D8', fg: '#1A1A1A' }
        }),
      }))
    },

    // 게임 잠금/카운트다운
    unlocked: (s) => s.forceOpen || GAME_OPEN_AT - s.now <= 0,
    countdown(s): string {
      const diff = GAME_OPEN_AT - s.now
      if (diff <= 0) return '00:00:00'
      const dd = Math.floor(diff / 86400000)
      const hh = Math.floor(diff / 3600000) % 24
      const mm = Math.floor(diff / 60000) % 60
      const ss = Math.floor(diff / 1000) % 60
      return dd > 0
        ? `${dd}일 ${pad(hh)}:${pad(mm)}:${pad(ss)}`
        : `${pad(hh)}:${pad(mm)}:${pad(ss)}`
    },

    // 게임 목록 (태그 스타일 포함)
    games() {
      return GAMES.map((g, i) => {
        const ts = tagStyle(g.tag)
        return { ...g, tagBg: ts.bg, tagFg: ts.fg, index: i }
      })
    },
    currentGame: (s) => (s.game === null ? null : GAMES[s.game] ?? null),
    modal(): null | { no: string; title: string; color: string; tag: string; tagBg: string; tagFg: string; lines: string[] } {
      const g = this.currentGame
      if (!g || !this.unlocked) return null
      const ts = tagStyle(g.tag)
      return { no: g.no, title: g.title, color: g.color, tag: g.tag, tagBg: ts.bg, tagFg: ts.fg, lines: g.lines }
    },
  },

  actions: {
    tick() { this.now = Date.now() },
    setTab(t: Tab) { this.tab = t },
    setDay(d: 1 | 2) { this.day = d },
    pickMe(n: string) { this.me = this.me === n ? null : n },
    setSeg(seg: Segment) { this.seg = seg },
    setRoomQ(v: string) { this.roomQ = v },
    openGame(i: number) { this.game = i },
    closeGame() { this.game = null },
    goMidRide() { this.tab = 'ride'; this.seg = 'mid' },
    goGame() { this.tab = 'game' },
    showCode() { this.askCode = true; this.codeErr = false },
    onCode(v: string) { this.codeInput = v; this.codeErr = false },
    checkCode() {
      const norm = (v: string) => (v || '').replace(/\s+/g, '')
      if (norm(this.codeInput) === PREVIEW_CODE) {
        this.forceOpen = true
        this.askCode = false
        this.codeErr = false
      } else {
        this.codeErr = true
      }
    },
  },
})

function tagStyle(t: string) {
  return t === '개인전'
    ? { bg: '#1A1A1A', fg: '#F7D117' }
    : { bg: '#EDE7D8', fg: '#1A1A1A' }
}
