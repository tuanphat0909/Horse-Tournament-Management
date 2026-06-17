import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';
import { PageAmbience } from '../../components/layout/PageAmbience';
import { getRaceViolations } from '../../api/refereeService';
import { getRaceSchedule } from '../../api/publicService';

type Tab = 'active' | 'decided';

export function RefereeViolationsPage() {
  const [tab, setTab] = useState<Tab>('active');
  const [showAdd, setShowAdd] = useState(false);
  const [races, setRaces] = useState<any[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [violations, setViolations] = useState<any[]>([]);
  const [racesLoading, setRacesLoading] = useState(true);
  const [violationsLoading, setViolationsLoading] = useState(false);

  useEffect(() => {
    getRaceSchedule()
      .then((d: any) => setRaces(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setRaces([]))
      .finally(() => setRacesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRaceId) { setViolations([]); return; }
    setViolationsLoading(true);
    getRaceViolations(selectedRaceId)
      .then((d: any) => setViolations(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setViolations([]))
      .finally(() => setViolationsLoading(false));
  }, [selectedRaceId]);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <PageAmbience accent="red" />
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Xử lý vi phạm"
            subtitle="Quản lý và kết luận đơn vi phạm"
            imageUrl="/images/hero-referee.jpg"
            imagePosition="right 52%"
            actions={
              <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Plus size={14} /> Ghi nhận vi phạm
              </button>
            }
          />

          {/* Flow */}
          <div className="glass-panel rounded-xl p-4 border border-glass-border relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-2 text-xs flex-wrap relative">
              <span className="text-muted font-bold shrink-0">Quy trình:</span>
              {[
                { label: 'Trọng tài ghi nhận ngay sau đua', active: false },
                { label: '→', sep: true },
                { label: 'Jockey có 30 phút khiếu nại', active: false },
                { label: '→', sep: true },
                { label: 'Trọng tài xem footage + ra quyết định', active: true },
                { label: '→', sep: true },
                { label: 'Kết quả chính thức — Admin nhận thông báo', active: false },
              ].map((s, i) =>
                s.sep ? <span key={i} className="text-muted/30">→</span>
                  : <span key={i} className={`px-2.5 py-1 rounded-lg border text-white/80 ${s.active ? 'bg-gold/10 border-gold/20 text-gold font-bold' : 'bg-white/[0.03] border-glass-border'}`}>{s.label}</span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-glass-border">
            {([
              ['active',  'Cần xử lý', 'text-gold border-gold'],
              ['decided', 'Đã xử lý', 'text-muted border-muted'],
            ] as [Tab, string, string][]).map(([t, label, activeClass]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? activeClass : 'text-muted border-transparent hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

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
                <div className="text-4xl opacity-40 mb-3">⚠️</div>
                <div className="text-muted text-sm">Chọn cuộc đua để xem danh sách vi phạm</div>
              </div>
            ) : violationsLoading ? (
              <div className="p-12 text-center text-muted text-sm">Đang tải...</div>
            ) : violations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl opacity-40 mb-3">✅</div>
                <div className="text-muted text-sm">Không có vi phạm nào trong cuộc đua này</div>
              </div>
            ) : (
              <div className="divide-y divide-glass-border relative z-10">
                {violations.map((v, i) => (
                  <div key={v.violationId ?? i} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs font-serif font-bold text-red-400 shrink-0 mt-0.5">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-champagne transition-colors">{v.description ?? '—'}</div>
                      <div className="text-xs text-muted mt-0.5">
                        {v.raceName ? <span className="mr-2">Cuộc đua: {v.raceName}</span> : null}
                        Trọng tài: {v.refereeName ?? `#${v.refereeId ?? '—'}`}
                      </div>
                    </div>
                    {v.penalty != null && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20 shrink-0">{v.penalty}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-glass-border relative overflow-hidden">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-1 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0"><AlertTriangle size={15} className="text-gold" /></div>
                  <h3 className="text-lg font-serif text-white">Ghi nhận vi phạm</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/30 via-glass-border to-transparent" />
                </div>
                <p className="text-xs text-muted mb-5">Jockey sẽ nhận thông báo ngay và có <span className="text-white font-bold">30 phút</span> để gửi khiếu nại.</p>
                <div className="space-y-4">
                  {[['Cuộc đua', 'Chọn cuộc đua...'], ['Ngựa / Nài ngựa vi phạm', 'Nhập tên...'], ['Loại vi phạm', 'VD: Lấn đường, Cản trở, Xuất phát sớm...']].map(([label, ph]) => (
                    <div key={label}>
                      <label className="block text-xs text-muted font-medium mb-1.5">{label}</label>
                      <input placeholder={ph} className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Mức độ vi phạm</label>
                    <select className="w-full bg-[#0B1628] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold/40">
                      <option value="warning">Cảnh cáo</option>
                      <option value="penalty">Phạt thời gian</option>
                      <option value="disqualify">Truất quyền thi đấu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Mô tả chi tiết</label>
                    <textarea rows={3} placeholder="Mô tả sự việc theo camera / quan sát thực tế..." className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none resize-none focus:border-gold/40" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-lg text-sm text-muted border border-glass-border hover:text-white transition-colors">Hủy</button>
                  <button onClick={() => setShowAdd(false)} className="btn-gold px-6 py-2 rounded-lg text-sm font-bold">Gửi vi phạm</button>
                </div>
              </motion.div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
