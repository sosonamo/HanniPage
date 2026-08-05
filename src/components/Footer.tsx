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
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                <Dribbble className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                여성 농구 클럽 한늬 (Han-nui)
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              함께 달리고 성장하는 즐거움! 초보자부터 숙련자까지 서로를 존중하며 
              건강하게 농구를 즐기는 여성 스포츠 커뮤니티입니다.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://open.kakao.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors"
                aria-label="KakaoTalk"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@hannui-basketball.com"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm">주요 메뉴 바로가기</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('schedule')} className="hover:text-orange-400 transition-colors">
                  📅 1. 정모일정 & 체육관 위치
                </button>
              </li>
              <li>
                <button onClick={onOpenJoinForm} className="hover:text-orange-400 transition-colors">
                  ✍️ 2. 신입 부원 참가신청서
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors">
                  🏀 3. 한늬 소개 & 히스토리
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('roster')} className="hover:text-orange-400 transition-colors">
                  🏃‍♀️ 4. 팀원 소개 & 프로필
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-orange-400 transition-colors">
                  ❓ 자주 묻는 질문 (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Location Summary */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm">주요 대관 체육관 안내</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>서초구 국민체육센터:</strong> 서울 서초구 사임당로 143 (수요일 전술)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>마포구민 체육센터:</strong> 서울 마포구 월드컵목로 11 (토요일 매치)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span><strong>성동구민 체육센터:</strong> 서울 성동구 장터길 18 (일요일 입문)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 여성 농구 클럽 한늬 (Han-nui Women's Basketball Club). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Women's Basketball
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="맨 위로"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
