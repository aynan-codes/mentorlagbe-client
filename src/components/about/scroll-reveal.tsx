"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const hiddenStyles = {
    up: "translate-y-12 opacity-0",
    left: "-translate-x-12 opacity-0",
    right: "translate-x-12 opacity-0",
    zoom: "scale-90 opacity-0",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : hiddenStyles[direction]
      } ${className}`}
    >
      {children}
    </div>
  );
}

type RevealImageProps = {
  src: string;
  alt: string;
  className?: string;
  direction?: "up" | "left" | "right" | "zoom";
};

export function RevealImage({
  src,
  alt,
  className = "",
  direction = "zoom",
}: RevealImageProps) {
  return (
    <ScrollReveal direction={direction} className={className}>
      <div className="group relative h-full min-h-[220px] w-full overflow-hidden rounded-3xl">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </ScrollReveal>
  );
}