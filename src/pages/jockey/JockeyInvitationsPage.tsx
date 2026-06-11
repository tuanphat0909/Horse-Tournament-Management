import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar, Trophy, User } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

type Tab = 'pending' | 'accepted' | 'rejected';

const INVITATIONS = [
  { id: 1, owner: 'Lê Thị Hoa', horse: 'Storm Rider', breed: 'Warmblood', race: 'Chung Kết - Giải Xuân 2026', date: '28/06/2026', time: '10:00', prize: '₫300.000.000', status: 'pending', receivedAt: '09/06/2026 08:00' },
  { id: 2, owner: 'Vũ Minh Tuấn', horse: 'Dark Knight', breed: 'Quarter Horse', race: 'Vòng Loại 1 - Cúp QG', date: '15/07/2026', time: '08:00', prize: '₫120.000.000', status: 'pending', receivedAt: '08/06/2026 15:30' },
  { id: 3, owner: 'Phạm Đức Mạnh', horse: 'Golden Flash', breed: 'Arabian', race: 'Vòng 1 - Giải Hè', date: '10/07/2026', time: '07:30', prize: '₫80.000.000', status: 'pending', receivedAt: '07/06/2026 11:00' },
  { id: 4, owner: 'Nguyễn Văn An', horse: 'Thunderstrike', breed: 'Thoroughbred', race: 'Vòng 4 - Giải Xuân', date: '20/06/2026', time: '09:00', prize: '₫150.000.000', status: 'accepted', receivedAt: '05/06/2026 09:00' },
  { id: 5, owner: 'Nguyễn Văn An', horse: 'Desert Wind', breed: 'Arabian', race: 'Vòng 4 - Giải Xuân', date: '20/06/2026', time: '09:00', prize: '₫150.000.000', status: 'accepted', receivedAt: '05/06/2026 09:05' },
  { id: 6, owner: 'Bùi Thị Mai', horse: 'Night Runner', breed: 'Unknown', race: 'Vòng 1 - Giải Xuân', date: '10/06/2026', time: '08:00', prize: '₫50.000.000', status: 'rejected', receivedAt: '01/06/2026 10:00' },
];

export function JockeyInvitationsPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const filtered = INVITATIONS.filter(i => i.status === tab);

  const TAB_COUNTS = { pending: INVITATIONS.filter(i => i.status === 'pending').length, accepted: INVITATIONS.filter(i => i.status === 'accepted').length, rejected: INVITATIONS.filter(i => i.status === 'rejected').length };

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Lời mời thi đấu"
            subtitle="Quản lý lời mời từ các chủ ngựa"
            imageUrl="/images/hero-jockey.jpg"
            imagePosition="center 25%"
          />

          <div className="flex items-center gap-1 border-b border-glass-border pb-0">
            {([['pending', 'Chờ phản hồi', 'text-yellow-400 border-yellow-400'], ['accepted', 'Đã nhận', 'text-emerald-400 border-emerald-400'], ['rejected', 'Đã từ chối', 'text-red-400 border-red-400']] as [Tab, string, string][]).map(([t, label, activeClass]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? activeClass : 'text-muted border-transparent hover:text-white'}`}>
                {label} <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${tab === t ? 'bg-current/10 text-current' : 'bg-white/5 text-muted'}`}>{TAB_COUNTS[t]}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((inv, i) => (
              <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-panel rounded-2xl p-6 border border-glass-border hover:border-gold/20 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-3xl shrink-0">🐴</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-lg font-serif text-white">{inv.horse}</h3>
                      <span className="text-xs text-muted">{inv.breed}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                      <User size={11} className="text-gold/60" /> Chủ ngựa: <span className="text-white font-medium">{inv.owner}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted mb-4">
                      <span className="flex items-center gap-1.5"><Trophy size={11} className="text-gold/60" /> {inv.race}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={11} className="text-gold/60" /> {inv.date} • {inv.time}</span>
                      <span className="text-gold font-bold">{inv.prize}</span>
                    </div>
                    {inv.status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <button className="px-5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-sm font-bold transition-colors flex items-center gap-2">
                          <CheckCircle size={15} /> Nhận lời mời
                        </button>
                        <button className="px-5 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-bold transition-colors flex items-center gap-2">
                          <XCircle size={15} /> Từ chối
                        </button>
                      </div>
                    )}
                    {inv.status === 'accepted' && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400 font-medium"><CheckCircle size={15} /> Đã nhận lời mời</span>
                    )}
                    {inv.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-red-400 font-medium"><XCircle size={15} /> Đã từ chối</span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted"><Clock size={10} /> {inv.receivedAt}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Không có lời mời nào</div>}
          </div>

        </main>
      </div>
    </div>
  );
}
