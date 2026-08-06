import type { Game } from '~/data/workshop'
import encrypted from '~/data/games.enc.json'
import {
  PBKDF2_ITERATIONS,
  normalizeCode,
  unpackPayload,
} from '~~/scripts/crypto-format.mjs'

/**
 * 위원회 코드로 게임 데이터를 복호화한다.
 *
 * 코드가 틀리면 AES-GCM 인증 태그 검증이 실패해 예외가 난다. 즉 복호화 성공
 * 자체가 코드 검증이라, 정답을 따로 들고 있을 필요가 없다. 번들에 남는 것은
 * 암호문뿐이라 잠금 화면을 우회해도 읽을 것이 없다.
 *
 * @returns 코드가 맞으면 게임 목록, 틀리면 null
 */
export async function decryptGames(code: string): Promise<Game[] | null> {
  // crypto.subtle은 secure context(HTTPS·localhost)에서만 노출된다.
  // 배포처인 github.io는 HTTPS라 문제없지만, 평문 HTTP로 띄우면 여기서 걸린다.
  if (!globalThis.crypto?.subtle) {
    throw new Error('이 브라우저에서는 코드 확인을 할 수 없습니다 (HTTPS 필요)')
  }

  const { salt, iv, ciphertext } = unpackPayload(encrypted.data)

  const baseKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(normalizeCode(code)), 'PBKDF2', false, ['deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )

  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
    return JSON.parse(new TextDecoder().decode(plain)) as Game[]
  } catch {
    // OperationError — 코드가 틀렸다는 뜻
    return null
  }
}
