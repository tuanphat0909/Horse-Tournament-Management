import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Severity = 'warning' | 'penalty' | 'disqualify';
type Status = 'appeal_window' | 'appealed' | 'confirmed' | 'rejected';
type Tab = 'pending' | 'appealed' | 'decided';

const VIOLATIONS = [
  {
    id: 1, horse: 'Desert Wind', owner: 'Nguyễn Văn An', jockey: 'Trần Đức Minh',
    race: 'Vòng 3 - Chặng Sức Bền', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Lấn đường', severity: 'warning' as Severity,
    description: 'Ngựa Desert Wind chuyển làn không đúng quy định ở cột 800m, gây ảnh hưởng đến Thunderstrike.',
    penalty: 'Cảnh cáo lần 1', status: 'appeal_window' as Status,
    filedAt: '15/06/2026 11:20', deadline: '16/06/2026 11:20', hoursLeft: 14,
    appealContent: null,
  },
  {
    id: 2, horse: 'Night Runner', owner: 'Bùi Thị Mai', jockey: 'Đỗ Văn Long',
    race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Xuất phát sớm', severity: 'penalty' as Severity,
    description: 'Nài ngựa không chấp hành tín hiệu xuất phát, rời chuồng trước khi có hiệu lệnh.',
    penalty: 'Phạt thời gian +2 giây', status: 'appealed' as Status,
    filedAt: '12/06/2026 09:15', deadline: '13/06/2026 09:15', hoursLeft: 0,
    appealContent: 'Tôi không cố ý xuất phát sớm, ngựa bị giật mình bởi tiếng động bên ngoài. Đề nghị xem xét lại camera góc 3.',
  },
  {
    id: 3, horse: 'Shadow Dancer', owner: 'Trần Thị Lan', jockey: 'Lý Minh Khôi',
    race: 'Vòng 1 - Chặng Mở Đầu', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Cản trở cố ý', severity: 'disqualify' as Severity,
    description: 'Nài ngựa cố ý chèn ép ngựa Storm Rider, gây nguy hiểm ở cột 400m về đích.',
    penalty: 'Truất quyền thi đấu', status: 'confirmed' as Status,
    filedAt: '10/06/2026 14:00', deadline: '11/06/2026 14:00', hoursLeft: 0,
    appealContent: null,
  },
  {
    id: 4, horse: 'Golden Flash', owner: 'Phạm Đức Mạnh', jockey: 'Lý Minh Khôi',
    race: 'Vòng 2 - Chặng Tốc Độ', tournament: 'Giải Xuân 2026',
    referee: 'Nguyễn Hoàng Việt', type: 'Cản trở', severity: 'warning' as Severity,
    description: 'Va chạm nhẹ với Silver Arrow tại cột 1200m.',
    penalty: 'Cảnh cáo', status: 'rejected' as Status,
    filedAt: '12/06/2026 10:00', deadline: '13/06/2026 10:00', hoursLeft: 0,
    appealContent: 'Va chạm là ngoài ý muốn, không phải cố ý.',
  },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  warning:    { label: 'Cảnh cáo',    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  penalty:    { label: 'Phạt',        color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  disqualify: { label: 'Truất quyền', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
};

const STATUS_DISPLAY: Record<Status, { label: string; color: string }> = {
  appeal_window: { label: 'Chờ hết thời hạn', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  appealed:      { label: 'Có khiếu nại',     color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  confirmed:     { label: 'Đã xác nhận',       color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  rejected:      { label: 'Đã bác bỏ',         color: 'text-muted bg-white/5 border-glass-border' },
};

const TAB_MAP: Record<Tab, Status[]> = {
  pending:  ['appeal_window'],
  appealed: ['appealed'],
  decided:  ['confirmed', 'rejected'],
};

export function AdminViolationsPage() {
  const [tab, setTab] = useState<Tab>('appealed');
  const [expanded, setExpanded] = useState<number | null>(2);

  const filtered = VIOLATIONS.filter(v => TAB_MAP[tab].includes(v.status));
  const counts: Record<Tab, number> = {
    pending:  VIOLATIONS.filter(v => v.status === 'appeal_window').length,
    appealed: VIOLATIONS.filter(v => v.status === 'appealed').length,
    decided:  VIOLATIONS.filter(v => ['confirmed', 'rejected'].includes(v.status)).length,
  };

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div>
            <h1 className="text-2xl font-serif text-white">Xử lý vi phạm</h1>
            <p className="text-sm text-muted mt-1">
              Xem xét và xác nhận vi phạm sau thời hạn khiếu nại của Jockey
            </p>
          </div>

          {/* Flow banner */}
          <div className="glass-panel rounded-xl p-4 border border-glass-border flex items-start gap-3">
            <AlertTriangle size={15} className="text-gold shrink-0 mt-0.5" />
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {['Trọng tài ghi nhận', '→', 'Jockey có 24h khiếu nại', '→', 'Admin xem xét (tab này)', '→', 'Xác nhận / Bác bỏ chính thức'].map((s, i) => (
                <span key={i} className={s === '→' ? 'text-muted/40' : `px-2.5 py-1 rounded-lg border text-white/80 ${i === 6 ? 'bg-gold/10 border-gold/20 text-gold font-bold' : 'bg-white/[0.04] border-glass-border'}`}>{s}</span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-glass-border">
            {([
              ['pending',  'Chờ hết thời hạn', 'text-yellow-400 border-yellow-400'],
              ['appealed', 'Có khiếu nại',      'text-blue-400 border-blue-400'],
              ['decided',  'Đã xử lý',          'text-muted border-muted'],
            ] as [Tab, string, string][]).map(([t, label, activeClass]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? activeClass : 'text-muted border-transparent hover:text-white'}`}>
                {label}
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-muted">{counts[t]}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((v, i) => {
              const sev = SEVERITY_CONFIG[v.severity];
              const stat = STATUS_DISPLAY[v.status];
              const isOpen = expanded === v.id;
              const canDecide = v.status === 'appealed';

              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`glass-panel rounded-xl border overflow-hidden ${canDecide ? 'border-blue-500/20' : 'border-glass-border'}`}>

                  <div className="p-5 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${sev.bg} border flex items-center justify-center shrink-0`}>
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
                        <span>Chủ: {v.owner}</span>
                        <span>{v.race} — {v.tournament}</span>
                      </div>
                      <div className="text-xs text-champagne font-medium">Hình phạt đề xuất: {v.penalty}</div>
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
                      {v.status === 'appeal_window' && v.hoursLeft > 0 && (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
                          <Clock size={12} /> Còn {v.hoursLeft}h
                        </span>
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
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-glass-border">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1">Mô tả vi phạm (Trọng tài)</div>
                        <div className="text-sm text-white/85 leading-relaxed">{v.description}</div>
                        <div className="mt-2 text-xs text-muted">Ghi nhận bởi: <span className="text-white">{v.referee}</span> lúc {v.filedAt}</div>
                      </div>

                      {v.appealContent && (
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                          <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                            <MessageSquare size={11} /> Khiếu nại của Jockey ({v.jockey})
                          </div>
                          <div className="text-sm text-white/80 leading-relaxed">{v.appealContent}</div>
                        </div>
                      )}

                      {canDecide && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-gold/5 border border-gold/15 text-xs text-muted">
                          <AlertTriangle size={12} className="text-gold" />
                          Xem xét kỹ nội dung khiếu nại và biên bản trọng tài trước khi đưa ra quyết định cuối cùng.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Không có vi phạm nào trong mục này</div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
