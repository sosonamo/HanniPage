import React, { useState, useEffect } from 'react';
import { ScheduleEvent } from '../types';
import { Flame, Calendar } from 'lucide-react';

interface NoticeBannerProps {
  nextSchedule?: ScheduleEvent;
  onRsvpClick: () => void;
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

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ nextSchedule, onRsvpClick }) => {
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
      <div className="max-w-7xl mx-auto grid grid-cols-[minmax(0,max-content)_max-content] md:flex md:flex-row items-center md:justify-between gap-2">
        {/* Left marquee / announcement */}
        <div className="col-start-1 row-start-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto md:min-w-0">
          <span className="inline-flex items-center gap-1 bg-black text-white font-black px-2.5 py-1 text-[10px] tracking-widest">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            공지
          </span>
          <span className="text-white font-black tracking-wide">
            신입 팀원 & 게스트 모집중 * 초보자 환영 *
          </span>
          <span className="text-white hidden sm:inline">/</span>
          <span className="text-white hidden sm:inline-flex items-center gap-1 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {nextSchedule
              ? `다음 일정 · ${nextSchedule.dayOfWeek} ${nextSchedule.time}`
              : '예정된 일정이 없습니다'}
          </span>
        </div>

        {/* Right countdown timer & CTA */}
        <div className="contents md:flex md:items-center md:gap-2 lg:gap-3 md:shrink-0">
          {timeLeft && <div className="col-start-1 row-start-2 justify-self-end flex items-center gap-1 lg:gap-1.5 whitespace-nowrap text-[10px] font-bold text-white">
            <span>다음 정모까지</span>
            <span className="bg-black text-white font-mono font-bold px-1 lg:px-1.5 py-0.5 border border-black">
              {timeLeft.days}d
            </span>
            <span>:</span>
            <span className="bg-black text-white font-mono font-bold px-1 lg:px-1.5 py-0.5 border border-black">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-black text-white font-mono font-bold px-1 lg:px-1.5 py-0.5 border border-black">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
          </div>}

          <button
            onClick={onRsvpClick}
            disabled={!nextSchedule?.rsvpUrl}
            className="col-start-2 row-start-2 shrink-0 whitespace-nowrap text-[10px] bg-black/30 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-2.5 py-1.5 transition-colors border border-white/30 flex items-center gap-1 tracking-wide"
          >
            {nextSchedule?.rsvpUrl
              ? '정모 참석'
              : nextSchedule
                ? '신청 링크 준비 중'
                : '일정 없음'}
          </button>

        </div>
      </div>
    </div>
  );
};
