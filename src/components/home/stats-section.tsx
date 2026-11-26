"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Active Students",
    value: 1200,
    suffix: "+",
    icon: Users,
    description: "Students learning with us",
  },
  {
    label: "Verified Tutors",
    value: 350,
    suffix: "+",
    icon: GraduationCap,
    description: "Qualified teaching experts",
  },
  {
    label: "Available Tuitions",
    value: 500,
    suffix: "+",
    icon: BookOpen,
    description: "Opportunities to explore",
  },
  {
    label: "Successful Applications",
    value: 800,
    suffix: "+",
    icon: CheckCircle2,
    description: "Learning connections made",
  },
];

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let current = 0;
    const duration = 1600;
    const steps = 60;
    const increment = value / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={counterRef}>
      {count.toLocaleString("en-BD")}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-muted/30 py-20 sm:py-24">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <TrendingUp size={17} />
            Our Achievements
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Growing Together with
            <span className="block text-primary">MentorLagbe</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            We are building a learning community where students and tutors
            connect, grow, and achieve their educational goals together.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 sm:p-8"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Card Decorative Shape */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

                {/* Icon */}
                <div className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <Icon size={27} strokeWidth={2} />
                </div>

                {/* Counter */}
                <div className="relative">
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    <AnimatedCounter value={stat.value} />
                    <span className="ml-0.5 text-primary">
                      {stat.suffix}
                    </span>
                  </h3>

                  <p className="mt-3 font-bold text-foreground">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}