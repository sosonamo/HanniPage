import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { subscribeMemberPresence } from '../services/members';
import type { PresenceState } from '../services/memberPresence';

export function OnlineMembers({ uid }: { uid: string }) {
  const [presence, setPresence] = useState<PresenceState>({ status: 'loading', members: [] });
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();
  useEffect(() => subscribeMemberPresence(setPresence), [uid]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return (
    <div ref={root} className="relative flex shrink-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
      <button ref={trigger} type="button" className="member-logout-button inline-flex items-center" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(value => !value)}>
        <Users className="h-3.5 w-3.5" aria-hidden="true" />
        {presence.status === 'ready' ? `접속 중 ${presence.members.length}명` : presence.status === 'error' ? '접속 확인 불가' : '접속 확인 중…'}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={listId} className="absolute left-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-white/20 bg-zinc-950 compact-padding shadow-xl sm:left-auto sm:right-0">
          <p className="mb-3 text-sm font-bold">접속 중인 팀원</p>
          {presence.status === 'ready' ? (
            presence.members.length ? <ul className="max-h-64 space-y-3 overflow-y-auto text-sm text-slate-200">
              {presence.members.map(member => <li key={member.uid} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" aria-hidden="true" />
                <span className="break-words min-w-0">{member.name}{member.uid === uid && <span className="ml-1 text-slate-400">(나)</span>}</span>
              </li>)}
            </ul> : <p className="text-sm text-slate-400">접속 중인 팀원이 없습니다.</p>
          ) : <p role="status" className="text-sm text-slate-400">{presence.status === 'error' ? '접속 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.' : '접속 정보를 확인하고 있습니다.'}</p>}
          <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-500">팀원 페이지 기준 · 연결 종료 반영에 약 90초가 걸릴 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
