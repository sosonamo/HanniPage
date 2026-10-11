import { useState } from 'react';
import { ExternalLink, LockKeyhole, Megaphone, Play, X } from 'lucide-react';

export function MembersSection() {
  const [preview, setPreview] = useState(false);

  return (
    <section id="members" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest text-red-400">MEMBERS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">한늬 팀원 공간</h2>
          <p className="text-sm text-slate-300">우리 팀 경기 영상과 회원 공지사항을 확인하세요.</p>
        </div>

        {import.meta.env.DEV && preview ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
              <p>개발용 화면 미리보기 · 실제 회원 로그인이 아닙니다.</p>
              <button type="button" onClick={() => setPreview(false)} className="inline-flex min-h-11 items-center gap-2 px-3">
                <X className="w-4 h-4" aria-hidden="true" /> 미리보기 닫기
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                <a href="https://youtu.be/nirLJaNBQXY" target="_blank" rel="noopener noreferrer" className="group relative block aspect-video focus-visible:outline-2 focus-visible:outline-red-400" aria-label="테스트 경기 영상 YouTube에서 보기 (새 탭)">
                  <img src="https://i.ytimg.com/vi/nirLJaNBQXY/hqdefault.jpg" alt="테스트 경기 영상 썸네일" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
                    <Play className="h-14 w-14 rounded-full bg-red-600 p-4 text-white" aria-hidden="true" />
                  </span>
                </a>
                <div className="space-y-4 p-6">
                  <h3 className="text-lg font-bold">경기 영상</h3>
                  <a href="https://youtu.be/nirLJaNBQXY" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex min-h-11 items-center gap-2 px-5 py-3 text-sm font-bold">
                    YouTube에서 보기 <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(새 탭에서 열림)</span>
                  </a>
                </div>
              </div>
              <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Megaphone className="h-5 w-5 text-red-400" aria-hidden="true" /> 회원 공지사항</h3>
                <div className="border-t border-slate-800 pt-5 text-sm leading-relaxed text-slate-300">공지내용</div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center space-y-4">
            <LockKeyhole className="mx-auto h-8 w-8 text-red-400" aria-hidden="true" />
            <h3 className="text-lg font-bold">회원 로그인 준비 중</h3>
            <p className="text-sm text-slate-400">팀원 전용 경기 영상과 공지사항은 로그인 기능 연결 후 이용할 수 있습니다.</p>
            {import.meta.env.DEV && (
              <button type="button" onClick={() => setPreview(true)} className="btn-secondary inline-flex min-h-11 items-center justify-center px-5 py-3 text-sm font-bold">
                개발용 콘텐츠 미리보기
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
