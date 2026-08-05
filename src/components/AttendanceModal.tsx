import React, { useState } from 'react';
import { ScheduleEvent } from '../types';
import { X, Calendar, MapPin, CheckCircle2, User, Phone, Sparkles } from 'lucide-react';

interface AttendanceModalProps {
  schedule: ScheduleEvent | null;
  onClose: () => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ schedule, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberType, setMemberType] = useState<'정회원' | '신입/게스트 (일일 참관)'>('정회원');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20">
                정모 참석 (RSVP) 신청
              </span>
              <h3 className="text-2xl font-black text-white mt-1">{schedule.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                {schedule.dayOfWeek} • {schedule.time}
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400">장소: {schedule.location}</span>
              <p className="text-slate-300 font-bold">{schedule.address}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  이름 / 닉네임 <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김한늬"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  연락처 <span className="text-orange-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">참석 구분</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['정회원', '신입/게스트 (일일 참관)'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMemberType(type as any)}
                      className={`py-2.5 rounded-xl border font-bold transition-all ${
                        memberType === type
                          ? 'bg-orange-500 text-white border-orange-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">남기실 메시지 (선택)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="예: 조금 늦게 도착할 수도 있습니다!"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-950/60 hover:scale-[1.01] transition-transform"
              >
                참석 RSVP 완료하기
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {name}님, {schedule.dayOfWeek} 참석 명단에 반영되었습니다!
            </h3>
            <p className="text-xs text-slate-300">
              체육관에서 만나요! 지각 없이 안전하게 오시길 바랍니다. 🏀
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
