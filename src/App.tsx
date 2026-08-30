import React, { useEffect, useState } from 'react';
import { SectionId, ScheduleEvent } from './types';
import { MOCK_SCHEDULES, MOCK_ROSTER, MOCK_TIMELINE, MOCK_GALLERY, MOCK_FAQS } from './data/mockData';
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
import {
  fetchGoogleCalendarSchedules,
  getMillisecondsUntilNextCalendarWeek,
  isGoogleCalendarConfigured,
} from './services/googleCalendar';

export type CalendarStatus = 'fallback' | 'loading' | 'connected' | 'error';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [schedules, setSchedules] = useState<ScheduleEvent[]>(MOCK_SCHEDULES);
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus>('fallback');

  useEffect(() => {
    if (!isGoogleCalendarConfigured()) return;

    let isActive = true;
    let weeklyRefreshTimer: number | undefined;

    const loadSchedules = () => {
      setCalendarStatus('loading');

      fetchGoogleCalendarSchedules()
        .then((events) => {
          if (!isActive) return;
          setSchedules(events);
          setCalendarStatus('connected');
        })
        .catch((error) => {
          if (!isActive) return;
          console.error('Google Calendar 연동 실패:', error);
          setCalendarStatus('error');
        });
    };

    const scheduleNextWeeklyRefresh = () => {
      weeklyRefreshTimer = window.setTimeout(() => {
        if (!isActive) return;
        loadSchedules();
        scheduleNextWeeklyRefresh();
      }, getMillisecondsUntilNextCalendarWeek());
    };

    loadSchedules();
    scheduleNextWeeklyRefresh();

    return () => {
      isActive = false;
      if (weeklyRefreshTimer !== undefined) {
        window.clearTimeout(weeklyRefreshTimer);
      }
    };
  }, []);

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* Notice Banner */}
      <NoticeBanner
        nextSchedule={schedules[0]}
        onRsvpClick={() => handleRsvpClick(schedules[0])}
        onJoinClick={handleOpenJoinForm}
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

      {/* FAQ Section */}
      <FaqSection faqs={MOCK_FAQS} />

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenJoinForm={handleOpenJoinForm}
      />

    </div>
  );
}
