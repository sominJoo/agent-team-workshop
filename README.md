# agent-team-workshop

2026 하계 워크샵 안내 웹 (일정 · 게임 · 차편 · 방배정 · 위원회).
Nuxt 4 기반 SPA이며 Web / 모바일 반응형으로 동작합니다.

## 요구 버전

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | **22.19.0 이상** | Nuxt 4.5가 `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` 요구. Node 20에서는 실행되지 않습니다 |
| npm | 10 이상 | `package-lock.json` 기준 (`npm ci` 사용) |
| Docker | 20.10 이상 | 컨테이너 배포 시에만 필요 |

프로젝트 권장 버전은 `.nvmrc`에 `22`로 고정되어 있습니다.

```bash
nvm use          # .nvmrc 참조
node -v          # v22.x 확인
```

## 로컬 개발

```bash
npm ci           # 최초 1회 (package-lock.json 그대로 설치)
npm run dev      # http://localhost:3000
```

> dev 서버를 여러 개 띄우면 HMR 소켓이 엇갈려 화면이 갱신되지 않을 수 있습니다.
> 한 번에 하나만 실행하세요.

## 프로덕션 빌드

```bash
npm run build              # .output/ 생성 (Nitro node-server)
npm run preview            # 빌드 결과 확인

# 산출물 직접 실행
HOST=0.0.0.0 PORT=3000 NODE_ENV=production node .output/server/index.mjs
```

`.output/`은 의존성이 번들된 자체 완결 산출물이므로 실행에 `node_modules`가 필요하지 않습니다.

## Docker

### 이미지 빌드

```bash
docker build -t workshop-app:1.0.0 -t workshop-app:latest .
```

`node:22-alpine` 멀티스테이지 빌드입니다. builder에서 `npm ci && npm run build`를 수행하고,
runtime에는 `.output`만 복사해 비특권 계정(`node`)으로 실행합니다. 최종 이미지 약 **167MB**.

### 실행

```bash
docker run -d \
  --name workshop-app \
  -p 3000:3000 \
  --restart unless-stopped \
  workshop-app:latest
```

호스트 포트를 바꾸려면 매핑만 변경하세요 (컨테이너 내부는 3000 유지).

```bash
docker run -d --name workshop-app -p 8080:3000 --restart unless-stopped workshop-app:latest
```

### 확인 · 운영

```bash
docker ps --filter name=workshop-app          # 상태 · 헬스체크
docker logs -f workshop-app                   # 로그
curl -I http://localhost:3000/                # 응답 확인

docker restart workshop-app                   # 재시작
docker rm -f workshop-app                     # 중지 후 제거
```

컨테이너에는 30초 간격 `HEALTHCHECK`가 포함되어 있어 `docker ps`의 STATUS에
`healthy` / `unhealthy`가 표시됩니다.

### 환경변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `HOST` | `0.0.0.0` | 바인딩 주소 (컨테이너 외부 접근을 위해 변경하지 마세요) |
| `PORT` | `3000` | 컨테이너 내부 리스닝 포트. 변경 시 헬스체크도 함께 따라갑니다 |
| `NODE_ENV` | `production` | — |

## 개발서버 배포

> **아키텍처 주의**: Apple Silicon(arm64)에서 빌드한 이미지는 x86_64 서버에서 실행되지 않습니다.
> 아래 중 한 방법을 사용하세요.

### A. 서버에서 직접 빌드 (권장)

```bash
ssh <dev-server>
cd <repo>
git pull
docker build -t workshop-app:latest .
docker rm -f workshop-app 2>/dev/null
docker run -d --name workshop-app -p 3000:3000 --restart unless-stopped workshop-app:latest
```

### B. 로컬에서 크로스 빌드 후 전송

```bash
docker build --platform linux/amd64 -t workshop-app:1.0.0 .
docker save workshop-app:1.0.0 | gzip > workshop-app.tar.gz
scp workshop-app.tar.gz <dev-server>:/tmp/
ssh <dev-server> 'gunzip -c /tmp/workshop-app.tar.gz | docker load'
```

### C. 레지스트리 경유

```bash
docker build --platform linux/amd64 -t <registry>/workshop-app:1.0.0 .
docker push <registry>/workshop-app:1.0.0
ssh <dev-server> 'docker pull <registry>/workshop-app:1.0.0'
```

## 프로젝트 구조

```
app/
  app.vue              # 레이아웃 · 헤더 · 네비게이션 (반응형 분기)
  assets/css/main.css  # 디자인 토큰(CSS 변수) · 브레이크포인트 · 전역 스타일
  components/          # 탭별 화면 + 인트로 · 게임 모달
  data/workshop.ts     # 일정 · 차편 · 방배정 · 게임 원본 데이터
  stores/workshop.ts   # Pinia 스토어 (탭 · 선택 상태 · 카운트다운)
public/images/         # 포스터 이미지
Dockerfile             # 멀티스테이지 빌드
.dockerignore          # 빌드 컨텍스트 축소 (253MB → 4.5MB)
```

### 반응형 브레이크포인트

| 구간 | 네비게이션 | 일정 탭 |
|---|---|---|
| ~639px | 하단 탭바 | Day 토글로 1일씩 |
| 640~899px | 하단 탭바 | 1열 (가독 폭 620px 제한) |
| 900px~ | 헤더 내 가로 탭 | Day1 · Day2 2열 동시 표시 |
