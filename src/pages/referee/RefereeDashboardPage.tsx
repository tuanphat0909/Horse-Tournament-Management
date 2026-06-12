import { motion } from 'framer-motion';
import { ShieldCheck, Flag, FileText, ClipboardList, ChevronRight, AlertTriangle, CheckCircle, Activity, Award } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { useNavigate } from 'react-router-dom';

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function RefereeDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{
              minHeight: '220px',
              background: `linear-gradient(to right, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.7) 40%, rgba(11,22,40,0.15) 100%), url('/images/hero-referee.jpg') right 52% / cover no-repeat`,
            }}
          >
            <div className="relative z-10 p-8 flex flex-col items-start justify-center" style={{ minHeight: '220px' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 2 cuộc đua cần kiểm tra hôm nay
              </div>
              <h1 className="text-2xl font-serif text-white mb-1.5">Chào mừng, <span className="italic text-champagne">Nguyễn Hoàng Việt</span></h1>
              <p className="text-sm text-muted mb-5">Trọng tài — Mùa giải 2026 • 1 vi phạm chờ xử lý • 3 kết quả chờ xác nhận</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/referee/horse-check')} className="btn-gold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                  Kiểm tra ngựa <ShieldCheck size={13} />
                </button>
                <button onClick={() => navigate('/referee/violations')} className="px-5 py-2 rounded-lg text-xs text-champagne border border-gold/25 bg-gold/5 hover:bg-gold/10 transition-colors font-medium">
                  Xử lý vi phạm
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
            {[
              { title: 'Cuộc đua hôm nay', value: '2', trend: 'Cần giám sát', icon: Flag, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20', path: '/referee/confirm-results' },
              { title: 'Ngựa cần kiểm tra', value: '5', trend: 'Chờ phê duyệt', icon: ShieldCheck, color: 'text-yellow-400', bg: 'from-yellow-500/15 to-yellow-900/20', path: '/referee/horse-check' },
              { title: 'Vi phạm chờ xử lý', value: '1', trend: 'Cần xem xét', icon: AlertTriangle, color: 'text-red-400', bg: 'from-red-500/15 to-red-900/20', path: '/referee/violations' },
              { title: 'Báo cáo đã gửi', value: '12', trend: 'Mùa giải 2026', icon: FileText, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20', path: '/referee/reports' },
            ].map((m, i) => (
              <motion.div key={i} variants={child} onClick={() => navigate(m.path)}
                className="glass-panel rounded-xl p-5 relative overflow-hidden group cursor-pointer" style={{ height: '130px' }}>
                <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${m.bg} blur-[30px] opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.bg} border border-white/[0.08] flex items-center justify-center ${m.color}`}><m.icon size={18} /></div>
                  <div className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{m.trend}</div>
                </div>
                <div className="relative z-10">
                  <div className="text-2xl font-serif text-white font-bold group-hover:text-champagne transition-colors">{m.value}</div>
                  <div className="text-[11px] text-muted/70 font-medium">{m.title}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Today races + Recent activity */}
          <div className="grid grid-cols-[1fr_360px] gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Cuộc đua hôm nay</h2>
                <button onClick={() => navigate('/referee/confirm-results')} className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">Xem tất cả <ChevronRight size={14} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { round: 'Vòng 4 - Bán Kết', time: '09:00', horses: 8, status: 'upcoming', location: 'Trường đua Phú Thọ' },
                  { round: 'Vòng 4 - Bán Kết (Nhóm 2)', time: '11:30', horses: 7, status: 'upcoming', location: 'Trường đua Phú Thọ' },
                ].map((race, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-glass-border hover:border-blue-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Flag size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{race.round}</div>
                      <div className="text-xs text-muted">{race.time} • {race.horses} ngựa • {race.location}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 text-xs font-bold transition-colors">
                      Giám sát
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList size={16} className="text-gold" />
                <h2 className="text-base font-serif text-white">Hoạt động gần đây</h2>
              </div>
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10', text: 'Phê duyệt Thunderstrike — sức khỏe đạt', time: '1 giờ trước' },
                  { icon: AlertTriangle, color: 'text-red-400 bg-red-500/10', text: 'Ghi nhận vi phạm — Desert Wind lấn đường', time: '3 giờ trước' },
                  { icon: CheckCircle, color: 'text-blue-400 bg-blue-500/10', text: 'Xác nhận kết quả Vòng 3', time: 'Hôm qua' },
                  { icon: Activity, color: 'text-purple-400 bg-purple-500/10', text: 'Gửi báo cáo Vòng 3 lên Admin', time: 'Hôm qua' },
                  { icon: Award, color: 'text-gold bg-gold/10', text: 'Xác nhận top 3 Vòng 2', time: '2 ngày trước' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}><a.icon size={13} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white/90 leading-relaxed">{a.text}</div>
                      <div className="text-[10px] text-muted/60 mt-0.5">{a.time}</div>
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
