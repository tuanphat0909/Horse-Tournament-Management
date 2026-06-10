import { motion } from 'framer-motion';
import { Bell, Flag, Calendar, Trophy, ChevronRight, Star, Activity, Award } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { useNavigate } from 'react-router-dom';

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function JockeyDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-8" style={{ minHeight: '160px' }}>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> 2 cuộc đua tuần này
              </div>
              <h1 className="text-2xl font-serif text-white mb-1.5">Chào mừng, <span className="italic text-champagne">Trần Đức Minh</span></h1>
              <p className="text-sm text-muted mb-5">3 lời mời đang chờ phản hồi • Hạng cá nhân #5 • 66% tỉ lệ thắng</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/jockey/invitations')} className="btn-gold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                  Xem lời mời <Bell size={13} />
                </button>
                <button onClick={() => navigate('/jockey/schedule')} className="px-5 py-2 rounded-lg text-xs text-champagne border border-gold/25 bg-gold/5 hover:bg-gold/10 transition-colors font-medium">
                  Lịch thi đấu
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
            {[
              { title: 'Lời mời mới', value: '3', trend: 'Chờ phản hồi', icon: Bell, color: 'text-yellow-400', bg: 'from-yellow-500/15 to-yellow-900/20', path: '/jockey/invitations' },
              { title: 'Cuộc đua sắp tới', value: '2', trend: '7 ngày tới', icon: Calendar, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20', path: '/jockey/schedule' },
              { title: 'Số lần thắng', value: '45', trend: '+3 tháng này', icon: Trophy, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20', path: '/jockey/stats' },
              { title: 'Tổng cuộc đua', value: '68', trend: 'Mùa giải 2026', icon: Flag, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20', path: '/jockey/races' },
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

          {/* Pending Invitations + Upcoming */}
          <div className="grid grid-cols-[1fr_380px] gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Lời mời đang chờ</h2>
                <button onClick={() => navigate('/jockey/invitations')} className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">Xem tất cả <ChevronRight size={14} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { owner: 'Lê Thị Hoa', horse: 'Storm Rider', race: 'Chung Kết - Giải Xuân 2026', date: '28/06/2026' },
                  { owner: 'Vũ Minh Tuấn', horse: 'Dark Knight', race: 'Vòng Loại - Cúp QG', date: '15/07/2026' },
                  { owner: 'Phạm Đức Mạnh', horse: 'Golden Flash', race: 'Vòng 1 - Giải Hè', date: '10/07/2026' },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-yellow-500/15 hover:border-yellow-500/30 transition-all">
                    <div className="text-2xl shrink-0">🐴</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{inv.horse}</div>
                      <div className="text-xs text-muted">Chủ: {inv.owner} • {inv.race} • {inv.date}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">Nhận</button>
                      <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-serif text-white mb-5">Thành tích gần đây</h2>
              <div className="space-y-3">
                {[
                  { icon: Trophy, color: 'text-gold bg-gold/10', text: 'Hạng 1 — Vòng 3 Giải Xuân (Thunderstrike)', time: '2 giờ trước' },
                  { icon: Star, color: 'text-blue-400 bg-blue-500/10', text: 'Hạng 2 — Vòng 2 Giải Xuân (Desert Wind)', time: '3 ngày trước' },
                  { icon: Activity, color: 'text-purple-400 bg-purple-500/10', text: 'Hạng 1 — Vòng 1 Giải Xuân (Thunderstrike)', time: '5 ngày trước' },
                  { icon: Award, color: 'text-emerald-400 bg-emerald-500/10', text: 'Nhận thưởng ₫21.000.000 từ Vòng 3', time: '2 giờ trước' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}><a.icon size={14} /></div>
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
