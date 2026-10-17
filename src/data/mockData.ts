import {
  galleryImages,
  characterNo3,
  characterNo6,
  characterNo7,
  characterNo9,
  characterNo10,
  characterNo11,
  characterNo13,
  characterNo33,
  characterNo17,
  characterNo22,
  characterNo37,
} from '../assets/images';
import { ScheduleEvent, RosterMember, ClubTimelineItem, GalleryItem, FaqItem } from '../types';

export const MOCK_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'sch-1',
    title: '수요일 정기 전술 & 기본기 훈련',
    type: 'tactics',
    date: '2026-08-05',
    dayOfWeek: '매주 수요일',
    time: '19:30 - 21:30 (2시간)',
    location: '서초구 국민체육센터 실내농구장 (2층)',
    address: '서울특별시 서초구 사임당로 143',
    courtDetails: '원목 정식 규격 파켓 코트 (냉난방 완비, 샤워실 이용 가능)',
    parkingInfo: '건물 지하 주차장 2시간 무료 (이후 10분당 500원)',
    maxCapacity: 20,
    currentRsvp: 16,
    description: '기초 드리블, 픽앤롤(Pick & Roll) 기본 전술 연습, 스페이싱 및 5:5 하프코트 실전 드릴',
    coach: '김지현 수석 코치'
  },
  {
    id: 'sch-2',
    title: '토요일 주말 정기 5:5 풀코트 자체전 & 게스트 매치',
    type: 'scrimmage',
    date: '2026-08-08',
    dayOfWeek: '매주 토요일',
    time: '14:00 - 17:00 (3시간)',
    location: '마포구민체육센터 종합체육관',
    address: '서울특별시 마포구 월드컵목로 11',
    courtDetails: '우수 청결 공인 경기장 (전광판 및 음향 설비 지원)',
    parkingInfo: '체육센터 지상/지하 주차장 이용 (최대 3시간 할인권 제공)',
    maxCapacity: 24,
    currentRsvp: 22,
    description: '전반기 심판 초빙 실전 매치, 팀 분할 5대5 풀코트 게임, 영상 촬영 및 스탯 피드백 제공',
    coach: '박서연 코치 & 한늬 매니저팀'
  },
  {
    id: 'sch-3',
    title: '일요일 신입 & 입문자 클래스 (초보자 전용)',
    type: 'beginner',
    date: '2026-08-09',
    dayOfWeek: '격주 일요일',
    time: '10:00 - 12:00 (2시간)',
    location: '성동구민종합체육센터 다목적 체육관',
    address: '서울특별시 성동구 장터길 18',
    courtDetails: '친환경 충격 흡수 우드 코트',
    parkingInfo: '성동구민센터 주차장 주말 무료',
    maxCapacity: 15,
    currentRsvp: 11,
    description: '농구를 처음 시작하는 분들을 위한 1:1 맞춤 피지컬 기초, 슈팅 폼 교정, 레이업 패스 원리 스터디',
    coach: '이민경 주장 & 전담 멘토진'
  }
];

