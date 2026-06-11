import { motion } from 'framer-motion';
import {
  Users, Trophy, ClipboardList, Calendar,
  TrendingUp, ChevronRight, CheckCircle, Clock, XCircle,
  Activity, UserCheck, Megaphone,
} from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { useNavigate } from 'react-router-dom';

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const RECENT_ACTIVITY = [
  { icon: Users, color: 'text-blue-400 bg-blue-500/10', text: 'Nguyễn Văn An đăng ký tài khoản Horse Owner', time: '5 phút trước' },
  { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10', text: 'Duyệt đăng ký ngựa "Thunder Storm" cho Giải Xuân', time: '20 phút trước' },
  { icon: Trophy, color: 'text-gold bg-gold/10', text: 'Giải đua Mùa Xuân 2026 đã bắt đầu', time: '1 giờ trước' },
  { icon: Megaphone, color: 'text-purple-400 bg-purple-500/10', text: 'Kết quả Vòng 3 đã được công bố', time: '2 giờ trước' },
  { icon: UserCheck, color: 'text-cyan-400 bg-cyan-500/10', text: 'Trọng tài Lê Hoàng Nam được phân công Race #7', time: '3 giờ trước' },
  { icon: XCircle, color: 'text-red-400 bg-red-500/10', text: 'Từ chối đăng ký: ngựa chưa đủ tuổi tối thiểu', time: '4 giờ trước' },
];

const PENDING_REGISTRATIONS = [
  { horse: 'Silver Arrow', owner: 'Trần Thị Bình', tournament: 'Giải Xuân 2026', date: '09/06/2026', status: 'pending' },
  { horse: 'Golden Flash', owner: 'Phạm Đức Mạnh', tournament: 'Cúp Quốc Gia', date: '08/06/2026', status: 'pending' },
  { horse: 'Dark Knight', owner: 'Vũ Minh Tuấn', tournament: 'Giải Xuân 2026', date: '08/06/2026', status: 'pending' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{
              minHeight: '220px',
              background: `linear-gradient(to right, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.7) 40%, rgba(11,22,40,0.15) 100%), url('/images/hero-admin.jpg') center center / cover no-repeat`,
            }}
          >
            <div className="relative z-10 p-8 flex items-center justify-between" style={{ minHeight: '220px' }}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Hệ thống đang hoạt động
                </div>
                <h1 className="text-2xl font-serif text-white mb-1.5">
                  Chào mừng, <span className="italic text-champagne">Admin</span>
                </h1>
                <p className="text-sm text-muted mb-5">Tổng quan hệ thống • Mùa giải 2026 Q3 • 24 đăng ký đang chờ duyệt</p>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/admin/registrations')} className="btn-gold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                    Xem đăng ký <ChevronRight size={13} />
                  </button>
                  <button onClick={() => navigate('/admin/races')} className="px-5 py-2 rounded-lg text-xs text-champagne border border-gold/25 bg-gold/5 hover:bg-gold/10 transition-colors font-medium">
                    Quản lý cuộc đua
                  </button>
                </div>
              </div>
              <div className="hidden lg:block bg-navy/70 backdrop-blur-md rounded-xl px-6 py-4 border border-gold/15 shrink-0">
                <div className="text-[9px] text-gold uppercase tracking-widest font-bold mb-3">Thống kê hệ thống</div>
                <div className="flex gap-6">
                  {[{ l: 'Người dùng', v: '156' }, { l: 'Giải đấu', v: '8' }, { l: 'Hôm nay', v: '5 đua' }].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-serif font-bold text-white">{s.v}</div>
                      <div className="text-[10px] text-muted uppercase tracking-wider">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Người dùng', value: '156', trend: '+12', icon: Users, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20', path: '/admin/users' },
              { title: 'Giải đấu', value: '8', trend: '3 active', icon: Trophy, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20', path: '/admin/tournaments' },
              { title: 'Chờ duyệt', value: '24', trend: 'Cần xử lý', icon: ClipboardList, color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-900/20', path: '/admin/registrations' },
              { title: 'Cuộc đua hôm nay', value: '5', trend: '2 đang chạy', icon: Calendar, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20', path: '/admin/races' },
            ].map((m, i) => (
              <motion.div
                key={i}
                variants={child}
                onClick={() => navigate(m.path)}
                className="glass-panel rounded-xl p-5 relative overflow-hidden group cursor-pointer"
                style={{ height: '130px' }}
              >
                <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${m.bg} blur-[30px] opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.bg} border border-white/[0.08] flex items-center justify-center ${m.color}`}>
                    <m.icon size={18} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <TrendingUp size={10} /> {m.trend}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-2xl font-serif text-white font-bold group-hover:text-champagne transition-colors">{m.value}</div>
                  <div className="text-[11px] text-muted/70 font-medium">{m.title}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* PENDING + ACTIVITY */}
          <div className="grid grid-cols-[1fr_380px] gap-6">
            {/* Pending Registrations */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-serif text-white">Đăng ký chờ duyệt</h2>
                  <p className="text-xs text-muted mt-0.5">Cần xử lý trong 24h</p>
                </div>
                <button onClick={() => navigate('/admin/registrations')} className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">
                  Xem tất cả <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                {PENDING_REGISTRATIONS.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-glass-border hover:border-gold/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-lg">🐴</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{r.horse}</div>
                      <div className="text-xs text-muted">Chủ: {r.owner} • {r.tournament}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted flex items-center gap-1"><Clock size={10} /> {r.date}</span>
                      <button className="px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">Duyệt</button>
                      <button className="px-3 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">Từ chối</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Hoạt động gần đây</h2>
                <Activity size={16} className="text-muted" />
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                      <a.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white/90 group-hover:text-white transition-colors leading-relaxed">{a.text}</div>
                      <div className="text-[10px] text-muted/60 mt-0.5">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* QUICK LINKS */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tạo giải đấu mới', desc: 'Thêm tournament mới vào hệ thống', icon: Trophy, path: '/admin/tournaments', color: 'text-gold' },
              { label: 'Phân công trọng tài', desc: 'Gán referee cho các cuộc đua', icon: UserCheck, path: '/admin/referees', color: 'text-cyan-400' },
              { label: 'Lập lịch đua', desc: 'Tạo và sắp xếp các vòng đua', icon: Calendar, path: '/admin/races', color: 'text-purple-400' },
              { label: 'Công bố kết quả', desc: 'Publish kết quả đã xác nhận', icon: Megaphone, path: '/admin/results', color: 'text-emerald-400' },
            ].map((q, i) => (
              <motion.button
                key={i}
                onClick={() => navigate(q.path)}
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-xl p-5 text-left group hover:border-gold/20 border border-glass-border transition-all"
              >
                <q.icon size={22} className={`${q.color} mb-3`} />
                <div className="text-sm font-semibold text-white group-hover:text-champagne transition-colors">{q.label}</div>
                <div className="text-xs text-muted mt-1 leading-relaxed">{q.desc}</div>
              </motion.button>
            ))}
          </motion.div>

        </main>
      </div>
    </div>
  );
}
