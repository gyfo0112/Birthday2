# 🎂 Birthday2 — 윤서 생일 축하 페이지

친구 **윤서**(생일 11월 12일)에게 링크로 보내는 모바일 우선 인터랙티브 생일 페이지.
핑크 파스텔 + 두꺼운 외곽선의 **스티커 팝아트** 스타일.

## 화면 흐름
1. **로딩** — 통통 튀는 마스코트 → 탭해서 시작 (여기서 오디오 잠금 해제)
2. **선물상자** — 흔들리는 상자를 탭하면 펑! 하고 열림
3. **D-day** — 생일 전 카운트다운 / 당일 D-DAY 폭죽 / 지난 뒤 D+N
4. **케이크 꾸미기** — 토핑을 탭해 올리고 → 촛불 켜기 → 탭·마이크(후~)로 끄기
5. **편지** — 봉투를 열면 타이핑 효과로 편지가 써짐
6. **엔딩** — HAPPY BIRTHDAY 모션 + 불꽃놀이

## 수정하는 곳
모든 문구·날짜는 `src/config.js` 한 곳에서 바꾼다 (이름, 생일, 편지 내용, 촛불 개수 등).

## 미리보기 팁
## 생일 잠금
생일(`src/config.js`의 `birthday`) **0시 전**에는 잠금 화면(자물쇠 + 카운트다운)만 보이고, 0시가 되면 자물쇠가 풀리며 열린다. 폰 시계 기준이다.

## 날짜별 미리보기
주소 뒤에 `?now=날짜&key=yunseo-preview` 를 붙이면 그 날짜로 볼 수 있다. **key가 없으면 무시**된다.
- 생일 전(잠금): `?now=2026-11-09&key=yunseo-preview`
- 0시 직전(자물쇠 풀리는 연출): `?now=2026-11-11T23:59:46&key=yunseo-preview`
- 당일: `?now=2026-11-12&key=yunseo-preview`
- 지난 뒤: `?now=2026-11-20&key=yunseo-preview`

## 개발
```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 빌드
```

## 기술
React + Vite, GSAP(장면 전환·모션), canvas-confetti, WebAudio 효과음(외부 파일 없음), `public/song.mp3` BGM.
`main` 브랜치에 push 하면 GitHub Pages로 자동 배포 (`.github/workflows/deploy.yml`).
