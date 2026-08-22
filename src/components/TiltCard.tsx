import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 6)
  glareOpacity?: number;
  glareColor?: 'cyan' | 'emerald' | 'indigo' | 'amber' | 'default';
  depth?: number; // 3D translateZ in px (default 8)
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  id,
  maxTilt = 6,
  glareOpacity = 0.15,
  glareColor = 'cyan',
  depth = 8,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });

  // Detect touch-only devices to avoid unnecessary mouse listeners
  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover)');
    setCanHover(hoverQuery.matches);

    const handleHoverChange = (e: MediaQueryListEvent) => {
      setCanHover(e.matches);
    };

    if (hoverQuery.addEventListener) {
      hoverQuery.addEventListener('change', handleHoverChange);
    } else {
      hoverQuery.addListener(handleHoverChange);
    }

    return () => {
      if (hoverQuery.removeEventListener) {
        hoverQuery.removeEventListener('change', handleHoverChange);
      } else {
        hoverQuery.removeListener(handleHoverChange);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !canHover || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized -1 to +1 range
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Invert Y for standard natural 3D tilt
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => {
    if (canHover && !shouldReduceMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  // Glare color mapping
  const getGlareGradient = () => {
    switch (glareColor) {
      case 'emerald':
        return `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(16, 185, 129, ${glareOpacity * 1.5}), transparent 60%)`;
      case 'indigo':
        return `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(99, 102, 241, ${glareOpacity * 1.5}), transparent 60%)`;
      case 'amber':
        return `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 158, 11, ${glareOpacity * 1.5}), transparent 60%)`;
      case 'cyan':
      default:
        return `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(6, 182, 212, ${glareOpacity * 1.5}), transparent 60%)`;
    }
  };

  if (shouldReduceMotion || !canHover) {
    return (
      <div id={id} className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1000px] transition-transform duration-300 ease-out ${className}`}
    >
      <div
        className="w-full h-full relative transition-all duration-200 ease-out [transform-style:preserve-3d]"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${depth}px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
        }}
      >
        {children}

        {/* Dynamic glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            background: getGlareGradient(),
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
