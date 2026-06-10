import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, CheckCircle, Clock, Send } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Status = 'draft' | 'submitted';

const REPORTS = [
  { id: 1, title: 'Báo cáo Vòng 3 - Giải Xuân 2026', race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', date: '15/06/2026', violations: 1, status: 'draft' as Status, summary: 'Ghi nhận 1 vi phạm lấn đường (Desert Wind). Cuộc đua diễn ra an toàn. Kết quả đã được xác nhận chính xác theo camera giám sát.' },
  { id: 2, title: 'Báo cáo Vòng 2 - Giải Xuân 2026', race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', date: '12/06/2026', violations: 0, status: 'submitted' as Status, summary: 'Không có vi phạm. Cuộc đua diễn ra đúng quy định. Kết quả chính thức đã gửi Admin.' },
  { id: 3, title: 'Báo cáo Vòng 1 - Giải Xuân 2026', race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', date: '10/06/2026', violations: 1, status: 'submitted' as Status, summary: 'Ghi nhận 1 vi phạm nghiêm trọng (Shadow Dancer - truất quyền). Báo cáo đã được Admin xác nhận.' },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  draft:     { label: 'Bản nháp', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  submitted: { label: 'Đã gửi', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
};

export function RefereeReportsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Báo cáo của tôi</h1>
              <p className="text-sm text-muted mt-1">{REPORTS.length} báo cáo • {REPORTS.filter(r => r.status === 'draft').length} bản nháp</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Plus size={14} /> Tạo báo cáo
            </button>
          </div>

          <div className="grid grid-cols-[1fr_380px] gap-6">
            <div className="space-y-3">
              {REPORTS.map((r, i) => {
                const cfg = STATUS_CONFIG[r.status];
                const Icon = cfg.icon;
                const isActive = selected === r.id;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    onClick={() => setSelected(isActive ? null : r.id)}
                    className={`glass-panel rounded-xl p-5 border cursor-pointer transition-all ${isActive ? 'border-gold/30 bg-gold/[0.02]' : 'border-glass-border hover:border-gold/20'}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-serif font-bold text-white">{r.title}</span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                            <Icon size={10} /> {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted">
                          <span>{r.race}</span>
                          <span>{r.date}</span>
                          <span>{r.violations > 0 ? <span className="text-red-400">{r.violations} vi phạm</span> : <span className="text-emerald-400">Không vi phạm</span>}</span>
                        </div>
                      </div>
                      {r.status === 'draft' && (
                        <button onClick={e => { e.stopPropagation(); }} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                          <Send size={12} /> Gửi báo cáo
                        </button>
                      )}
                    </div>
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-glass-border text-sm text-muted leading-relaxed">
                        {r.summary}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6 h-fit">
              <h3 className="text-base font-serif text-white mb-4">Tóm tắt mùa giải</h3>
              <div className="space-y-4">
                {[
                  { label: 'Tổng báo cáo', value: REPORTS.length, color: 'text-white' },
                  { label: 'Đã gửi', value: REPORTS.filter(r => r.status === 'submitted').length, color: 'text-emerald-400' },
                  { label: 'Bản nháp', value: REPORTS.filter(r => r.status === 'draft').length, color: 'text-yellow-400' },
                  { label: 'Tổng vi phạm ghi nhận', value: REPORTS.reduce((s, r) => s + r.violations, 0), color: 'text-red-400' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-glass-border/50 last:border-none">
                    <span className="text-xs text-muted">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-glass-border">
                <h3 className="text-lg font-serif text-white mb-5">Tạo báo cáo mới</h3>
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
