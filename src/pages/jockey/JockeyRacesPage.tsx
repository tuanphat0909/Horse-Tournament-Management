import { motion } from 'framer-motion';
import { Flag, Calendar, MapPin, Trophy, ShieldCheck, ChevronRight } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

const MY_RACES = [
  { id: 1, race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', time: '08:00', horse: 'Thunderstrike', breed: 'Thoroughbred', owner: 'Nguyễn Văn An', location: 'Trường đua Phú Thọ', distance: '2.000m', status: 'completed', result: 1 },
  { id: 2, race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', time: '08:00', horse: 'Desert Wind', breed: 'Arabian', owner: 'Nguyễn Văn An', location: 'Trường đua Phú Thọ', distance: '2.000m', status: 'completed', result: 2 },
  { id: 3, race: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', date: '20/06/2026', time: '09:00', horse: 'Thunderstrike', breed: 'Thoroughbred', owner: 'Nguyễn Văn An', location: 'Trường đua Phú Thọ', distance: '1.800m', status: 'upcoming', result: null },
  { id: 4, race: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', date: '20/06/2026', time: '09:00', horse: 'Desert Wind', breed: 'Arabian', owner: 'Nguyễn Văn An', location: 'Trường đua Phú Thọ', distance: '1.800m', status: 'upcoming', result: null },
];

const STATUS_CONFIG = {
  upcoming:  { label: 'Sắp diễn ra', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  completed: { label: 'Đã kết thúc', color: 'text-muted bg-white/5 border-glass-border' },
  racing:    { label: 'Đang đua', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

const POS_STYLE: Record<number, string> = { 1: 'bg-gold/20 text-gold border-gold/30', 2: 'bg-white/10 text-white border-white/20', 3: 'bg-orange-500/20 text-orange-400 border-orange-500/20' };

export function JockeyRacesPage() {
  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div>
            <h1 className="text-2xl font-serif text-white">Cuộc đua của tôi</h1>
            <p className="text-sm text-muted mt-1">Danh sách các cuộc đua được phân công</p>
          </div>

          <div className="space-y-4">
            {MY_RACES.map((r, i) => {
              const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-2xl overflow-hidden border border-glass-border hover:border-gold/20 transition-all group">
                  <div className="p-6 flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Flag size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-base font-serif text-white group-hover:text-champagne transition-colors">{r.race}</h3>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                        {r.result && (
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-sm border ${POS_STYLE[r.result] ?? 'bg-white/5 text-muted border-glass-border'}`}>
                            {r.result}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
                        <span className="flex items-center gap-1"><Trophy size={10} className="text-gold/60" /> {r.tournament}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} className="text-gold/60" /> {r.date} • {r.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-gold/60" /> {r.location}</span>
                        <span className="text-champagne font-medium">{r.distance}</span>
                      </div>
                      <div className="flex items-center gap-5 p-3 rounded-xl bg-white/[0.02] border border-glass-border w-fit">
                        <div className="text-sm font-bold text-white">🐴 {r.horse}</div>
                        <div className="text-xs text-muted">{r.breed}</div>
                        <div className="flex items-center gap-1 text-xs text-muted"><ShieldCheck size={11} className="text-emerald-400" /> Chủ: {r.owner}</div>
                      </div>
                    </div>
                    <button className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors shrink-0 font-medium">
                      Chi tiết <ChevronRight size={14} />
                    </button>
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
