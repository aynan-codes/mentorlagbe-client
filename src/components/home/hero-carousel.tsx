"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=85",
    badge: "Your Learning Journey Starts Here",
    title: "Find the Right Tutor,",
    highlight: "Learn Better.",
    description:
      "Connect with qualified tutors, discover personalized tuition opportunities, and achieve your academic goals with MentorLagbe.",
    button: "Explore Tuitions",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=85",
    badge: "Education Made Easier",
    title: "Discover Better Ways",
    highlight: "To Learn.",
    description:
      "Explore learning opportunities that match your subjects, budget, location, and personal preferences.",
    button: "Find a Tutor",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85",
    badge: "Share Knowledge, Build Futures",
    title: "Teach What You Love,",
    highlight: "Inspire Others.",
    description:
      "Connect with students, showcase your teaching skills, and discover meaningful tutoring opportunities.",
    button: "Become a Tutor",
  },
];

const trustPoints = [
  "Verified Tutors",
  "Flexible Learning",
  "Easy Application",
];

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-background px-3 py-5 sm:px-5 sm:py-7 lg:px-6">
      <div
        className="group relative isolate min-h-[540px] overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-2xl shadow-primary/10 sm:min-h-[600px] lg:min-h-[660px] lg:rounded-[2rem]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        {/* Background Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out ${
              activeSlide === index
                ? "scale-100 opacity-100"
                : "scale-110 opacity-0"
            }`}
            style={{ backgroundImage: `url("${slide.image}")` }}
            aria-hidden="true"
          />
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />

        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-white/10 bg-primary/10 blur-3xl" />

        {/* Main Content */}
        <div className="container relative mx-auto flex min-h-[540px] items-center px-5 py-24 sm:min-h-[600px] sm:px-10 lg:min-h-[660px] lg:px-16">
          <div
            key={activeSlide}
            className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:text-sm">
              <Sparkles size={17} className="text-blue-300" />
              {slides[activeSlide].badge}
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {slides[activeSlide].title}

              <span className="mt-2 block bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {slides[activeSlide].highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base sm:leading-8 lg:text-lg">
              {slides[activeSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/tuitions"
                className="group/button inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/30 sm:h-14 sm:px-8"
              >
                {slides[activeSlide].button}

                <ArrowRight
                  size={19}
                  className="transition-transform group-hover/button:translate-x-1"
                />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-950 sm:h-14 sm:px-8"
              >
                <GraduationCap size={19} />
                Join MentorLagbe
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-xs font-medium text-slate-200 sm:text-sm"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-blue-400"
                  />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-10 sm:bottom-8">
          <div className="flex items-center justify-between px-5 sm:px-10 lg:px-16">
            {/* Slide Indicators */}
            <div className="flex items-center gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={
                    activeSlide === index ? "true" : undefined
                  }
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    activeSlide === index
                      ? "w-10 bg-primary"
                      : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary sm:h-11 sm:w-11"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary sm:h-11 sm:w-11"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Progress Indicator */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
          <div
            key={activeSlide}
            className="h-full bg-primary animate-in slide-in-from-left duration-500"
            style={{
              width: `${((activeSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}