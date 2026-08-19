import React from 'react';
import { SectionId } from '../types';
import { Dribbble, Instagram, MessageSquare, Mail, MapPin, Heart, ChevronUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenJoinForm }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 relative pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">      

        {/* Link */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p> 여자농구동호회 한늬 (HANNI Women's Basketball Club).</p>
          <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/hanni_basketball?igsh=MTByNjE3N2wzNWk1bA=="
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://open.kakao.com/o/gm9r16ub"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors"
                aria-label="KakaoTalk"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 drop-shadow-sm"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fill="#FEE500" 
                    d="M12 3C6.477 3 2 6.477 2 10.777c0 2.753 1.776 5.156 4.364 6.545l-1.05 3.877c-.079.293.255.518.508.354L10.51 18.42c.49.09 1 .135 1.49.135 5.523 0 10-3.477 10-7.778C22 6.477 17.523 3 12 3z" 
                  />
                  <path 
                    fill="#3A1D1D" 
                    d="M8.5 11.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z" 
                  />
                </svg>
              </a>
              <a
                href="mailto:contact@hannui-basketball.com"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                aria-label="Email"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="맨 위로"
            >
              <span>맨 위로</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
