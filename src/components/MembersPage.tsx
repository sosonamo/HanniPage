import { useEffect, useState } from 'react';
import { OnlineMembers } from './OnlineMembers';
import { isMembersConfigured, loginMember, logoutMember, memberErrorMessage, subscribeMember, type MemberState } from '../services/members';
import { ExternalLink, LockKeyhole, Megaphone, LogOut, FolderOpen, Youtube, ArrowUp } from 'lucide-react';

export function MembersPage() {
  const [state, setState] = useState<MemberState>({ status: 'loading' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const visibleContent = state.status === 'ready' ? state.content : null;
  useEffect(() => subscribeMember(setState), []);

  async function handleLogin() {
    if (busy) return;
    setBusy(true); setError('');
    try { await loginMember(); }
    catch (cause) { setError(memberErrorMessage(cause)); }
    finally { setBusy(false); }
  }

  async function logout() {
    setError('');
    setState(previous => ({ status: 'loading', uid: previous.uid, displayName: previous.displayName }));
    try { await logoutMember(); }
    catch (cause) { setError(memberErrorMessage(cause)); }
  }

  return (
    <>
      <header className="border-b border-slate-800 bg-black">
        <div className="site-container py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
          <a href={import.meta.env.BASE_URL} aria-label="HANNI THE BLAZERS 홈페이지로" className="headline-font shrink-0 text-base sm:text-xl tracking-wider">
            HANNI THE BLAZERS
          </a>
          {state.uid && (
            <div className="ml-auto flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-6">
              {state.status === 'ready' && <OnlineMembers key={state.uid} uid={state.uid} />}
              <button type="button" onClick={logout} className="member-logout-button inline-flex shrink-0 items-center">
                <LogOut className="size-[10.67px]" aria-hidden="true" /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
    <section id="members" aria-label="한늬 팀원 공간" className="py-8 bg-slate-950 text-white border-b border-slate-800">
      <div className="site-container space-y-8">
        {error && <p role="alert" className="text-center text-sm text-red-300">{error}</p>}
        {visibleContent ? (
          <>
            {/* Notice */}
            <div className="space-y-10">
              <div className="space-y-5">
                <h3 className="heading-subsection flex items-center gap-2"><Megaphone className="heading-subsection-icon text-red-400" aria-hidden="true" /> 회원 공지사항</h3>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 card-padding whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{visibleContent.notice}</div>
              </div>

              {/* Match Resources */}
              <div className="space-y-5 border-t border-slate-800 pt-10">
                <h3 className="heading-subsection flex items-center gap-2"><FolderOpen className="heading-subsection-icon text-red-400" aria-hidden="true" /> 경기자료</h3>
                {visibleContent.matchResources.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleContent.matchResources.map(resource => resource.url ? (
                      <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer"
                        className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-3 hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-orange-400">
                        <span className="min-w-0 break-words font-bold">{resource.title}</span>
                        <ExternalLink className="h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                        <span className="sr-only">경기자료 열기 (새 탭)</span>
                      </a>
                    ) : (
                      <div key={resource.id} className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-3">
                        <span className="min-w-0 break-words font-bold">{resource.title}</span>
                        <span className="shrink-0 text-xs text-slate-400">준비 중</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400">등록된 경기자료가 없습니다.</p>}
              </div>

              {/* Shared Resources */}
              <div className="space-y-5 border-t border-slate-800 pt-10">
                <h3 className="heading-subsection flex items-center gap-2"><FolderOpen className="heading-subsection-icon text-red-400" aria-hidden="true" /> 공유 자료</h3>
                {visibleContent.resources.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleContent.resources.map(resource => (
                      <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer"
                        className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-3 hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-orange-400">
                        <span className="min-w-0 break-words font-bold">{resource.title}</span>
                        <ExternalLink className="h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                        <span className="sr-only">공유 자료 열기 (새 탭)</span>
                      </a>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400">등록된 공유 자료가 없습니다.</p>}
              </div>
              
              {/* YouTube List */}
              <div className="space-y-5 border-t border-slate-800 pt-10">
                <h3 className="heading-subsection flex items-center gap-2"><Youtube className="heading-subsection-icon text-red-400" aria-hidden="true" /> YouTube 영상</h3>
                {visibleContent.playlists.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleContent.playlists.map(playlist => (
                      <a key={playlist.id} href={playlist.url} target="_blank" rel="noopener noreferrer"
                        className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-3 hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-orange-400">
                        <span className="min-w-0 break-words font-bold">{playlist.title}</span>
                        <ExternalLink className="h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                        <span className="sr-only">YouTube에서 보기 (새 탭)</span>
                      </a>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400">등록된 YouTube 영상이 없습니다.</p>}
              </div>

            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 panel-padding text-center space-y-4">
            <LockKeyhole className="mx-auto h-8 w-8 text-red-400" aria-hidden="true" />
            <h3 className="heading-card ">{!isMembersConfigured ? '회원 로그인 준비 중' : state.status === 'pending' ? '팀원 승인 대기' : state.status === 'loading' ? '회원 권한 확인 중' : 'Google 계정으로 로그인'}</h3>
            <p className="text-sm text-slate-400">
              {state.status === 'pending' ? '로그인은 완료되었습니다. 운영진의 팀원 승인 후 이용할 수 있습니다.' : '승인된 한늬 팀원만 공지와 경기 영상, 공유 자료를 볼 수 있습니다.'}
            </p>
            {state.uid && !visibleContent && (
              <p className="text-xs text-slate-400 break-all">운영진에게 전달할 회원 UID: <code className="select-all">{state.uid}</code></p>
            )}
            {state.message && <p role={state.status === 'error' ? 'alert' : 'status'} className="text-sm text-red-300">{state.message}</p>}
            {isMembersConfigured && !state.uid && state.status !== 'loading' && (
              <button type="button" onClick={handleLogin} disabled={busy}
                className="btn-primary min-h-11 px-6 py-3 text-sm font-bold disabled:opacity-50">
                {busy ? '로그인 중…' : 'Google로 로그인'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
      </main>
      <div className="site-container flex justify-center sm:justify-end py-8 text-xs">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 px-3 p-2 bg-slate-900 hover:bg-red-600 text-slate-300 border border-slate-800"
          title="맨 위로"
        >
          <span>맨 위로</span>
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
