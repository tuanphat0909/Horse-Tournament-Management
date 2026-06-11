import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, ChevronDown, Clock, CheckCircle, XCircle, MessageSquare, Video } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type Severity = 'warning' | 'penalty' | 'disqualify';
type Status = 'pending_appeal' | 'appealed' | 'confirmed' | 'rejected';
type Tab = 'active' | 'decided';

const VIOLATIONS = [
  {
    id: 1, horse: 'Desert Wind', owner: 'Nguyễn Văn An', jockey: 'Trần Đức Minh',
    race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026',
    type: 'Lấn đường', severity: 'warning' as Severity,
    description: 'Ngựa Desert Wind chuyển làn không đúng quy định ở cột 800m, gây cản trở Thunderstrike phía sau.',
    penalty: 'Cảnh cáo lần 1', status: 'appealed' as Status,
    filedAt: '15/06/2026 11:20', minutesLeft: 12,
    appealContent: 'Ngựa bị giật mình do tiếng động bên ngoài đường đua, không phải cố ý lấn đường. Đề nghị xem camera góc 3 cột 800m.',
    cameraAngles: ['Góc chính diện', 'Góc bên trái', 'Góc flycam'],
  },
  {
    id: 2, horse: 'Night Runner', owner: 'Bùi Thị Mai', jockey: 'Đỗ Văn Long',
    race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026',
    type: 'Xuất phát sớm', severity: 'penalty' as Severity,
    description: 'Nài ngựa rời chuồng xuất phát trước hiệu lệnh khoảng 0.3 giây.',
    penalty: 'Phạt thời gian +2 giây', status: 'pending_appeal' as Status,
    filedAt: '15/06/2026 11:22', minutesLeft: 18,
    appealContent: null,
    cameraAngles: ['Góc chuồng xuất phát', 'Góc chính diện'],
  },
  {
    id: 3, horse: 'Shadow Dancer', owner: 'Trần Thị Lan', jockey: 'Lý Minh Khôi',
    race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026',
    type: 'Cản trở cố ý', severity: 'disqualify' as Severity,
    description: 'Nài ngựa cố ý chèn ép ngựa Storm Rider, gây nguy hiểm ở cột 400m về đích.',
    penalty: 'Truất quyền thi đấu', status: 'confirmed' as Status,
    filedAt: '10/06/2026 14:00', minutesLeft: 0,
    appealContent: 'Đây là va chạm ngoài ý muốn do đường đua hẹp.',
    cameraAngles: ['Góc chính diện', 'Góc flycam'],
  },
  {
    id: 4, horse: 'Golden Flash', owner: 'Phạm Đức Mạnh', jockey: 'Lý Minh Khôi',
    race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026',
    type: 'Va chạm nhẹ', severity: 'warning' as Severity,
    description: 'Va chạm nhẹ với Silver Arrow tại cột 1200m.',
    penalty: 'Cảnh cáo', status: 'rejected' as Status,
    filedAt: '12/06/2026 10:00', minutesLeft: 0,
    appealContent: 'Va chạm là ngoài ý muốn, camera góc 2 thể hiện rõ.',
    cameraAngles: ['Góc chính diện', 'Góc bên phải'],
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  warning:    { label: 'Cảnh cáo',    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  penalty:    { label: 'Phạt',        color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  disqualify: { label: 'Truất quyền', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
};

const STATUS_DISPLAY: Record<Status, { label: string; color: string }> = {
  pending_appeal: { label: 'Chờ jockey phản hồi', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  appealed:       { label: 'Jockey đã khiếu nại',  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  confirmed:      { label: 'Vi phạm đã xác nhận',   color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  rejected:       { label: 'Vi phạm bị bác bỏ',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

export function RefereeViolationsPage() {
  const [tab, setTab] = useState<Tab>('active');
  const [expanded, setExpanded] = useState<number | null>(1);
  const [showAdd, setShowAdd] = useState(false);

  const active = VIOLATIONS.filter(v => v.status === 'pending_appeal' || v.status === 'appealed');
  const decided = VIOLATIONS.filter(v => v.status === 'confirmed' || v.status === 'rejected');
  const displayed = tab === 'active' ? active : decided;

  const needsDecision = active.filter(v => v.status === 'appealed').length;

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

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
          <div className="glass-panel rounded-xl p-4 border border-glass-border">
            <div className="flex items-center gap-2 text-xs flex-wrap">
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
              ['active',  `Cần xử lý (${active.length})`, 'text-gold border-gold'],
              ['decided', `Đã xử lý (${decided.length})`, 'text-muted border-muted'],
            ] as [Tab, string, string][]).map(([t, label, activeClass]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? activeClass : 'text-muted border-transparent hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {displayed.map((v, i) => {
              const sev = SEVERITY_CONFIG[v.severity];
              const stat = STATUS_DISPLAY[v.status];
              const isOpen = expanded === v.id;
              const hasAppeal = !!v.appealContent;
              const canDecide = v.status === 'appealed' || (v.status === 'pending_appeal' && v.minutesLeft === 0);

              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`glass-panel rounded-xl border overflow-hidden ${v.status === 'appealed' ? 'border-blue-500/25' : 'border-glass-border'}`}>

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
                        <span>🐴 <span className="text-white">{v.horse}</span></span>
                        <span>Nài: <span className="text-white">{v.jockey}</span></span>
                        <span>{v.race}</span>
                        <span className="text-muted/60">{v.filedAt}</span>
                      </div>
                      {v.status === 'pending_appeal' && v.minutesLeft > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold">
                          <Clock size={12} /> Còn {v.minutesLeft} phút jockey có thể khiếu nại
                        </div>
                      )}
                      {hasAppeal && v.status === 'appealed' && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                          <MessageSquare size={12} /> Jockey đã gửi khiếu nại — cần xem xét
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canDecide && (
                        <>
                          <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-colors flex items-center gap-1">
                            <CheckCircle size={12} /> Xác nhận vi phạm
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1">
                            <XCircle size={12} /> Bác bỏ
                          </button>
                        </>
                      )}
                      <button onClick={() => setExpanded(isOpen ? null : v.id)}
                        className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors">
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-3">
                      <div className="h-px bg-glass-border" />

                      {/* Countdown bar (active only) */}
                      {v.status === 'pending_appeal' && v.minutesLeft > 0 && (
                        <div>
                          <div className="flex justify-between text-[10px] text-muted mb-1.5">
                            <span>Thời hạn khiếu nại của jockey</span>
                            <span className="text-yellow-400 font-bold">Còn {v.minutesLeft}/30 phút</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                              initial={{ width: '100%' }} animate={{ width: `${(v.minutesLeft / 30) * 100}%` }} transition={{ duration: 0.6 }} />
                          </div>
                        </div>
                      )}

                      {/* Violation description */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-glass-border">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Mô tả vi phạm</div>
                        <div className="text-sm text-white/85 leading-relaxed mb-2">{v.description}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Hình phạt đề xuất: <span className={`font-bold ${sev.color}`}>{v.penalty}</span></span>
                        </div>
                      </div>

                      {/* Camera angles */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Video size={13} className="text-muted" />
                        <span className="text-xs text-muted">Camera:</span>
                        {v.cameraAngles.map((c, idx) => (
                          <button key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-glass-border text-xs text-white hover:border-gold/30 hover:text-champagne transition-colors">
                            {c}
                          </button>
                        ))}
                      </div>

                      {/* Jockey appeal */}
                      {v.appealContent && (
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                          <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                            <MessageSquare size={11} /> Khiếu nại của {v.jockey}
                          </div>
                          <div className="text-sm text-white/80 leading-relaxed">{v.appealContent}</div>
                        </div>
                      )}

                      {/* Decision note */}
                      {canDecide && (
                        <div className="p-3 rounded-xl bg-gold/5 border border-gold/15 text-xs text-muted flex items-start gap-2">
                          <AlertTriangle size={12} className="text-gold shrink-0 mt-0.5" />
                          Quyết định của trọng tài là <span className="text-white font-bold">chính thức và cuối cùng</span>.
                          Admin sẽ nhận thông báo tự động sau khi bạn ra phán quyết.
                          {v.severity === 'disqualify' && <span className="text-orange-400"> Án truất quyền cho phép jockey kháng cáo lên Admin trong 48h.</span>}
                        </div>
                      )}

                      {/* Decided result */}
                      {(v.status === 'confirmed' || v.status === 'rejected') && (
                        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${v.status === 'confirmed' ? 'bg-red-500/5 border-red-500/20 text-red-300' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'}`}>
                          {v.status === 'confirmed' ? <CheckCircle size={13} /> : <XCircle size={13} />}
                          {v.status === 'confirmed' ? `Vi phạm đã được xác nhận chính thức. Hình phạt áp dụng: ${v.penalty}.` : 'Vi phạm đã bị bác bỏ. Khiếu nại của jockey được chấp nhận.'}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {displayed.length === 0 && (
              <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Không có vi phạm nào</div>
            )}
          </div>

          {/* Add modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-glass-border">
                <h3 className="text-lg font-serif text-white mb-1">Ghi nhận vi phạm</h3>
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
