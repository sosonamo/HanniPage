import React from 'react';
import { ClubTimelineItem } from '../types';
import { Dribbble, Heart, Shield, Sparkles, History, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  timeline: ClubTimelineItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ timeline }) => {
  return (
    <section id="about" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-white border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Dribbble className="w-3.5 h-3.5 text-orange-400" />
            한늬소개 (About Us)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            코트 위에서 하나되는 <span className="text-white"> 한늬</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            '한늬'는 '끝까지 무언가를 꾸준히 그리고 열심히 함' 을 의미하는 순우리말 표현입니다. 
            농구를 좋아하는 사람들이 모여 원팀이 되는 곳입니다.
          </p>
        </div>

        {/* 3 Core Identity Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">포용적 팀 문화 (Inclusive)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              서로를 칭찬하고 북돋우는 따뜻한 분위기를 지향합니다. 나이, 직업을 넘어 농구로 소통합니다.
            </p>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">함께하는 성장 (Growth)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              팀원 서로가 가르쳐주고 배우며 함께 성장합니다.
            </p>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">안전 & 클린 코트 (Respect)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              부상 예방을 최우선으로 하며, 거친 비매너 행위를 엄격히 차단하여 누구나 안심하고 뛸 수 있는 환경을 만듭니다.
            </p>
          </div>
        </div>

        {/* Left Column: Membership Guide & Fees Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">신입 부원 혜택 & 안내</h3>
                <p className="text-xs text-slate-400">한늬 가입 프로세스 및 회비 투명 운영</p>
              </div>
            </div>

            {/* Recruitment Eligibility */}
            <div className="space-y-3 text-xs text-slate-300">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-orange-400" /> 모집 대상
              </h4>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-300">
                <li>농구를 좋아하는 모든 성인 여성</li>
                <li>매너 있는 코트 에티켓과 상호 존중 마인드를 가지신 분</li>
              </ul>
            </div>

            {/* Membership Fee Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                <Dribbble className="w-4 h-4 text-orange-400" /> 회비 및 지원 내역
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">입단비 (최초 1회)</span>
                  <span className="text-lg font-bold text-white font-mono">30,000원</span>
                  <p className="text-[10px] text-slate-500 mt-1"></p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">월 회비</span>
                  <span className="text-lg font-bold text-white font-mono">30,000원</span>
                  <p className="text-[10px] text-slate-500 mt-1">체육관 대관료 & 행사 지원</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <History className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-black text-white">한늬 발자국</h3>
          </div>

          <div className="relative border-l-2 border-orange-500/30 pl-6 sm:pl-8 space-y-8 ml-2">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-slate-950 group-hover:scale-125 transition-transform" />
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white">{item.year}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
