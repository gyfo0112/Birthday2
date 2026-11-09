// 이름·날짜·문구는 여기서만 수정하면 돼
export const config = {
  name: '윤서',
  birthday: { year: 2026, month: 11, day: 12 }, // 이 날 0시에 잠금이 풀림
  marquee: 'HAPPY BIRTHDAY YUNSEO',

  // 로딩 화면 마스코트: public/ 폴더에 넣은 이미지 파일명. null이면 코드로 그린 기본 토끼
  mascotImage: 'mascot.png', // 핑크빛 흰 몸 버전을 쓰려면 'mascot-pink.png'
  mascotHalo: true, // 마스코트 뒤에 흰 원 스티커
  loaderTitle: '윤서에게 도착한\n선물 준비 중…',
  permTitle: '선물을 열기 전에',
  permChips: ['🎤 촛불 후~ 불기', '📱 폰 흔들어 폭죽'],
  permAllow: '허용하고 시작',
  permSkip: '허용 없이 시작',
  permBusy: '준비 중…',
  permNotice: '마이크와 모션을 허용하면 촛불을 후~ 불고, 폰을 흔들어 폭죽을 터뜨릴 수 있어요. 허용하지 않아도 끝까지 즐길 수 있어요!',

  lockTitle: '아직 열 수 없어요',
  lockOpensAt: (m, d) => `${m}월 ${d}일 0시에 열려요`,
  lockHint: '0시에 이 화면을 열어두면 자동으로 열려요',
  lockTeasers: ['아직이야~ 조금만 기다려!', '0시가 되면 열려요', '두근두근, 거의 다 왔어!', '쉿, 서프라이즈는 생일에!'],
  unlockTitle: '자물쇠가 풀렸어요!',
  unlockSub: (name) => `${name}야, 생일 축하해!`,
  unlockButton: '열어보기',

  giftHint: '선물상자를 탭해서 열어봐!',
  giftTitle: '윤서야,\n생일 축하해!',
  giftSub: '너를 위해 준비했어',

  candleCount: 3,
  decorateHint: '토핑을 탭해서 케이크를 꾸며줘!',
  decorateDone: '다 꾸몄어!',
  lightingText: '촛불 켜는 중…',
  blowHint: '소원을 빌고 촛불을 꺼봐!',
  micButton: '🎤 후~ 불어서 끄기',
  micCalibrating: '🎤 주변 소리를 듣는 중…',
  micListening: '🎤 후~ 하고 불어봐!',
  micFail: '마이크를 쓸 수 없어서 촛불을 직접 탭해서 꺼줘!',
  blowAllButton: '한 번에 끄기',
  wishText: '소원 빌었지? 🌟',
  wishHint: '눈을 감고\n소원을 빌어봐…',
  wishDone: '소원 다 빌었어!',

  letter: {
    title: '윤서에게 💌',
    lines: [
      '윤서야, 오늘 생일 축하해!',
      '',
      '올해도 고생 많았고',
      '오늘만큼은 행복해!',
      '맛있는 거 먹고',
      '내년에도 화이팅해!',
    ],
    sign: '- 너의 친구가 -',
    openHint: '편지를 탭해서 열어봐 💌',
    next: '다 읽었어',
  },

  endTitle: ['HAPPY', 'BIRTHDAY'],
  endSub: '윤서야, 오늘 하루 제일 행복하길!',
  againButton: '🎆 폭죽 한 번 더',
  shakeHint: '📱 폰을 흔들어봐!',
  shakeButton: '📱 흔들기 켜기',
  saveButton: '📷 케이크 저장',
  saveBusy: '만드는 중…',
  saveDone: '저장했어!',
  saveFail: '이미지를 만들지 못했어',
  replayButton: '↺ 처음부터 다시',
}
