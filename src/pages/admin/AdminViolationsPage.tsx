import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Bell, ArrowUpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type Tab = 'notifications' | 'escalations';

// Thông báo chính thức từ trọng tài (read-only)
const OFFICIAL_NOTICES = [
  {
    id: 1, horse: 'Shadow Dancer', jockey: 'Lý Minh Khôi', owner: 'Trần Thị Lan',
    race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Cản trở cố ý', severity: 'disqualify',
    penalty: 'Truất quyền thi đấu', verdict: 'confirmed',
    decidedAt: '10/06/2026 14:45', appealContent: 'Đây là va chạm ngoài ý muốn.',
    refereeNote: 'Xem footage 3 góc — hành vi có chủ đích rõ ràng. Xác nhận vi phạm.',
  },
  {
    id: 2, horse: 'Night Runner', jockey: 'Đỗ Văn Long', owner: 'Bùi Thị Mai',
    race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Xuất phát sớm', severity: 'penalty',
    penalty: 'Phạt thời gian +2 giây', verdict: 'confirmed',
    decidedAt: '12/06/2026 10:30', appealContent: 'Ngựa bị giật mình bởi tiếng động bên ngoài.',
    refereeNote: 'Camera góc chuồng xuất phát cho thấy xuất phát trước 0.3 giây. Xác nhận vi phạm.',
  },
  {
    id: 3, horse: 'Golden Flash', jockey: 'Lý Minh Khôi', owner: 'Phạm Đức Mạnh',
    race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Va chạm nhẹ', severity: 'warning',
    penalty: 'Cảnh cáo', verdict: 'rejected',
    decidedAt: '12/06/2026 11:00', appealContent: 'Va chạm là ngoài ý muốn, camera góc 2 thể hiện rõ.',
    refereeNote: 'Xem footage góc 2 — va chạm do đường đua hẹp, không có yếu tố cố ý. Bác bỏ vi phạm.',
  },
];

// Kháng cáo lên Admin (chỉ án truất quyền / đình chỉ)
const ESCALATIONS = [
  {
    id: 1, horse: 'Shadow Dancer', jockey: 'Lý Minh Khôi',
    race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026',
    type: 'Cản trở cố ý', penalty: 'Truất quyền thi đấu',
    referee: 'Nguyễn Hoàng Việt', refereeNote: 'Xem footage 3 góc — hành vi có chủ đích rõ ràng.',
    escalateContent: 'Tôi phản đối phán quyết này. Va chạm xảy ra vì ngựa đổi hướng đột ngột do chấn thương chân trái. Đề nghị xem xét hồ sơ sức khỏe ngựa kèm theo.',
    escalatedAt: '10/06/2026 16:00', deadline: '12/06/2026 14:45', hoursLeft: 39, status: 'pending',
  },
];

const SEVERITY_BADGE: Record<string, string> = {
  warning:    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  penalty:    'text-orange-400 bg-orange-500/10 border-orange-500/20',
  disqualify: 'text-red-400 bg-red-500/10 border-red-500/20',
};
const SEVERITY_LABEL: Record<string, string> = { warning: 'Cảnh cáo', penalty: 'Phạt', disqualify: 'Truất quyền' };

