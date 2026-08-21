import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

export default function HeroSlider({ slides, settings, globalSettings, products, openEnquiry }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const duration = settings?.transitionSpeed || 5000;
  const autoplay = settings?.autoplay !== false;

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [slides.length, autoplay, duration]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeIdx];
  const overlayOpacity = settings?.overlayOpacity || 0.45;

  return (
    <section className="relative w-full h-[100vh] bg-primary-dark overflow-hidden flex items-center">
      {/* Background slide images */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeIdx ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.desktopImage || slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover object-center ${
              slides.length > 1
                ? `transition-transform duration-[10000ms] ease-out ${idx === activeIdx ? 'scale-108' : 'scale-100'}`
                : 'scale-100'
            }`}
          />
          <div
            className="absolute inset-0 bg-primary-dark"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      ))}

      {/* Slide Text Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full text-white min-h-[50vh] flex flex-col justify-center select-none pointer-events-none">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute left-6 right-6 md:left-8 md:right-8 flex flex-col justify-center transition-all duration-1000 ease-in-out ${
              idx === activeIdx
                ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                : 'opacity-0 translate-y-8 pointer-events-none z-0'
            }`}
          >
            <div className="max-w-3xl space-y-4 md:space-y-6">
              {slide.eyebrow && (
                <span className={`inline-block text-xs md:text-sm font-bold tracking-widest text-brass uppercase transition-all duration-700 delay-200 ${
                  idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                  {slide.eyebrow}
                </span>
              )}
              
              <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold font-serif leading-tight tracking-tight text-white transition-all duration-700 delay-300 ${
                idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {slide.title}
              </h1>

              {slide.subtitle && (
                <p className={`text-xl md:text-2xl font-light font-serif italic text-zinc-200 transition-all duration-700 delay-500 ${
                  idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.subtitle}
                </p>
              )}

              {slide.description && (
                <p className={`text-sm md:text-base text-zinc-300 max-w-xl font-normal leading-relaxed select-text transition-all duration-700 delay-700 ${
                  idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className={`flex flex-wrap gap-4 pt-6 transition-all duration-700 delay-1000 ${
              idx === activeIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {slide.ctaText1 && (
                <Link
                  to={slide.ctaUrl1 || '/products'}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
                >
                  {slide.ctaText1}
                </Link>
              )}

              <button
                onClick={() => openEnquiry()}
                className="flex items-center gap-2 px-6 py-3 border border-white/40 hover:border-white hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm"
              >
                <Mail size={14} />
                {slide.ctaText2 || 'Request Quote'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-2 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-2 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIdx ? 'w-6 bg-brass' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
