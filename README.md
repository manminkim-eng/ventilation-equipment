# 환기설비 — 기계환기설비 환기량 산정 시스템

**MANMIN-Ver5.0** | 건축물의 설비기준 등에 관한 규칙 제11조 · 별표 1의6 · 기계설비 기술기준 별표 3

사용자 매뉴얼: https://manminkim-eng.github.io/ventilation-equipment/manual/ (탭 막대 「📘 매뉴얼」)

| 버전 | 날짜 | 내용 |
|---|---|---|
| v5.0.11 | 2026-10-13 | 사용자 매뉴얼(manual/ · PDF 30쪽) · 탭 막대 매뉴얼 버튼(좁은 화면은 한 줄 · 좌우 밀기) · A4 최종 행 배경색 |
| v5.0.10 | 2026-10-13 | 설비규칙 제11조 · 별표 1의6 · 기술기준 별표 3 원문 반영(공동주택 0.5회/h · 인원 25 · 29 · 36 · 주차장 27 ㎥/㎡·h) · 기준 = Max(체적 · 법정) · 다중 구역 인원 · 여유율 · 명칭 변경 |

## GitHub Pages 배포

1. 이 저장소를 GitHub에 업로드
2. **Settings → Pages → Source: main / (root)**
3. `https://<username>.github.io/<repo>/` 접속

## PWA 설치 (바로가기 이름: **환기설비**)

| 환경 | 방법 |
|---|---|
| **Android Chrome** | 헤더 📲 설치 버튼 또는 주소창 오른쪽 설치 아이콘 |
| **iOS Safari** | 헤더 📲 설치 버튼 탭 → 안내 팝업 따라 홈 화면에 추가 |
| **PC Chrome/Edge** | 헤더 📲 설치 버튼 또는 주소창 오른쪽 설치 아이콘 |

## 파일 구조

```
hwangi_pwa/
├── index.html              ← 메인 앱
├── manifest.json           ← PWA 매니페스트 (이름: 환기설비)
├── sw.js                   ← Service Worker (오프라인 지원)
├── README.md
└── icons/
    ├── brand-icon.jpg      ← 헤더 로고 (60×60)
    ├── og-image.jpg        ← OG 이미지 (1200×630)
    ├── favicon-16.png
    ├── favicon-32.png
    ├── apple-touch-icon.png ← iOS 홈화면 (180×180)
    ├── icon-72.png ~ icon-512.png
```
