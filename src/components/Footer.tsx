import React from 'react';
import { SectionId } from '../types';
import { Instagram, ArrowUp } from 'lucide-react';
import hanniLogo from '../../assets/한늬로고_최종_White.png';

interface FooterProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenJoinForm }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-shell bg-black text-slate-400 text-xs border-t border-red-500/40 relative pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="flex items-center gap-5">
            <img src={hanniLogo} alt="한늬 더 블레이저스" className="h-20 w-20 object-contain" />
            <div>
              <p className="headline-font text-3xl sm:text-5xl leading-none text-white">
                ONE TEAM<br /><span className="text-white">TOGETHER</span>
              </p>
              <p className="mt-3 text-[9px] font-black uppercase tracking-[0.28em] text-slate-500">
                Hanni The Blazers · We Blaze Together
              </p>
            </div>
          </div>
        </div>

        {/* Link */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 HANNI WOMEN'S BASKETBALL CLUB. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6 pt-2">
              <a
                href="https://www.instagram.com/hanni_basketball?igsh=MTByNjE3N2wzNWk1bA=="
                target="_blank"
                rel="noreferrer"
                className="w-[29.04px] h-[29.04px] rounded-[8px] flex items-center justify-center bg-[linear-gradient(135deg,#833AB4_0%,#C13584_35%,#E1306C_55%,#F77737_80%,#FCAF45_100%)] text-white transition-transform hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="w-[15.84px] h-[15.84px]" strokeWidth={2.2} aria-hidden="true" />
              </a>
                            <a
                href="https://www.youtube.com/@LetsGoHanni"
                target="_blank"
                rel="noreferrer"
                className="w-[29.04px] h-[29.04px] rounded-[8px] flex items-center justify-center bg-white transition-transform hover:scale-105"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 28 20" className="w-[18.48px] h-[13.2px]" aria-hidden="true">
                  <path fill="#FF0000" d="M27.4 3.1A3.5 3.5 0 0 0 25 .6C22.8 0 14 0 14 0S5.2 0 3 .6A3.5 3.5 0 0 0 .6 3.1 36.6 36.6 0 0 0 0 10a36.6 36.6 0 0 0 .6 6.9A3.5 3.5 0 0 0 3 19.4c2.2.6 11 .6 11 .6s8.8 0 11-.6a3.5 3.5 0 0 0 2.4-2.5A36.6 36.6 0 0 0 28 10a36.6 36.6 0 0 0-.6-6.9Z" />
                  <path fill="white" d="m11.2 14.3 7.3-4.3-7.3-4.3Z" />
                </svg>
              </a>
              <a
                href="https://open.kakao.com/o/gm9r16ub"
                target="_blank"
                rel="noreferrer"
                className="w-[29.04px] h-[29.04px] rounded-[8px] flex items-center justify-center bg-[#FEE500] transition-transform hover:scale-105"
                aria-label="KakaoTalk"
              >
                <svg viewBox="0 0 24 24" className="w-[21.12px] h-[21.12px]" aria-hidden="true">
                  <path fill="#3C1E1E" d="M12 3C6.477 3 2 6.477 2 10.777c0 2.753 1.776 5.156 4.364 6.545l-1.05 3.877c-.079.293.255.518.508.354L10.51 18.42c.49.09 1 .135 1.49.135 5.523 0 10-3.477 10-7.778C22 6.477 17.523 3 12 3z" />
                  <text x="12" y="12.8" textAnchor="middle" fill="#FEE500" fontFamily="Arial, sans-serif" fontSize="6.4" fontWeight="900" letterSpacing="-.35">TALK</text>
                </svg>
              </a>
            </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 p-2 bg-slate-900 hover:bg-red-600 text-slate-300 border border-slate-800"
              title="맨 위로"
            >
              <span>맨 위로</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
