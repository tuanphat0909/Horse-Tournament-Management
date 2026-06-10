import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, DollarSign, Search, ChevronRight, Eye } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

const TOURNAMENTS = [
  { id: 1, name: 'Giải Đua Mùa Xuân 2026', start: '01/06/2026', end: '30/06/2026', horses: 42, jockeys: 18, prize: '₫850.000.000', status: 'active', rounds: 6, currentRound: 3, location: 'Trường đua Phú Thọ', desc: 'Giải đua truyền thống mở màn mùa giải 2026, quy tụ các ngựa xuất sắc nhất từ khắp cả nước.' },
  { id: 2, name: 'Cúp Vô Địch Quốc Gia 2026', start: '15/07/2026', end: '20/08/2026', horses: 60, jockeys: 24, prize: '₫2.400.000.000', status: 'upcoming', rounds: 8, currentRound: 0, location: 'Trường đua Đại Nam', desc: 'Giải đấu lớn nhất trong năm, xác định nhà vô địch đua ngựa quốc gia.' },
  { id: 3, name: 'Giải Khai Mạc Hè 2026', start: '10/07/2026', end: '15/07/2026', horses: 24, jockeys: 12, prize: '₫320.000.000', status: 'upcoming', rounds: 4, currentRound: 0, location: 'Trường đua Phú Thọ', desc: 'Giải đua ngắn hạn khai mạc mùa hè, cơ hội thú vị cho các ngựa trẻ.' },
];

const STATUS_CONFIG = {
  active:    { label: 'Đang diễn ra', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400 animate-pulse' },
  upcoming:  { label: 'Sắp diễn ra', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  completed: { label: 'Đã kết thúc', color: 'text-muted bg-white/5 border-glass-border', dot: 'bg-muted' },
};

export function SpectatorTournamentsPage() {
  const [search, setSearch] = useState('');
  const filtered = TOURNAMENTS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Giải đấu</h1>
              <p className="text-sm text-muted mt-1">Theo dõi các giải đua đang diễn ra và sắp tới</p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 w-64">
              <Search size={14} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm giải đấu..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
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
                      </div>
                      <p className="text-xs text-muted mb-3 leading-relaxed">{t.desc}</p>
                      <div className="flex flex-wrap items-center gap-5 text-xs text-muted mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={11} className="text-gold/60" /> {t.start} – {t.end}</span>
                        <span className="flex items-center gap-1.5"><Users size={11} className="text-gold/60" /> {t.horses} ngựa · {t.jockeys} nài</span>
                        <span className="flex items-center gap-1.5"><DollarSign size={11} className="text-gold/60" /> {t.prize}</span>
                        <span className="text-muted/60">{t.location}</span>
                      </div>
                      {t.status === 'active' && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted">Tiến độ: Vòng {t.currentRound}/{t.rounds}</span>
                            <span className="text-gold font-bold">{Math.round((t.currentRound / t.rounds) * 100)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-gold to-champagne"
                              initial={{ width: 0 }} animate={{ width: `${(t.currentRound / t.rounds) * 100}%` }} transition={{ delay: 0.3, duration: 0.6 }} />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <button className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Eye size={13} /> Theo dõi
                        </button>
                        <button className="px-5 py-2 rounded-lg text-xs font-medium text-muted border border-glass-border hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5">
                          Xem lịch thi đấu <ChevronRight size={13} />
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
