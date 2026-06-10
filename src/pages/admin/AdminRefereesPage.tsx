import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Flag, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

const REFEREES = [
  { id: 1, name: 'Lê Hoàng Nam', email: 'lhnam@email.com', races: 12, rating: 4.9, available: true },
  { id: 2, name: 'Trương Văn Tú', email: 'tvtu@email.com', races: 8, rating: 4.7, available: true },
  { id: 3, name: 'Nguyễn Thị Lan', email: 'ntlan@email.com', races: 15, rating: 4.8, available: false },
  { id: 4, name: 'Đinh Công Sơn', email: 'dcson@email.com', races: 6, rating: 4.5, available: true },
];

const RACES_NEEDING_REFEREE = [
  { id: 4, name: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', date: '20/06/2026', time: '09:00', referee: null },
  { id: 5, name: 'Chung Kết', tournament: 'Giải Xuân 2026', date: '28/06/2026', time: '10:00', referee: null },
  { id: 6, name: 'Vòng Loại 1', tournament: 'Cúp Quốc Gia', date: '15/07/2026', time: '08:00', referee: null },
  { id: 7, name: 'Vòng Loại 2', tournament: 'Cúp Quốc Gia', date: '18/07/2026', time: '09:00', referee: null },
];

const ASSIGNED_RACES = [
  { id: 1, name: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', date: '10/06/2026', referee: 'Lê Hoàng Nam' },
  { id: 2, name: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', referee: 'Trương Văn Tú' },
  { id: 3, name: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', referee: 'Lê Hoàng Nam' },
];

export function AdminRefereesPage() {
  const [assignments, setAssignments] = useState<Record<number, number | null>>({ 4: null, 5: null, 6: null, 7: null });
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  function assign(raceId: number, refereeId: number) {
    setAssignments(prev => ({ ...prev, [raceId]: refereeId }));
    setDropdownOpen(null);
  }

  function getRefereeName(id: number | null) {
    if (!id) return null;
    return REFEREES.find(r => r.id === id)?.name ?? null;
  }

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Phân công trọng tài</h1>
              <p className="text-sm text-muted mt-1">{RACES_NEEDING_REFEREE.length} cuộc đua chưa có trọng tài</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_320px] gap-6">
            {/* Left: Race Assignment */}
            <div className="space-y-4">
              {/* Needs Referee */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden">
                <div className="p-5 border-b border-glass-border flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow-400" />
                  <h2 className="text-base font-serif text-white">Chưa phân công</h2>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[11px] font-bold border border-yellow-500/20">
                    {RACES_NEEDING_REFEREE.length}
                  </span>
                </div>
                <div className="divide-y divide-glass-border/50">
                  {RACES_NEEDING_REFEREE.map(race => {
                    const assignedId = assignments[race.id];
                    const assignedName = getRefereeName(assignedId);
                    return (
                      <div key={race.id} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                          <Flag size={18} className="text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{race.name}</div>
                          <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                            <span>{race.tournament}</span>
                            <span className="flex items-center gap-1"><Calendar size={10} /> {race.date} • {race.time}</span>
                          </div>
                        </div>
                        <div className="relative shrink-0">
                          {assignedName ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                <CheckCircle size={12} /> {assignedName}
                              </span>
                              <button onClick={() => setAssignments(prev => ({ ...prev, [race.id]: null }))} className="text-xs text-muted hover:text-red-400 transition-colors">Hủy</button>
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => setDropdownOpen(dropdownOpen === race.id ? null : race.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/30 bg-gold/5 text-champagne text-xs font-medium hover:bg-gold/10 transition-colors"
                              >
                                <UserCheck size={13} /> Phân công <ChevronDown size={12} className={`transition-transform ${dropdownOpen === race.id ? 'rotate-180' : ''}`} />
                              </button>
                              {dropdownOpen === race.id && (
                                <div className="absolute right-0 top-full mt-1 z-20 glass-panel border border-glass-border rounded-xl overflow-hidden shadow-2xl w-52">
                                  {REFEREES.filter(r => r.available).map(ref => (
                                    <button
                                      key={ref.id}
                                      onClick={() => assign(race.id, ref.id)}
                                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors border-b border-glass-border/50 last:border-0"
                                    >
                                      <div className="text-white font-medium">{ref.name}</div>
                                      <div className="text-xs text-muted">⭐ {ref.rating} • {ref.races} cuộc đua</div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Already Assigned */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-xl overflow-hidden">
                <div className="p-5 border-b border-glass-border flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <h2 className="text-base font-serif text-white">Đã phân công</h2>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">{ASSIGNED_RACES.length}</span>
                </div>
                <div className="divide-y divide-glass-border/50">
                  {ASSIGNED_RACES.map(race => (
                    <div key={race.id} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Flag size={18} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{race.name}</div>
                        <div className="text-xs text-muted mt-0.5">{race.tournament} • {race.date}</div>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">{race.referee}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Referee List */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-xl p-5 h-fit">
              <h2 className="text-base font-serif text-white mb-4">Danh sách trọng tài</h2>
              <div className="space-y-3">
                {REFEREES.map(ref => (
                  <div key={ref.id} className="p-4 rounded-xl bg-white/[0.02] border border-glass-border hover:border-gold/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/20 flex items-center justify-center font-serif font-bold text-purple-300 text-sm shrink-0">
                        {ref.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{ref.name}</div>
                        <div className="text-xs text-muted">{ref.email}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ref.available ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                        {ref.available ? 'Sẵn sàng' : 'Bận'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>⭐ {ref.rating}/5.0</span>
                      <span>{ref.races} cuộc đua đã làm</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </main>
      </div>
    </div>
  );
}
