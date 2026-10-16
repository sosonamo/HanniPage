import { useState, type FormEvent } from 'react';
import { isMembersConfigured, loginMember, type MemberContent } from '../services/members';
import { MEMBER_PLAYLISTS } from '../data/memberVideos';
import { ExternalLink, LockKeyhole, Megaphone, Play, X, Users } from 'lucide-react';

export function MembersPage() {
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState<MemberContent | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const visibleContent = content || (import.meta.env.DEV && preview ? {
    videoId: 'nirLJaNBQXY', videoTitle: '경기 영상', notice: '공지내용',
  } : null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      setContent(await loginMember(email, password));
      setPreview(false);
      setEmail('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '로그인에 실패했습니다.');
    } finally {
      setPassword('');
      setBusy(false);
    }
  }

  function logout() {
    setContent(null);
    setPreview(false);
    setError('');
  }

  return (
    <section id="members" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-white border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
            팀원 공간 (MEMBERS)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">한늬 팀원 공간</h1>
          <p className="text-sm text-slate-300">회원 공지사항과 우리 팀 경기 영상을 확인하세요.</p>
        </div>

        {visibleContent ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
              <p>{preview ? '개발용 화면 미리보기 · 실제 회원 로그인이 아닙니다.' : '한늬 팀원 여러분, 환영합니다.'}</p>
              <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 px-3">
                <X className="w-4 h-4" aria-hidden="true" /> {preview ? '미리보기 닫기' : '로그아웃'}
              </button>
            </div>
            <div className="space-y-10">
              <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Megaphone className="h-5 w-5 text-red-400" aria-hidden="true" /> 회원 공지사항</h3>
                <div className="border-t border-slate-800 pt-5 text-sm leading-relaxed text-slate-300">{visibleContent.notice}</div>
              </div>
              <div className="space-y-5">
                <h3 className="text-2xl font-bold">YouTube 경기 영상</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {MEMBER_PLAYLISTS.map((playlist) => (
                    <div key={playlist.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                      <a href={playlist.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-video bg-gradient-to-br from-red-950 to-slate-950 focus-visible:outline-2 focus-visible:outline-red-400" aria-label={`${playlist.title} YouTube에서 보기 (새 탭)`}>
                        <span className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/20 group-hover:bg-black/40">
                          <Play className="h-14 w-14 rounded-full bg-red-600 p-4 text-white" aria-hidden="true" />
                          <h4 className="text-lg font-bold">{playlist.title}</h4>
                        </span>
                      </a>
                      <div className="space-y-4 px-6 pb-6 pt-0 text-center">
                        <a href={playlist.url} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex min-h-11 items-center gap-2 px-5 py-3 text-sm font-bold">
                          재생목록 보러가기 <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">(새 탭에서 열림)</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center space-y-4">
            <LockKeyhole className="mx-auto h-8 w-8 text-red-400" aria-hidden="true" />
            <h3 className="text-lg font-bold">{isMembersConfigured ? '회원 로그인' : '회원 로그인 준비 중'}</h3>
            <p className="text-sm text-slate-400">{isMembersConfigured ? '등록된 이메일과 개인 비밀번호를 입력해주세요.' : '로그인 기능 연결 후 이용할 수 있습니다.'}</p>
            {isMembersConfigured && (
              <form onSubmit={handleLogin} className="mx-auto max-w-sm space-y-4 text-left" aria-busy={busy}>
                <div className="space-y-2">
                  <label htmlFor="member-email" className="block text-sm">이메일</label>
                  <input id="member-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="member-password" className="block text-sm">비밀번호</label>
                  <input id="member-password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base" />
                </div>
                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                <button type="submit" disabled={busy} className="btn-primary min-h-11 w-full px-5 py-3 text-sm font-bold disabled:opacity-50">
                  {busy ? '확인 중…' : '로그인'}
                </button>
              </form>
            )}
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
