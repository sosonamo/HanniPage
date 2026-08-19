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
    name: '이민경',
    nickname: '코트의 지휘자',
    role: '주장',
    position: 'PG',
    positionFull: 'Point Guard (포인트 가드)',
    heightCm: 165,
    experienceYears: 5,
    favoriteMove: '헤지테이션 크로스오버 & 패스',
    quote: '즐겁게 달리는 농구, 함께할 때 가장 빛납니다!',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 85, passing: 95, defense: 80, speed: 90, stamina: 88 },
    intro: '한늬를 이끄는 온화하고 똑부러지는 캡틴. 경기 흐름을 읽는 패스 센스와 팀원들을 북돋우는 강한 리더십을 보유하고 있습니다.'
  },
  {
    id: 'm-2',
    number: 11,
    name: '김지현',
    nickname: '지코치',
    role: '코치진',
    position: 'Coach',
    positionFull: 'Head Coach (헤드 코치)',
    heightCm: 178,
    experienceYears: 12,
    favoriteMove: '미드레인지 풀업 점퍼',
    quote: '기본기가 실전을 만날 때 가장 큰 즐거움이 찾아옵니다.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 92, passing: 88, defense: 90, speed: 82, stamina: 85 },
    intro: '체육학 전공 및 생활체육 지도사. 체계적인 부상 방지 스트레칭부터 실전 전략까지 스윗하고 꼼꼼하게 지도합니다.'
  },
  {
    id: 'm-3',
    number: 23,
    name: '최수아',
    nickname: '스나이퍼 수아',
    role: '선수',
    position: 'SG',
    positionFull: 'Shooting Guard (슈팅 가드)',
    heightCm: 168,
    experienceYears: 4,
    favoriteMove: '캐치 앤 3점 슈팅',
    quote: '림을 가르는 림의 소리를 좋아해요!',
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 96, passing: 75, defense: 78, speed: 85, stamina: 82 },
    intro: '한늬 최고의 클러치 슈터! 완벽한 슈팅 폼과 매서운 3점 슈트 감각으로 경기 승부처를 지배합니다.'
  },
  {
    id: 'm-4',
    number: 35,
    name: '박서연',
    nickname: '에너자이저',
    role: '운영진',
    position: 'SF',
    positionFull: 'Small Forward (스몰 포워드)',
    heightCm: 172,
    experienceYears: 6,
    favoriteMove: '드라이브 앤 디쉬 / 리바운드 후 속공',
    quote: '멈추지 않는 수비와 코트 위 열정!',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 82, passing: 83, defense: 92, speed: 88, stamina: 96 },
    intro: '공수 양면에서 헌신하는 올라운더. 클럽 신입 적응 멘토링과 행사 기획을 총괄하는 다정한 소통왕입니다.'
  },
  {
    id: 'm-5',
    number: 14,
    name: '한정아',
    nickname: '골밑의 파수꾼',
    role: '선수',
    position: 'PF',
    positionFull: 'Power Forward (파워 포워드)',
    heightCm: 176,
    experienceYears: 3,
    favoriteMove: '포스트업 후 턴어라운드 뱅크슛',
    quote: '리바운드를 제어하는 자가 게임을 제어한다!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 78, passing: 76, defense: 94, speed: 76, stamina: 90 },
    intro: '적극적인 박스아웃과 허슬 플레이로 팀의 골밑을 든든하게 지켜주는 파워풀한 보물 포워드입니다.'
  },
  {
    id: 'm-6',
    number: 55,
    name: '장은유',
    nickname: '수호신',
    role: '선수',
    position: 'C',
    positionFull: 'Center (센터)',
    heightCm: 180,
    experienceYears: 4,
    favoriteMove: '블록슛 & 하이포스트 패스',
    quote: '우리 코트 안에서는 그 누구도 쉽게 득점할 수 없어요.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    stats: { shooting: 75, passing: 82, defense: 98, speed: 70, stamina: 86 },
    intro: '압도적인 높이와 뛰어난 BQ를 가진 림 프로텍터. 묵묵하고 든든하게 팀원들의 뒷공간을 책임집니다.'
  }
];

