import React, { useState } from 'react';
import { RosterMember, PlayerPosition } from '../types';
import { Users, Award, Shield, Dribbble, Sparkles, X, Activity, Flame } from 'lucide-react';

interface RosterSectionProps {
  roster: RosterMember[];
}

export const RosterSection: React.FC<RosterSectionProps> = ({ roster }) => {
  const [filter, setFilter] = useState<string>('전체');
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(null);

  const filteredRoster = roster.filter((m) => {
    if (filter === '전체') return true;
    if (filter === '운영진/코치진') return m.role === '주장' || m.role === '코치진' || m.role === '운영진';
    if (filter === '가드 (PG/SG)') return m.position === 'PG' || m.position === 'SG';
    if (filter === '포워드 (SF/PF)') return m.position === 'SF' || m.position === 'PF';
    if (filter === '센터 (C)') return m.position === 'C';
    return true;
  });

  return (
    <section id="roster" className="py-20 bg-slate-900 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              4. 팀원소개 (Roster)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              코트를 빛내는 <span className="text-orange-500">한늬 선수단 & 코치진</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              각 포지션에서 열정을 다하는 멤버들의 프로필과 코트 위 강점을 확인하세요.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {['전체', '운영진/코치진', '가드 (PG/SG)', '포워드 (SF/PF)', '센터 (C)'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoster.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="group bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Number Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Back Number Badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center font-mono text-lg font-black text-orange-400 shadow-md">
                    #{member.number}
                  </div>

                  {/* Position Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-xs font-black shadow-sm">
                      {member.position}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 text-[11px] font-semibold border border-slate-700">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                        {member.name}
                      </h3>
                      {member.nickname && (
                        <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          "{member.nickname}"
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{member.positionFull}</p>
                  </div>

                  {/* Favorite Move */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">주무기 / 시그니처 무브</span>
                    <span className="font-bold text-slate-200 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {member.favoriteMove}
                    </span>
                  </div>

                  {/* Stats Mini Progress Bars */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">슈팅 (Shooting)</span>
                      <span className="font-bold font-mono text-orange-400">{member.stats.shooting}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                        style={{ width: `${member.stats.shooting}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">수비 & 허슬 (Defense)</span>
                      <span className="font-bold font-mono text-orange-400">{member.stats.defense}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                        style={{ width: `${member.stats.defense}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Quote */}
              <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 italic">
                "{member.quote}"
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          onClick={() => setSelectedMember(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-950 rounded-3xl max-w-2xl w-full border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-orange-500/50 shadow-lg"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-orange-600 text-white font-black text-xs">
                    #{selectedMember.number}
                  </span>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                    {selectedMember.role}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedMember.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{selectedMember.positionFull}</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{selectedMember.intro}</p>
              </div>
            </div>

            {/* Comprehensive Radar/Stats Box */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-orange-400" /> 선수 종합 능력치 스탯
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>슈팅 (Shooting)</span>
                    <span className="font-bold text-white">{selectedMember.stats.shooting}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${selectedMember.stats.shooting}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>패스 센스 (Passing)</span>
                    <span className="font-bold text-white">{selectedMember.stats.passing}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${selectedMember.stats.passing}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>수비 & 대인방어 (Defense)</span>
                    <span className="font-bold text-white">{selectedMember.stats.defense}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${selectedMember.stats.defense}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>스피드 & 스피드 (Speed)</span>
                    <span className="font-bold text-white">{selectedMember.stats.speed}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${selectedMember.stats.speed}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs italic text-orange-300 text-center">
              "{selectedMember.quote}"
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
