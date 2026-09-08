import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { GalleryItem } from '../../types';

interface ClubGallerySectionProps {
  gallery: GalleryItem[];
}

// 보관된 갤러리 섹션입니다. AboutSection에서 import해 렌더링하면 다시 사용할 수 있습니다.
export const ClubGallerySection = ({ gallery }: ClubGallerySectionProps) => {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('전체');
  const [activeImageModal, setActiveImageModal] = useState<GalleryItem | null>(null);
  const galleryCategories = ['전체', '훈련', '대회', '소모임', '단체사진'];
  const filteredGallery = selectedGalleryCategory === '전체'
    ? gallery
    : gallery.filter((item) => item.category === selectedGalleryCategory);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            <h3 className="text-2xl font-extrabold text-white">클럽 갤러리 & 활동 모습</h3>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {galleryCategories.map((category) => (
              <button
                key={category}
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
              onClick={() => setActiveImageModal(image)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3] cursor-pointer hover:border-orange-500/50 transition-all shadow-lg"
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-slate-800">
                  {image.category}
                </span>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">{image.date}</span>
                  <h4 className="text-sm font-bold text-white transition-colors">
                    {image.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative bg-slate-950 rounded-3xl max-w-3xl w-full border border-slate-800 overflow-hidden space-y-4 p-4 sm:p-6"
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
              className="w-full h-80 sm:h-96 object-cover rounded-2xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-bold">{activeImageModal.category}</span>
                <span className="text-xs text-slate-500">• {activeImageModal.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeImageModal.title}</h3>
              <p className="text-xs text-slate-300">{activeImageModal.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
