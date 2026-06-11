import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Flag, Award, Star, BarChart3 } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const HISTORY = [
  { id: 1, horse: 'Thunderstrike', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', pos: 1, time: '2:05.4', prize: '₫21.000.000' },
  { id: 2, horse: 'Desert Wind', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', pos: 2, time: '2:06.1', prize: '₫10.500.000' },
  { id: 3, horse: 'Thunderstrike', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', pos: 3, time: '1:42.8', prize: '₫5.250.000' },
  { id: 4, horse: 'Desert Wind', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', pos: 1, time: '1:41.5', prize: '₫21.000.000' },
  { id: 5, horse: 'Thunderstrike', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', date: '10/06/2026', pos: 1, time: '1:58.4', prize: '₫21.000.000' },
  { id: 6, horse: 'Night Runner', race: 'Vòng 1 - Giải Xuân', tournament: 'Giải Xuân 2026', date: '10/06/2026', pos: 4, time: '2:03.2', prize: '—' },
];

const POS_STYLE: Record<number, string> = {
  1: 'bg-gold/20 text-gold border-gold/30',
  2: 'bg-white/10 text-white border-white/20',
  3: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
};

const wins = HISTORY.filter(r => r.pos === 1).length;
const top3 = HISTORY.filter(r => r.pos <= 3).length;
const winRate = Math.round((wins / HISTORY.length) * 100);

export function JockeyStatsPage() {
  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Thành tích"
            subtitle="Thống kê và hiệu suất thi đấu"
            imageUrl="/images/hero-jockey.jpg"
            imagePosition="center 25%"
          />

          {/* Overview stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Số lần thắng', value: wins, icon: Trophy, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20' },
              { label: 'Tổng cuộc đua', value: HISTORY.length, icon: Flag, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20' },
              { label: 'Tỉ lệ thắng', value: `${winRate}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20' },
              { label: 'Top 3', value: top3, icon: Award, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-xl p-5 relative overflow-hidden">
                <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.bg} blur-[30px] opacity-60`} />
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} border border-white/[0.08] flex items-center justify-center ${s.color} mb-3 relative z-10`}>
                  <s.icon size={16} />
                </div>
                <div className="relative z-10 text-3xl font-serif font-bold text-white">{s.value}</div>
                <div className="relative z-10 text-[11px] text-muted font-medium mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Win-rate visual + Ranking */}
          <div className="grid grid-cols-[1fr_280px] gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={16} className="text-gold" />
                <h2 className="text-base font-serif text-white">Phân bố kết quả</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Hạng 1', count: wins, total: HISTORY.length, color: 'bg-gold', text: 'text-gold' },
                  { label: 'Hạng 2', count: HISTORY.filter(r => r.pos === 2).length, total: HISTORY.length, color: 'bg-white/60', text: 'text-white' },
                  { label: 'Hạng 3', count: HISTORY.filter(r => r.pos === 3).length, total: HISTORY.length, color: 'bg-orange-400', text: 'text-orange-400' },
                  { label: 'Ngoài Top 3', count: HISTORY.filter(r => r.pos > 3).length, total: HISTORY.length, color: 'bg-white/20', text: 'text-muted' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className={`w-14 text-xs font-bold ${b.text}`}>{b.label}</span>
                    <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                      <motion.div className={`h-full rounded-full ${b.color}`}
                        initial={{ width: 0 }} animate={{ width: `${(b.count / b.total) * 100}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }} />
                    </div>
                    <span className={`w-6 text-sm font-bold ${b.text}`}>{b.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <Star size={28} className="text-gold mb-3" />
              <div className="text-4xl font-serif font-bold text-white mb-1">#5</div>
              <div className="text-sm text-muted mb-4">Hạng cá nhân mùa giải</div>
              <div className="w-full p-3 rounded-xl bg-gold/5 border border-gold/20">
                <div className="text-xs text-muted mb-1">Điểm tích lũy</div>
                <div className="text-2xl font-bold text-gold">1.240 pts</div>
              </div>
            </motion.div>
          </div>

          {/* Race history table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-xl overflow-hidden">
            <div className="p-5 border-b border-glass-border">
              <h2 className="text-base font-serif text-white">Lịch sử thi đấu</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border bg-navy-light/30">
                  {['Hạng', 'Ngựa', 'Cuộc đua', 'Giải đấu', 'Ngày', 'Thời gian', 'Tiền thưởng'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.04 }}
                    className="border-b border-glass-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-sm border ${POS_STYLE[r.pos] ?? 'bg-white/5 text-muted border-glass-border'}`}>
                        {r.pos}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-white">{r.horse}</td>
                    <td className="px-5 py-4 text-sm text-muted">{r.race}</td>
                    <td className="px-5 py-4 text-sm text-muted">{r.tournament}</td>
                    <td className="px-5 py-4 text-xs text-muted">{r.date}</td>
                    <td className="px-5 py-4 text-sm font-mono text-champagne font-bold">{r.time}</td>
                    <td className="px-5 py-4 text-sm text-gold font-bold">{r.prize}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
