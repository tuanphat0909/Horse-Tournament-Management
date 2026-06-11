import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, DollarSign, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const TOURNAMENTS = [
  { id: 1, name: 'Giải Đua Mùa Xuân 2026', start: '01/06/2026', end: '30/06/2026', horses: 42, prize: '₫850.000.000', status: 'active', registered: 2, location: 'Trường đua Phú Thọ' },
  { id: 2, name: 'Cúp Vô Địch Quốc Gia 2026', start: '15/07/2026', end: '20/08/2026', horses: 60, prize: '₫2.400.000.000', status: 'upcoming', registered: 1, location: 'Trường đua Đại Nam' },
  { id: 3, name: 'Giải Khai Mạc Hè 2026', start: '10/07/2026', end: '15/07/2026', horses: 24, prize: '₫320.000.000', status: 'upcoming', registered: 0, location: 'Trường đua Phú Thọ' },
];

const STATUS_CONFIG = {
  active:    { label: 'Đang diễn ra', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400 animate-pulse' },
  upcoming:  { label: 'Sắp diễn ra', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  completed: { label: 'Đã kết thúc', color: 'text-muted bg-white/5 border-glass-border', dot: 'bg-muted' },
};

export function OwnerTournamentsPage() {
  const [search, setSearch] = useState('');
  const filtered = TOURNAMENTS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Giải đấu"
            subtitle="Các giải đấu đang và sắp diễn ra"
            imageUrl="/images/hero-owner.jpg"
            imagePosition="center 58%"
          />

          <div className="flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 w-64">
            <Search size={14} className="text-muted shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm giải đấu..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
          </div>

          <div className="space-y-4">
            {filtered.map((t, i) => {
              const cfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-2xl p-6 border border-glass-border hover:border-gold/20 transition-all group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center shrink-0">
                      <Trophy size={24} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-serif text-white group-hover:text-champagne transition-colors">{t.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}
                        </span>
                        {t.registered > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-champagne bg-gold/10 border border-gold/20">
                            {t.registered} ngựa đã đăng ký
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-5 text-xs text-muted mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={11} className="text-gold/60" /> {t.start} – {t.end}</span>
                        <span className="flex items-center gap-1.5"><Users size={11} className="text-gold/60" /> {t.horses} ngựa tham gia</span>
                        <span className="flex items-center gap-1.5"><DollarSign size={11} className="text-gold/60" /> {t.prize}</span>
                        <span className="text-muted/60">{t.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {t.status !== 'completed' && (
                          <button className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            Đăng ký ngựa <ChevronRight size={13} />
                          </button>
                        )}
                        <button className="px-5 py-2 rounded-lg text-xs font-medium text-muted border border-glass-border hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5">
                          Xem chi tiết <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
