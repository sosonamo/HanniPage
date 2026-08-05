export type SectionId = 'hero' | 'schedule' | 'join' | 'about' | 'roster' | 'faq';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'regular' | 'tactics' | 'scrimmage' | 'beginner';
  date: string;
  dayOfWeek: string;
  time: string;
  location: string;
  address: string;
  courtDetails: string;
  parkingInfo: string;
  mapUrl?: string;
  maxCapacity: number;
  currentRsvp: number;
  description: string;
  coach: string;
}

export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'Coach' | 'Staff';

export interface RosterMember {
  id: string;
  number: number;
  name: string;
  nickname?: string;
  role: '운영진' | '코치진' | '주장' | '선수';
  position: PlayerPosition;
  positionFull: string;
  heightCm?: number;
  experienceYears: number;
  favoriteMove: string;
  quote: string;
  image: string;
  stats: {
    shooting: number;
    passing: number;
    defense: number;
    speed: number;
    stamina: number;
  };
  intro: string;
}

export interface ClubTimelineItem {
  year: string;
  title: string;
  description: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: '훈련' | '대회' | '소모임' | '단체사진';
  date: string;
  imageUrl: string;
  caption: string;
}

export interface JoinFormData {
  name: string;
  ageGroup: string;
  phone: string;
  email: string;
  location: string;
  experienceLevel: '입문 (농구 공을 처음 잡음)' | '초급 (기본 슛/드블 가능)' | '중급 (동호회/동아리 경험)' | '상급 (대회 출전 경험)';
  preferredPosition: PlayerPosition;
  heightCm: string;
  motivation: string;
  availableDays: string[];
  agreedTerms: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: '가입안내' | '훈련/장소' | '준비물' | '회비';
}
