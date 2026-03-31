# 환기설비 — 기계환기 법정 환기량 산정 시스템

**MANMIN-Ver2.0** | 기계설비법 시행규칙 · 별표 3

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
