import React, { useState } from 'react';
import { ScheduleEvent } from '../types';
import { Calendar, MapPin, Clock, Users, Car, CheckCircle2, Navigation, Copy, Sparkles, ChevronRight, Share2 } from 'lucide-react';

interface ScheduleSectionProps {
  schedules: ScheduleEvent[];
  onRsvpClick: (schedule: ScheduleEvent) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules, onRsvpClick }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredSchedules = selectedType === 'all'
    ? schedules
    : schedules.filter(s => s.type === selectedType);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <section id="schedule" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              1. 정모일정 & 체육관 안내
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              이번 주 <span className="text-orange-500">정기 훈련 & 매치</span> 일정
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              체육관 위치, 주차 정보, 정모 참석(RSVP) 현황을 한눈에 확인하세요.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 일정
            </button>
            <button
              onClick={() => setSelectedType('tactics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'tactics'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전술 & 기본기
            </button>
            <button
              onClick={() => setSelectedType('scrimmage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'scrimmage'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5:5 매치
            </button>
            <button
              onClick={() => setSelectedType('beginner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'beginner'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              초보자 클래스
            </button>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredSchedules.map((item) => {
            const isFull = item.currentRsvp >= item.maxCapacity;
            return (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Top Badge & Time */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      {item.dayOfWeek}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.time}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Location & Details */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-100">{item.location}</p>
                        <p className="text-slate-400 text-[11px]">{item.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>🏀 코트: {item.courtDetails}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Car className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.parkingInfo}</span>
                    </div>
                  </div>

                  {/* Capacity Progress */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-orange-400" />
                        참석 확정 현황
                      </span>
                      <span className="font-bold text-slate-200">
                        {item.currentRsvp} / {item.maxCapacity}명
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? 'bg-rose-500'
                            : 'bg-gradient-to-r from-orange-500 to-amber-400'
                        }`}
                        style={{
                          width: `${Math.min((item.currentRsvp / item.maxCapacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleCopyAddress(item.address)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs font-semibold flex items-center gap-1"
                    title="주소 복사"
                  >
                    {copiedAddress === item.address ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedAddress === item.address ? '복사됨' : '주소복사'}</span>
                  </button>

                  <button
                    onClick={() => onRsvpClick(item)}
                    disabled={isFull}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md shadow-orange-950/50'
                    }`}
                  >
                    <span>{isFull ? '마감됨' : '참석 / 게스트 RSVP 신청'}</span>
                    {!isFull && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gym Location Interactive Card Box */}
        <div className="mt-12 bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold">
              <Navigation className="w-3.5 h-3.5" />
              체육관 오시는 길 Guide
            </div>
            <h3 className="text-2xl font-bold text-white">
              쾌적한 최고급 실내 파켓 코트에서 진행합니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              한늬는 부상 예방을 위해 최신 마루 바닥 파켓 시설과 샤워실, 냉난방 장비가 완비된 서초구 국민체육센터, 마포구민체육센터, 성동구민체육센터를 주로 대관합니다.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-orange-400 font-bold block mb-1">서초 국민체육센터</span>
                <span className="text-slate-400">교대역/남부터미널역 도보 8분</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">마포구민 체육센터</span>
                <span className="text-slate-400">마포구청역 1번 출구 버스 환승</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700">
              {/* Map Illustration Placeholder */}
              <img
                src="https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=800"
                alt="체육관 실내 전경"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[11px]">
                    서초 체육관
                  </span>
                  <span className="text-xs text-slate-200 font-bold">
                    서울 서초구 사임당로 143
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">카카오맵 / 네이버 지도에서 검색 가능</span>
              <a
                href="https://map.naver.com"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:underline font-bold flex items-center gap-1"
              >
                네이버 지도 바로가기 <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
