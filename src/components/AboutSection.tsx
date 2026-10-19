import React from 'react';
import { about, membership, fees, timelineTitle } from '../data/clubContent';
const valueIcons = { Heart, Sparkles, Shield };
import { ClubTimelineItem, GalleryItem } from '../types';
import { ClubGallerySection } from './ClubGallerySection';
import { Dribbble, Heart, Shield, Sparkles, History, CheckCircle, ExternalLink } from 'lucide-react';

interface AboutSectionProps {
  timeline: ClubTimelineItem[];
  gallery: GalleryItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ timeline, gallery }) => {
  return (
    <section id="about" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="site-container space-y-16">

        {/* Section Header */}
        <div className="text-center sm:text-left max-w-3xl mx-auto sm:mx-0 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-white border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Dribbble className="heading-label-icon text-orange-400" />
            {about.label}
          </div>
          <h2 className="heading-section text-white tracking-tight">
            {about.title} <span className="heading-accent">{about.titleAccent}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 whitespace-pre-line">{about.description}</p>
        </div>

        {/* 3 Core Identity Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {about.values.map((value) => {
            const Icon = valueIcons[value.icon as keyof typeof valueIcons] ?? Heart;
            const amber = value.icon === 'Sparkles';
            return (
              <div key={value.title} className={`bg-slate-900/80 card-padding rounded-3xl border border-slate-800 space-y-4 transition-all ${amber ? 'hover:border-amber-500/40' : 'hover:border-orange-500/40'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center ${amber ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                    <Icon className="heading-card-icon" />
                  </div>
                  <h3 className="heading-card min-w-0 text-white">{value.title}</h3>
                </div>
                <p className="pl-[3.75rem] text-xs text-slate-300 leading-relaxed whitespace-pre-line">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline Section */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 panel-padding space-y-8">
          <div className="heading-row border-b border-slate-800 pb-4">
            <History className="heading-subsection-icon text-orange-400" />
            <h3 className="heading-subsection text-white">{timelineTitle}</h3>
          </div>

          <div className="relative border-l-2 border-orange-500/30 pl-6 sm:pl-8 space-y-8 ml-2">
            {timeline.map((item) => (
              <div key={`${item.year}-${item.title}`} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-slate-950 group-hover:scale-125 transition-transform" />

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white">{item.year}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="heading-card text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <ClubGallerySection gallery={gallery} />

        {/* Membership Guide & Fees Info */}
        <div className="space-y-6">
          <div className="bg-slate-950 panel-padding rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="heading-row">
              <Sparkles className="heading-subsection-icon text-orange-400" />
              <div>
                <h3 className="heading-subsection text-white">{membership.title}</h3>
              </div>
            </div>

            {/* Recruitment Eligibility */}
            <div className="space-y-3 text-xs text-slate-300">
              <h4 className="heading-item text-slate-100 flex items-center gap-1.5">
                <CheckCircle className="heading-item-icon text-orange-400" /> {membership.eligibilityTitle}
              </h4>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-300">
                {membership.eligibility.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>

            {/* Membership Fee Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="heading-item text-slate-100 flex items-center gap-1.5">
                <CheckCircle className="heading-item-icon text-orange-400" /> {membership.feesTitle}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{membership.joiningLabel}</span>
                  <span className="text-lg font-bold text-white font-mono">{fees.joining}</span>

                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{membership.monthlyLabel}</span>
                  <span className="text-lg font-bold text-white font-mono">{fees.monthly}</span>
                  <p className="text-[10px] text-slate-500 mt-1">{membership.monthlyDescription}</p>
                </div>
              </div>
            </div>

            {/* Membership Registration Information */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="heading-item text-slate-100 flex items-center gap-1.5">
                <CheckCircle className="heading-item-icon text-orange-400" />{membership.guideTitle}
              </h4>
              <a
                href={membership.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${membership.guideTitle} ${membership.guideLabel} (새 탭에서 열림)`}
                className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {membership.guideLabel}
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
