import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Flag, Clock } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Status = 'pending' | 'confirmed';

const RACES = [
  {
    id: 1, race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', status: 'pending' as Status,
    results: [
      { pos: 1, horse: 'Thunderstrike', jockey: 'Trần Đức Minh', time: '2:05.4', note: '' },
      { pos: 2, horse: 'Desert Wind', jockey: 'Trần Đức Minh', time: '2:06.1', note: '' },
      { pos: 3, horse: 'Storm Rider', jockey: 'Phạm Quang Hùng', time: '2:06.8', note: '' },
      { pos: 4, horse: 'Dark Knight', jockey: 'Lý Minh Khôi', time: '2:07.5', note: '' },
      { pos: 5, horse: 'Golden Flash', jockey: 'Đỗ Văn Long', time: '2:08.2', note: '' },
    ],
  },
  {
    id: 2, race: 'Vòng 3 - Chặng Sức Bền (Nhóm 2)', tournament: 'Giải Xuân 2026', date: '15/06/2026', status: 'pending' as Status,
    results: [
      { pos: 1, horse: 'Silver Arrow', jockey: 'Nguyễn Mạnh Cường', time: '2:04.9', note: '' },
      { pos: 2, horse: 'Night Runner', jockey: 'Trần Văn Hòa', time: '2:05.7', note: 'Vi phạm xuất phát +2s' },
      { pos: 3, horse: 'Shadow Dancer', jockey: 'Bùi Minh Tâm', time: '2:06.3', note: '' },
    ],
  },
  {
    id: 3, race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', status: 'confirmed' as Status,
    results: [
      { pos: 1, horse: 'Desert Wind', jockey: 'Trần Đức Minh', time: '1:41.5', note: '' },
      { pos: 2, horse: 'Thunderstrike', jockey: 'Trần Đức Minh', time: '1:42.8', note: '' },
      { pos: 3, horse: 'Golden Flash', jockey: 'Lý Minh Khôi', time: '1:43.2', note: '' },
    ],
  },
];

const POS_STYLE: Record<number, string> = {
  1: 'bg-gold/20 text-gold border-gold/30',
  2: 'bg-white/10 text-white border-white/20',
  3: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
};

export function RefereeConfirmResultsPage() {
  const [expanded, setExpanded] = useState<number | null>(RACES[0].id);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div>
            <h1 className="text-2xl font-serif text-white">Xác nhận kết quả</h1>
            <p className="text-sm text-muted mt-1">{RACES.filter(r => r.status === 'pending').length} cuộc đua chờ xác nhận kết quả</p>
          </div>

          <div className="space-y-4">
            {RACES.map((race, i) => {
              const isOpen = expanded === race.id;
              const isPending = race.status === 'pending';
              return (
                <motion.div key={race.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-xl border border-glass-border overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPending ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                      <Flag size={18} className={isPending ? 'text-yellow-400' : 'text-emerald-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-base font-serif font-bold text-white">{race.race}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${isPending ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                          {isPending ? 'Chờ xác nhận' : 'Đã xác nhận'}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted">
                        <span>{race.tournament}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {race.date}</span>
                        <span>{race.results.length} ngựa</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1.5">
                          <CheckCircle size={13} /> Xác nhận kết quả
                        </button>
                      )}
                      <button onClick={() => setExpanded(isOpen ? null : race.id)} className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors">
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-glass-border">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-navy-light/20">
                            {['Hạng', 'Ngựa', 'Nài ngựa', 'Thời gian', 'Ghi chú'].map(h => (
                              <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {race.results.map((r, idx) => (
                            <tr key={idx} className="border-t border-glass-border/50 hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-sm border ${POS_STYLE[r.pos] ?? 'bg-white/5 text-muted border-glass-border'}`}>
                                  {r.pos}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-white">{r.horse}</td>
                              <td className="px-5 py-3.5 text-sm text-muted">{r.jockey}</td>
                              <td className="px-5 py-3.5 text-sm font-mono text-champagne font-bold">{r.time}</td>
                              <td className="px-5 py-3.5 text-xs text-red-400">{r.note || '—'}</td>
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

        </main>
      </div>
    </div>
  );
}
