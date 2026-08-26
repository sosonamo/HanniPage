import React, { useState } from 'react';
import { ScheduleEvent } from '../types';
import { Calendar, MapPin, Clock, Users, Car, CheckCircle2, Navigation, Copy, ChevronRight, ExternalLink, LoaderCircle } from 'lucide-react';
import type { CalendarStatus } from '../App';

interface ScheduleSectionProps {
  schedules: ScheduleEvent[];
  calendarStatus: CalendarStatus;
  onRsvpClick: (schedule: ScheduleEvent) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules, calendarStatus, onRsvpClick }) => {
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
              정모일정 & 체육관 안내
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              이번 주 <span className="text-orange-500">정기 훈련 & 매치</span> 일정
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              체육관 위치, 주차 정보, 정모 참석(RSVP) 현황을 한눈에 확인하세요.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            {calendarStatus === 'loading' && (
              <><LoaderCircle className="w-4 h-4 animate-spin text-orange-400" /> 캘린더 동기화 중</>
            )}
            {calendarStatus === 'connected' && (
              <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Calendar 연동됨</>
            )}
            {calendarStatus === 'error' && (
              <span className="text-amber-400">캘린더 연결 실패 · 임시 일정을 표시합니다</span>
            )}
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredSchedules.map((item) => {
            const hasCapacity = item.currentRsvp !== undefined && item.maxCapacity !== undefined;
            const isFull = hasCapacity && item.currentRsvp! >= item.maxCapacity!;
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

                    {item.courtDetails && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>🏀 코트: {item.courtDetails}</span>
                      </div>
                    )}

                    {item.parkingInfo && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.parkingInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Capacity Progress */}
                  {hasCapacity && <div className="space-y-1.5 pt-2">
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
                          width: `${Math.min((item.currentRsvp! / item.maxCapacity!) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>}
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

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="Google Calendar에서 보기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

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
          {filteredSchedules.length === 0 && calendarStatus !== 'loading' && (
            <div className="lg:col-span-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-14 text-center">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="font-bold text-slate-200">이번 주 한늬 일정이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">다음 주 월요일에 새 주의 일정을 다시 확인해주세요.</p>
            </div>
          )}
        </div>

        {/* Gym Location Interactive Card Box */}
        <div className="mt-12 bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold">
              <Navigation className="w-3.5 h-3.5" />
              체육관 오시는 길
            </div>
            <h3 className="text-2xl font-bold text-white">
              부천/인천 소재의 실내체육관에서 진행합니다
            </h3>
            <div className="grid grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-orange-400 font-bold block mb-1">부천 소사</span>
                <span className="text-slate-400">서해선 소새울역 인근</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">부천 오정</span>
                <span className="text-slate-400">서해선 원종역 인근</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">인천 검암</span>
                <span className="text-slate-400">인천1호선 검암역 인근</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
