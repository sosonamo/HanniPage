import { useEffect, useRef, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const INTRO_COMPLETE_MESSAGE = 'hanni-intro-complete';
const FADE_DURATION_MS = 800;

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== INTRO_COMPLETE_MESSAGE ||
        hasCompletedRef.current
      ) {
        return;
      }

      hasCompletedRef.current = true;
      setIsExiting(true);

      window.setTimeout(onComplete, FADE_DURATION_MS);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-slate-950 transition-opacity duration-[800ms] ease-out ${
        isExiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-label="한늬 농구클럽 시작 인트로"
    >
      <iframe
        className="h-full w-full border-0"
        src="/index_ball_smooth_roll_exit.html"
        title="농구공 시작 애니메이션"
      />
    </div>
  );
}