export const MOCK_ROSTER: RosterMember[] = [
  {
    id: 'm-1',
    number: 7,
    name: '유지수',
    nickname: '에이스',
    role: '선수',
    position: 'SF',
    heightCm: 162,
    experienceStartYear: 2012,
    favoriteMove: '빠른 드리블 후 돌파 & 킥아웃 패스',
    image: characterNo7,
    stats: { shooting: 85, passing: 95, defense: 80, speed: 90, stamina: 88 },
    intro: '공격과 수비를 두루 소화하는 다재다능한 에이스.'
  },
  {
    id: 'm-2',
    number: 11,
    name: '조소연',
    nickname: '조라몬',
    role: '주장',
    position: 'SG',
    heightCm: 159,
    experienceStartYear: 2014,
    favoriteMove: '3점슛',
    image: characterNo11,
    stats: { shooting: 92, passing: 88, defense: 90, speed: 82, stamina: 85 },
    intro: '한늬를 이끄는 캡틴. 센스있는 수비를 하는 클러치슈터.'
  },
  {
    id: 'm-3',
    number: 6,
    name: '최유리',
    nickname: '유리',
    role: '선수',
    position: 'PF',
    heightCm: 168,
    experienceStartYear: 2021,
    favoriteMove: '미들슛 / 리바운드 / 블록슛',
    image: characterNo6,
    stats: { shooting: 96, passing: 75, defense: 78, speed: 85, stamina: 82 },
    intro: '경기의 흐름을 바꾸는 블록슛마스터.'
  },
  {
    id: 'm-4',
    number: 9,
    name: '김도예',
    nickname: '동메',
    role: '선수',
    position: 'SF',
    heightCm: 166,
    experienceStartYear: 2023,
    favoriteMove: '원드리블 점퍼 / 훅슛',
    image: characterNo9,
    stats: { shooting: 82, passing: 83, defense: 92, speed: 88, stamina: 96 },
    intro: '열정 만렙의 슈팅스타.'
  },
  {
    id: 'm-5',
    number: 10,
    name: '이수빈',
    nickname: '수빈',
    role: '선수',
    position: 'PF',
    heightCm: 170,
    experienceStartYear: 2024,
    favoriteMove: '캐치 앤 슛',
    image: characterNo10,
    stats: { shooting: 78, passing: 76, defense: 94, speed: 76, stamina: 90 },
    intro: '적극적인 박스아웃과 허슬 플레이의 보물포워드.'
  },
  {
    id: 'm-6',
    number: 3,
    name: '김지은',
    nickname: '지은',
    role: '선수',
    position: 'PG',
    heightCm: 156,
    experienceStartYear: 2024,
    favoriteMove: '돌파 & 패스',
    image: characterNo3,
    stats: { shooting: 75, passing: 82, defense: 98, speed: 70, stamina: 86 },
    intro: '넓은 시야로 경기를 조율하는 플레이메이커.'
  },
  {
    id: 'm-7',
    number: 13,
    name: '여소리',
    nickname: '소리',
    role: '선수',
    position: 'C',
    heightCm: 180,
    experienceStartYear: 2021,
    favoriteMove: '리바운드',
    image: characterNo13,
    stats: { shooting: 75, passing: 82, defense: 98, speed: 70, stamina: 86 },
    intro: '스피드와 높이를 함께 갖춘 골밑지킴이.'
  },
  {
    id: 'm-8',
    number: 33,
    name: '장혜진',
    nickname: '혜진',
    role: '선수',
    position: 'C',
    heightCm: 170,
    experienceStartYear: 2021,
    favoriteMove: '리바운드',
    image: characterNo33,
    stats: { shooting: 75, passing: 82, defense: 98, speed: 70, stamina: 86 },
    intro: '파워풀한 플레이를 하는 팀의 에너자이저'
  },
  {
    id: 'm-17',
    number: 17,
    name: '이무늬',
    nickname: '무늬',
    role: '선수',
    position: 'PF',
    image: characterNo17,
    intro: '넓은 활동범위와 농구 센스를 갖춘 올라운더.'
  },
  {
    id: 'm-22',
    number: 22,
    name: '조 이로하',
    nickname: '로하',
    role: '선수',
    position: 'SG',
    image: characterNo22,
    intro: '매 경기 무서운 성장세를 보여주는 라이징슈터.'
  },
  {
    id: 'm-37',
    number: 37,
    name: '다나카 코토네',
    nickname: '코네',
    role: '선수',
    position: 'SF',
    image: characterNo37,
    intro: '리듬감 있는 돌파와 화려한 마무리가 돋보이는 테크니션.'
  }
];

