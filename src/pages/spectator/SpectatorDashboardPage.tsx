import { motion } from 'framer-motion';
import { Trophy, Bell, BarChart3, Eye, ChevronRight, TrendingUp, Activity, Sparkles, Wallet } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { useNavigate } from 'react-router-dom';

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const LIVE_RACES = [
  { round: 'Vòng 3 - Nhóm 2', tournament: 'Giải Xuân 2026', horses: 6, leader: 'Silver Arrow', time: '1:23.8', status: 'live' },
];

const UPCOMING = [
  { round: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', date: '20/06/2026', time: '09:00', horses: 8 },
  { round: 'Chung Kết', tournament: 'Giải Xuân 2026', date: '28/06/2026', time: '10:00', horses: 4 },
];

export function SpectatorDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-body font-sans flex" style={{ backgroundColor: '#0b101e' }}>
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
              background: `linear-gradient(to right, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.7) 40%, rgba(11,22,40,0.15) 100%), url('/images/hero-spectator.jpg') center 50% / cover no-repeat`,
            }}
          >
            <div className="relative z-10 p-8 flex flex-col items-start justify-center" style={{ minHeight: '220px' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> 1 cuộc đua đang diễn ra
              </div>
              <h1 className="text-2xl font-serif text-white mb-1.5">Chào mừng, <span className="italic text-champagne">Hoàng Minh Tuấn</span></h1>
              <p className="text-sm text-muted mb-5">2 cuộc đua sắp tới • 3 dự đoán đang chờ kết quả • 1 thông báo mới</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/spectator/live')} className="btn-gold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                  Xem kết quả trực tiếp <Eye size={13} />
                </button>
                <button onClick={() => navigate('/spectator/predictions')} className="px-5 py-2 rounded-lg text-xs text-champagne border border-gold/25 bg-gold/5 hover:bg-gold/10 transition-colors font-medium">
                  Dự đoán của tôi
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-5 gap-4">
            {[
              { title: 'Số dư', value: '3,500', trend: '≈ $35.00', icon: Wallet, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20', path: '/spectator/wallet' },
              { title: 'Đang diễn ra', value: '1', trend: 'Live ngay', icon: Activity, color: 'text-red-400', bg: 'from-red-500/15 to-red-900/20', path: '/spectator/live' },
              { title: 'Giải đấu', value: '3', trend: 'Đang theo dõi', icon: Trophy, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20', path: '/spectator/tournaments' },
              { title: 'Dự đoán', value: '7', trend: '3 chờ kết quả', icon: BarChart3, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20', path: '/spectator/predictions' },
              { title: 'Thông báo', value: '1', trend: 'Chưa đọc', icon: Bell, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20', path: '/spectator/notifications' },
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

          {/* Live race + Upcoming */}
          <div className="grid grid-cols-[1fr_360px] gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Đang diễn ra</h2>
                <button onClick={() => navigate('/spectator/live')} className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">Chi tiết <ChevronRight size={14} /></button>
              </div>
              {LIVE_RACES.map((r, i) => (
                <div key={i} className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm font-bold text-red-400">LIVE</span>
                    <span className="text-sm text-white font-serif">{r.round}</span>
                  </div>
                  <div className="text-xs text-muted mb-3">{r.tournament} • {r.horses} ngựa</div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-glass-border">
                    <TrendingUp size={14} className="text-gold" />
                    <div className="text-sm font-bold text-white">Dẫn đầu: {r.leader}</div>
                    <div className="ml-auto text-sm font-mono text-champagne font-bold">{r.time}</div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted mb-3">Sắp diễn ra</h3>
                <div className="space-y-2">
                  {UPCOMING.map((u, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                      <Trophy size={13} className="text-gold/60 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white">{u.round}</div>
                        <div className="text-[10px] text-muted">{u.tournament} • {u.date} {u.time}</div>
                      </div>
                      <span className="text-[10px] text-muted">{u.horses} ngựa</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} className="text-gold" />
                <h2 className="text-base font-serif text-white">Dự đoán gần đây</h2>
              </div>
              <div className="space-y-3">
                {[
                  { horse: 'Thunderstrike', race: 'Vòng 3', result: 'correct', prize: '+1,000 coins' },
                  { horse: 'Desert Wind', race: 'Vòng 2', result: 'correct', prize: '+1,200 coins' },
                  { horse: 'Storm Rider', race: 'Vòng 4', result: 'pending', prize: '-500 coins' },
                  { horse: 'Silver Arrow', race: 'Vòng 4', result: 'pending', prize: '-300 coins' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                    <div>
                      <div className="text-xs font-medium text-white">🐴 {p.horse}</div>
                      <div className="text-[10px] text-muted">{p.race}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[11px] font-bold ${p.result === 'correct' ? 'text-emerald-400' : p.result === 'incorrect' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {p.result === 'correct' ? 'Đúng' : p.result === 'incorrect' ? 'Sai' : 'Chờ'}
                      </div>
                      <div className="text-xs text-gold font-bold">{p.prize}</div>
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
