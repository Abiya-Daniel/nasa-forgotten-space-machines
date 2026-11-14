import { useEffect, useRef } from 'react';

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const starCount = Math.min(180, Math.floor((width * height) / 11000));
    const stars = Array.from({ length: starCount }, (_, i) => {
      // Deterministic-feeling spread with varied depth
      const seed = (i * 9301 + 49297) % 233280;
      const r1 = seed / 233280;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + r1 * 1.3,
        alpha: 0.25 + r1 * 0.65,
        speed: 0.015 + r1 * 0.04,
        phase: r1 * Math.PI * 2,
      };
    });

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0012 + s.phase) * 0.18;
        const alpha = Math.max(0.1, Math.min(0.95, s.alpha + twinkle));
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          s.y -= s.speed;
          if (s.y < -4) {
            s.y = height + 4;
            s.x = Math.random() * width;
          }
        }
      }
    };

    let rafId = 0;
    if (prefersReducedMotion) {
      draw(0);
    } else {
      const tick = (t: number) => {
        draw(t);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) draw(0);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-75" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(148, 163, 184, 0.06), transparent 70%), radial-gradient(ellipse 65% 50% at 85% 20%, rgba(234, 88, 12, 0.07), transparent 70%)',
        }}
      />
    </div>
  );
}
