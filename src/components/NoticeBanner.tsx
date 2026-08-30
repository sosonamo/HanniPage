import React, { useState, useEffect } from 'react';
import { ScheduleEvent } from '../types';
import { Bell, Flame, Calendar, MapPin, ChevronRight, Sparkles } from 'lucide-react';

interface NoticeBannerProps {
  nextSchedule?: ScheduleEvent;
  onRsvpClick: () => void;
  onJoinClick: () => void;
}

const getTimeLeft = (startDateTime?: string) => {
  if (!startDateTime || !startDateTime.includes('T')) return null;

  const difference = new Date(startDateTime).getTime() - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
  };
};

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ nextSchedule, onRsvpClick, onJoinClick }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(nextSchedule?.startDateTime));

  useEffect(() => {
    setTimeLeft(getTimeLeft(nextSchedule?.startDateTime));
    const timer = setInterval(
      () => setTimeLeft(getTimeLeft(nextSchedule?.startDateTime)),
      60_000,
    );
    return () => clearInterval(timer);
  }, [nextSchedule?.startDateTime]);

  return (
    <div className="bg-slate-950 text-slate-100 border-b border-orange-500/20 text-xs sm:text-sm py-2 px-4 relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left marquee / announcement */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
          <span className="inline-flex items-center gap-1 bg-orange-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm shadow-orange-900/50">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            공지
          </span>
          <span className="text-slate-300 font-medium">
            🔥 2026 하반기 신입 부원 & 게스트 정기 모집 중! (초보자 환영)
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-orange-400 hidden sm:inline-flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {nextSchedule
              ? `다음 일정 · ${nextSchedule.dayOfWeek} ${nextSchedule.time}`
              : '예정된 일정이 없습니다'}
          </span>
        </div>

        {/* Right countdown timer & CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {timeLeft && <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
            <span>다음 정모까지</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {timeLeft.days}d
            </span>
            <span>:</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
          </div>}

          <button
            onClick={onRsvpClick}
            disabled={!nextSchedule?.rsvpUrl}
            className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-medium px-2.5 py-1 rounded transition-colors border border-slate-700 flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-orange-400" />
            {nextSchedule?.rsvpUrl
              ? '다음 일정 참석'
              : nextSchedule
                ? '신청 링크 준비 중'
                : '일정 없음'}
          </button>

          <button
            onClick={onJoinClick}
            className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-3 py-1 rounded transition-all shadow-sm flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            신청하기
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
