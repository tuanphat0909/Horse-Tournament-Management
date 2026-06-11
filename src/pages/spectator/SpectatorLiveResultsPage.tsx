import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Trophy, Clock, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const LIVE_RACE = {
  name: 'Vòng 3 - Chặng Sức Bền (Nhóm 2)', tournament: 'Giải Xuân 2026', distance: '2.000m',
  standings: [
    { pos: 1, horse: 'Silver Arrow', jockey: 'Nguyễn Mạnh Cường', time: '1:23.8', gap: '—', color: 'bg-gold' },
    { pos: 2, horse: 'Night Runner', jockey: 'Trần Văn Hòa', time: '1:24.3', gap: '+0.5s', color: 'bg-white/40' },
    { pos: 3, horse: 'Shadow Dancer', jockey: 'Bùi Minh Tâm', time: '1:25.1', gap: '+1.3s', color: 'bg-orange-400' },
    { pos: 4, horse: 'Crimson Flame', jockey: 'Lê Hoàng Nam', time: '1:25.7', gap: '+1.9s', color: 'bg-white/10' },
    { pos: 5, horse: 'Blue Thunder', jockey: 'Phạm Bá Dũng', time: '1:26.0', gap: '+2.2s', color: 'bg-white/10' },
    { pos: 6, horse: 'Sea Breeze', jockey: 'Đoàn Văn Khánh', time: '1:26.4', gap: '+2.6s', color: 'bg-white/10' },
  ],
};

const COMPLETED_RACES = [
  {
    id: 1, name: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026',
    results: [
      { pos: 1, horse: 'Thunderstrike', jockey: 'Trần Đức Minh', time: '2:05.4', prize: '₫85.000.000' },
      { pos: 2, horse: 'Desert Wind', jockey: 'Trần Đức Minh', time: '2:06.1', prize: '₫42.000.000' },
      { pos: 3, horse: 'Storm Rider', jockey: 'Phạm Quang Hùng', time: '2:06.8', prize: '₫21.000.000' },
    ],
  },
  {
    id: 2, name: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026',
    results: [
      { pos: 1, horse: 'Desert Wind', jockey: 'Trần Đức Minh', time: '1:41.5', prize: '₫85.000.000' },
      { pos: 2, horse: 'Thunderstrike', jockey: 'Trần Đức Minh', time: '1:42.8', prize: '₫42.000.000' },
      { pos: 3, horse: 'Golden Flash', jockey: 'Lý Minh Khôi', time: '1:43.2', prize: '₫21.000.000' },
    ],
  },
];

const POS_STYLE: Record<number, string> = {
  1: 'bg-gold/20 text-gold border-gold/30',
  2: 'bg-white/10 text-white border-white/20',
  3: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
};

export function SpectatorLiveResultsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Kết quả trực tiếp"
            subtitle="Theo dõi cuộc đua đang diễn ra"
            imageUrl="/images/hero-spectator.jpg"
            imagePosition="center 50%"
          />

          {/* Live race */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl border border-red-500/20 overflow-hidden">
            <div className="p-5 border-b border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> TRỰC TIẾP
                </span>
                <div>
                  <div className="text-base font-serif font-bold text-white">{LIVE_RACE.name}</div>
                  <div className="text-xs text-muted">{LIVE_RACE.tournament} • {LIVE_RACE.distance}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Clock size={12} /> Cập nhật liên tục
              </div>
            </div>

            {/* Visual leaderboard */}
            <div className="p-6 space-y-2.5">
              {LIVE_RACE.standings.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${s.pos === 1 ? 'bg-gold text-navy font-black' : s.pos === 2 ? 'bg-white/20 text-white' : s.pos === 3 ? 'bg-orange-500/30 text-orange-400' : 'bg-white/5 text-muted'}`}>
                    {s.pos}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{s.horse}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted">{s.jockey}</span>
                        <span className="font-mono text-champagne font-bold">{s.time}</span>
                        <span className="text-muted w-10 text-right">{s.gap}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div className={`h-full rounded-full ${s.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - (i * 8)}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Completed races */}
          <div>
            <h2 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-gold" /> Kết quả đã xác nhận
            </h2>
            <div className="space-y-4">
              {COMPLETED_RACES.map((race, i) => {
                const isOpen = expanded === race.id;
                return (
                  <motion.div key={race.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="glass-panel rounded-xl border border-glass-border overflow-hidden">
                    <button onClick={() => setExpanded(isOpen ? null : race.id)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <Activity size={16} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-serif font-bold text-white">{race.name}</div>
                        <div className="text-xs text-muted">{race.tournament} • {race.date}</div>
                      </div>
                      <ChevronDown size={16} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-glass-border">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-navy-light/20">
                              {['Hạng', 'Ngựa', 'Nài ngựa', 'Thời gian', 'Tiền thưởng'].map(h => (
                                <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {race.results.map((r, idx) => (
                              <tr key={idx} className="border-t border-glass-border/50 hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-sm border ${POS_STYLE[r.pos] ?? 'bg-white/5 text-muted border-glass-border'}`}>{r.pos}</div>
                                </td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-white">{r.horse}</td>
                                <td className="px-5 py-3.5 text-sm text-muted">{r.jockey}</td>
                                <td className="px-5 py-3.5 text-sm font-mono text-champagne font-bold">{r.time}</td>
                                <td className="px-5 py-3.5 text-sm text-gold font-bold">{r.prize}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
