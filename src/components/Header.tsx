import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import hanniLogo from '../../assets/한늬로고_최종_White.png';

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  onOpenJoinForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, onOpenJoinForm }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; label: string; index: string }[] = [
    { id: 'schedule', label: 'SCHEDULE', index: '01' },
    { id: 'join', label: 'JOIN US', index: '02' },
    { id: 'about', label: 'ABOUT', index: '03' },
    { id: 'roster', label: 'ROSTER', index: '04' },
    { id: 'faq', label: 'FAQ', index: '05' },
  ];

  const handleNavClick = (id: SectionId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`hanni-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-red-500/35 py-2'
          : 'bg-black/90 backdrop-blur-sm border-b border-white/10 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <img
            src={hanniLogo}
            alt="한늬 더 블레이저스 로고"
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <div className="headline-font text-lg sm:text-xl tracking-[0.05em] text-white leading-none">
              HANNI <span className="text-red-500">THE BLAZERS</span>
            </div>
            <p className="mt-1 text-[9px] text-slate-400 font-semibold tracking-[0.22em] uppercase">
              Women's Basketball Club · Since 2008
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-9">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-cut relative flex items-center gap-2 py-2 text-[11px] font-black tracking-[0.12em] transition-all duration-200 ${
                  isActive
                    ? 'text-red-500'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="font-mono text-[9px] text-slate-600">{item.index}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden xl:flex items-center gap-3">
          <button
            onClick={onOpenJoinForm}
            className="btn-primary group inline-flex items-center justify-center px-5 py-3 text-xs font-black tracking-[0.08em] text-white transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              JOIN THE TEAM
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-black border-b border-red-500/30 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1.5 pt-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 border-b text-sm font-black tracking-wider transition-all ${
                    isActive
                      ? 'bg-red-500/10 text-red-400 border-red-500'
                      : 'text-slate-200 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-500">{item.index}</span>
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
