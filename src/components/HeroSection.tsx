import React from 'react';
import { SectionId } from '../types';
import { Dribbble, ArrowRight, Sparkles, Users, Award, ShieldCheck, PlayCircle, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenJoinForm }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden pt-6 pb-16 lg:py-20 border-b border-slate-800">
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      
      {/* Basketball Accent Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            {/*<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <Dribbble className="w-4 h-4 text-orange-500" />
              <span>신입 부원 모집 중</span>
            </div>*/}

            {/* Main Title & Slogan */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                함께 달리고 성장하는 즐거움 <br />
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                  여자농구동호회 한늬
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                농구를 사랑하는 여성들이 모여 땀 흘리고 서로를 응원하는 코트!
                함께 성장하는 따뜻하고 열정적인 한늬(HANNI)에서 함께하세요.
              </p>
            </div>

            {/* Feature Highlights Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>초보자 맞춤 멘토링</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>인천·부천 실내체육관</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>토요일 or 일요일 정기 훈련</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={() => onNavigate('schedule')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📅 이번 주 정모 일정 보기</span>
              </button>

              <button
                onClick={onOpenJoinForm}
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-xl shadow-orange-950/60 hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-orange-400/30 cursor-pointer"
              >
                <span>✍️ 정모 참가신청서 작성</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
