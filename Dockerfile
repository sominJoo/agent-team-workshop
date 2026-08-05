# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# builder — 의존성 설치 후 Nuxt 빌드
#
# $BUILDPLATFORM: 빌드를 실행하는 호스트의 아키텍처(맥이면 arm64).
# Nitro 산출물은 아키텍처에 의존하지 않는 순수 JS라, amd64를 노리더라도
# 이 단계까지 QEMU로 에뮬레이션할 이유가 없다. 네이티브로 빌드해야 빠르다.
# ─────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

# 의존성 레이어를 소스와 분리해 캐시 재사용 (소스만 바뀌면 npm ci 생략)
# --ignore-scripts: postinstall(nuxt prepare)은 소스가 아직 없는 이 단계에서
#                   할 일이 없다. 실제 준비 작업은 아래 nuxt build가 수행한다.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# runtime — Nitro 산출물만 실행
#
# --platform을 지정하지 않으므로 빌드 시 넘긴 타겟 아키텍처를 따른다.
#   docker build --platform linux/amd64  → amd64 이미지 (x86_64 리눅스 서버용)
#   docker build                         → 호스트와 동일 (맥에서는 arm64)
# ─────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# .output은 의존성이 번들된 자체 완결 산출물이라 node_modules가 필요 없다
COPY --from=builder --chown=node:node /app/.output ./.output

# 루트로 실행하지 않는다 (node 이미지에 기본 포함된 비특권 계정)
USER node

EXPOSE 3000

# shell 형식이라 $PORT가 런타임에 확장된다 (-e PORT=8080 으로 바꿔도 따라감)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:$PORT/" >/dev/null 2>&1 || exit 1

CMD ["node", ".output/server/index.mjs"]
