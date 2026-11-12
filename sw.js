/* ═══════════════════════════════════════════════════
   v6.1.6 (2026-11-12) — KDS 31 25 20 : 2026 4.4(3) 호흡선 최소 외기량 비교(표 4.4-2 Rp · Ra · 기본 밀도) · 「권장 적용」 선택 칸(체크 안 하면 종전과 같은 결과) · 결과 · A4 줄(정밀검토 KDS 남은 2건) · 작업지시서 §25-6-83 · 캐시명 v6.1.6 (종전 v6.1.5)
   v6.1.5 (2026-11-12) — Pretendard CSS SRI(integrity · crossorigin)(정밀검토 C2) — 화면 · 계산 · 인쇄 불변 · 작업지시서 §25-6-82 · 캐시명 v6.1.5 (종전 v6.1.4)
   v6.1.4 (2026-11-12) — KDS 31 25 20 : 2026 대조 — 참고표를 표 4.4-2 호흡선 최소 외기량(Rp · Ra · 밀도)으로 교체 · 근거 메모에 학교시설 21.6 ㎥/인·h(학교보건법 시행규칙 별표 2) · 배기량 표 4.5-1 설명 추가(정밀검토 B12) — 계산 값 불변 · 작업지시서 §25-6-81 · 판 6.1 · 캐시명 v6.1.4 (종전 v6.1.3)
   v6.1.3 (2026-11-12) — 건물개요 공통 원본 MM-PROJECT v1.2 → v1.3(불러오기 창 표 칸 모양 고정 — 도구 CSS 가 새지 않음 · 저장값 같음, 정밀검토 C10) · 작업지시서 §25-6-80 · 판 6.1 · 캐시명 v6.1.3 (종전 v6.1.2)
   v6.1.2 (2026-11-12) — 입력값 경고 표시: 외기도입 비율 · 여유율 빈 값 → 100 · 10% · 여유율 · 면적 · 층고 · 인원 음수 · 실별 표 음수(합계 제외) — 계산 값 불변 · 계산서 끝 「입력 확인」 줄(정밀검토 B10 · 작업지시서 §25-6-79) · 판 6.1 · 캐시명 v6.1.2 (종전 hwangi-v6.1.1)
   v6.1.1 (2026-11-12) — 건물개요 공통 원본 MM-PROJECT v1.2 새로 넣음(사업명 · 작성자 · 정밀검토 B6 · 작업지시서 §25-6-77) · 판 6.1 · 캐시명 v6.1.1 (종전 hwangi-v6.1.0)
   v6.1.0 2026-11-11 — KDS 코드 31 25 00 → 31 25 20 정정 · 별표 1의6 바목 근거 문구(학교 · 실험실은 준용값) · 법정 기준 표 규모 요건 · 근거 메모 · 판 6.1 · 캐시명 v6.1.0
   S6 회차 2026-09-05 — R24①② 표 선 separate·mono 한글 폴백 소급 동반 캐시명 v5.0.9
   S5 회차 2026-09-04 — R23② JPG 엔진 행 나눔 소급 동반 캐시명 v5.0.8
   S3-0 회차 2026-09-04 — R27 html2canvas 클론 정화 동반 캐시명 v5.0.7
   S2 회차 2026-09-04 — index 소급(R1·R21·R26 등) 동반 캐시명 v5.0.6
   R25 회차 2026-09-04 — 자기 접두어 캐시 조회 · cors 프리캐시 · opaque 가드 · 캐시명 v5.0.5 (S10)
   환기설비 — 기계환기설비 환기량 산정 시스템  MANMIN Ver-6.1
   Service Worker — 오프라인 캐시 + 버전 업데이트
   ENGINEER KIM MANMIN

   v5.0.0 (2026-09-02)
   ───────────────────────────────────────────────────
   [변경 ①] 문서(HTML)를 Network-first 로 바꿨다(§11-3).
            종전 Cache-first 에서는 index.html 을 고쳐 배포해도
            캐시명을 올리기 전에는 사용자 화면에 영구히 반영되지 않는다.
   ⛔ navigate 분기를 제거하지 말 것.

   [변경 ②] 캐시 삭제 범위를 자기 접두어(PREFIX)로 한정했다.
            caches.keys() 는 origin 전체를 반환한다.
            manminkim-eng.github.io 한 origin 에 39종이 배포돼 있어,
            종전 `k !== CACHE` 필터는 나머지 38종의 캐시를 전부 지웠다.

   ⛔ cache.addAll 은 원자적이다. 목록 중 하나라도 404 면 설치가 통째로 실패해
      SW 가 아예 안 붙는다 → allSettled + 개별 catch 로 감쌌다(§11-3).
═══════════════════════════════════════════════════ */
const PREFIX = 'hwangi-';
/* ═ R25 (2026-09-04) — SW 캐시 origin 오염 차단 (S10 · 지시서 §21-1 R25)
   전역 caches 의 match 는 origin 전체를 검색한다. manminkim-eng.github.io 는 34종이 한 origin 이라
   다른 도구 캐시의 opaque 응답이 <script crossorigin>(cors) 요청에 돌아가 스크립트가 폐기됐다
   (30 #root 빈 화면 · 40 html2canvas undefined). 자기 접두어 캐시만 조회하고, cross-origin
   프리캐시는 cors 로 받으며, opaque↔cors 불일치 시 캐시를 쓰지 않는다. */
