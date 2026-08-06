// 암호문 포맷 — 암호화(스크립트)와 복호화(브라우저)가 공유한다.
//
// 한쪽만 바뀌면 복호화가 통째로 실패하므로, 규칙은 반드시 여기 한 곳에만 둔다.
// 앱에서도 이 파일을 그대로 import한다(app/utils/gameCrypto.ts).

/**
 * PBKDF2 반복 횟수.
 *
 * 코드 한 번 확인하는 데 드는 비용이자, 무차별 대입 한 번당 드는 비용이기도
 * 하다. 올릴수록 안전하지만 사용자 대기 시간도 같이 늘어난다. 저사양 폰에서도
 * 체감 지연이 크지 않은 선.
 */
export const PBKDF2_ITERATIONS = 250_000

export const SALT_BYTES = 16
export const IV_BYTES = 12

/**
 * 입력한 코드를 키 유도용 표준형으로 바꾼다.
 *
 * 해시와 달리 여기서는 정규화가 틀리면 키 자체가 달라져 복호화가 실패한다.
 * NFC는 macOS 한글 입력이 자모 분리형(NFD)으로 들어오는 경우를 위한 것 —
 * 눈에는 같은 '위'라도 NFD면 바이트가 달라 다른 키가 나온다.
 *
 * @param {string} v
 * @returns {string}
 */
export function normalizeCode(v) {
  return (v || '')
    .normalize('NFC')
    .replace(/[\s-]+/g, '')
    .toLowerCase()
}

/**
 * salt · iv · 암호문을 base64 한 덩어리로 합친다.
 * salt와 iv는 비밀이 아니라 암호문과 같이 보관해도 된다.
 *
 * @param {Uint8Array} salt
 * @param {Uint8Array} iv
 * @param {Uint8Array} ciphertext
 * @returns {string}
 */
export function packPayload(salt, iv, ciphertext) {
  const out = new Uint8Array(salt.length + iv.length + ciphertext.length)
  out.set(salt, 0)
  out.set(iv, salt.length)
  out.set(ciphertext, salt.length + iv.length)
  let bin = ''
  for (const b of out) bin += String.fromCharCode(b)
  return btoa(bin)
}

/**
 * packPayload의 역연산.
 *
 * @param {string} payload
 * @returns {{ salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array }}
 */
export function unpackPayload(payload) {
  const bin = atob(payload)
  const raw = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return {
    salt: raw.subarray(0, SALT_BYTES),
    iv: raw.subarray(SALT_BYTES, SALT_BYTES + IV_BYTES),
    ciphertext: raw.subarray(SALT_BYTES + IV_BYTES),
  }
}
