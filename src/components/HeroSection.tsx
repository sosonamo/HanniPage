import React from 'react';
import { SectionId } from '../types';
import { ArrowRight, Flame, MapPin, ShieldCheck } from 'lucide-react';
import hanniLogo from '../../assets/한늬로고_최종_White.png';
import characterNo3 from '../../assets/character_No3_final.png';
import characterNo6 from '../../assets/character_No6_final.png';
import characterNo7 from '../../assets/character_No7_final.png';
import characterNo11 from '../../assets/character_No11_final.png';

interface HeroSectionProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenJoinForm }) => {
  return (
    <section className="hero-shell relative overflow-hidden border-b border-slate-800 text-white">
      <div className="hero-court" aria-hidden="true" />
      <div className="hero-slash hero-slash-one" aria-hidden="true" />
      <div className="hero-slash hero-slash-two" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[580px] lg:min-h-[650px]">
          
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 border-l-2 border-red-500 pl-3 text-[10px] sm:text-xs font-black tracking-[0.24em] text-slate-300 uppercase">
              <Flame className="w-4 h-4 text-red-500" />
              Since 2008 · Women's Basketball Club
            </div>

            <div className="space-y-4">
              <h1 className="hero-title headline-font text-[3.8rem] sm:text-[5.5rem] lg:text-[7.2rem] tracking-[-0.035em] leading-[0.78] text-white">
                WE BLAZE
                <span className="block text-red-500">TOGETHER.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 break-keep">
                농구를 사랑하는 여성들이 함께 달리고, 부딪히고, 성장하는 코트.
                열정으로 하나 되는 <strong className="text-white">한늬 더 블레이저스</strong>에서 당신의 플레이를 시작하세요.
              </p>
            </div>

            {/* Feature Highlights Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-1 text-[11px] sm:text-xs text-slate-300 font-bold tracking-wide">
              <div className="flex items-center gap-2 border-l border-red-500 pl-3">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>초보자 환영</span>
              </div>
              <div className="flex items-center gap-2 border-l border-red-500 pl-3">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>인천·부천 실내체육관</span>
              </div>
              <div className="flex items-center gap-2 border-l border-red-500 pl-3">
                <Flame className="w-4 h-4 text-red-400" />
                <span>주말 정기 훈련</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={() => onNavigate('schedule')}
                className="btn-secondary w-full sm:w-auto px-7 py-4 font-black text-xs tracking-[0.08em] text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW SCHEDULE</span>
              </button>

              <button
                onClick={onOpenJoinForm}
                className="btn-primary w-full sm:w-auto px-7 py-4 font-black text-xs tracking-[0.08em] text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>JOIN THE TEAM</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[410px] sm:h-[520px] lg:h-[620px]" aria-label="한늬 선수 캐릭터">
            <div className="hero-logo-halo" aria-hidden="true">
              <img src={hanniLogo} alt="" className="h-full w-full object-contain opacity-[0.14] grayscale" />
            </div>
            <div className="absolute inset-x-2 bottom-6 h-[68%] border border-white/10 bg-black/25 backdrop-blur-[1px] hero-player-frame" />
            <img src={characterNo11} alt="한늬 11번 선수 캐릭터" className="hero-character hero-character-11" />
            <img src={characterNo3} alt="한늬 3번 선수 캐릭터" className="hero-character hero-character-3" />
            <img src={characterNo6} alt="한늬 6번 선수 캐릭터" className="hero-character hero-character-6" />
            <img src={characterNo7} alt="한늬 7번 선수 캐릭터" className="hero-character hero-character-7" />
            <div className="absolute right-2 top-4 border-r border-red-500 pr-3 text-right">
              <span className="headline-font block text-4xl text-white">ONE TEAM.</span>
              <span className="text-[9px] font-black tracking-[0.28em] text-red-400">PASSION · GROWTH · VICTORY</span>
            </div>
            <div className="absolute bottom-0 left-2 right-2 flex items-center gap-3 text-[9px] font-black tracking-[0.24em] text-slate-500">
              <span>HANNI THE BLAZERS</span>
              <span className="h-px flex-1 bg-gradient-to-r from-red-500 to-transparent" />
              <span>08 — 26</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
