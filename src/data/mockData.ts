import { ScheduleEvent } from '../types';

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

export { roster as MOCK_ROSTER, gallery as MOCK_GALLERY } from './sectionContent';

export { timeline as MOCK_TIMELINE, faqs as MOCK_FAQS } from './clubContent';
