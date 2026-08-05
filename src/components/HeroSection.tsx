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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <Dribbble className="w-4 h-4 text-orange-500" />
              <span>2026 하반기 신입 부원 모집 중</span>
              <span className="bg-orange-500/20 text-orange-300 text-[11px] px-2 py-0.5 rounded-md font-bold">
                D-7
              </span>
            </div>

            {/* Main Title & Slogan */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                함께 달리고 성장하는 즐거움, <br />
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                  여성 농구 클럽 한늬
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                농구를 사랑하는 여성들이 모여 땀 흘리고 서로를 응원하는 코트!
                기초 슈팅부터 실전 5:5 하프코트·풀코트 경기까지, 
                따뜻하고 열정적인 농구 커뮤니티 한늬(Han-nui)에서 함께하세요.
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
                <span>서초·마포·성동 우수 파켓 코트</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>주 수/토/일 정기 훈련</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={onOpenJoinForm}
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-xl shadow-orange-950/60 hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-orange-400/30 cursor-pointer"
              >
                <span>✍️ 신입 부원 참가신청서 작성</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('schedule')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📅 이번 주 정모 일정 보기</span>
              </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  45<span className="text-orange-500">+</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">활동 회원수</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  2021<span className="text-amber-400">년</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">클럽 창단</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  100<span className="text-orange-500">%</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">포용적 매너 응원</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hero Banner Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-orange-500/30 bg-slate-900 shadow-2xl shadow-orange-950/40 group">
              {/* Hero Image */}
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1000"
                alt="여성 농구 클럽 한늬 훈련 현장"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Live Game Card */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-100">다음 정모: 수요일 야간 훈련</span>
                </div>
                <span className="text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  서초체육관
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-orange-600 text-white font-extrabold text-xs">
                    HAN-NUI
                  </span>
                  <span className="text-slate-300 text-xs font-semibold">
                    "코트 위에서 하나되는 우리의 큰 물결"
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  실내 파켓 코트에서 펼쳐지는 열정적인 연습 매치와 1:1 맞춤 폼 교정 세션.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                      alt="Player Avatar"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100"
                      alt="Player Avatar"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=100"
                      alt="Player Avatar"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center">
                      +42
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> 리그 우승 팀
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