export const MOCK_TIMELINE: ClubTimelineItem[] = [
  {
    year: '2026년 현재',
    title: '신입 팀원 모집 & 브랜드 리뉴얼',
    description: '성장하는 즐거움을 함께할 한늬즈 모집중.',
    badge: '진행중'
  },
  {
    year: '2026년 9월',
    title: '제2회 새싹리그 2위',
    description: '5명으로 이뤄낸 값진 결과',
    badge: '대회입상'
  },
  {
    year: '2018년 8월',
    title: '제15회 어셉배 준우승',
    description: '선출대회에서 비선출멤버로 준우승',
    badge: '대회입상'
  },
  {
    year: '2015년 11월',
    title: '서울시 생활체육 여성농구 3위',
    description: '-',
    badge: '대회입상'
  },
  {
    year: '2015년 10월',
    title: '제2회 한늬배 우승',
    description: '-',
    badge: '대회입상'
  },

  {
    year: '2014년 10월',
    title: '제1회 한늬배 개최',
    description: '여자농구동호회 최초 자체 비선출대회 개최',
    badge: '이벤트'
  },
  {
    year: '2008년 05월',
    title: '여성 농구 클럽 "한늬" 창단',
    description: '농구를 사랑하는 여성들이 모여 주말 동호회 창단',
    badge: '창단'
  },

  
  
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '2024 리그 우승 순간의 감동',
    category: '대회',
    date: '2024.10.20',
    imageUrl: galleryImages.championship,
    caption: '우승 트로피를 들고 환호하는 한늬 선수단'
  },
  {
    id: 'gal-2',
    title: '열기 넘치는 수요일 야간 전술 훈련',
    category: '훈련',
    date: '2026-07-15',
    imageUrl: galleryImages.training,
    caption: '기초 슈팅 교정과 픽앤롤 전술을 연습하는 모습'
  },
  {
    id: 'gal-3',
    title: '한늬 봄맞이 피크닉 & 단합대회',
    category: '소모임',
    date: '2026-04-12',
    imageUrl: galleryImages.picnic,
    caption: '코트 밖에서도 웃음꽃 피우는 우리 팀원들'
  },
  {
    id: 'gal-4',
    title: '전반기 단체 프로필 촬영',
    category: '단체사진',
    date: '2026-02-28',
    imageUrl: galleryImages.teamPhoto,
    caption: '한늬 전용 오렌지/네이비 유니폼 착용 단체컷'
  }
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-11',
    category: '정모',
    question: '농구를 한 번도 안 해본 왕초보인데 참석할 수 있나요?',
    answer: '네, 적극 환영합니다! 한늬 회원 중 40% 이상이 농구를 처음 시작한 분들이었습니다. 규칙부터 드리블, 패스, 슛까지! 정모를 통해 배우실 수 있습니다.'
  },
  {
    id: 'faq-12',
    category: '정모',
    question: '정모에 참석할 때 어떤 준비물이 필요한가요?',
    answer: '실내 농구화(또는 깨끗한 바닥의 운동화), 편안한 운동복(반팔/반바지), 기타 개인용품을 준비해 주시면 됩니다. 연습용 농구공, 훈련 용품은 준비되어 있습니다.'
  },
  {
    id: 'faq-21',
    category: '회비',
    question: '팀원 회비는 어떻게 되나요?',
    answer: '월 정기 회비는 3만원 입니다. 회비는 체육관 대관료, 대회 참가비 지원, 행사 비용 지원 등으로 사용되며,모임계좌를 통해 내역을 확인하실 수 있습니다.'
  },
  {
    id: 'faq-22',
    category: '회비',
    question: '불가피하게 장기간 참석이 어려운 경우는 어떻게 되나요?',
    answer: '부상, 학업 등 불가피한 상황으로 인해 장기간 참석이 어려운 경우, 해당 기간 동안의 회비는 면제됩니다.'
  },
  {
    id: 'faq-31',
    category: '가입안내',
    question: '가입비는 어떻게 되나요?',
    answer: '가입비는 3만원 입니다. 불가피한 상황으로 탈퇴하실 경우, 재가입 시에도 가입비를 다시 납부하셔야 합니다.'
  },
  {
    id: 'faq-32',
    category: '가입안내',
    question: '팀원이 되면 매주 꼭 참석해야 하나요?',
    answer: '개인 일정에 맞춰 자율적으로 참석하실 수 있습니다. 전체 정모시간의 일부도 참석 가능합니다.'
  }
];
