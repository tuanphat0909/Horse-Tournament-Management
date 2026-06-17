import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Award, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';
import { PageAmbience } from '../../components/layout/PageAmbience';
import { getRaceReports } from '../../api/refereeService';
import { getRaceSchedule } from '../../api/publicService';

function fmtDate(s?: string) {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('vi-VN'); } catch { return s; }
}

export function RefereeReportsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [races, setRaces] = useState<any[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [racesLoading, setRacesLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    getRaceSchedule()
      .then((d: any) => setRaces(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setRaces([]))
      .finally(() => setRacesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRaceId) { setReports([]); return; }
    setReportsLoading(true);
    getRaceReports(selectedRaceId)
      .then((d: any) => setReports(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, [selectedRaceId]);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <PageAmbience accent="red" />
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Báo cáo"
            subtitle="Lịch sử báo cáo và tài liệu trọng tài"
            imageUrl="/images/hero-referee.jpg"
            imagePosition="right 52%"
            actions={
              <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> Tạo báo cáo
              </button>
            }
          />

          <div className="grid grid-cols-[1fr_380px] gap-6">
            <div className="space-y-4">
              {/* Race selector */}
              <div className="relative w-72">
                <select
                  value={selectedRaceId}
                  onChange={e => setSelectedRaceId(e.target.value)}
                  className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 pr-8 text-sm text-white focus:border-gold/40 outline-none appearance-none cursor-pointer"
                >
                  <option value="">{racesLoading ? 'Đang tải...' : races.length === 0 ? 'Không có cuộc đua' : '— Chọn cuộc đua —'}</option>
                  {races.map((r, i) => (
                    <option key={r.id ?? r.raceId ?? i} value={String(r.id ?? r.raceId ?? i)}>
                      {r.name ?? r.raceName ?? `Cuộc đua #${r.id ?? r.raceId ?? i}`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>

              <div className="glass-panel rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
                {!selectedRaceId ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl opacity-40 mb-3">📋</div>
                    <div className="text-muted text-sm">Chọn cuộc đua để xem danh sách báo cáo</div>
                  </div>
                ) : reportsLoading ? (
                  <div className="p-12 text-center text-muted text-sm">Đang tải...</div>
                ) : reports.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl opacity-40 mb-3">📋</div>
                    <div className="text-muted text-sm">Chưa có báo cáo nào cho cuộc đua này</div>
                  </div>
                ) : (
                  <div className="divide-y divide-glass-border relative z-10">
                    {reports.map((r, i) => (
                      <div key={r.reportId ?? i} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                        <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-serif font-bold text-champagne shrink-0 mt-0.5">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white group-hover:text-champagne transition-colors">{r.content ?? '—'}</div>
                          {r.violationNote && (
                            <div className="text-xs text-red-400 mt-0.5">Vi phạm: {r.violationNote}</div>
                          )}
                          <div className="text-xs text-muted mt-0.5">
                            Trọng tài: {r.refereeName ?? `#${r.refereeId ?? '—'}`}
                            {r.raceName ? ` • ${r.raceName}` : ''}
                            {r.createdAt ? ` • ${fmtDate(r.createdAt)}` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6 h-fit relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-[40px] pointer-events-none" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0"><Award size={15} className="text-gold" /></div>
                <h3 className="text-base font-serif text-white">Tóm tắt mùa giải</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-glass-border to-transparent" />
              </div>
              {/* TODO: BE chưa có API thống kê tóm tắt mùa giải của trọng tài */}
              <div className="space-y-3 relative z-10">
                {[
                  { label: 'Tổng báo cáo', value: '—', color: 'text-white' },
                  { label: 'Đã gửi', value: '—', color: 'text-emerald-400' },
                  { label: 'Bản nháp', value: '—', color: 'text-yellow-400' },
                  { label: 'Tổng vi phạm ghi nhận', value: '—', color: 'text-red-400' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-glass-border hover:border-gold/30 hover:bg-gold/[0.04] transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center font-serif font-bold text-champagne text-sm shrink-0">{i + 1}</div>
                      <span className="text-xs text-muted group-hover:text-champagne transition-colors">{s.label}</span>
                    </div>
                    <span className={`text-sm font-serif font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-glass-border relative overflow-hidden">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0"><FileText size={15} className="text-gold" /></div>
                  <h3 className="text-lg font-serif text-white">Tạo báo cáo mới</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-glass-border to-transparent" />
                </div>
                <div className="space-y-4">
                  {[['Tiêu đề báo cáo', 'VD: Báo cáo Vòng 4...'], ['Cuộc đua', 'Chọn cuộc đua...']].map(([label, ph]) => (
                    <div key={label}>
                      <label className="block text-xs text-muted font-medium mb-1.5">{label}</label>
                      <input placeholder={ph} className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Nội dung báo cáo</label>
                    <textarea rows={4} placeholder="Mô tả diễn biến cuộc đua, vi phạm (nếu có), nhận xét..." className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none resize-none focus:border-gold/40 transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-lg text-sm text-muted border border-glass-border hover:text-white transition-colors">Hủy</button>
                  <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-lg text-sm text-muted border border-glass-border hover:text-white transition-colors">Lưu nháp</button>
                  <button onClick={() => setShowAdd(false)} className="btn-gold px-6 py-2 rounded-lg text-sm font-bold">Gửi ngay</button>
                </div>
              </motion.div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
