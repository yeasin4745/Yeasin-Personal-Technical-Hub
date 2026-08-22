import React, { ReactNode } from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
  id?: string;
  amount?: number;
  blur?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.55,
  className = '',
  id,
  amount = 0.15,
  blur = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const getInitial = () => {
    const blurStyle = blur ? 'blur(4px)' : 'blur(0px)';
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, scale: 0.98, filter: blurStyle };
      case 'down':
        return { opacity: 0, y: -distance, scale: 0.98, filter: blurStyle };
      case 'left':
        return { opacity: 0, x: distance, scale: 0.98, filter: blurStyle };
      case 'right':
        return { opacity: 0, x: -distance, scale: 0.98, filter: blurStyle };
      case 'zoom':
        return { opacity: 0, scale: 0.92, filter: blurStyle };
      case 'none':
      default:
        return { opacity: 0, filter: blurStyle };
    }
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial={getInitial()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once: false, amount, margin: '-20px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  id?: string;
  amount?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.09,
  delayChildren = 0.05,
  id,
  amount = 0.1,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount, margin: '-30px' }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  id?: string;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  id,
  distance = 20,
  direction = 'up',
  duration = 0.5,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const getItemInitial = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: distance, scale: 0.98, filter: 'blur(3px)' };
      case 'right':
        return { opacity: 0, x: -distance, scale: 0.98, filter: 'blur(3px)' };
      case 'down':
        return { opacity: 0, y: -distance, scale: 0.98, filter: 'blur(3px)' };
      case 'up':
      default:
        return { opacity: 0, y: distance, scale: 0.98, filter: 'blur(3px)' };
    }
  };

  const itemVariants: Variants = {
    hidden: getItemInitial(),
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div id={id} className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};

export interface FadeInUpSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  amount?: number;
}

/**
 * High-performance Framer Motion container that adds a subtle, smooth
 * viewport-driven animation when major content sections enter/exit the viewport.
 */
export const FadeInUpSection: React.FC<FadeInUpSectionProps> = ({
  children,
  id,
  className = '',
  delay = 0,
  distance = 30,
  duration = 0.65,
  amount = 0.08,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: distance, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount, margin: '-30px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.section>
  );
};

/**
 * Cybersecurity HUD Container Frame with corner reticles and glowing border lines
 */
interface CyberHudFrameProps {
  children: ReactNode;
  className?: string;
  id?: string;
  accent?: 'cyan' | 'emerald' | 'indigo' | 'amber';
  active?: boolean;
}

export const CyberHudFrame: React.FC<CyberHudFrameProps> = ({
  children,
  className = '',
  id,
  accent = 'cyan',
  active = true,
}) => {
  const accentColors = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  };

  const cornerBorder = {
    cyan: 'border-cyan-400',
    emerald: 'border-emerald-400',
    indigo: 'border-indigo-400',
    amber: 'border-amber-400',
  };

  return (
    <div
      id={id}
      className={`relative rounded-xl border ${accentColors[accent]} p-6 transition-all duration-300 ${className}`}
    >
      {/* Corner Bracket Reticles */}
      <span
        className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${cornerBorder[accent]} rounded-tl-sm pointer-events-none`}
        aria-hidden="true"
      />
      <span
        className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${cornerBorder[accent]} rounded-tr-sm pointer-events-none`}
        aria-hidden="true"
      />
      <span
        className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${cornerBorder[accent]} rounded-bl-sm pointer-events-none`}
        aria-hidden="true"
      />
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${cornerBorder[accent]} rounded-br-sm pointer-events-none`}
        aria-hidden="true"
      />

      {children}
    </div>
  );
};
