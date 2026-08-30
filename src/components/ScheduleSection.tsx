import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Navigation, LoaderCircle, MapPin } from 'lucide-react';
import { ScheduleEvent } from '../types';
import type { CalendarStatus } from '../App';

interface ScheduleSectionProps {
  schedules: ScheduleEvent[];
  calendarStatus: CalendarStatus;
}

type MonthOffset = 0 | 1;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_OPTIONS: Array<{ label: string; offset: MonthOffset }> = [
  { label: '이번 달', offset: 0 },
  { label: '다음 달', offset: 1 },
];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createMonthCells = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const firstCell = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => (
    new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + index)
  ));
};

const getStartTime = (time: string) => {
  if (time === '종일') return time;
  return time.split(' - ')[0];
};

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules, calendarStatus }) => {
  const [monthOffset, setMonthOffset] = useState<MonthOffset>(0);
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const visibleMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1),
    [monthOffset, today],
  );
  const visibleYear = visibleMonth.getFullYear();
  const visibleMonthIndex = visibleMonth.getMonth();
  const monthCells = useMemo(
    () => createMonthCells(visibleYear, visibleMonthIndex),
    [visibleYear, visibleMonthIndex],
  );
  const schedulesByDate = useMemo(() => {
    const grouped = new Map<string, ScheduleEvent[]>();

    schedules.forEach((schedule) => {
      const dateKey = schedule.date.slice(0, 10);
      const items = grouped.get(dateKey) ?? [];
      items.push(schedule);
      grouped.set(dateKey, items);
    });

    return grouped;
  }, [schedules]);

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
              월간 <span className="text-orange-500">정모</span> 일정
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              이번 달과 다음 달 정모 날짜를 달력에서 확인하세요.
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

        {/* Monthly Calendar */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
          <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-xs font-bold text-orange-400">MONTHLY SCHEDULE</p>
              <h3 className="mt-1 text-2xl font-black text-white">
                {visibleYear}년 {visibleMonthIndex + 1}월
              </h3>
            </div>
            <div className="inline-flex w-fit rounded-xl border border-slate-700 bg-slate-950 p-1">
              {MONTH_OPTIONS.map((option) => (
                <button
                  key={option.offset}
                  type="button"
                  onClick={() => setMonthOffset(option.offset)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                    monthOffset === option.offset
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70">
                {WEEKDAYS.map((weekday, index) => (
                  <div
                    key={weekday}
                    className={`py-3 text-center text-xs font-bold ${
                      index === 0
                        ? 'text-rose-400'
                        : index === 6
                          ? 'text-blue-400'
                          : 'text-slate-400'
                    }`}
                  >
                    {weekday}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {monthCells.map((date) => {
                  const dateKey = toDateKey(date);
                  const isVisibleMonth = date.getFullYear() === visibleYear
                    && date.getMonth() === visibleMonthIndex;
                  const isToday = dateKey === todayKey;
                  const daySchedules = isVisibleMonth
                    ? schedulesByDate.get(dateKey) ?? []
                    : [];

                  return (
                    <div
                      key={dateKey}
                      className={`min-h-28 border-b border-r border-slate-800 p-2.5 ${
                        isVisibleMonth ? 'bg-slate-900/40' : 'bg-slate-950/70'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-xs font-bold ${
                            isToday
                              ? 'bg-orange-500 text-white'
                              : isVisibleMonth
                                ? date.getDay() === 0
                                  ? 'text-rose-400'
                                  : date.getDay() === 6
                                    ? 'text-blue-400'
                                    : 'text-slate-200'
                                : 'text-slate-600'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {daySchedules.slice(0, 2).map((schedule) => (
                          <div
                            key={schedule.id}
                            className="w-full rounded-md bg-orange-500/10 px-2 py-1.5 text-left text-[10px] font-semibold text-slate-200"
                            title={`${schedule.time} · ${schedule.title} · ${schedule.location}`}
                          >
                            <div className="flex items-start gap-1.5">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                              <span className="min-w-0 truncate">
                                <span className="font-mono text-orange-300">{getStartTime(schedule.time)}</span>{' '}
                                {schedule.title}
                              </span>
                            </div>
                            <div className="mt-1 flex min-w-0 items-center gap-1 text-slate-400">
                              <MapPin className="h-3 w-3 shrink-0 text-orange-400/80" />
                              <span className="truncate">{schedule.location}</span>
                            </div>
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <p className="px-2 text-[10px] font-bold text-slate-500">
                            +{daySchedules.length - 2}개 일정
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
