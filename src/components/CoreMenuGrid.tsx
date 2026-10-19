import React from 'react';
import { SectionId } from '../types';
import { CalendarDays, Flame, Shield, Users } from 'lucide-react';

interface CoreMenuGridProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const CoreMenuGrid: React.FC<CoreMenuGridProps> = ({ onNavigate, onOpenJoinForm }) => {
  const cards = [
    {
      number: '01',
      eyebrow: 'Game Plan',
      title: 'SCHEDULE',
      korean: '월간 정모 일정',
      description: '이번 달 훈련과 경기 일정, 체육관 위치를 한눈에 확인하세요.',
      icon: CalendarDays,
      action: () => onNavigate('schedule'),
    },
    {
      number: '02',
      eyebrow: 'Join The Team',
      title: 'JOIN US',
      korean: '정모 참가 신청',
      description: '첫 코트부터 한 팀이 되는 순간까지, 한늬가 함께합니다.',
      icon: Flame,
      action: onOpenJoinForm,
    },
    {
      number: '03',
      eyebrow: 'Our Identity',
      title: 'ABOUT',
      korean: '한늬의 이야기',
      description: '2008년부터 이어진 열정, 포용, 성장의 팀 스토리를 만나보세요.',
      icon: Shield,
      action: () => onNavigate('about'),
    },
    {
      number: '04',
      eyebrow: 'One Team',
      title: 'ROSTER',
      korean: '한늬 선수단',
      description: '서로 다른 플레이가 모여 완성되는 한늬즈를 소개합니다.',
      icon: Users,
      action: () => onNavigate('roster'),
    },
  ];

  return (
    <section id="core-menu" className="core-menu-shell relative overflow-hidden border-b border-slate-800 py-16 sm:py-20">
      <div className="site-container">
        <div className="mb-10 flex flex-col items-center text-center sm:text-left gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Explore Hanni</p>
            <h2 className="heading-menu headline-font mt-2 text-white">
              FIND YOUR <span className="text-white">PLAY.</span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-left">
            일정 확인부터 참가 신청, 팀 스토리와 선수단까지.<br />원하는 메뉴를 선택해 바로 이동하세요.
          </p>
        </div>

        <div className="grid grid-cols-2 border-l border-t border-slate-800 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.number}
                type="button"
                onClick={card.action}
                className="menu-card group relative min-w-0 min-h-0 aspect-square sm:aspect-auto sm:min-h-[330px] overflow-hidden border-b border-r border-slate-800 p-3 text-left sm:p-7"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className="headline-font text-5xl sm:text-6xl text-white/[0.08] transition-colors group-hover:text-white/20">
                      {card.number}
                    </span>
                    <Icon className="h-6 w-6 text-red-500" strokeWidth={1.6} />
                  </div>

                  <div className="mt-auto">
                    <p className="hidden sm:block mb-2 text-[9px] font-black uppercase tracking-[0.12em] sm:tracking-[0.28em] text-white">
                      {card.eyebrow}
                    </p>
                    <h3 className="heading-menu-card headline-font text-white transition-transform duration-300 group-hover:translate-x-1">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-black text-slate-200">{card.korean}</p>
                    <p className="hidden sm:block mt-4 max-w-[16rem] text-xs leading-relaxed text-slate-500 transition-colors group-hover:text-slate-300">
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
