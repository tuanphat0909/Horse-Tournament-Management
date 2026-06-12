import { motion } from 'framer-motion';
import {
  Trophy, Activity, Calendar, ChevronRight, TrendingUp,
  Star, Clock, ShieldCheck, MapPin, Users,
  Target, Award, BarChart3, Zap, Flag,
} from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const IMG = {
  horse1: '/images/hero-jockey.jpg',
  horse2: '/images/hero-referee.jpg',
  horse3: '/images/hero-owner.jpg',
  horse4: '/images/hero-spectator.jpg',
  horse5: '/images/hero-admin.jpg',
};

const SPARKS = [
  'M0,18 L12,14 L24,16 L36,10 L48,12 L60,6 L72,8 L84,4 L96,6 L100,3',
  'M0,16 L14,12 L28,15 L42,8 L56,11 L70,5 L84,9 L100,4',
  'M0,14 L16,18 L32,10 L48,14 L64,6 L80,10 L96,3 L100,5',
  'M0,12 L14,16 L28,10 L42,14 L56,8 L70,12 L84,5 L100,2',
];

export function OwnerDashboardPage() {
  return (
    <div className="min-h-screen text-body font-sans flex" style={{ backgroundColor: '#0b101e' }}>
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <Topbar />

        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          {/* ROW 1: HERO */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{
              minHeight: '220px',
              background: `linear-gradient(to right, rgba(11,22,40,0.97) 0%, rgba(11,22,40,0.7) 40%, rgba(11,22,40,0.15) 100%), url('/images/hero-owner.jpg') center 58% / cover no-repeat`,
            }}
          >
            <div className="relative z-10 p-8 flex items-center justify-between" style={{ minHeight: '220px' }}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Mùa giải đang diễn ra
                </div>
                <h1 className="text-2xl font-serif text-white mb-1.5">
                  Chào mừng, <span className="italic text-champagne">Nguyễn Văn An</span>
                </h1>
                <p className="text-sm text-muted mb-5">2 ngựa thi đấu hôm nay • Hạng mùa giải #3 • Tỉ lệ thắng 68%</p>
                <div className="flex gap-3">
                  <button className="btn-gold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 font-bold">
                    Đăng ký ngựa <ChevronRight size={14} />
                  </button>
                  <button className="px-5 py-2 rounded-lg text-xs text-champagne border border-gold/25 bg-gold/5 hover:bg-gold/10 transition-colors font-medium">
                    Xem lịch thi đấu
                  </button>
                </div>
              </div>
              <div className="hidden lg:block bg-navy/70 backdrop-blur-md rounded-xl px-6 py-4 border border-gold/15 shrink-0">
                <div className="text-[9px] text-gold uppercase tracking-widest font-bold mb-3">Mùa giải 2026</div>
                <div className="flex gap-6">
                  {[{ l: 'Tiền thưởng', v: '₫1.2B' }, { l: 'Thắng', v: '21' }, { l: 'Hạng', v: '#3' }].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-serif font-bold text-white">{s.v}</div>
                      <div className="text-[10px] text-muted uppercase tracking-wider">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ROW 2: STATS */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
            {[
              { title: 'Ngựa của tôi', value: '12', trend: '+12%', icon: Star, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-900/20', spark: SPARKS[0] },
              { title: 'Đang thi đấu', value: '2', trend: '+1', icon: Activity, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20', spark: SPARKS[1] },
              { title: 'Sắp thi đấu', value: '4', trend: '3 ngày nữa', icon: Calendar, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-900/20', spark: SPARKS[2] },
              { title: 'Tiền thưởng', value: '₫1.2B', trend: '+18%', icon: Trophy, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20', spark: SPARKS[3] },
            ].map((m, i) => (
              <motion.div key={i} variants={child} className="glass-panel rounded-xl p-5 relative overflow-hidden group cursor-default" style={{ height: '140px' }}>
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
                <svg className="absolute bottom-0 left-0 w-full h-10 opacity-10 group-hover:opacity-25 transition-opacity" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`sf-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${m.spark} L100,20 L0,20 Z`} fill={`url(#sf-${i})`} />
                  <path d={m.spark} fill="none" stroke="var(--color-gold)" strokeWidth="0.4" />
                </svg>
              </motion.div>
            ))}
          </motion.div>

          {/* ROW 3: HORSES + RACES */}
          <div className="grid grid-cols-[1fr_380px] gap-6" style={{ minHeight: '420px' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Ngựa của tôi</h2>
                <button className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">
                  Xem tất cả <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {[
                  { name: 'Thunderstrike', breed: 'Thoroughbred', age: '3 tuổi', perf: 98, health: 100, next: 'Giải Xuân 2026', img: IMG.horse1 },
                  { name: 'Desert Wind', breed: 'Arabian', age: '4 tuổi', perf: 94, health: 95, next: 'Cúp Quốc Gia', img: IMG.horse2 },
                  { name: 'Midnight Run', breed: 'Thoroughbred', age: '2 tuổi', perf: 89, health: 98, next: 'Giải Xuân 2026', img: IMG.horse3 },
                  { name: 'Golden Hoof', breed: 'Quarter Horse', age: '5 tuổi', perf: 92, health: 88, next: 'Cúp Quốc Gia', img: IMG.horse4 },
                  { name: 'Silver Arrow', breed: 'Appaloosa', age: '3 tuổi', perf: 87, health: 96, next: 'Giải Khai Mạc Hè', img: IMG.horse5 },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-gold/15 transition-all group cursor-pointer">
                    <img src={h.img} alt={h.name} className="w-11 h-11 rounded-lg object-cover bg-surface border border-glass-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-champagne transition-colors truncate">{h.name}</div>
                      <div className="text-[11px] text-muted">{h.breed} • {h.age}</div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <div className="text-[11px] text-muted/60">Giải tiếp theo</div>
                      <div className="text-xs text-champagne font-medium">{h.next}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs font-bold text-champagne"><ShieldCheck size={11} /> {h.perf}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-12 h-1 bg-navy rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${h.health >= 95 ? 'bg-emerald-400' : h.health >= 85 ? 'bg-yellow-400' : 'bg-orange-400'}`} style={{ width: `${h.health}%` }} />
                          </div>
                          <span className="text-[10px] text-muted">{h.health}%</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-muted/30 group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-serif text-white">Lịch thi đấu sắp tới</h2>
                <button className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">
                  Xem lịch <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  { name: 'Vòng 4 - Bán Kết', date: 'Ngày mai, 09:00', loc: 'Trường đua Phú Thọ', prize: '₫85M', countdown: '1 ngày', horses: 2 },
                  { name: 'Vòng Loại 1 - Cúp QG', date: '15/07, 08:00', loc: 'Trường đua Đại Nam', prize: '₫120M', countdown: '35 ngày', horses: 1 },
                  { name: 'Chung Kết Giải Xuân', date: '28/06, 10:00', loc: 'Trường đua Phú Thọ', prize: '₫300M', countdown: '18 ngày', horses: 1 },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-glass-border hover:border-gold/20 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-champagne transition-colors">{r.name}</h3>
                      <span className="text-[10px] bg-gold/15 text-gold font-bold px-2 py-0.5 rounded">{r.countdown}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted mb-2">
                      <span className="flex items-center gap-1"><Clock size={11} className="text-gold/60" /> {r.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-gold/60" /> {r.loc}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-champagne font-bold">{r.prize}</span>
                      <span className="text-muted">{r.horses} ngựa tham gia</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ROW 4: PERFORMANCE + ACTIVITY */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-serif text-white mb-5">Thành tích mùa giải</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Tỉ lệ thắng', value: '68%', ring: 68, icon: Target, accent: 'text-emerald-400' },
                  { label: 'Tiền thưởng', value: '₫1.2B', ring: 82, icon: Award, accent: 'text-gold' },
                  { label: 'Số lần đua', value: '31', ring: 75, icon: BarChart3, accent: 'text-blue-400' },
                  { label: 'Xếp hạng', value: '#3', ring: 92, icon: Zap, accent: 'text-purple-400' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-glass-border group hover:border-gold/15 transition-all">
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeDasharray={`${s.ring} ${100 - s.ring}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <s.icon size={14} className={s.accent} />
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-serif text-white font-bold">{s.value}</div>
                      <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }} className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-serif text-white mb-5">Hoạt động gần đây</h2>
              <div className="space-y-3">
                {[
                  { action: 'Thunderstrike giành hạng 1 Vòng 3', time: '2 giờ trước', icon: Trophy, color: 'text-gold bg-gold/10' },
                  { action: 'Desert Wind đăng ký Cúp Quốc Gia thành công', time: '5 giờ trước', icon: Flag, color: 'text-blue-400 bg-blue-500/10' },
                  { action: 'Kiểm tra sức khỏe Golden Hoof hoàn tất', time: '1 ngày trước', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10' },
                  { action: 'Jockey Trần Đức Minh xác nhận lời mời', time: '1 ngày trước', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
                  { action: 'Nhận thưởng Vòng 2: ₫42.000.000', time: '2 ngày trước', icon: Award, color: 'text-champagne bg-gold/10' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                      <a.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/90 group-hover:text-white transition-colors">{a.action}</div>
                      <div className="text-[11px] text-muted/60 mt-0.5">{a.time}</div>
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
