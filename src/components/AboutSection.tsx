import React, { useState } from 'react';
import { ClubTimelineItem, GalleryItem } from '../types';
import { Dribbble, Heart, Shield, Sparkles, Award, History, Image as ImageIcon, X, ChevronRight } from 'lucide-react';

interface AboutSectionProps {
  timeline: ClubTimelineItem[];
  gallery: GalleryItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ timeline, gallery }) => {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('전체');
  const [activeImageModal, setActiveImageModal] = useState<GalleryItem | null>(null);

  const galleryCategories = ['전체', '훈련', '대회', '소모임', '단체사진'];

  const filteredGallery = selectedGalleryCategory === '전체'
    ? gallery
    : gallery.filter(g => g.category === selectedGalleryCategory);

  return (
    <section id="about" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <Dribbble className="w-3.5 h-3.5" />
            한늬소개 (About Us)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            코트 위에서 하나되는 <span className="text-orange-500"> 한늬</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            '한늬'는 '끝까지 무언가를 꾸준히 그리고 열심히 함' 을 의미하는 순우리말 표현입니다. 
            농구를 좋아하는 사람들이 모여 원팀이 되는 곳입니다.
          </p>
        </div>

        {/* 3 Core Identity Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">포용적 팀 문화 (Inclusive)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              서로를 칭찬하고 북돋우는 따뜻한 분위기를 지향합니다. 나이, 직업을 넘어 농구로 소통합니다.
            </p>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">함께하는 성장 (Growth)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              팀원 서로가 가르쳐주고 배우며 함께 성장합니다.
            </p>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">안전 & 클린 코트 (Respect)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              부상 예방을 최우선으로 하며, 거친 비매너 행위를 엄격히 차단하여 누구나 안심하고 뛸 수 있는 환경을 만듭니다.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <History className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-black text-white">한늬 발자국</h3>
          </div>

          <div className="relative border-l-2 border-orange-500/30 pl-6 sm:pl-8 space-y-8 ml-2">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-slate-950 group-hover:scale-125 transition-transform" />
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-orange-400">{item.year}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
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

        {/* Club Gallery */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-400" />
              <h3 className="text-2xl font-extrabold text-white">클럽 갤러리 & 활동 모습</h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedGalleryCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGalleryCategory === cat
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveImageModal(img)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3] cursor-pointer hover:border-orange-500/50 transition-all shadow-lg"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-orange-400 border border-slate-800">
                    {img.category}
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">{img.date}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                      {img.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-950 rounded-3xl max-w-3xl w-full border border-slate-800 overflow-hidden space-y-4 p-4 sm:p-6"
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeImageModal.imageUrl}
              alt={activeImageModal.title}
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover rounded-2xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-400 font-bold">{activeImageModal.category}</span>
                <span className="text-xs text-slate-500">• {activeImageModal.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeImageModal.title}</h3>
              <p className="text-xs text-slate-300">{activeImageModal.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
