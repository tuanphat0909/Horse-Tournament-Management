import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

const RESULTS = [
  { id: 1, horse: 'Thunderstrike', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', pos: 1, time: '2:05.4', prize: '₫85.000.000' },
  { id: 2, horse: 'Desert Wind', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', pos: 2, time: '2:06.1', prize: '₫42.000.000' },
  { id: 3, horse: 'Thunderstrike', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', pos: 3, time: '1:42.8', prize: '₫21.000.000' },
  { id: 4, horse: 'Desert Wind', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', pos: 1, time: '1:41.5', prize: '₫85.000.000' },
  { id: 5, horse: 'Thunderstrike', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', date: '10/06/2026', pos: 1, time: '1:58.4', prize: '₫85.000.000' },
  { id: 6, horse: 'Silver Arrow', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', date: '10/06/2026', pos: 5, time: '2:02.1', prize: '—' },
];

const POS_STYLE: Record<number, string> = {
  1: 'bg-gold/20 text-gold border-gold/30',
  2: 'bg-white/10 text-white border-white/20',
  3: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
};

export function OwnerResultsPage() {
  const wins = RESULTS.filter(r => r.pos === 1).length;
  const top3 = RESULTS.filter(r => r.pos <= 3).length;

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div>
            <h1 className="text-2xl font-serif text-white">Kết quả & Tiền thưởng</h1>
            <p className="text-sm text-muted mt-1">Lịch sử thi đấu và thành tích của tất cả ngựa</p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng tiền thưởng', value: '₫318.000.000', icon: Trophy, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20' },
              { label: 'Số lần thắng (hạng 1)', value: wins, icon: Award, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20' },
              { label: 'Top 3', value: top3, icon: TrendingUp, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20' },
              { label: 'Số cuộc đua', value: RESULTS.length, icon: BarChart3, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-xl p-5 relative overflow-hidden">
                <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.bg} blur-[30px] opacity-60`} />
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} border border-white/[0.08] flex items-center justify-center ${s.color} mb-3 relative z-10`}>
                  <s.icon size={16} />
                </div>
                <div className="relative z-10 text-2xl font-serif font-bold text-white">{s.value}</div>
                <div className="relative z-10 text-[11px] text-muted font-medium mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Results Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden">
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
                {RESULTS.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
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
