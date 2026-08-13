import { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ gallery, heroImage }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = gallery && gallery.length > 0 ? gallery : heroImage ? [heroImage] : [];

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-sand/10 border border-sand/40 rounded flex items-center justify-center text-zinc-450 text-sm">
        No images available
      </div>
    );
  }

  const activeImage = images[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sand/65 bg-zinc-950 group">
        <img
          src={activeImage.url}
          alt={activeImage.altText || 'Product Close Up'}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
        />
        
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black text-white border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Fullscreen view"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={img._id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`aspect-square rounded border overflow-hidden bg-zinc-950 transition-all ${
                activeIdx === idx
                  ? 'border-accent ring-2 ring-accent/20 scale-102'
                  : 'border-sand/60 hover:border-sand'
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || 'Product Thumbnail'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 text-white select-none">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <img
              src={activeImage.url}
              alt={activeImage.altText || 'Product Fullscreen'}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {activeImage.altText && (
            <div className="mt-4 max-w-xl text-center text-xs text-zinc-400">
              <p className="select-text">{activeImage.altText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
