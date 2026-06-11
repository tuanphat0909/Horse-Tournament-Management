import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShieldCheck, ChevronRight, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const HORSES = [
  { id: 1, name: 'Thunderstrike', breed: 'Thoroughbred', age: 3, color: 'Nâu đỏ', weight: 480, health: 100, perf: 98, status: 'racing', jockey: 'Trần Đức Minh', img: '/images/hero-jockey.jpg' },
  { id: 2, name: 'Desert Wind', breed: 'Arabian', age: 4, color: 'Xám bạc', weight: 460, health: 95, perf: 94, status: 'racing', jockey: 'Hoàng Thị Lan', img: '/images/hero-owner.jpg' },
  { id: 3, name: 'Midnight Run', breed: 'Thoroughbred', age: 2, color: 'Đen', weight: 440, health: 98, perf: 89, status: 'registered', jockey: null, img: '/images/hero-referee.jpg' },
  { id: 4, name: 'Golden Hoof', breed: 'Quarter Horse', age: 5, color: 'Vàng', weight: 510, health: 88, perf: 92, status: 'resting', jockey: null, img: '/images/hero-spectator.jpg' },
  { id: 5, name: 'Silver Arrow', breed: 'Appaloosa', age: 3, color: 'Trắng đốm', weight: 450, health: 96, perf: 87, status: 'registered', jockey: 'Ngô Minh Khoa', img: '/images/hero-admin.jpg' },
];

const STATUS_CONFIG = {
  racing:     { label: 'Đang đua',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  registered: { label: 'Đã đăng ký',  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  resting:    { label: 'Đang nghỉ',   color: 'text-muted bg-white/5 border-glass-border' },
};

export function OwnerHorsesPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const filtered = HORSES.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Quản lý ngựa"
            subtitle="Danh sách ngựa trong chuồng của bạn"
            imageUrl="/images/hero-owner.jpg"
            imagePosition="center 58%"
            actions={
              <button onClick={() => setShowModal(true)} className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-bold">
                <Plus size={16} /> Thêm ngựa
              </button>
            }
          />

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 w-72">
            <Search size={15} className="text-muted shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên ngựa..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
          </div>

          {/* Horse Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((h, i) => {
              const cfg = STATUS_CONFIG[h.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div key={h.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-panel rounded-2xl overflow-hidden border border-glass-border hover:border-gold/25 transition-all group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={h.img} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                    <span className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-serif text-white group-hover:text-champagne transition-colors">{h.name}</h3>
                        <p className="text-xs text-muted">{h.breed} • {h.age} tuổi • {h.color}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Eye size={13} /></button>
                        <button className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"><Edit2 size={13} /></button>
                        <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[{ l: 'Cân nặng', v: `${h.weight}kg` }, { l: 'Hiệu suất', v: `${h.perf}/100` }, { l: 'Sức khỏe', v: `${h.health}%` }].map(s => (
                        <div key={s.l} className="bg-navy/60 rounded-lg p-2 text-center border border-glass-border">
                          <div className="text-sm font-bold text-white">{s.v}</div>
                          <div className="text-[9px] uppercase tracking-wider text-muted mt-0.5">{s.l}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] text-muted mb-1 font-medium">
                        <span className="flex items-center gap-1"><ShieldCheck size={10} /> Sức khỏe</span>
                        <span className={h.health >= 95 ? 'text-emerald-400' : h.health >= 85 ? 'text-yellow-400' : 'text-orange-400'}>{h.health}%</span>
                      </div>
                      <div className="h-1.5 bg-navy rounded-full overflow-hidden border border-glass-border">
                        <div className={`h-full rounded-full transition-all ${h.health >= 95 ? 'bg-emerald-400' : h.health >= 85 ? 'bg-yellow-400' : 'bg-orange-400'}`} style={{ width: `${h.health}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Jockey: <span className="text-white font-medium">{h.jockey ?? 'Chưa có'}</span></span>
                      <button className="text-gold hover:text-champagne flex items-center gap-1 transition-colors font-medium">
                        Chi tiết <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-8 w-full max-w-lg border border-gold/20">
            <h2 className="text-xl font-serif text-white mb-6">Thêm ngựa mới</h2>
            <div className="space-y-4">
              {[{ label: 'Tên ngựa', placeholder: 'VD: Thunder King' }, { label: 'Giống ngựa', placeholder: 'VD: Thoroughbred' }, { label: 'Màu sắc', placeholder: 'VD: Nâu đỏ' }].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[{ l: 'Tuổi', p: 'VD: 3' }, { l: 'Cân nặng (kg)', p: 'VD: 480' }].map(f => (
                  <div key={f.l}>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{f.l}</label>
                    <input type="number" placeholder={f.p} className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-glass-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Hủy</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold">Lưu</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
