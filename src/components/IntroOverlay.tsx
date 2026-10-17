import { useCallback, useEffect, useRef, useState } from 'react';

interface IntroOverlayProps { onComplete: () => void; }
const SESSION_KEY = 'hanni-intro-seen';

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [hidden] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true'
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  });
  const complete = useCallback(() => {
    try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch { /* Storage may be disabled. */ }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (hidden) { complete(); return; }
    const timer = window.setTimeout(complete, 15_000);
    const message = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow
        && event.data?.type === 'hanni-intro-complete') complete();
    };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') complete(); };
    window.addEventListener('message', message);
    window.addEventListener('keydown', key);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', message);
      window.removeEventListener('keydown', key);
    };
  }, [complete, hidden]);

  if (hidden) return null;
  return (
    <div className="fixed inset-0 z-[1000] bg-black" aria-label="한늬 농구클럽 시작 인트로">
      <iframe ref={frame} className="h-full w-full border-0"
        src={`${import.meta.env.BASE_URL}index_ball.html`} title="농구공 시작 애니메이션"
        onError={complete} />
    </div>
  );
}
