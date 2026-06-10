import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, Search, ChevronDown } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type Status = 'pending' | 'approved' | 'rejected';

const HORSES = [
  { id: 1, horse: 'Thunderstrike', breed: 'Thoroughbred', owner: 'Nguyễn Văn An', jockey: 'Trần Đức Minh', tournament: 'Giải Xuân 2026', race: 'Vòng 4 - Bán Kết', weight: '512 kg', age: 5, health: 'Tốt', status: 'pending' as Status, note: '' },
  { id: 2, horse: 'Desert Wind', breed: 'Arabian', owner: 'Nguyễn Văn An', jockey: 'Trần Đức Minh', tournament: 'Giải Xuân 2026', race: 'Vòng 4 - Bán Kết', weight: '490 kg', age: 4, health: 'Tốt', status: 'pending' as Status, note: '' },
  { id: 3, horse: 'Storm Rider', breed: 'Warmblood', owner: 'Lê Thị Hoa', jockey: 'Trần Đức Minh', tournament: 'Giải Xuân 2026', race: 'Chung Kết', weight: '525 kg', age: 6, health: 'Tốt', status: 'pending' as Status, note: '' },
  { id: 4, horse: 'Dark Knight', breed: 'Quarter Horse', owner: 'Vũ Minh Tuấn', jockey: 'Phạm Quang Hùng', tournament: 'Cúp QG 2026', race: 'Vòng Loại 1', weight: '498 kg', age: 5, health: 'Tốt', status: 'pending' as Status, note: '' },
  { id: 5, horse: 'Golden Flash', breed: 'Arabian', owner: 'Phạm Đức Mạnh', jockey: 'Lý Minh Khôi', tournament: 'Giải Hè 2026', race: 'Vòng 1', weight: '485 kg', age: 3, health: 'Đủ điều kiện', status: 'approved' as Status, note: '' },
  { id: 6, horse: 'Shadow Dancer', breed: 'Unknown', owner: 'Trần Thị Lan', jockey: 'Đỗ Văn Long', tournament: 'Giải Hè 2026', race: 'Vòng 1', weight: '460 kg', age: 2, health: 'Cần theo dõi', status: 'rejected' as Status, note: 'Chấn thương nhẹ ở chân trái — cần nghỉ dưỡng thêm 2 tuần' },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  pending:  { label: 'Chờ kiểm tra', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved: { label: 'Đạt yêu cầu', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  rejected: { label: 'Không đạt', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

type Tab = Status | 'all';

export function RefereeHorseCheckPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = HORSES.filter(h => {
    const matchTab = tab === 'all' || h.status === tab;
    const matchSearch = h.horse.toLowerCase().includes(search.toLowerCase()) || h.owner.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = { all: HORSES.length, pending: HORSES.filter(h => h.status === 'pending').length, approved: HORSES.filter(h => h.status === 'approved').length, rejected: HORSES.filter(h => h.status === 'rejected').length };

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Kiểm tra sức khỏe ngựa</h1>
              <p className="text-sm text-muted mt-1">{counts.pending} ngựa đang chờ kiểm tra</p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 w-64">
              <Search size={14} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm ngựa / chủ ngựa..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-glass-border">
            {([['all', 'Tất cả'], ['pending', 'Chờ kiểm tra'], ['approved', 'Đạt yêu cầu'], ['rejected', 'Không đạt']] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-white'}`}>
                {label} <span className="ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-muted">{counts[t]}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((h, i) => {
              const cfg = STATUS_CONFIG[h.status];
              const isOpen = expanded === h.id;
              return (
                <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl border border-glass-border overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <div className="text-2xl shrink-0">🐴</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-base font-serif font-bold text-white">{h.horse}</span>
                        <span className="text-xs text-muted">{h.breed}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-muted">
                        <span>Chủ: <span className="text-white">{h.owner}</span></span>
                        <span>Nài: <span className="text-white">{h.jockey}</span></span>
                        <span>{h.tournament} — {h.race}</span>
                        <span>Trọng lượng: <span className="text-champagne">{h.weight}</span></span>
                        <span>Tuổi: <span className="text-champagne">{h.age}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {h.status === 'pending' && (
                        <>
                          <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1.5">
                            <ShieldCheck size={13} /> Phê duyệt
                          </button>
                          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-colors flex items-center gap-1.5">
                            <XCircle size={13} /> Từ chối
                          </button>
                        </>
                      )}
                      <button onClick={() => setExpanded(isOpen ? null : h.id)} className="w-8 h-8 rounded-lg bg-white/5 text-muted hover:text-white flex items-center justify-center transition-colors">
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="border-t border-glass-border pt-4">
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                            <div className="text-[10px] text-muted mb-1">Tình trạng sức khỏe</div>
                            <div className="text-sm font-bold text-white">{h.health}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                            <div className="text-[10px] text-muted mb-1">Giải đấu</div>
                            <div className="text-sm font-bold text-white">{h.tournament}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                            <div className="text-[10px] text-muted mb-1">Cuộc đua</div>
                            <div className="text-sm font-bold text-white">{h.race}</div>
                          </div>
                        </div>
                        {h.note && (
                          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-red-300">
                            <span className="font-bold">Ghi chú:</span> {h.note}
                          </div>
                        )}
                        {h.status === 'pending' && (
                          <div className="mt-3">
                            <textarea rows={2} placeholder="Ghi chú kiểm tra (tùy chọn)..."
                              className="w-full bg-white/[0.03] border border-glass-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted/60 outline-none resize-none focus:border-gold/30 transition-colors" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
