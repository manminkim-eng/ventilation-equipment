# 환기설비 — 기계환기 법정 환기량 산정 시스템
> MANMIN-Ver2.0 | 기계설비법 시행규칙 별표3 기준

## 📁 파일 구성
```
index.html              ← 메인 앱 (단일 파일, 모든 기능 포함)
manifest.json           ← PWA 매니페스트 (앱명: 환기설비)
sw.js                   ← 서비스 워커 (오프라인 캐시)
.nojekyll               ← GitHub Pages 필수
icons/
  icon-72~512.jpg       ← Android / PWA 아이콘
  apple-touch-icon.jpg  ← iOS 홈화면 아이콘
```

## GitHub Pages 배포
1. 이 폴더 전체를 GitHub 저장소 루트에 push
2. Settings → Pages → Source: main 브랜치 루트
3. `https://[username].github.io/[repo]/` 접속

## PWA 설치
- **Android Chrome** : 설치 버튼(📲) 또는 브라우저 메뉴 → 홈 화면에 추가
- **iPhone/iPad** : Safari → 공유(□↑) → 홈 화면에 추가
