import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Severity = 'warning' | 'penalty' | 'disqualify';
type Status = 'appeal_window' | 'appealed' | 'confirmed' | 'rejected';

const MY_VIOLATIONS = [
  {
    id: 1, race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026', horse: 'Desert Wind',
    referee: 'Nguyễn Hoàng Việt', type: 'Lấn đường', severity: 'warning' as Severity,
    description: 'Ngựa Desert Wind chuyển làn không đúng quy định ở cột 800m, gây ảnh hưởng đến Thunderstrike phía sau.',
    penalty: 'Cảnh cáo lần 1', status: 'appeal_window' as Status,
    filedAt: '15/06/2026 11:20', deadline: '16/06/2026 11:20', hoursLeft: 14, minutesLeft: 23,
  },
  {
    id: 2, race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026', horse: 'Night Runner',
    referee: 'Nguyễn Hoàng Việt', type: 'Xuất phát sớm', severity: 'penalty' as Severity,
    description: 'Nài ngựa không chấp hành tín hiệu xuất phát, rời chuồng trước khi có hiệu lệnh.',
    penalty: 'Phạt thời gian +2 giây', status: 'appealed' as Status,
    filedAt: '12/06/2026 09:15', deadline: '13/06/2026 09:15', hoursLeft: 0, minutesLeft: 0,
    appealContent: 'Tôi không cố ý xuất phát sớm, ngựa bị giật mình bởi tiếng động bên ngoài. Đề nghị xem xét lại camera góc 3.',
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  warning:    { label: 'Cảnh cáo',    color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  penalty:    { label: 'Phạt',        color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  disqualify: { label: 'Truất quyền', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  appeal_window: { label: 'Đang trong thời hạn khiếu nại', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  appealed:      { label: 'Đã khiếu nại — Chờ Admin',      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',    icon: MessageSquare },
  confirmed:     { label: 'Vi phạm được xác nhận',          color: 'text-red-400 bg-red-500/10 border-red-500/20',       icon: XCircle },
  rejected:      { label: 'Admin bác bỏ vi phạm',           color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
};

export function JockeyViolationsPage() {
  const [expanded, setExpanded] = useState<number | null>(MY_VIOLATIONS[0]?.id ?? null);
  const [appealing, setAppealing] = useState<number | null>(null);
  const [appealText, setAppealText] = useState('');

  const pending = MY_VIOLATIONS.filter(v => v.status === 'appeal_window').length;

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div>
            <h1 className="text-2xl font-serif text-white">Vi phạm của tôi</h1>
            <p className="text-sm text-muted mt-1">
              {pending > 0
                ? <span className="text-yellow-400 font-medium">{pending} vi phạm đang trong thời hạn khiếu nại</span>
                : 'Không có vi phạm nào đang chờ xử lý'}
            </p>
          </div>

          {/* Info banner */}
          <div className="glass-panel rounded-xl p-4 border border-blue-500/15 bg-blue-500/[0.03] flex items-start gap-3">
            <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-muted leading-relaxed">
              Khi trọng tài ghi nhận vi phạm, bạn có <span className="text-white font-bold">24 giờ</span> để xem xét và gửi khiếu nại.
              Sau thời hạn này, Admin sẽ xem xét toàn bộ thông tin và đưa ra quyết định cuối cùng.
              Nếu Admin bác bỏ vi phạm, hình phạt sẽ được hủy bỏ.
            </div>
          </div>

          <div className="space-y-4">
            {MY_VIOLATIONS.map((v, i) => {
              const sev = SEVERITY_CONFIG[v.severity];
              const stat = STATUS_CONFIG[v.status];
              const StatIcon = stat.icon;
              const isOpen = expanded === v.id;
              const canAppeal = v.status === 'appeal_window' && v.hoursLeft > 0;

              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`glass-panel rounded-2xl border overflow-hidden transition-all ${canAppeal ? 'border-yellow-500/20' : 'border-glass-border'}`}>

                  {/* Header */}
                  <div className="p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center shrink-0`}>
                      <AlertTriangle size={22} className={sev.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-lg font-serif font-bold text-white">{v.type}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sev.bg} ${sev.border} ${sev.color}`}>{sev.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted mb-2">
                        <span>Ngựa: <span className="text-white font-medium">{v.horse}</span></span>
                        <span>{v.race} — {v.tournament}</span>
                        <span>Trọng tài: <span className="text-white">{v.referee}</span></span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${stat.color}`}>
                          <StatIcon size={10} /> {stat.label}
                        </span>
                        {canAppeal && (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-400">
                            <Clock size={14} />
                            Còn <span className="text-white">{v.hoursLeft}h {v.minutesLeft}m</span> để khiếu nại
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
                    <div className="px-6 pb-6 space-y-4">
                      <div className="h-px bg-glass-border" />

                      {/* Countdown bar */}
                      {v.status === 'appeal_window' && (
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted">Thời hạn khiếu nại</span>
                            <span className="text-yellow-400 font-bold">{v.hoursLeft}h {v.minutesLeft}m còn lại</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                              initial={{ width: '100%' }}
                              animate={{ width: `${(v.hoursLeft / 24) * 100}%` }}
                              transition={{ duration: 0.8 }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted mt-1">
                            <span>Ghi nhận: {v.filedAt}</span>
                            <span>Hạn chót: {v.deadline}</span>
                          </div>
                        </div>
                      )}

                      {/* Violation detail */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-glass-border space-y-2">
                        <div>
                          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Mô tả vi phạm</div>
                          <div className="text-sm text-white/85 leading-relaxed">{v.description}</div>
                        </div>
                        <div className="pt-2 border-t border-glass-border/50 flex items-center justify-between">
                          <span className="text-xs text-muted">Hình phạt đề xuất:</span>
                          <span className={`text-sm font-bold ${sev.color}`}>{v.penalty}</span>
                        </div>
                      </div>

                      {/* Existing appeal */}
                      {'appealContent' in v && v.appealContent && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                          <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                            <MessageSquare size={11} /> Khiếu nại của bạn (đã gửi)
                          </div>
                          <div className="text-sm text-white/80 leading-relaxed">{v.appealContent}</div>
                        </div>
                      )}

                      {/* Appeal form */}
                      {canAppeal && appealing !== v.id && (
                        <button onClick={() => setAppealing(v.id)}
                          className="w-full py-3 rounded-xl border-2 border-dashed border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/5 hover:border-yellow-500/50 transition-all flex items-center justify-center gap-2">
                          <MessageSquare size={15} /> Gửi khiếu nại
                        </button>
                      )}

                      {canAppeal && appealing === v.id && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
                          <div className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                            <MessageSquare size={14} /> Nội dung khiếu nại
                          </div>
                          <textarea rows={4} value={appealText} onChange={e => setAppealText(e.target.value)}
                            placeholder="Trình bày lý do bạn không đồng ý với vi phạm này. Có thể đề cập đến camera, nhân chứng, hoặc tình huống cụ thể..."
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

                      {!canAppeal && v.status === 'appeal_window' && (
                        <div className="flex items-center gap-2 text-xs text-muted p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                          <Clock size={12} className="text-red-400" /> Đã hết thời hạn khiếu nại
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
