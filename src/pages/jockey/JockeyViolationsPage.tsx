import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, ChevronDown, ArrowUpCircle } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type Severity = 'warning' | 'penalty' | 'disqualify';
type Status = 'pending_appeal' | 'appealed' | 'confirmed' | 'rejected';

const MY_VIOLATIONS = [
  {
    id: 1, race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', horse: 'Desert Wind',
    referee: 'Nguyễn Hoàng Việt', type: 'Lấn đường', severity: 'warning' as Severity,
    description: 'Ngựa Desert Wind chuyển làn không đúng quy định ở cột 800m, gây cản trở Thunderstrike phía sau.',
    penalty: 'Cảnh cáo lần 1', status: 'pending_appeal' as Status,
    filedAt: '15/06/2026 11:20', minutesLeft: 18, totalMinutes: 30,
    canEscalate: false,
  },
  {
    id: 2, race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026', horse: 'Night Runner',
    referee: 'Nguyễn Hoàng Việt', type: 'Xuất phát sớm', severity: 'penalty' as Severity,
    description: 'Nài ngựa rời chuồng xuất phát trước hiệu lệnh khoảng 0.3 giây.',
    penalty: 'Phạt thời gian +2 giây', status: 'appealed' as Status,
    filedAt: '12/06/2026 09:15', minutesLeft: 0, totalMinutes: 30,
    appealContent: 'Ngựa bị giật mình bởi tiếng động bên ngoài đường đua. Đề nghị trọng tài xem lại camera góc chuồng xuất phát.',
    canEscalate: false,
  },
  {
    id: 3, race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', horse: 'Shadow Dancer',
    referee: 'Nguyễn Hoàng Việt', type: 'Cản trở cố ý', severity: 'disqualify' as Severity,
    description: 'Nài ngựa cố ý chèn ép ngựa Storm Rider, gây nguy hiểm ở cột 400m về đích.',
    penalty: 'Truất quyền thi đấu', status: 'confirmed' as Status,
    filedAt: '10/06/2026 14:00', minutesLeft: 0, totalMinutes: 30,
    appealContent: 'Đây là va chạm ngoài ý muốn do đường đua hẹp tại cột 400m.',
    canEscalate: true,
    escalateDeadline: '12/06/2026 14:00',
    escalateHoursLeft: 39,
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  warning:    { label: 'Cảnh cáo',    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  penalty:    { label: 'Phạt',        color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  disqualify: { label: 'Truất quyền', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  pending_appeal: { label: 'Đang chờ khiếu nại',          color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  appealed:       { label: 'Đã khiếu nại — Chờ trọng tài', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',    icon: MessageSquare },
  confirmed:      { label: 'Trọng tài xác nhận vi phạm',   color: 'text-red-400 bg-red-500/10 border-red-500/20',       icon: XCircle },
  rejected:       { label: 'Trọng tài bác bỏ vi phạm',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
};

export function JockeyViolationsPage() {
  const [expanded, setExpanded] = useState<number | null>(MY_VIOLATIONS[0]?.id ?? null);
  const [appealing, setAppealing] = useState<number | null>(null);
  const [appealText, setAppealText] = useState('');

  const pending = MY_VIOLATIONS.filter(v => v.status === 'pending_appeal').length;

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Vi phạm của tôi"
            subtitle="Các đơn vi phạm và khiếu nại"
            imageUrl="/images/hero-jockey.jpg"
            imagePosition="center 25%"
          />

          {/* Info */}
          <div className="glass-panel rounded-xl p-4 border border-blue-500/15 bg-blue-500/[0.02] flex items-start gap-3">
            <Clock size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-muted leading-relaxed space-y-1">
              <div>Khi trọng tài ghi nhận vi phạm, bạn có <span className="text-white font-bold">30 phút</span> để gửi khiếu nại — trước khi kết quả cuộc đua được công bố chính thức.</div>
              <div>Trọng tài sẽ xem lại footage và ra phán quyết cuối cùng. Với án <span className="text-red-400 font-bold">truất quyền</span>, bạn có thêm <span className="text-white font-bold">48 giờ</span> để kháng cáo lên Ban tổ chức.</div>
            </div>
          </div>

          <div className="space-y-4">
            {MY_VIOLATIONS.map((v, i) => {
              const sev = SEVERITY_CONFIG[v.severity];
              const stat = STATUS_CONFIG[v.status];
              const StatIcon = stat.icon;
              const isOpen = expanded === v.id;
              const canAppeal = v.status === 'pending_appeal' && v.minutesLeft > 0;
              const pct = v.minutesLeft > 0 ? (v.minutesLeft / v.totalMinutes) * 100 : 0;

              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`glass-panel rounded-2xl border overflow-hidden ${canAppeal ? 'border-yellow-500/25' : v.status === 'confirmed' ? 'border-red-500/15' : 'border-glass-border'}`}>

                  <div className="p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${sev.bg} border flex items-center justify-center shrink-0`}>
                      <AlertTriangle size={22} className={sev.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-lg font-serif font-bold text-white">{v.type}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sev.bg} ${sev.color}`}>{sev.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${stat.color}`}>
                          <StatIcon size={10} /> {stat.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted mb-2">
                        <span>Ngựa: <span className="text-white font-medium">{v.horse}</span></span>
                        <span>{v.race} — {v.tournament}</span>
                        <span>Trọng tài: <span className="text-white">{v.referee}</span></span>
                      </div>
                      {canAppeal && (
                        <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-400">
                          <Clock size={14} />
                          Còn <span className="text-white mx-1">{v.minutesLeft} phút</span> để khiếu nại
                        </div>
                      )}
                      {'canEscalate' in v && v.canEscalate && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-400 font-bold mt-1">
                          <ArrowUpCircle size={13} /> Có thể kháng cáo lên Admin — còn {'escalateHoursLeft' in v ? v.escalateHoursLeft : 0}h (trước {('escalateDeadline' in v ? v.escalateDeadline : '')})
                        </div>
                      )}
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : v.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-6 space-y-4">
                      <div className="h-px bg-glass-border" />

                      {/* Countdown bar */}
                      {v.status === 'pending_appeal' && (
                        <div>
                          <div className="flex justify-between text-[10px] mb-1.5">
                            <span className="text-muted">Thời hạn khiếu nại</span>
                            <span className={v.minutesLeft > 10 ? 'text-yellow-400 font-bold' : v.minutesLeft > 0 ? 'text-red-400 font-bold' : 'text-muted'}>
                              {v.minutesLeft > 0 ? `Còn ${v.minutesLeft}/30 phút` : 'Đã hết thời hạn'}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div className={`h-full rounded-full ${pct > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                              initial={{ width: '100%' }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted mt-1">
                            <span>Ghi nhận: {v.filedAt}</span>
                            <span>Hạn: 30 phút sau khi ghi nhận</span>
                          </div>
                        </div>
                      )}

                      {/* Violation details */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-glass-border">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Mô tả vi phạm của trọng tài</div>
                        <div className="text-sm text-white/85 leading-relaxed mb-3">{v.description}</div>
                        <div className="flex justify-between items-center text-xs border-t border-glass-border/50 pt-2">
                          <span className="text-muted">Hình phạt đề xuất:</span>
                          <span className={`font-bold ${sev.color}`}>{v.penalty}</span>
                        </div>
                      </div>

                      {/* Existing appeal */}
                      {'appealContent' in v && v.appealContent && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                          <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                            <MessageSquare size={11} /> Khiếu nại đã gửi
                          </div>
                          <div className="text-sm text-white/80 leading-relaxed">{v.appealContent}</div>
                        </div>
                      )}

                      {/* Appeal form */}
                      {canAppeal && appealing !== v.id && (
                        <button onClick={() => setAppealing(v.id)}
                          className="w-full py-3 rounded-xl border-2 border-dashed border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/5 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2">
                          <MessageSquare size={15} /> Gửi khiếu nại ngay
                        </button>
                      )}

                      {canAppeal && appealing === v.id && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
                          <div className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                            <MessageSquare size={14} /> Nội dung khiếu nại
                          </div>
                          <p className="text-xs text-muted">Trình bày lý do không đồng ý. Có thể đề cập tình huống cụ thể, camera góc nào, hoặc nhân chứng.</p>
                          <textarea rows={4} value={appealText} onChange={e => setAppealText(e.target.value)}
                            placeholder="VD: Tôi không cố ý lấn đường, ngựa bị kéo do... Đề nghị xem camera góc..."
                            className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none resize-none focus:border-yellow-500/40 transition-colors" />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setAppealing(null)} className="px-4 py-2 rounded-lg text-xs text-muted border border-glass-border hover:text-white transition-colors">Hủy</button>
                            <button onClick={() => setAppealing(null)} disabled={!appealText.trim()}
                              className="px-5 py-2 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                              Gửi khiếu nại
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Escalation to Admin (only for disqualify + confirmed) */}
                      {'canEscalate' in v && v.canEscalate && v.status === 'confirmed' && (
                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <div className="text-sm font-bold text-orange-400 flex items-center gap-2">
                                <ArrowUpCircle size={15} /> Kháng cáo lên Ban tổ chức
                              </div>
                              <div className="text-xs text-muted mt-0.5">
                                Án truất quyền có thể kháng cáo trong vòng <span className="text-white font-bold">48 giờ</span> kể từ khi trọng tài ra quyết định.
                                Còn {'escalateHoursLeft' in v ? v.escalateHoursLeft : 0}h (hạn: {'escalateDeadline' in v ? v.escalateDeadline : ''}).
                              </div>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/25 hover:bg-orange-500/25 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0">
                              <ArrowUpCircle size={13} /> Gửi kháng cáo
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Final verdict */}
                      {v.status === 'rejected' && (
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle size={13} /> Trọng tài đã bác bỏ vi phạm. Khiếu nại của bạn được chấp nhận — hình phạt không áp dụng.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {MY_VIOLATIONS.length === 0 && (
              <div className="glass-panel rounded-xl p-16 text-center">
                <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
                <div className="text-white font-medium mb-1">Không có vi phạm nào</div>
                <div className="text-xs text-muted">Bạn chưa bị ghi nhận vi phạm nào trong mùa giải này</div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
