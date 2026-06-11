import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Eye, CheckCircle, Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const PENDING_RESULTS = [
  {
    id: 3,
    race: 'Vòng 3 - Chặng Sức Bền',
    tournament: 'Giải Xuân 2026',
    date: '15/06/2026',
    referee: 'Lê Hoàng Nam',
    submittedAt: '15/06/2026 12:45',
    results: [
      { pos: 1, horse: 'Thunderstrike', owner: 'Nguyễn Văn An', jockey: 'Trần Thị Bình', time: '2:05.4', prize: '₫85.000.000' },
      { pos: 2, horse: 'Desert Wind', owner: 'Nguyễn Văn An', jockey: 'Hoàng Thị Lan', time: '2:06.1', prize: '₫42.000.000' },
      { pos: 3, horse: 'Silver Arrow', owner: 'Trần Thị Bình', jockey: 'Ngô Minh Khoa', time: '2:07.3', prize: '₫21.000.000' },
      { pos: 4, horse: 'Golden Flash', owner: 'Phạm Đức Mạnh', jockey: 'Vũ Đức Minh', time: '2:08.0', prize: '—' },
      { pos: 5, horse: 'Dark Knight', owner: 'Vũ Minh Tuấn', jockey: 'Trương Văn Hải', time: '2:09.2', prize: '—' },
    ],
  },
];

const PUBLISHED_RESULTS = [
  {
    id: 1,
    race: 'Vòng 1 - Chặng Mở Đầu',
    tournament: 'Giải Xuân 2026',
    date: '10/06/2026',
    publishedAt: '10/06/2026 15:00',
    winner: 'Thunderstrike',
  },
  {
    id: 2,
    race: 'Vòng 2 - Chặng Tốc Độ',
    tournament: 'Giải Xuân 2026',
    date: '12/06/2026',
    publishedAt: '12/06/2026 14:30',
    winner: 'Desert Wind',
  },
];

export function AdminResultsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6 relative z-10">

          <PageHero
            title="Kết quả & Công bố"
            subtitle="Xác nhận và công bố kết quả chính thức"
            imageUrl="/images/hero-admin.jpg"
            imagePosition="center center"
          />

          {/* Pending Publication */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="text-base font-medium text-white">Chờ công bố</h2>
            </div>
            <div className="space-y-4">
              {PENDING_RESULTS.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden border border-yellow-500/20">
                  {/* Header Row */}
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                      <Trophy size={20} className="text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-serif text-white">{item.race}</div>
                      <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                        <span>{item.tournament}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                        <span>Trọng tài: {item.referee}</span>
                        <span>Nộp lúc: {item.submittedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-glass-border text-muted hover:text-white text-xs font-medium transition-colors"
                      >
                        <Eye size={13} /> Xem kết quả
                        {expanded === item.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg btn-gold text-xs font-bold">
                        <Megaphone size={13} /> Công bố
                      </button>
                    </div>
                  </div>

                  {/* Expandable Results Table */}
                  {expanded === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-glass-border"
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="bg-navy-light/30 border-b border-glass-border">
                            {['Vị trí', 'Ngựa', 'Chủ ngựa', 'Jockey', 'Thời gian', 'Giải thưởng'].map(h => (
                              <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.results.map((r, i) => (
                            <tr key={i} className="border-b border-glass-border/30 hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-sm ${
                                  r.pos === 1 ? 'bg-gold/20 text-gold border border-gold/30' :
                                  r.pos === 2 ? 'bg-white/10 text-white border border-white/20' :
                                  r.pos === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                                  'bg-white/5 text-muted border border-glass-border'
                                }`}>
                                  {r.pos}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-white">{r.horse}</td>
                              <td className="px-5 py-3.5 text-sm text-muted">{r.owner}</td>
                              <td className="px-5 py-3.5 text-sm text-muted">{r.jockey}</td>
                              <td className="px-5 py-3.5 text-sm font-mono text-champagne font-bold">{r.time}</td>
                              <td className="px-5 py-3.5 text-sm text-gold font-bold">{r.prize}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Published */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={14} className="text-emerald-400" />
              <h2 className="text-base font-medium text-white">Đã công bố</h2>
            </div>
            <div className="glass-panel rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border bg-navy-light/30">
                    {['Cuộc đua', 'Giải đấu', 'Ngày', 'Ngựa vô địch', 'Công bố lúc'].map(h => (
                      <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PUBLISHED_RESULTS.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="border-b border-glass-border/50 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-sm font-semibold text-white">{r.race}</td>
                      <td className="px-5 py-4 text-sm text-muted">{r.tournament}</td>
                      <td className="px-5 py-4 text-sm text-muted">{r.date}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-gold font-medium">
                          <Trophy size={13} /> {r.winner}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted">{r.publishedAt}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