export const MOCK_TIMELINE: ClubTimelineItem[] = [
  {
    year: '2026년 현재',
    title: '신입 부원 모집 & 브랜드 리뉴얼',
    description: '성장하는 즐거움을 함께할 한늬즈 모집중.',
    badge: '진행중'
  },
  {
    year: '201?년 ?월',
    title: '제??회 어셉배 준우승',
    description: '선출대회에서 비선출멤버로 준우승을 해냈습니다',
    badge: '대회 입상'
  },
  {
    year: '201?년 ?월',
    title: '서울시 생활체육 여성농구 리그 3위',
    description: '.',
    badge: '대회 입상'
  },
  {
    year: '2015년 10월',
    title: '제2회 한늬배 우승',
    description: '.',
    badge: '우승'
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
    description: '농구를 열정적으로 사랑하는 6명의 초기 멤버들이 모여 주말 동호회로 첫발을 내딛었습니다.',
    badge: '창단'
  },

  
  
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '2024 리그 우승 순간의 감동',
    category: '대회',
    date: '2024.10.20',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    caption: '우승 트로피를 들고 환호하는 한늬 선수단'
  },
  {
    id: 'gal-2',
    title: '열기 넘치는 수요일 야간 전술 훈련',
    category: '훈련',
    date: '2026-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=800',
    caption: '기초 슈팅 교정과 픽앤롤 전술을 연습하는 모습'
  },
  {
    id: 'gal-3',
    title: '한늬 봄맞이 피크닉 & 단합대회',
    category: '소모임',
    date: '2026-04-12',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    caption: '코트 밖에서도 웃음꽃 피우는 우리 팀원들'
  },
  {
    id: 'gal-4',
    title: '전반기 단체 프로필 촬영',
    category: '단체사진',
    date: '2026-02-28',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    caption: '한늬 전용 오렌지/네이비 유니폼 착용 단체컷'
  }
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: '가입안내',
    question: '농구를 한 번도 안 해본 왕초보인데 가입할 수 있나요?',
    answer: '네, 적극 환영합니다! 한늬 회원 중 40% 이상이 농구를 처음 시작한 분들이었습니다. 기초 슈팅, 드리블, 규칙부터 차근차근 가르쳐 드리는 일요일 입문자 클래스 및 1:1 멘토링이 준비되어 있습니다.'
  },
  {
    id: 'faq-2',
    category: '준비물',
    question: '정모에 참석할 때 어떤 준비물이 필요한가요?',
    answer: '실내 농구화(또는 깨끗한 바닥의 운동화), 편안한 운동복(반팔/반바지), 개인 수건 및 음료를 준비해 주시면 됩니다. 팀 유니폼 및 연습용 농구공, 훈련 용품은 클럽에서 구비해 드립니다.'
  },
  {
    id: 'faq-3',
    category: '회비',
    question: '클럽 회비는 어떻게 운영되나요?',
    answer: '신입 가입 시 입단비(초기 유니폼/웰컴키트 포함) 3만원, 월 정기 회비는 4만원입니다. 회비는 체육관 대관료, 음료/프로틴 제공, 코칭 비용, 대회 참가비 지원으로 전액 투명하게 사용되며 매월 정산 내역이 공개됩니다.'
  },
  {
    id: 'faq-4',
    category: '훈련/장소',
    question: '매주 꼭 참석해야 하나요? 게스트 참여도 가능한가요?',
    answer: '학업이나 직장 생활 일정에 맞춰 자율적으로 참석하실 수 있습니다. 정기 부원 신청 전에 일일 게스트(체험 참관 1회 1만원)로 먼저 참여해 보시는 것도 언제든 환영합니다!'
  }
];
