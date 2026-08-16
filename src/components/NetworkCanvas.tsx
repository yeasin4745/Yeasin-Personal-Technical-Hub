import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
}

interface Packet {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const NetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isPaused = false;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) {
        drawStaticLayout();
      }
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    // Pause rendering when tab is hidden to save battery & CPU
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dynamic node scaling based on device profile
    const nodeCount = isMobile
      ? Math.min(Math.floor(width / 45), 18)
      : Math.min(Math.floor(width / 32), 40);

    const nodes: Node[] = [];
    const colors = ['#00f0ff', '#38bdf8', '#10b981', '#6366f1'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        radius: Math.random() * 1.5 + 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Static fallback render for reduced motion
    const drawStaticLayout = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isMobile ? 100 : 130;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.1;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    if (prefersReducedMotion) {
      drawStaticLayout();
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Packet transmission simulator along network edges
    const packets: Packet[] = [];
    const maxPackets = isMobile ? 3 : 6;

    const spawnPacket = () => {
      if (packets.length >= maxPackets || nodes.length < 2) return;
      const s = Math.floor(Math.random() * nodes.length);
      let t = Math.floor(Math.random() * nodes.length);
      while (t === s) {
        t = Math.floor(Math.random() * nodes.length);
      }
      packets.push({
        sourceIndex: s,
        targetIndex: t,
        progress: 0,
        speed: 0.008 + Math.random() * 0.01,
        color: Math.random() > 0.4 ? '#00f0ff' : '#10b981',
      });
    };

    let tick = 0;

    const render = () => {
      if (isPaused) return;

      tick++;
      ctx.clearRect(0, 0, width, height);

      // Spawn periodic packet transmissions
      if (tick % (isMobile ? 120 : 75) === 0 && Math.random() > 0.3) {
        spawnPacket();
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse gravity pull (desktop only)
        if (!isMobile && mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 10) {
            node.x += (dx / dist) * 0.25;
            node.y += (dy / dist) * 0.25;
          }
        }

        // Draw node
        node.pulsePhase += 0.025;
        const currentRadius = node.radius + Math.sin(node.pulsePhase) * 0.4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.55;
        ctx.fill();

        // Connect adjacent network nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isMobile ? 105 : 130;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Update and draw packets hopping through network links
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        const src = nodes[pkt.sourceIndex];
        const tgt = nodes[pkt.targetIndex];

        if (!src || !tgt || pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const px = src.x + (tgt.x - src.x) * pkt.progress;
        const py = src.y + (tgt.y - src.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="network-interactive-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
    />
  );
};
