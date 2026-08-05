import React, { useState } from 'react';
import { JoinFormData, PlayerPosition } from '../types';
import { UserPlus, Sparkles, CheckCircle, HelpCircle, ShieldCheck, ArrowRight, Dribbble, Check, AlertCircle, MessageSquare } from 'lucide-react';

interface JoinFormSectionProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const JoinFormSection: React.FC<JoinFormSectionProps> = ({ isOpenModal, onCloseModal }) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

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
            2. 참가신청서 (Join Us)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            한늬의 새로운 <span className="text-orange-500">팀원이 되어주세요!</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            농구 경험이 전혀 없어도 괜찮습니다. 열정과 운동화만 있다면 누구나 환영받는 따뜻한 코트입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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
                  <li>20대 ~ 40대 이상 농구를 좋아하는 모든 성인 여성</li>
                  <li>농구가 처음이거나 오랜만에 다시 시작하시는 분</li>
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
                    <span className="text-lg font-bold text-orange-400 font-mono">30,000원</span>
                    <p className="text-[10px] text-slate-500 mt-1">웰컴 유니폼 패키지 제공</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">월 정기 회비</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">40,000원</span>
                    <p className="text-[10px] text-slate-500 mt-1">체육관 대관료 & 음료 지원</p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs space-y-1">
                <span className="font-bold text-orange-300 block">💡 부담 없는 일일 체험 가능</span>
                <p className="text-slate-300">
                  정회원 등록 전에 1회 게스트 체험(10,000원)으로 분위기를 먼저 경험해 보실 수 있습니다!
                </p>
              </div>
            </div>
          </div>

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

      </div>
    </section>
  );
};
