import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  subtitle: string;
  imageUrl: string;
  imagePosition?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHero({
  title,
  subtitle,
  imageUrl,
  imagePosition = 'right center',
  badge,
  actions,
}: PageHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
      style={{
        minHeight: '150px',
        background: `linear-gradient(to right, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.7) 40%, rgba(11,22,40,0.15) 100%), url('${imageUrl}') ${imagePosition} / cover no-repeat`,
      }}
    >
      <div
        className="relative z-10 px-8 py-6 flex flex-col items-start justify-center"
        style={{ minHeight: '150px' }}
      >
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl font-serif text-white mb-1">{title}</h1>
        <p className="text-sm text-muted">{subtitle}</p>
        {actions && <div className="flex gap-3 mt-4">{actions}</div>}
      </div>
    </motion.div>
  );
}
