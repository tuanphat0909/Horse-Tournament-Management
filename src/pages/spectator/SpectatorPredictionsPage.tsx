import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type PredResult = 'correct' | 'incorrect' | 'pending';
type Tab = PredResult | 'all';

const PREDICTIONS = [
  { id: 1, horse: 'Thunderstrike', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', predictedPos: 1, actualPos: 1, amount: '200 coins', prize: '+1,000 coins', result: 'correct' as PredResult, date: '14/06/2026' },
  { id: 2, horse: 'Desert Wind',   race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', predictedPos: 1, actualPos: 2, amount: '100 coins', prize: '—', result: 'incorrect' as PredResult, date: '14/06/2026' },
  { id: 3, horse: 'Storm Rider',   race: 'Vòng 4 - Bán Kết',       tournament: 'Giải Xuân 2026', predictedPos: 1, actualPos: null, amount: '500 coins', prize: '—', result: 'pending' as PredResult, date: '18/06/2026' },
  { id: 4, horse: 'Silver Arrow',  race: 'Vòng 4 - Bán Kết',       tournament: 'Giải Xuân 2026', predictedPos: 2, actualPos: null, amount: '300 coins', prize: '—', result: 'pending' as PredResult, date: '18/06/2026' },
  { id: 5, horse: 'Thunderstrike', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', predictedPos: 1, actualPos: 2, amount: '200 coins', prize: '—', result: 'incorrect' as PredResult, date: '11/06/2026' },
  { id: 6, horse: 'Desert Wind',   race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', predictedPos: 1, actualPos: 1, amount: '250 coins', prize: '+1,200 coins', result: 'correct' as PredResult, date: '11/06/2026' },
  { id: 7, horse: 'Golden Flash',  race: 'Vòng 4 - Bán Kết',       tournament: 'Giải Xuân 2026', predictedPos: 3, actualPos: null, amount: '120 coins', prize: '—', result: 'pending' as PredResult, date: '18/06/2026' },
];

const RESULT_CONFIG: Record<PredResult, { label: string; color: string; icon: typeof Clock }> = {
  correct:   { label: 'Đúng', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  incorrect: { label: 'Sai', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
  pending:   { label: 'Chờ kết quả', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
};

const TABS: [Tab, string][] = [['all', 'Tất cả'], ['pending', 'Chờ kết quả'], ['correct', 'Đúng'], ['incorrect', 'Sai']];

export function SpectatorPredictionsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = tab === 'all' ? PREDICTIONS : PREDICTIONS.filter(p => p.result === tab);
  const counts: Record<Tab, number> = {
    all: PREDICTIONS.length,
    pending: PREDICTIONS.filter(p => p.result === 'pending').length,
    correct: PREDICTIONS.filter(p => p.result === 'correct').length,
    incorrect: PREDICTIONS.filter(p => p.result === 'incorrect').length,
  };

  const totalWon = '2,200 coins';
  const accuracy = `${Math.round((counts.correct / (counts.correct + counts.incorrect)) * 100)}%`;

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Dự đoán của tôi"
            subtitle="Dự đoán kết quả và nhận thưởng"
            imageUrl="/images/hero-spectator.jpg"
            imagePosition="center 50%"
            actions={
              <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> Thêm dự đoán
              </button>
            }
          />

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Tổng tiền thưởng', value: totalWon, icon: Sparkles, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20' },
              { label: 'Tỉ lệ đúng', value: accuracy, icon: TrendingUp, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20' },
              { label: 'Tổng dự đoán', value: PREDICTIONS.length, icon: CheckCircle, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20' },
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

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-glass-border">
            {TABS.map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-white'}`}>
                {label} <span className="ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-muted">{counts[t]}</span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map((p, i) => {
              const cfg = RESULT_CONFIG[p.result];
              const Icon = cfg.icon;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl p-5 border border-glass-border hover:border-gold/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl shrink-0">🐴</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-base font-serif font-bold text-white">{p.horse}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                          <Icon size={10} /> {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted">
                        <span>{p.race} — {p.tournament}</span>
                        <span>Dự đoán: <span className="text-champagne font-bold">Hạng {p.predictedPos}</span></span>
                        {p.actualPos && <span>Thực tế: <span className={p.actualPos === p.predictedPos ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>Hạng {p.actualPos}</span></span>}
                        <span className="text-muted/60">{p.date}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted">Cược: {p.amount}</div>
                      <div className={`text-sm font-bold ${p.result === 'correct' ? 'text-gold' : 'text-muted'}`}>{p.prize}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Add modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-7 w-full max-w-md border border-glass-border">
                <h3 className="text-lg font-serif text-white mb-5">Thêm dự đoán mới</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Cuộc đua</label>
                    <select className="w-full bg-[#0B1628] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold/40 transition-colors">
                      <option>Vòng 4 - Bán Kết (20/06/2026)</option>
                      <option>Chung Kết (28/06/2026)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Ngựa dự đoán</label>
                    <select className="w-full bg-[#0B1628] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold/40 transition-colors">
                      <option>Thunderstrike</option>
                      <option>Desert Wind</option>
                      <option>Storm Rider</option>
                      <option>Silver Arrow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Hạng dự đoán</label>
                    <select className="w-full bg-[#0B1628] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold/40 transition-colors">
                      <option value="1">Hạng 1</option>
                      <option value="2">Hạng 2</option>
                      <option value="3">Hạng 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Số coins cược <span className="text-muted/60">(Số dư: 3,500 coins)</span></label>
                    <input type="number" placeholder="100" min="10" className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-lg text-sm text-muted border border-glass-border hover:text-white transition-colors">Hủy</button>
                  <button onClick={() => setShowAdd(false)} className="btn-gold px-6 py-2 rounded-lg text-sm font-bold">Xác nhận dự đoán</button>
                </div>
              </motion.div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
