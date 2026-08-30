import React, { useState } from 'react';
import { JoinFormData, PlayerPosition, ScheduleEvent } from '../types';
import {
  UserPlus,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Dribbble,
  Check,
  AlertCircle,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Users,
  Car,
  CheckCircle2,
  Copy,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { CalendarStatus } from '../App';

const CALENDAR_TIME_ZONE = import.meta.env.VITE_CALENDAR_TIME_ZONE || 'Asia/Seoul';
const SHOW_HOMEPAGE_APPLICATION_FORM = false;

const getCurrentWeekRange = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CALENDAR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const todayAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
  );
  const dayOfWeek = new Date(todayAsUtc).getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const weekStart = new Date(todayAsUtc - daysSinceMonday * 86_400_000);
  const nextWeekStart = new Date(weekStart.getTime() + 7 * 86_400_000);

  return {
    startDate: weekStart.toISOString().slice(0, 10),
    endDateExclusive: nextWeekStart.toISOString().slice(0, 10),
  };
};

interface JoinFormSectionProps {
  schedules: ScheduleEvent[];
  calendarStatus: CalendarStatus;
  onRsvpClick: (schedule: ScheduleEvent) => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const JoinFormSection: React.FC<JoinFormSectionProps> = ({
  schedules,
  calendarStatus,
  onRsvpClick,
  isOpenModal,
  onCloseModal,
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const { startDate, endDateExclusive } = getCurrentWeekRange();
  const filteredSchedules = schedules
    .filter((schedule) => (
      schedule.date >= startDate
      && schedule.date < endDateExclusive
      && schedule.title.trim() === '정모'
    ))
    .sort((a, b) => (
      a.date.localeCompare(b.date)
      || (a.startDateTime ?? a.time).localeCompare(b.startDateTime ?? b.time)
    ));

  const [formData, setFormData] = useState<JoinFormData>({
    name: '',
    ageGroup: '20대 후반',
    phone: '',
    email: '',
    location: '서울 서초/강남/마포',
    experienceLevel: '입문 (농구 공을 처음 잡음)',
    preferredPosition: 'PG',
    heightCm: '165',
    motivation: '',
    availableDays: ['수요일 야간', '토요일 오후'],
    agreedTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    window.setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleInputChange = (field: keyof JoinFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      if (exists) {
        return { ...prev, availableDays: prev.availableDays.filter((d) => d !== day) };
      } else {
        return { ...prev, availableDays: [...prev.availableDays, day] };
      }
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = '이름을 입력해주세요.';
    if (!formData.phone.trim()) errs.phone = '연락처를 입력해주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedTerms) {
      setErrors({ terms: '개인정보 수집 동의에 체크해 주세요.' });
      return;
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setFormData({
      name: '',
      ageGroup: '20대 후반',
      phone: '',
      email: '',
      location: '서울 서초/강남/마포',
      experienceLevel: '입문 (농구 공을 처음 잡음)',
      preferredPosition: 'PG',
      heightCm: '165',
      motivation: '',
      availableDays: ['수요일 야간', '토요일 오후'],
      agreedTerms: true,
    });
  };

  return (
    <section id="join" className="py-20 bg-slate-900 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-3.5 h-3.5" />
            참가신청서 (Join Us)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            한늬랑 함께 농구하실 <span className="text-orange-500">게스트를 모집합니다!</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            농구 경험이 전혀 없어도 괜찮습니다. 열정과 운동화만 있다면 누구나 환영받는 따뜻한 코트입니다.
          </p>
        </div>

                {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredSchedules.map((item) => {
            const hasCapacity = item.currentRsvp !== undefined && item.maxCapacity !== undefined;
            const isFull = hasCapacity && item.currentRsvp! >= item.maxCapacity!;
            const isRsvpUnavailable = isFull || !item.rsvpUrl;
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
                    disabled={isRsvpUnavailable}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isRsvpUnavailable
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md shadow-orange-950/50'
                    }`}
                  >
                    <span>
                      {isFull
                        ? '마감됨'
                        : item.rsvpUrl
                          ? '게스트 신청'
                          : '신청 링크 준비 중'}
                    </span>
                    {!isRsvpUnavailable && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
          {filteredSchedules.length === 0 && calendarStatus !== 'loading' && (
            <div className="lg:col-span-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-14 text-center">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="font-bold text-slate-200">이번 주 한늬 일정이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">다음 주 월요일에 일정을 다시 확인해주세요.</p>
            </div>
          )}
        </div>

        {/*
          TODO: Google Calendar 신청 대신 홈페이지 신청 방식을 확정한 뒤
          SHOW_HOMEPAGE_APPLICATION_FORM을 true로 변경해 다시 노출합니다.
        */}
        {SHOW_HOMEPAGE_APPLICATION_FORM && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Right Column: Multi-Step Interactive Form */}
          <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
            
            {!submitted ? (
              <div>
                {/* Form Progress Bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      1
                    </span>
                    <span className="text-xs font-bold text-slate-200">기본 정보</span>
                  </div>

                  <div className="w-12 h-0.5 bg-slate-800" />

                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      2
                    </span>
                    <span className="text-xs font-bold text-slate-200">농구 경험 & 포지션</span>
                  </div>

                  <div className="w-12 h-0.5 bg-slate-800" />

                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      3
                    </span>
                    <span className="text-xs font-bold text-slate-200">일정 & 제출</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 1: Basic Info */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-white mb-2">Step 1. 기본 인적사항을 입력해주세요</h3>
                      
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          이름 / 닉네임 <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="예: 김한늬"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            연락처 (핸드폰) <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="010-0000-0000"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                          {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Age Group */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">연령대</label>
                          <select
                            value={formData.ageGroup}
                            onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                          >
                            <option value="20대 초반">20대 초반</option>
                            <option value="20대 후반">20대 후반</option>
                            <option value="30대 초반">30대 초반</option>
                            <option value="30대 후반">30대 후반</option>
                            <option value="40대 이상">40대 이상</option>
                          </select>
                        </div>
                      </div>

                      {/* Email & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">이메일 주소</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="example@hannui.com"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">주요 거주/활동 지역</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="예: 서울 서초구 / 관악구"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Basketball Level & Position */}
                  {step === 2 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-white mb-2">Step 2. 농구 경험 및 선호 포지션</h3>

                      {/* Level Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">
                          현재 나의 농구 실력/경험 단계
                        </label>
                        <div className="space-y-2">
                          {[
                            '입문 (농구 공을 처음 잡음)',
                            '초급 (기본 슛/드리블 가능)',
                            '중급 (동호회/동아리 경험 있음)',
                            '상급 (공식 대회 출전 경험)',
                          ].map((lvl) => (
                            <label
                              key={lvl}
                              onClick={() => handleInputChange('experienceLevel', lvl)}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.experienceLevel === lvl
                                  ? 'bg-orange-500/10 border-orange-500 text-white font-bold'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  formData.experienceLevel === lvl
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-slate-600'
                                }`}
                              >
                                {formData.experienceLevel === lvl && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-xs">{lvl}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Position Picker */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">
                          선호하는 코트 포지션 (선택)
                        </label>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {[
                            { pos: 'PG', label: '가드' },
                            { pos: 'SG', label: '슈팅가드' },
                            { pos: 'SF', label: '포워드' },
                            { pos: 'PF', label: '파워포워드' },
                            { pos: 'C', label: '센터' },
                          ].map((item) => (
                            <button
                              key={item.pos}
                              type="button"
                              onClick={() => handleInputChange('preferredPosition', item.pos as PlayerPosition)}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                                formData.preferredPosition === item.pos
                                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-950/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="text-sm font-extrabold">{item.pos}</div>
                              <div className="text-[10px] opacity-80 mt-0.5">{item.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Height */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">신장 (cm)</label>
                        <input
                          type="number"
                          value={formData.heightCm}
                          onChange={(e) => handleInputChange('heightCm', e.target.value)}
                          placeholder="165"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Days & Submit */}
                  {step === 3 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                      <h3 className="text-lg font-bold text-white mb-2">Step 3. 가능 일정 & 가입 동기</h3>

                      {/* Days Checkbox */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">
                          참석 가능한 정모 시간대 (중복 선택)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {['수요일 야간 (전술)', '토요일 오후 (매치)', '일요일 오전 (입문)'].map((day) => {
                            const isChecked = formData.availableDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                                  isChecked
                                    ? 'bg-orange-500/15 border-orange-500 text-orange-300'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                                }`}
                              >
                                <span>{day}</span>
                                {isChecked && <Check className="w-4 h-4 text-orange-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Motivation Textarea */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          한늬 가입 동기 또는 기대하는 한마디
                        </label>
                        <textarea
                          rows={3}
                          value={formData.motivation}
                          onChange={(e) => handleInputChange('motivation', e.target.value)}
                          placeholder="예: 퇴근 후 함께 운동하며 실력도 늘리고 좋은 사람들을 만나고 싶습니다!"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Terms Agreement */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.agreedTerms}
                            onChange={(e) => handleInputChange('agreedTerms', e.target.checked)}
                            className="w-4 h-4 rounded accent-orange-500"
                          />
                          <span className="text-xs text-slate-300 font-medium">
                            [필수] 신입 부원 가입 안내 연락을 위한 개인정보 수집·이용에 동의합니다.
                          </span>
                        </label>
                        {errors.terms && <p className="text-xs text-rose-400">{errors.terms}</p>}
                      </div>
                    </div>
                  )}

                  {/* Navigation & Submit Action Buttons */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800"
                      >
                        이전 단계
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-950/50"
                      >
                        <span>다음 단계로</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-orange-950/60 transition-all hover:scale-[1.02]"
                      >
                        <Sparkles className="w-4 h-4" />
                        참가신청서 제출 완료
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* Success Screen */
              <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">
                    {formData.name}님, 참가신청이 정상 완료되었습니다! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    한늬 입단 안내 담당 매니저가 기재해주신 연락처(<span className="text-orange-400 font-bold">{formData.phone}</span>)로 24시간 이내에 안내 문자를 보내드립니다.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">신청자명:</span>
                    <span className="font-bold text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">선택 경험:</span>
                    <span className="font-bold text-orange-400">{formData.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">희망 포지션:</span>
                    <span className="font-bold text-white">{formData.preferredPosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">가능 정모:</span>
                    <span className="font-bold text-slate-200">{formData.availableDays.join(', ')}</span>
                  </div>
                </div>

                {/* Kakao Open Chat Invitation Button */}
                <div className="pt-2 space-y-3">
                  <a
                    href="https://open.kakao.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    한늬 신입 오픈카톡방 입장하기
                  </a>
                  <div>
                    <button
                      onClick={resetForm}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      새로운 신청서 작성하기
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
        )}

      </div>
    </section>
  );
};
