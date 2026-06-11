import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, XCircle, Calendar, Trophy } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type Tab = 'pending' | 'approved' | 'rejected';

const REGISTRATIONS = [
  { id: 1, horse: 'Silver Arrow', tournament: 'Giải Xuân 2026', round: 'Chung Kết', submitted: '07/06/2026', status: 'pending', confirmed: false },
  { id: 2, horse: 'Midnight Run', tournament: 'Cúp Quốc Gia', round: 'Vòng Loại 1', submitted: '05/06/2026', status: 'pending', confirmed: false },
  { id: 3, horse: 'Thunderstrike', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '01/06/2026', status: 'approved', confirmed: true },
  { id: 4, horse: 'Desert Wind', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '01/06/2026', status: 'approved', confirmed: true },
  { id: 5, horse: 'Thunderstrike', tournament: 'Giải Xuân 2026', round: 'Vòng 2', submitted: '11/06/2026', status: 'approved', confirmed: false },
  { id: 6, horse: 'Golden Hoof', tournament: 'Giải Khai Mạc Hè', round: 'Vòng 1', submitted: '01/06/2026', status: 'rejected', confirmed: false },
];

const STATUS_CONFIG = {
  pending:  { label: 'Chờ Admin duyệt', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved: { label: 'Đã duyệt', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  rejected: { label: 'Bị từ chối', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export function OwnerRegistrationsPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [showModal, setShowModal] = useState(false);

  const filtered = REGISTRATIONS.filter(r => r.status === tab);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto relative">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6 relative z-10">

          <PageHero
            title="Đăng ký thi đấu"
            subtitle="Quản lý đăng ký tham gia giải đấu"
            imageUrl="/images/hero-owner.jpg"
            imagePosition="center 58%"
            actions={
              <button onClick={() => setShowModal(true)} className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-bold">
                <Plus size={16} /> Đăng ký ngựa
              </button>
            }
          />

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-glass-border pb-0">
            {([['pending', 'Chờ duyệt'], ['approved', 'Đã duyệt'], ['rejected', 'Bị từ chối']] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-white'}`}>
                {label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${tab === t ? 'bg-gold/10 text-gold' : 'bg-white/5 text-muted'}`}>
                  {REGISTRATIONS.filter(r => r.status === t).length}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map((r, i) => {
              const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="glass-panel rounded-xl p-5 flex items-center gap-5 border border-glass-border hover:border-gold/20 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-xl shrink-0">🐴</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-serif text-white">{r.horse}</div>
                    <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                      <span className="flex items-center gap-1"><Trophy size={10} className="text-gold/60" /> {r.tournament}</span>
                      <span>•</span>
                      <span>{r.round}</span>
                      <span className="flex items-center gap-1"><Calendar size={10} className="text-gold/60" /> Nộp: {r.submitted}</span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${cfg.color}`}>{cfg.label}</span>

                  {r.status === 'approved' && !r.confirmed && (
                    <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold border border-emerald-500/20 transition-colors flex items-center gap-1.5 shrink-0">
                      <CheckCircle size={13} /> Xác nhận tham gia
                    </button>
                  )}
                  {r.status === 'approved' && r.confirmed && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                      <CheckCircle size={13} /> Đã xác nhận
                    </span>
                  )}
                  {r.status === 'pending' && (
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0" title="Hủy đăng ký">
                      <XCircle size={15} />
                    </button>
                  )}
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Không có đăng ký nào</div>
            )}
          </div>

        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-8 w-full max-w-md border border-gold/20">
            <h2 className="text-xl font-serif text-white mb-6">Đăng ký ngựa thi đấu</h2>
            <div className="space-y-4">
              {[
                { label: 'Chọn ngựa', type: 'select', options: ['Thunderstrike', 'Desert Wind', 'Midnight Run', 'Silver Arrow'] },
                { label: 'Chọn giải đấu', type: 'select', options: ['Giải Xuân 2026', 'Cúp Quốc Gia 2026', 'Giải Khai Mạc Hè'] },
                { label: 'Chọn vòng đua', type: 'select', options: ['Vòng 1', 'Vòng 2', 'Vòng Loại', 'Chung Kết'] },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{f.label}</label>
                  <select className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-gold/40">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-glass-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Hủy</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold">Nộp đăng ký</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
