import React, { useEffect, useState } from 'react';
import { SectionId, ScheduleEvent } from './types';
import { MOCK_ROSTER, MOCK_TIMELINE, MOCK_FAQS, MOCK_GALLERY } from './data/mockData';
import { NoticeBanner } from './components/NoticeBanner';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CoreMenuGrid } from './components/CoreMenuGrid';
import { ScheduleSection } from './components/ScheduleSection';
import { JoinFormSection } from './components/JoinFormSection';
import { AboutSection } from './components/AboutSection';
import { RosterSection } from './components/RosterSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import IntroOverlay from './components/IntroOverlay';
import { MembersSection } from './components/MembersSection';
import {
  fetchGoogleCalendarSchedules,
  isGoogleCalendarConfigured,
} from './services/googleCalendar';

import { useCalendarNow } from './hooks/useCalendarNow';
import { calendarDateKey, nextSchedule } from './services/scheduleDates';

export type CalendarStatus = 'fallback' | 'loading' | 'connected' | 'error';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus>('fallback');

  const now = useCalendarNow();
  const timeZone = import.meta.env.VITE_CALENDAR_TIME_ZONE || 'Asia/Seoul';
  const dateKey = calendarDateKey(now, timeZone);
  const upcoming = nextSchedule(schedules, now, timeZone);

  useEffect(() => {
    if (!isGoogleCalendarConfigured()) return;
    const controller = new AbortController();
    setCalendarStatus('loading');
    fetchGoogleCalendarSchedules(controller.signal).then(events => {
      if (controller.signal.aborted) return;
      setSchedules(events);
      setCalendarStatus('connected');
    }).catch(error => {
      if (controller.signal.aborted) return;
      console.error('Google Calendar 연동 실패:', error);
      setCalendarStatus('error');
    });
    return () => controller.abort();
  }, [dateKey]);

  useEffect(() => {
    const update = () => {
      const sections = ['hero', 'schedule', 'join', 'about', 'roster', 'members', 'faq'] as SectionId[];
      let current: SectionId = 'hero';
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 180) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenJoinForm = () => {
    scrollToSection('join');
  };

  const handleRsvpClick = (schedule?: ScheduleEvent) => {
    if (!schedule?.rsvpUrl) return;
    window.open(schedule.rsvpUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="hanni-site min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* Notice Banner */}
      <NoticeBanner
        nextSchedule={upcoming}
        onRsvpClick={() => handleRsvpClick(upcoming)}
      />

      {/* Main Header */}
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenJoinForm={handleOpenJoinForm}
      />

      {/* Hero Section */}
      <HeroSection
        onNavigate={scrollToSection}
        onOpenJoinForm={handleOpenJoinForm}
      />

      {/* Core 4 Icon Menu Grid Cards */}
      <CoreMenuGrid
        onNavigate={scrollToSection}
        onOpenJoinForm={handleOpenJoinForm}
      />

      {/* 1. Schedule Section */}
      <ScheduleSection
        schedules={schedules}
        calendarStatus={calendarStatus}
      />

      {/* 2. Join Form Section */}
      <JoinFormSection
        schedules={schedules}
        calendarStatus={calendarStatus}
        onRsvpClick={handleRsvpClick}
      />

      {/* 3. About Us Section */}
      <AboutSection
        timeline={MOCK_TIMELINE}
        gallery={MOCK_GALLERY}
      />

      {/* 4. Roster Section */}
      <RosterSection roster={MOCK_ROSTER} />

      {/* 5. FAQ Section */}
      <FaqSection faqs={MOCK_FAQS} />

      {/* 6. Members Section */}
      {/* <MembersSection /> */}

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenJoinForm={handleOpenJoinForm}
      />

      </div>
    </>
  );
}
