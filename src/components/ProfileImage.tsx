import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export type ProfileSize = 'hero' | 'lg' | 'md' | 'sm' | 'xs';

interface ProfileImageProps {
  className?: string;
  size?: ProfileSize;
  interactive?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  glowIntensity?: 'high' | 'medium' | 'subtle';
  id?: string;
  imageSrc?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  className = '',
  size = 'hero',
  interactive = true,
  showBadge = true,
  badgeText = 'IDENTITY // VERIFIED',
  glowIntensity = 'high',
  id = 'cyber-profile-image',
  imageSrc,
}) => {
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(imageSrc || null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // 3D Parallax Tilt state
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    setActiveImageSrc(imageSrc || null);
  }, [imageSrc]);

  const handleImageError = () => {
    setActiveImageSrc(null);
  };

  // Handle subtle 3D tilt on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || prefersReducedMotion || size === 'sm' || size === 'xs' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Controlled tilt angles (max ±6 degrees)
    const tiltX = ((y - centerY) / centerY) * -6;
    const tiltY = ((x - centerX) / centerX) * 6;
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ x: tiltX, y: tiltY, glowX, glowY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });
  };

  // Dimension mapping
  const sizeClasses: Record<ProfileSize, {
    container: string;
    imageBox: string;
    outerPadding: string;
    badgeSize: string;
    iconSize: string;
    monogramSize: string;
    subSize: string;
  }> = {
    hero: {
      container: 'w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80',
      imageBox: 'w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72',
      outerPadding: 'p-3 sm:p-4',
      badgeSize: 'text-[10px] sm:text-[11px] px-3 py-1',
      iconSize: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
      monogramSize: 'text-4xl sm:text-5xl lg:text-6xl',
      subSize: 'text-xs sm:text-sm',
    },
    lg: {
      container: 'w-40 h-40 sm:w-48 sm:h-48',
      imageBox: 'w-36 h-36 sm:w-44 sm:h-44',
      outerPadding: 'p-2',
      badgeSize: 'text-[9px] px-2 py-0.5',
      iconSize: 'w-3 h-3',
      monogramSize: 'text-2xl sm:text-3xl',
      subSize: 'text-[10px] sm:text-xs',
    },
    md: {
      container: 'w-24 h-24 sm:w-28 sm:h-28',
      imageBox: 'w-22 h-22 sm:w-26 sm:h-26',
      outerPadding: 'p-1.5',
      badgeSize: 'text-[8px] px-1.5 py-0.5',
      iconSize: 'w-2.5 h-2.5',
      monogramSize: 'text-xl',
      subSize: 'text-[9px]',
    },
    sm: {
      container: 'w-10 h-10',
      imageBox: 'w-9 h-9',
      outerPadding: 'p-0.5',
      badgeSize: 'text-[7px]',
      iconSize: 'w-2 h-2',
      monogramSize: 'text-xs',
      subSize: 'hidden',
    },
    xs: {
      container: 'w-8 h-8',
      imageBox: 'w-7 h-7',
      outerPadding: 'p-0.5',
      badgeSize: 'hidden',
      iconSize: 'w-2 h-2',
      monogramSize: 'text-[10px]',
      subSize: 'hidden',
    },
  };

  const currentSize = sizeClasses[size];

  // Derive initials from name (e.g. "YN" for Yeasin Nehal)
  const initials = PERSONAL_INFO.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      id={id}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{
        perspective: size === 'hero' ? '1000px' : 'none',
      }}
    >
      {/* Dynamic 3D Transform Wrapper */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform:
            interactive && !prefersReducedMotion && size === 'hero'
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`
              : 'none',
        }}
      >
        {/* Layer 1: Outer Neon Ambient Glow Aura */}
        <div
          className={`absolute -inset-2 sm:-inset-4 rounded-full pointer-events-none transition-opacity duration-700 ${
            glowIntensity === 'high'
              ? 'opacity-80 sm:opacity-90 blur-xl sm:blur-2xl'
              : glowIntensity === 'medium'
              ? 'opacity-60 blur-md sm:blur-lg'
              : 'opacity-40 blur-sm'
          } ${!prefersReducedMotion ? 'animate-neon-pulse' : ''}`}
          style={{
            background:
              size === 'hero'
                ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(6, 182, 212, 0.45), rgba(59, 130, 246, 0.25) 45%, rgba(16, 185, 129, 0.15) 75%, transparent 90%)`
                : 'radial-gradient(circle, rgba(6, 182, 212, 0.35), rgba(59, 130, 246, 0.2) 60%, transparent 85%)',
          }}
        />

        {/* Layer 2: Cyber Geometry Rotating Energy Ring */}
        <div
          className={`relative ${currentSize.container} rounded-full flex items-center justify-center`}
        >
          {/* Animated Conic Gradient Neon Perimeter Ring */}
          <div
            className={`absolute inset-0 rounded-full ${
              !prefersReducedMotion ? 'animate-neon-spin' : ''
            }`}
            style={{
              padding: size === 'hero' ? '3px' : '2px',
              background: `conic-gradient(from 0deg, #00f0ff, #38bdf8 25%, #6366f1 50%, #10b981 75%, #00f0ff 100%)`,
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #fff calc(100% - 2px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #fff calc(100% - 2px))',
            }}
          />

          {/* Reverse Micro-Tick Accent Ring for high-tech precision */}
          {(size === 'hero' || size === 'lg') && (
            <div
              className={`absolute -inset-1.5 sm:-inset-2 rounded-full border border-dashed border-cyan-500/30 pointer-events-none ${
                !prefersReducedMotion ? 'animate-neon-spin-reverse' : ''
              }`}
            />
          )}

          {/* Precision Cyber Cardinal Nodes for Hero */}
          {size === 'hero' && (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff] z-20" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] z-20" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] z-20" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1] z-20" />
            </>
          )}

          {/* Layer 3: Inner High-Depth Shield & Inner Luminous Bezel */}
          <div
            className={`relative ${currentSize.imageBox} rounded-full overflow-hidden bg-[#040810] border-[1.5px] border-cyan-400/80 shadow-[inset_0_0_16px_rgba(6,182,212,0.4),0_0_12px_rgba(6,182,212,0.35)] flex items-center justify-center z-10`}
          >
            {/* Background tech grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0" />

            {/* Custom Image if provided, else Sleek Cyber Developer Monogram */}
            {activeImageSrc ? (
              <img
                src={activeImageSrc}
                alt={`${PERSONAL_INFO.name} (@${PERSONAL_INFO.handle}) - Backend Systems & Security`}
                className="w-full h-full object-cover object-[center_15%] select-none z-10 transition-transform duration-500 hover:scale-[1.03]"
                referrerPolicy="no-referrer"
                loading={size === 'hero' ? 'eager' : 'lazy'}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1424] via-[#070d18] to-[#040810] text-center p-3 z-10 relative">
                {/* Circuit node decorative accents */}
                <div className="absolute top-3 right-3 text-cyan-500/20 pointer-events-none">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="absolute bottom-3 left-3 text-cyan-500/20 pointer-events-none">
                  <Terminal className="w-6 h-6" />
                </div>

                <div className="relative flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-cyan-400/80 mb-1">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-cyan-300">
                      SEC // ARCH
                    </span>
                  </div>

                  <span
                    className={`font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-400 drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)] ${currentSize.monogramSize}`}
                  >
                    {initials}
                  </span>

                  <span
                    className={`font-mono font-semibold text-cyan-300 mt-1 ${currentSize.subSize}`}
                  >
                    @{PERSONAL_INFO.handle}
                  </span>

                  {size === 'hero' && (
                    <div className="mt-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>ONLINE // SYSTEMS READY</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inner Cyber Shadow Vignette */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(4,8,16,0.8)] pointer-events-none z-20" />

            {/* Subtle Horizontal Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 scanline opacity-25" />
          </div>
        </div>
      </div>

      {/* Layer 4: Verified Telemetry Badge for Hero / LG */}
      {showBadge && (size === 'hero' || size === 'lg') && (
        <div className="relative -mt-3 sm:-mt-4 z-30 flex items-center justify-center">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#080d1a]/95 border border-cyan-500/50 ${currentSize.badgeSize} font-mono font-bold text-cyan-300 shadow-lg shadow-black/80 backdrop-blur-md`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
            <span className="tracking-wider">{badgeText}</span>
            <ShieldCheck className={`${currentSize.iconSize} text-cyan-400`} />
          </div>
        </div>
      )}
    </div>
  );
};
