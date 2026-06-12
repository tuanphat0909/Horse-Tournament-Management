import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Search, Clock } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type TabType = 'pending' | 'approved' | 'rejected';

const REGISTRATIONS = [
  { id: 1, horse: 'Silver Arrow', breed: 'Thoroughbred', age: 4, owner: 'Trần Thị Bình', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '09/06/2026 14:20', status: 'pending', note: '' },
  { id: 2, horse: 'Golden Flash', breed: 'Arabian', age: 5, owner: 'Phạm Đức Mạnh', tournament: 'Cúp Quốc Gia', round: 'Vòng Loại', submitted: '08/06/2026 10:05', status: 'pending', note: '' },
  { id: 3, horse: 'Dark Knight', breed: 'Quarter Horse', age: 3, owner: 'Vũ Minh Tuấn', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '08/06/2026 09:45', status: 'pending', note: '' },
  { id: 4, horse: 'Storm Rider', breed: 'Warmblood', age: 6, owner: 'Lê Thị Hoa', tournament: 'Cúp Quốc Gia', round: 'Vòng Loại', submitted: '07/06/2026 16:30', status: 'pending', note: '' },
  { id: 5, horse: 'Thunderstrike', breed: 'Thoroughbred', age: 4, owner: 'Nguyễn Văn An', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '05/06/2026 08:00', status: 'approved', note: 'Đủ điều kiện' },
  { id: 6, horse: 'Desert Wind', breed: 'Arabian', age: 5, owner: 'Nguyễn Văn An', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '05/06/2026 08:10', status: 'approved', note: 'Đủ điều kiện' },
  { id: 7, horse: 'Young Star', breed: 'Pony', age: 2, owner: 'Bùi Thị Mai', tournament: 'Giải Xuân 2026', round: 'Vòng 1', submitted: '06/06/2026 11:00', status: 'rejected', note: 'Ngựa chưa đủ 3 tuổi theo quy định' },
  { id: 8, horse: 'Night Runner', breed: 'Unknown', age: 4, owner: 'Đỗ Quang Huy', tournament: 'Giải Xuân 2026', round: 'Vòng 2', submitted: '06/06/2026 14:00', status: 'rejected', note: 'Giấy tờ nguồn gốc không hợp lệ' },
];

const TAB_CONFIG = {
  pending: { label: 'Chờ duyệt', color: 'text-yellow-400', bg: 'border-yellow-400/40 bg-yellow-400/5' },
  approved: { label: 'Đã duyệt', color: 'text-emerald-400', bg: 'border-emerald-400/40 bg-emerald-400/5' },
  rejected: { label: 'Từ chối', color: 'text-red-400', bg: 'border-red-400/40 bg-red-400/5' },
};

export function AdminRegistrationsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = REGISTRATIONS.filter(r =>
    r.status === tab &&
    (r.horse.toLowerCase().includes(search.toLowerCase()) || r.owner.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedReg = REGISTRATIONS.find(r => r.id === selected);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Duyệt đăng ký"
            subtitle="Xét duyệt đăng ký tham gia thi đấu"
            imageUrl="/images/hero-admin.jpg"
            imagePosition="center center"
          />

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-glass-border pb-0">
            {(['pending', 'approved', 'rejected'] as TabType[]).map(t => {
              const cfg = TAB_CONFIG[t];
              const count = REGISTRATIONS.filter(r => r.status === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${
                    tab === t ? `${cfg.color} border-current` : 'text-muted border-transparent hover:text-white'
                  }`}
                >
                  {cfg.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold ${tab === t ? cfg.bg + ' ' + cfg.color : 'bg-white/5 text-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <div className="ml-auto mb-1 flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-1.5 w-56">
              <Search size={13} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm ngựa, chủ ngựa..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
          </div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border bg-navy-light/30">
                  {['Ngựa đăng ký', 'Chủ ngựa', 'Giải đấu / Vòng', 'Ngày nộp', tab === 'rejected' ? 'Lý do' : 'Thao tác'].map(h => (
                    <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted font-bold px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-muted text-sm">Không có đăng ký nào</td>
                  </tr>
                ) : filtered.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-glass-border/50 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-lg shrink-0">🐴</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{r.horse}</div>
                          <div className="text-xs text-muted">{r.breed} • {r.age} tuổi</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white">{r.owner}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-white">{r.tournament}</div>
                      <div className="text-xs text-muted">{r.round}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={11} /> {r.submitted}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {tab === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(r.id)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Xem chi tiết"><Eye size={14} /></button>
                          <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold border border-emerald-500/20 transition-colors flex items-center gap-1">
                            <CheckCircle size={12} /> Duyệt
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold border border-red-500/20 transition-colors flex items-center gap-1">
                            <XCircle size={12} /> Từ chối
                          </button>
                        </div>
                      )}
                      {tab === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <CheckCircle size={13} /> {r.note}
                        </span>
                      )}
                      {tab === 'rejected' && (
                        <span className="text-xs text-red-400/80">{r.note}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

        </main>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-8 w-full max-w-md border border-gold/20">
            <h2 className="text-xl font-serif text-white mb-6">Chi tiết đăng ký</h2>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Tên ngựa', value: selectedReg.horse },
                { label: 'Giống', value: selectedReg.breed },
                { label: 'Tuổi', value: `${selectedReg.age} tuổi` },
                { label: 'Chủ ngựa', value: selectedReg.owner },
                { label: 'Giải đấu', value: selectedReg.tournament },
                { label: 'Vòng đua', value: selectedReg.round },
                { label: 'Ngày nộp', value: selectedReg.submitted },
              ].map(f => (
                <div key={f.label} className="flex justify-between text-sm border-b border-glass-border/50 pb-2">
                  <span className="text-muted">{f.label}</span>
                  <span className="text-white font-medium">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-lg border border-glass-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Đóng</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium transition-colors">Từ chối</button>
              <button onClick={() => setSelected(null)} className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold">Duyệt</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
