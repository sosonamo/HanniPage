import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, X } from 'lucide-react';
import { GalleryItem } from '../types';
import galleryConfig from '../data/gallery.json';

interface ClubGallerySectionProps {
  gallery: GalleryItem[];
}

// AboutSection에서 사용하는 클럽 사진 갤러리입니다.
export const ClubGallerySection = ({ gallery }: ClubGallerySectionProps) => {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('전체');
  const [activeImageModal, setActiveImageModal] = useState<GalleryItem | null>(null);
  const galleryCategories = ['전체', ...new Set([...galleryConfig.categories, ...gallery.map((item) => item.category)].filter((category) => category !== '전체'))];
  const filteredGallery = selectedGalleryCategory === '전체'
    ? gallery
    : gallery.filter((item) => item.category === selectedGalleryCategory);

  return (
    <>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 panel-padding space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="heading-row">
            <ImageIcon className="heading-subsection-icon text-orange-400" />
            <h3 className="heading-subsection text-white">한늬 갤러리</h3>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {galleryCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedGalleryCategory === category}
                onClick={() => setSelectedGalleryCategory(category)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGalleryCategory === category
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((image) => (
            <div
              key={image.id}
              onClick={() => image.imageUrl && setActiveImageModal(image)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 transition-all shadow-lg"
            >
              {image.imageUrl && <div className="aspect-[4/3] w-full bg-black/30">
                <img
                src={image.imageUrl}
                alt={image.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
                />
              </div>}
              <div className="card-padding flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-slate-800">
                    {image.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{image.date}</span>
                </div>
                <div>
                  <h4 className="heading-card text-white transition-colors">
                    {image.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeImageModal && createPortal(
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative bg-slate-950 rounded-3xl max-w-3xl w-full border border-slate-800 max-h-[calc(100dvh-2rem)] overflow-y-auto space-y-4 image-dialog-padding"
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="갤러리 이미지 닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeImageModal.imageUrl}
              alt={activeImageModal.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[65dvh] object-contain rounded-2xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-bold">{activeImageModal.category}</span>
                <span className="text-xs text-slate-500">• {activeImageModal.date}</span>
              </div>
              <h3 className="heading-card text-white">{activeImageModal.title}</h3>
              <p className="text-xs text-slate-300">{activeImageModal.caption}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
