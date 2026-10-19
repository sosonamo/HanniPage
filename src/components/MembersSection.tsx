import { ArrowUpRight, Users } from 'lucide-react';

export function MembersSection() {
  return (
    <section id="members" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-white border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Users className="heading-label-icon text-orange-400" aria-hidden="true" />
            팀원 공간 (MEMBERS)
          </div>
          <h2 className="heading-section text-white tracking-tight">한늬즈 <span className="heading-accent">전용 공간</span> 입니다</h2>
          <p className="text-sm text-slate-300">로그인하고 회원 공지사항과 경기 영상을 확인하세요.</p>
        </div>
        <a href={`${import.meta.env.BASE_URL}members.html`} className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-6 py-4 text-sm font-bold shrink-0">
          바로가기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
