import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, XCircle, Clock, Star, Send } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const JOCKEYS = [
  { id: 1, name: 'Trần Đức Minh', wins: 45, races: 68, winRate: 66, rating: 4.9, status: 'confirmed', horse: 'Thunderstrike', race: 'Vòng 4 - Bán Kết' },
  { id: 2, name: 'Hoàng Thị Lan', wins: 32, races: 50, winRate: 64, rating: 4.7, status: 'confirmed', horse: 'Desert Wind', race: 'Vòng 4 - Bán Kết' },
  { id: 3, name: 'Ngô Minh Khoa', wins: 18, races: 35, winRate: 51, rating: 4.4, status: 'pending', horse: 'Silver Arrow', race: 'Chung Kết' },
];

const AVAILABLE_JOCKEYS = [
  { id: 4, name: 'Đinh Văn Hải', wins: 28, races: 45, winRate: 62, rating: 4.6 },
  { id: 5, name: 'Lý Thị Thu', wins: 15, races: 30, winRate: 50, rating: 4.3 },
  { id: 6, name: 'Phan Đức Long', wins: 40, races: 60, winRate: 67, rating: 4.8 },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Đã xác nhận', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  pending:   { label: 'Chờ phản hồi', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  rejected:  { label: 'Từ chối', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
};

export function OwnerJockeysPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Nài ngựa"
            subtitle="Danh sách nài ngựa hợp tác"
            imageUrl="/images/hero-owner.jpg"
            imagePosition="center 58%"
            actions={
              <button onClick={() => setShowInvite(true)} className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-bold">
                <Plus size={16} /> Mời Jockey
              </button>
            }
          />

          {/* Active Assignments */}
          <div>
            <h2 className="text-base font-medium text-white mb-4">Jockey hiện tại</h2>
            <div className="space-y-3">
              {JOCKEYS.map((j, i) => {
                const cfg = STATUS_CONFIG[j.status as keyof typeof STATUS_CONFIG];
                const Icon = cfg.icon;
                return (
                  <motion.div key={j.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="glass-panel rounded-xl p-5 flex items-center gap-5 border border-glass-border hover:border-gold/20 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/20 flex items-center justify-center font-serif font-bold text-blue-300 text-lg shrink-0">
                      {j.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-serif text-white mb-0.5">{j.name}</div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span>⭐ {j.rating}</span>
                        <span>{j.wins} thắng / {j.races} đua ({j.winRate}%)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted mb-0.5">Ngựa được giao</div>
                      <div className="text-sm font-semibold text-champagne">🐴 {j.horse}</div>
                      <div className="text-xs text-muted mt-0.5">{j.race}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shrink-0 ${cfg.color}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                    {j.status === 'pending' && (
                      <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0" title="Hủy lời mời">
                        <XCircle size={15} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Available Jockeys */}
          <div>
            <h2 className="text-base font-medium text-white mb-4">Jockey khả dụng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AVAILABLE_JOCKEYS.map((j, i) => (
                <motion.div key={j.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-xl p-5 border border-glass-border hover:border-gold/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/20 flex items-center justify-center font-serif font-bold text-purple-300 text-lg shrink-0">
                      {j.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-serif text-white">{j.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Star size={10} className="text-gold fill-gold" /> {j.rating}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{ l: 'Thắng', v: j.wins }, { l: 'Đã đua', v: j.races }, { l: 'Tỉ lệ', v: `${j.winRate}%` }].map(s => (
                      <div key={s.l} className="bg-navy/60 rounded-lg p-2 text-center border border-glass-border">
                        <div className="text-sm font-bold text-white">{s.v}</div>
                        <div className="text-[9px] uppercase tracking-wider text-muted">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 text-xs font-bold border border-gold/20 transition-colors flex items-center justify-center gap-1.5">
                    <Send size={12} /> Gửi lời mời
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-8 w-full max-w-md border border-gold/20">
            <h2 className="text-xl font-serif text-white mb-6">Mời Jockey</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Chọn ngựa</label>
                <select className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-gold/40">
                  <option>Thunderstrike</option><option>Desert Wind</option><option>Midnight Run</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Chọn cuộc đua</label>
                <select className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-gold/40">
                  <option>Chung Kết - Giải Xuân 2026</option><option>Vòng Loại 1 - Cúp Quốc Gia</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Tên Jockey</label>
                <input placeholder="Nhập tên jockey..." className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 rounded-lg border border-glass-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Hủy</button>
              <button onClick={() => setShowInvite(false)} className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold">Gửi lời mời</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
