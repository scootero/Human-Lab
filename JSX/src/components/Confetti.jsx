import { useEffect, useRef } from 'react';

export function launchConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 375;
  canvas.height = 820;
  const colors = ['#3b82f6', '#06d6a0', '#a855f7', '#fbbf24', '#f43f5e'];
  const pieces = [];
  for (let i = 0; i < 70; i++) {
    pieces.push({
      x: Math.random() * 375,
      y: -10,
      w: Math.random() * 8 + 4,
      h: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * 5)],
      rot: Math.random() * 360,
      rs: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      op: 1,
    });
  }
  let f = 0;
  function draw() {
    ctx.clearRect(0, 0, 375, 820);
    pieces.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = p.op;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rs;
      p.op -= 0.012;
    });
    f++;
    if (f < 140) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, 375, 820);
  }
  draw();
}

export function ConfettiCanvas({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => launchConfetti(ref.current), 300);
      return () => clearTimeout(t);
    }
  }, [active]);
  return <canvas id="confetti-canvas" ref={ref} />;
}