export function AdminViolationsPage() {
  const [tab, setTab] = useState<Tab>('escalations');
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Xử lý vi phạm"
            subtitle="Kháng cáo và quyết định chính thức"
            imageUrl="/images/hero-admin.jpg"
            imagePosition="center center"
          />

          {/* Flow */}
          <div className="glass-panel rounded-xl p-4 border border-glass-border">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted font-bold shrink-0">Quy trình:</span>
              {[
                { label: 'Trọng tài ghi nhận',       active: false },
                { label: '→', sep: true },
                { label: 'Jockey khiếu nại (30 phút)', active: false },
                { label: '→', sep: true },
                { label: 'Trọng tài ra quyết định',   active: false },
                { label: '→', sep: true },
                { label: 'Admin nhận thông báo',       active: false, note: true },
                { label: '→', sep: true },
                { label: 'Kháng cáo án nặng (48h)',   active: true },
              ].map((s, i) =>
                s.sep ? <span key={i} className="text-muted/30">→</span>
                  : <span key={i} className={`px-2.5 py-1 rounded-lg border text-white/80 ${s.active ? 'bg-gold/10 border-gold/20 text-gold font-bold' : s.note ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/[0.03] border-glass-border'}`}>{s.label}</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Vi phạm được xác nhận', value: OFFICIAL_NOTICES.filter(n => n.verdict === 'confirmed').length, color: 'text-red-400', bg: 'from-red-500/15 to-red-900/20', icon: AlertTriangle },
              { label: 'Vi phạm bị bác bỏ', value: OFFICIAL_NOTICES.filter(n => n.verdict === 'rejected').length, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20', icon: CheckCircle },
              { label: 'Kháng cáo chờ xử lý', value: ESCALATIONS.filter(e => e.status === 'pending').length, color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-900/20', icon: ArrowUpCircle },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
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
            {([
              ['escalations', `Kháng cáo chờ xử lý (${ESCALATIONS.filter(e => e.status === 'pending').length})`, 'text-orange-400 border-orange-400'],
              ['notifications', `Thông báo chính thức (${OFFICIAL_NOTICES.length})`, 'text-muted border-muted'],
            ] as [Tab, string, string][]).map(([t, label, ac]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? ac : 'text-muted border-transparent hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Escalations */}
          {tab === 'escalations' && (
            <div className="space-y-4">
              {ESCALATIONS.map((e, i) => {
                const isOpen = expanded === e.id;
                return (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="glass-panel rounded-xl border border-orange-500/20 overflow-hidden">
                    <div className="p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                        <ArrowUpCircle size={18} className="text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base font-serif font-bold text-white">{e.type}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-red-400 bg-red-500/10 border-red-500/20">Truất quyền</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border text-orange-400 bg-orange-500/10 border-orange-500/20">Kháng cáo</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted mb-1">
                          <span>🐴 <span className="text-white">{e.horse}</span></span>
                          <span>Nài: <span className="text-white">{e.jockey}</span></span>
                          <span>{e.race} — {e.tournament}</span>
                        </div>
                        <div className="text-xs text-orange-400 font-bold">
                          Còn {e.hoursLeft}h để xử lý (hạn: {e.deadline})
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-colors flex items-center gap-1">
                          <XCircle size={12} /> Giữ nguyên án
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1">
                          <CheckCircle size={12} /> Chấp nhận kháng cáo
                        </button>
                        <button onClick={() => setExpanded(isOpen ? null : e.id)}
                          className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors">
                          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-3">
                        <div className="h-px bg-glass-border" />
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-glass-border">
                          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Kết luận của trọng tài ({e.referee})</div>
                          <div className="text-sm text-white/80">{e.refereeNote}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                          <div className="text-[10px] text-orange-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                            <MessageSquare size={11} /> Lý do kháng cáo của {e.jockey}
                          </div>
                          <div className="text-sm text-white/80 leading-relaxed">{e.escalateContent}</div>
                          <div className="text-[10px] text-muted mt-2">Gửi lúc: {e.escalatedAt}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gold/5 border border-gold/15 text-xs text-muted flex items-start gap-2">
                          <AlertTriangle size={12} className="text-gold shrink-0 mt-0.5" />
                          Quyết định của Ban tổ chức là <span className="text-white font-bold mx-1">chung thẩm</span> — không thể kháng cáo thêm.
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {ESCALATIONS.filter(e => e.status === 'pending').length === 0 && (
                <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Không có kháng cáo nào đang chờ xử lý</div>
              )}
            </div>
          )}

          {/* Official notifications (read-only) */}
          {tab === 'notifications' && (
            <div className="space-y-3">
              {OFFICIAL_NOTICES.map((n, i) => {
                const isOpen = expanded === n.id + 100;
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="glass-panel rounded-xl border border-glass-border overflow-hidden">
                    <div className="p-5 flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${SEVERITY_BADGE[n.severity]}`}>
                        <Bell size={16} className={n.verdict === 'confirmed' ? 'text-red-400' : 'text-emerald-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-serif font-bold text-white">{n.type}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${SEVERITY_BADGE[n.severity]}`}>{SEVERITY_LABEL[n.severity]}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${n.verdict === 'confirmed' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                            {n.verdict === 'confirmed' ? 'Trọng tài xác nhận' : 'Trọng tài bác bỏ'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted">
                          <span>🐴 {n.horse} — Nài: {n.jockey}</span>
                          <span>{n.race}</span>
                          <span className="text-muted/60">{n.decidedAt}</span>
                        </div>
                      </div>
                      <button onClick={() => setExpanded(isOpen ? null : n.id + 100)}
                        className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-4 space-y-3">
                        <div className="h-px bg-glass-border" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-glass-border text-xs">
                            <div className="text-muted mb-1">Kết luận trọng tài ({n.referee})</div>
                            <div className="text-white/80">{n.refereeNote}</div>
                          </div>
                          {n.appealContent && (
                            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs">
                              <div className="text-blue-400 mb-1">Khiếu nại của jockey</div>
                              <div className="text-white/80">{n.appealContent}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
