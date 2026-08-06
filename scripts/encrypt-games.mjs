// 게임 데이터를 위원회 코드로 암호화한다.
//
// 저장소가 public이라 평문을 커밋하면 그대로 읽힌다. 그래서 평문 원본
// (data/games.source.json)은 gitignore로 빼두고, 이 스크립트가 만든 암호문만
// 커밋한다. 배포(GitHub Actions)는 암호문만 있으면 되고, 복호화는 사용자
// 브라우저에서 코드를 키 삼아 일어난다.
//
//   node scripts/encrypt-games.mjs
//
// 게임 데이터를 고쳤다면 이 스크립트를 다시 돌려 암호문을 커밋해야 한다.

import { webcrypto as crypto } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { PBKDF2_ITERATIONS, normalizeCode, packPayload } from './crypto-format.mjs'

const SOURCE = 'data/games.source.json'
const OUTPUT = 'app/data/games.enc.json'

// 인자로 넘기면 셸 히스토리에 코드가 남는다. 환경변수 쪽을 먼저 본다.
const code = process.env.WORKSHOP_CODE || process.argv[2]
if (!code) {
  console.error('위원회 코드가 필요합니다.')
  console.error('  WORKSHOP_CODE=<코드> node scripts/encrypt-games.mjs')
  console.error("  node scripts/encrypt-games.mjs '<코드>'   (셸 히스토리에 남음)")
  process.exit(1)
}

const plaintext = readFileSync(SOURCE, 'utf8')
const games = JSON.parse(plaintext) // 형식이 깨졌으면 여기서 죽는 편이 낫다

const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))

const baseKey = await crypto.subtle.importKey(
  'raw', new TextEncoder().encode(normalizeCode(code)), 'PBKDF2', false, ['deriveKey'],
)
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
)

const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(JSON.stringify(games)),
))

writeFileSync(OUTPUT, JSON.stringify({ v: 1, data: packPayload(salt, iv, ciphertext) }, null, 2) + '\n')

console.log(`게임 ${games.length}건 암호화 → ${OUTPUT}`)
console.log(`평문 ${plaintext.length}B → 암호문 ${ciphertext.length}B`)
