import React from 'react';
import { SectionId } from '../types';
import { Calendar, UserPlus, Dribbble, Users, ChevronRight, Sparkles, MapPin, Award, ArrowUpRight } from 'lucide-react';

interface CoreMenuGridProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const CoreMenuGrid: React.FC<CoreMenuGridProps> = ({ onNavigate, onOpenJoinForm }) => {
  const cards = [
    {
      id: 'schedule' as SectionId,
      number: '01',
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      emoji: '📅',
      title: '정모일정',
      titleEn: 'Schedule & Gym',
      subtitle: '이번 주 훈련 일정 • 체육관 위치 • 월간 캘린더',
      description: '수요일 야간 전술 훈련, 토요일 자체 매치, 일요일 초보자 클래스 및 서초/마포 체육관 오시는 길 안내.',
      badge: '이번 주 3회 진행',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      gradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
      borderColor: 'group-hover:border-orange-500/60',
      actionText: '일정 및 지도 보기',
      action: () => onNavigate('schedule'),
    },
    {
      id: 'join' as SectionId,
      number: '02',
      icon: <UserPlus className="w-8 h-8 text-amber-400" />,
      emoji: '✍️',
      title: '참가신청서',
      titleEn: 'Join Us Form',
      subtitle: '신입 부원 모집 • 가입 안내 • 온라인 신청 폼',
      description: '입문자부터 경력자까지! 간단한 내 농구 경험 입력 후 바로 제출할 수 있는 1분 가입 신청서.',
      badge: '모집 진행 중',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'group-hover:border-amber-400/60',
      actionText: '신청서 작성하기',
      action: onOpenJoinForm,
    },
    {
      id: 'about' as SectionId,
      number: '03',
      icon: <Dribbble className="w-8 h-8 text-orange-400" />,
      emoji: '🏀',
      title: '한늬소개',
      titleEn: 'About Us',
      subtitle: '팀 정체성 • 포용적 문화 • 클럽 히스토리',
      description: '"한늬"의 의미, 다양성을 존중하는 매너 코트 수칙, 2021년 창단부터 리그 우승까지의 스토리.',
      badge: '2021 창단',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      gradient: 'from-orange-600/20 via-slate-800/10 to-transparent',
      borderColor: 'group-hover:border-orange-400/60',
      actionText: '팀 스토리 읽기',
      action: () => onNavigate('about'),
    },
    {
      id: 'roster' as SectionId,
      number: '04',
      icon: <Users className="w-8 h-8 text-amber-500" />,
      emoji: '🏃‍♀️',
      title: '팀원소개',
      titleEn: 'Roster & Stats',
      subtitle: '운영진/코치진 • 선수 프로필 • 포지션 스탯',
      description: '주장, 코치진, 각 포지션별(가드, 포워드, 센터) 한늬 선수단의 스탯, 특기 기술, 한마디 소개.',
      badge: '45명 Roster',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      gradient: 'from-amber-600/20 via-slate-800/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/60',
      actionText: '선수 명단 보기',
      action: () => onNavigate('roster'),
    },
  ];

  return (
    <section id="core-menu" className="py-16 bg-slate-900/90 relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Core Navigation • 주요 안내
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            한늬 공식 클럽 <span className="text-orange-500">4대 핵심 서비스</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            원하시는 메뉴를 클릭하여 훈련 일정, 가입 신청, 클럽 소개, 선수 프로필을 바로 확인해 보세요.
          </p>
        </div>

        {/* 4 Main Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={card.action}
              className={`group relative bg-slate-950 rounded-2xl p-6 border border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-950/50 cursor-pointer flex flex-col justify-between overflow-hidden ${card.borderColor}`}
            >
              {/* Background Accent Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Card Top Row: Emoji Icon + Number */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300 shadow-inner">
                    <span className="text-2xl">{card.emoji}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-orange-400 transition-colors">
                    {card.number}
                  </span>
                </div>

                {/* Badge */}
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs font-bold text-slate-400">{card.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {card.description}
                </p>
              </div>

              {/* Card Bottom CTA Link */}
              <div className="relative z-10 pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-amber-300 transition-colors">
                <span>{card.actionText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
