import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, XCircle, Trophy, TrendingUp, DollarSign, Search } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type TabType = 'all' | 'correct' | 'incorrect' | 'pending';

const PREDICTIONS = [
  { id: 1, spectator: 'Phạm Thu Hà', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', predicted: 'Thunderstrike', actual: 'Thunderstrike', correct: true, reward: '₫500.000', paid: true, submittedAt: '09/06/2026' },
  { id: 2, spectator: 'Bùi Thị Mai', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', predicted: 'Desert Wind', actual: 'Thunderstrike', correct: false, reward: '—', paid: false, submittedAt: '09/06/2026' },
  { id: 3, spectator: 'Ngô Minh Khoa', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', predicted: 'Thunderstrike', actual: 'Thunderstrike', correct: true, reward: '₫500.000', paid: false, submittedAt: '09/06/2026' },
  { id: 4, spectator: 'Phạm Thu Hà', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', predicted: 'Desert Wind', actual: 'Desert Wind', correct: true, reward: '₫500.000', paid: true, submittedAt: '11/06/2026' },
  { id: 5, spectator: 'Lê Thị Hoa', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', predicted: 'Silver Arrow', actual: 'Desert Wind', correct: false, reward: '—', paid: false, submittedAt: '11/06/2026' },
  { id: 6, spectator: 'Bùi Thị Mai', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', predicted: 'Thunderstrike', actual: null, correct: null, reward: '?', paid: false, submittedAt: '14/06/2026' },
  { id: 7, spectator: 'Phạm Thu Hà', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', predicted: 'Golden Flash', actual: null, correct: null, reward: '?', paid: false, submittedAt: '14/06/2026' },
];

const STATS = [
  { label: 'Tổng dự đoán', value: PREDICTIONS.length, icon: Target, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20' },
  { label: 'Dự đoán đúng', value: PREDICTIONS.filter(p => p.correct === true).length, icon: CheckCircle, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20' },
  { label: 'Đã trả thưởng', value: PREDICTIONS.filter(p => p.paid).length, icon: DollarSign, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20' },
  { label: 'Tỉ lệ chính xác', value: `${Math.round(PREDICTIONS.filter(p => p.correct === true).length / PREDICTIONS.filter(p => p.correct !== null).length * 100)}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20' },
];

export function AdminPredictionsPage() {
  const [tab, setTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');

  const filtered = PREDICTIONS.filter(p => {
    const matchTab = tab === 'all' || (tab === 'correct' && p.correct === true) || (tab === 'incorrect' && p.correct === false) || (tab === 'pending' && p.correct === null);
    const matchSearch = p.spectator.toLowerCase().includes(search.toLowerCase()) || p.predicted.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const TAB_CONFIG = {
    all: { label: 'Tất cả', count: PREDICTIONS.length },
    pending: { label: 'Chưa có kết quả', count: PREDICTIONS.filter(p => p.correct === null).length },
    correct: { label: 'Đúng', count: PREDICTIONS.filter(p => p.correct === true).length },
    incorrect: { label: 'Sai', count: PREDICTIONS.filter(p => p.correct === false).length },
  };

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Quản lý dự đoán"
            subtitle="Theo dõi và xét duyệt dự đoán khán giả"
            imageUrl="/images/hero-admin.jpg"
            imagePosition="center center"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel rounded-xl p-5 relative overflow-hidden"
              >
                <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.bg} blur-[30px] opacity-60`} />
                <div className="relative z-10 flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} border border-white/[0.08] flex items-center justify-center ${s.color}`}>
                    <s.icon size={16} />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-muted font-bold">{s.label}</span>
                </div>
                <div className="relative z-10 text-2xl font-serif font-bold text-white">{s.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Tabs + Table */}
          <div className="flex items-center gap-2 border-b border-glass-border pb-0">
            {(Object.keys(TAB_CONFIG) as TabType[]).map(t => {
              const cfg = TAB_CONFIG[t];
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-white'}`}
                >
                  {cfg.label}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${tab === t ? 'bg-gold/10 text-gold' : 'bg-white/5 text-muted'}`}>{cfg.count}</span>
                </button>
              );
            })}
            <div className="ml-auto mb-1 flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-1.5 w-56">
              <Search size={13} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm khán giả, ngựa..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border bg-navy-light/30">
                  {['Khán giả', 'Cuộc đua', 'Dự đoán', 'Kết quả thực tế', 'Đánh giá', 'Thưởng', 'Thanh toán'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-glass-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-serif font-bold text-cyan-300 text-sm shrink-0">
                          {p.spectator[0]}
                        </div>
                        <span className="text-sm font-medium text-white">{p.spectator}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-white">{p.race}</div>
                      <div className="text-xs text-muted">{p.submittedAt}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-champagne font-medium">
                        <Trophy size={13} className="text-gold/60" /> {p.predicted}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-white">{p.actual ?? <span className="text-muted italic">Chờ kết quả</span>}</td>
                    <td className="px-5 py-4">
                      {p.correct === null ? (
                        <span className="text-[11px] text-muted italic">—</span>
                      ) : p.correct ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle size={13} /> Đúng</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold"><XCircle size={13} /> Sai</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gold font-bold">{p.reward}</td>
                    <td className="px-5 py-4">
                      {p.correct && !p.paid && (
                        <button className="px-3 py-1 rounded bg-gold/15 text-gold text-xs font-bold border border-gold/20 hover:bg-gold/25 transition-colors">
                          Trả thưởng
                        </button>
                      )}
                      {p.paid && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1"><CheckCircle size={12} /> Đã trả</span>
                      )}
                      {p.correct === false && !p.paid && (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
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
