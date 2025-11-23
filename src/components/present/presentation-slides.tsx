'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TitleSlide } from './slides/title-slide';
import { Problem1Slide } from './slides/problem1-slide';
import { Problem2Slide } from './slides/problem2-slide';
import { SolutionSlide } from './slides/solution-slide';
import { TechStackSlide } from './slides/tech-stack-slide';
import { DemoSlide } from './slides/demo-slide';

const slides = [
  TitleSlide,
  Problem1Slide,
  Problem2Slide,
  SolutionSlide,
  TechStackSlide,
  DemoSlide,
];

export function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full w-full"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation indicators */}
      <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-sky-400'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="fixed left-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {currentSlide < slides.length - 1 && (
        <button
          onClick={nextSlide}
          className="fixed right-8 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Slide counter */}
      <div className="fixed right-8 top-8 text-sm text-white/50">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