const MM_EXCLUDE = [];   /* 내 접두어로 시작하지만 남의 캐시인 이름 (§17-1 충돌) */
const mmOwn   = (k) => k.indexOf(PREFIX) === 0 && !MM_EXCLUDE.some((x) => k.indexOf(x) === 0);
const mmReq   = (u) => (typeof u === 'string' && u.indexOf('http') === 0) ? new Request(u, { mode: 'cors' }) : u;
const mmMatch = (req, opt) => caches.keys()
  .then((ks) => ks.filter(mmOwn))
  .then((ks) => ks.reduce((p, k) => p.then((r) => r || caches.open(k).then((c) => c.match(req, opt))), Promise.resolve(undefined)))
  .then((r) => (r && r.type === 'opaque' && req && req.mode === 'cors') ? undefined : r);

const CACHE  = 'hwangi-v6.1.6';  /* 2026-11-11 v6.1.0 근거 정정 · 근거 메모 · 판 6.1 (종전 v5.0.18) */

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/brand-icon.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  /* v5.0 — 로컬 폴백 폰트. CDN 차단·오프라인 시 한글 깨짐 방지 (§3-7 · §14-4) */
  './assets/fonts/manmin-fonts.css',
  './assets/fonts/NotoSansKR-var.woff2',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', function(e){
  console.log('[SW] Install:', CACHE);
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.allSettled(ASSETS.map(function(u){
        return c.add(mmReq(u)).catch(function(err){ console.warn('[SW] precache skip:', u, err); });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  console.log('[SW] Activate:', CACHE);
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){
          /* ⛔ 자기 접두어만 지운다. origin 을 39종이 공유하므로
             무조건 지우면 남의 캐시를 통째로 날린다. */
          return k !== CACHE && mmOwn(k);
        }).map(function(k){
          console.log('[SW] 구버전 캐시 삭제:', k);
          return caches.delete(k);
        })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('http') !== 0) return;

  /* ══ ⛔ 핵심 ══ HTML 문서는 Network-first. */
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).then(function(res){
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      }).catch(function(){
        return mmMatch(e.request).then(function(c){
          return c || mmMatch('./index.html');
        });
      })
    );
    return;
  }

  /* ══ 정적 자산: Cache-First + 백그라운드 갱신 ══ */
  e.respondWith(
    mmMatch(e.request).then(function(cached){
      if (cached) {
        fetch(e.request).then(function(res){
          if (res && res.status === 200) {
            caches.open(CACHE).then(function(c){ c.put(e.request, res.clone()); });
          }
        }).catch(function(){});
        return cached;
      }
      return fetch(e.request).then(function(res){
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return res;
      }).catch(function(){ return mmMatch('./index.html'); });
    })
  );
});

self.addEventListener('message', function(e){
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data && e.data.type === 'GET_VERSION' && e.ports[0]) {
    e.ports[0].postMessage({ version: CACHE });
  }
});

console.log('[SW] loaded:', CACHE);
