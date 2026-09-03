import React, { useState, useEffect } from 'react';
import { ScheduleEvent } from '../types';
import { Flame, Calendar, MapPin, ArrowUpRight } from 'lucide-react';

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
    <div className="notice-stripe bg-red-600 text-white border-b border-red-400/40 text-xs py-2 px-4 relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left marquee / announcement */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
          <span className="inline-flex items-center gap-1 bg-black text-white font-black px-2.5 py-1 text-[10px] tracking-widest">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            공지
          </span>
          <span className="text-white font-black tracking-wide">
            2026 하반기 신입 부원 & 게스트 정기 모집 중 — 초보자 환영
          </span>
          <span className="text-red-200 hidden sm:inline">/</span>
          <span className="text-red-100 hidden sm:inline-flex items-center gap-1 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {nextSchedule
              ? `다음 일정 · ${nextSchedule.dayOfWeek} ${nextSchedule.time}`
              : '예정된 일정이 없습니다'}
          </span>
        </div>

        {/* Right countdown timer & CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {timeLeft && <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-red-100">
            <span>다음 정모까지</span>
            <span className="bg-black text-white font-mono font-bold px-1.5 py-0.5 border border-black">
              {timeLeft.days}d
            </span>
            <span>:</span>
            <span className="bg-black text-white font-mono font-bold px-1.5 py-0.5 border border-black">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-black text-white font-mono font-bold px-1.5 py-0.5 border border-black">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
          </div>}

          <button
            onClick={onRsvpClick}
            disabled={!nextSchedule?.rsvpUrl}
            className="text-[10px] bg-black/30 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-2.5 py-1.5 transition-colors border border-white/30 flex items-center gap-1 tracking-wide"
          >
            <MapPin className="w-3 h-3 text-white" />
            {nextSchedule?.rsvpUrl
              ? '다음 일정 참석'
              : nextSchedule
                ? '신청 링크 준비 중'
                : '일정 없음'}
          </button>

          <button
            onClick={onJoinClick}
            className="text-[10px] bg-white hover:bg-black text-black hover:text-white font-black px-3 py-1.5 transition-all flex items-center gap-1 tracking-wide"
          >
            JOIN US
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
