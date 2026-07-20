import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flag, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { getHorseRankings, getJockeyRankings } from '../api/publicService';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

type Tab = 'horses' | 'jockeys';

// Huy chương cho 3 hạng đầu, các hạng sau dùng số thứ tự
const RANK_STYLE = [
  'bg-gradient-to-br from-[#FFE07A] to-[#F5A623] text-[#2A1D00] border-gold/40',
  'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 border-slate-300/40',
  'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 border-amber-600/40',
];

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('horses');
  const [horses, setHorses] = useState<any[]>([]);
  const [jockeys, setJockeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getHorseRankings(), getJockeyRankings()])
      .then(([h, j]) => {
        const pick = (r: PromiseSettledResult<any>) =>
          r.status === 'fulfilled' ? ((r.value as any)?.result ?? (Array.isArray(r.value) ? r.value : [])) : [];
        setHorses(pick(h));
        setJockeys(pick(j));
      })
      .finally(() => setLoading(false));
  }, []);

  const rows = tab === 'horses' ? horses : jockeys;

  return (
    <div className="min-h-screen bg-navy text-body font-sans selection:bg-gold/30">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">Season 2026</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Championship <span className="text-champagne italic">Leaderboard</span>
          </h1>
          <p className="text-sm text-muted max-w-xl mx-auto">
            Live standings from every official race in the Equestria system — updated as soon as
            referees confirm the results.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {([['horses', 'Horses', Flag], ['jockeys', 'Jockeys', Users]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${
                tab === key
                  ? 'bg-gold/15 border-gold/40 text-champagne'
                  : 'border-glass-border text-muted hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSkeleton rows={6} h="h-16" />
        ) : rows.length === 0 ? (
          <div className="glass-panel rounded-2xl py-20 text-center">
            <Trophy size={36} className="mx-auto mb-4 text-gold opacity-40" />
            <p className="text-sm text-muted">No ranking data available yet.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl overflow-hidden border border-glass-border"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-glass-border bg-white/[0.02] text-[11px] font-bold text-muted uppercase tracking-wider">
                    <th className="px-6 py-4 w-20">Rank</th>
                    <th className="px-6 py-4">{tab === 'horses' ? 'Horse' : 'Jockey'}</th>
                    <th className="px-6 py-4 text-center">Races</th>
                    <th className="px-6 py-4 text-center">Wins</th>
                    <th className="px-6 py-4 text-right">Win rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/40 text-sm">
                  {rows.map((r, i) => {
                    const total = r.totalRaces ?? r.raceCount ?? 0;
                    const wins = r.winsCount ?? r.totalWins ?? r.wins ?? 0;
                    const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
                    const name = r.horseName ?? r.jockeyName ?? r.name ?? r.fullName ?? `#${r.horseId ?? r.jockeyId ?? i + 1}`;
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span
                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                              i < 3 ? RANK_STYLE[i] : 'bg-white/[0.03] border-glass-border text-muted'
                            }`}
                          >
                            {i < 3 ? <Medal size={14} /> : i + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-serif font-bold text-white">{name}</td>
                        <td className="px-6 py-4 text-center text-muted font-mono">{total}</td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-gold">{wins}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-mono font-bold ${rate >= 50 ? 'text-emerald-400' : 'text-muted'}`}>
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted mb-4">Want to follow races live and place your predictions?</p>
          <button
            onClick={() => navigate('/register')}
            className="btn-gold px-7 py-3 rounded-lg text-xs font-bold inline-flex items-center gap-2"
          >
            Create your account <ArrowRight size={14} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
