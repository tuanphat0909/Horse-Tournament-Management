import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, ChevronDown, Clock } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Severity = 'warning' | 'penalty' | 'disqualify';
type Status = 'appeal_window' | 'appealed' | 'confirmed' | 'rejected';

const VIOLATIONS = [
  {
    id: 1, horse: 'Desert Wind', owner: 'Nguyễn Văn An', jockey: 'Trần Đức Minh',
    race: 'Vòng 3 - Giải Xuân 2026', type: 'Lấn đường', severity: 'warning' as Severity,
    description: 'Ngựa Desert Wind chuyển làn không đúng quy định ở cột 800m, gây ảnh hưởng đến Thunderstrike phía sau.',
    penalty: 'Cảnh cáo lần 1', status: 'appeal_window' as Status,
    filedAt: '15/06/2026 11:20', deadline: '16/06/2026 11:20', hoursLeft: 14,
  },
  {
    id: 2, horse: 'Night Runner', owner: 'Bùi Thị Mai', jockey: 'Đỗ Văn Long',
    race: 'Vòng 2 - Giải Xuân 2026', type: 'Xuất phát sớm', severity: 'penalty' as Severity,
    description: 'Nài ngựa không chấp hành tín hiệu xuất phát, rời chuồng trước khi có hiệu lệnh.',
    penalty: 'Phạt thời gian +2 giây', status: 'appealed' as Status,
    filedAt: '12/06/2026 09:15', deadline: '13/06/2026 09:15', hoursLeft: 0,
    appealContent: 'Tôi không cố ý xuất phát sớm, ngựa bị giật mình bởi tiếng động bên ngoài. Đề nghị xem xét lại camera.',
  },
  {
    id: 3, horse: 'Shadow Dancer', owner: 'Trần Thị Lan', jockey: 'Lý Minh Khôi',
    race: 'Vòng 1 - Giải Xuân 2026', type: 'Cản trở cố ý', severity: 'disqualify' as Severity,
    description: 'Nài ngựa cố ý chèn ép ngựa Storm Rider, gây nguy hiểm ở cột 400m về đích.',
    penalty: 'Truất quyền thi đấu', status: 'confirmed' as Status,
    filedAt: '10/06/2026 14:00', deadline: '11/06/2026 14:00', hoursLeft: 0,
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  warning:    { label: 'Cảnh cáo',    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  penalty:    { label: 'Phạt',        color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  disqualify: { label: 'Truất quyền', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  appeal_window: { label: 'Trong thời hạn khiếu nại', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  appealed:      { label: 'Đã khiếu nại — Chờ Admin',  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  confirmed:     { label: 'Admin đã xác nhận',          color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  rejected:      { label: 'Admin bác bỏ vi phạm',       color: 'text-muted bg-white/5 border-glass-border' },
};

export function RefereeViolationsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Ghi nhận vi phạm</h1>
              <p className="text-sm text-muted mt-1">
                Vi phạm do bạn ghi nhận — Admin sẽ xác nhận sau khi hết thời hạn khiếu nại
              </p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-gold px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Plus size={14} /> Ghi nhận vi phạm mới
            </button>
          </div>

          {/* Flow explanation */}
          <div className="glass-panel rounded-xl p-4 border border-blue-500/15 bg-blue-500/[0.03]">
            <div className="flex items-start gap-3 text-xs text-muted">
              <div className="flex items-center gap-2 shrink-0 text-blue-400 font-bold">Quy trình:</div>
              <div className="flex items-center gap-2 flex-wrap">
                {['Trọng tài ghi nhận', '→', 'Jockey nhận thông báo (24h khiếu nại)', '→', 'Admin xem xét & xác nhận chính thức'].map((s, i) => (
                  <span key={i} className={s === '→' ? 'text-muted/40' : 'px-2.5 py-1 rounded-lg bg-white/[0.04] border border-glass-border text-white/80'}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {VIOLATIONS.map((v, i) => {
              const sev = SEVERITY_CONFIG[v.severity];
              const stat = STATUS_CONFIG[v.status];
              const isOpen = expanded === v.id;
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-xl border border-glass-border overflow-hidden">
                  <div className="p-5 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${sev.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                      <AlertTriangle size={18} className={sev.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-base font-serif font-bold text-white">{v.type}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.color}`}>{sev.label}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${stat.color}`}>{stat.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted mb-1.5">
                        <span>Ngựa: <span className="text-white">{v.horse}</span></span>
                        <span>Nài: <span className="text-white">{v.jockey}</span></span>
                        <span>{v.race}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-champagne font-medium">Hình phạt đề xuất: {v.penalty}</span>
                        {v.status === 'appeal_window' && v.hoursLeft > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400 font-bold">
                            <Clock size={11} /> Còn {v.hoursLeft}h khiếu nại
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : v.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <div className="border-t border-glass-border pt-4 space-y-3">
                        <div>
                          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Mô tả chi tiết</div>
                          <div className="text-sm text-white/80 leading-relaxed">{v.description}</div>
                        </div>
                        <div className="flex gap-4 text-xs text-muted">
                          <span>Ghi nhận lúc: <span className="text-white">{v.filedAt}</span></span>
                          <span>Hạn khiếu nại: <span className="text-white">{v.deadline}</span></span>
                        </div>
                        {'appealContent' in v && v.appealContent && (
                          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-1.5">Nội dung khiếu nại của Jockey</div>
                            <div className="text-xs text-white/80 leading-relaxed">{v.appealContent}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-glass-border">
                <h3 className="text-lg font-serif text-white mb-1">Ghi nhận vi phạm mới</h3>
                <p className="text-xs text-muted mb-5">Jockey sẽ nhận thông báo và có 24 giờ để khiếu nại trước khi Admin xác nhận.</p>
                <div className="space-y-4">
                  {[['Cuộc đua', 'Chọn cuộc đua...'], ['Tên ngựa / Nài ngựa', 'Nhập tên...'], ['Loại vi phạm', 'VD: Lấn đường, Cản trở...']].map(([label, ph]) => (
                    <div key={label}>
                      <label className="block text-xs text-muted font-medium mb-1.5">{label}</label>
                      <input placeholder={ph} className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Mức độ vi phạm</label>
                    <select className="w-full bg-[#0B1628] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-gold/40 transition-colors">
                      <option value="warning">Cảnh cáo</option>
                      <option value="penalty">Phạt thời gian</option>
                      <option value="disqualify">Truất quyền thi đấu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted font-medium mb-1.5">Mô tả chi tiết</label>
                    <textarea rows={3} placeholder="Mô tả sự việc theo camera / quan sát thực tế..." className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none resize-none focus:border-gold/40 transition-colors" />
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
