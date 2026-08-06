'use client';

import React, { useEffect, useRef } from 'react';
import { SPRING, Spring, VectorSpring, clamp, length2 } from '@/lib/cursor-physics';

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [data-cursor]';

/**
 * Liquid trailing cursor: a small dot rides on a snappy spring while a
 * frosted glass ring floats behind it on a loose spring. The ring elongates
 * along the direction of travel, swells over interactive targets, and
 * compresses on press. Spring-driven — never eased.
 */
const CursorGlow: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.classList.remove('hidden');

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    const dot = new VectorSpring(initialX, initialY, initialX, initialY, SPRING.snappy);
    const ring = new VectorSpring(initialX, initialY, initialX, initialY, SPRING.float);
    const scale = new Spring(1, 1, SPRING.glass);
    const press = new Spring(1, 1, SPRING.bounce);
    const opacity = new Spring(1, 1, SPRING.glass);
    opacity.snap(0);

    let pointerX = initialX;
    let pointerY = initialY;
    let lastX = initialX;
    let lastY = initialY;
    let vx = 0;
    let vy = 0;
    let lastTime = 0;
    let hovering = false;
    let interactiveRef = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!hovering) {
        hovering = true;
        opacity.setTarget(1);
      }
      const target = e.target as Element | null;
      const next = !!target?.closest?.(INTERACTIVE_SELECTOR);
      if (next !== interactiveRef) interactiveRef = next;
    };

    const onDown = () => {
      press.setTarget(0.8);
    };

    const onUp = () => {
      press.setTarget(1);
    };

    const onLeave = () => {
      if (hovering) {
        hovering = false;
        opacity.setTarget(0);
      }
    };

    const onEnter = () => {
      if (!hovering) {
        hovering = true;
        opacity.setTarget(1);
      }
    };

    const loop = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 0;
      lastTime = now;

      if (dt > 0) {
        const rawVx = (pointerX - lastX) / dt;
        const rawVy = (pointerY - lastY) / dt;
        const a = 1 - Math.exp(-14 * dt);
        vx += (rawVx - vx) * a;
        vy += (rawVy - vy) * a;
      }
      lastX = pointerX;
      lastY = pointerY;

      dot.setTarget(pointerX, pointerY);
      ring.setTarget(pointerX, pointerY);
      scale.setTarget(interactiveRef ? 1.7 : 1);
      dot.update(dt);
      ring.update(dt);
      scale.update(dt);
      press.update(dt);
      opacity.update(dt);

      const speed = length2(vx, vy);
      const stretch = clamp(1 + speed * 0.00035, 1, 1.28);
      const angle = Math.atan2(vy, vx);

      dotEl.style.opacity = String(opacity.value);
      dotEl.style.transform = `translate3d(${dot.x.value}px, ${dot.y.value}px, 0) translate(-50%, -50%) scale(${press.value})`;

      const base = scale.value * press.value;
      ringEl.style.opacity = String(opacity.value * 0.9);
      ringEl.style.transform =
        `translate3d(${ring.x.value}px, ${ring.y.value}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${base * stretch}, ${base * (2 - stretch)})`;

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseenter', onEnter);
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden"
    >
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
};

CursorGlow.displayName = 'CursorGlow';

export { CursorGlow };
