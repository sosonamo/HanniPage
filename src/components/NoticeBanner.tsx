import React, { useState, useEffect } from 'react';
import { Bell, Flame, Calendar, MapPin, ChevronRight, Sparkles } from 'lucide-react';

interface NoticeBannerProps {
  onRsvpClick: () => void;
  onJoinClick: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ onRsvpClick, onJoinClick }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 25, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
            <Calendar className="w-3.5 h-3.5" /> 이번 주 수요일 정모 D-3
          </span>
        </div>

        {/* Right countdown timer & CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
            <span>다음 정모까지</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-800 text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <button
            onClick={onRsvpClick}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-2.5 py-1 rounded transition-colors border border-slate-700 flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-orange-400" />
            서초체육관 참석
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
