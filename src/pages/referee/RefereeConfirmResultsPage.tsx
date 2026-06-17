import { useState, useEffect } from 'react';
import { ChevronDown, Trophy } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';
import { PageAmbience } from '../../components/layout/PageAmbience';
import { getRaceResults } from '../../api/refereeService';
import { getRaceSchedule } from '../../api/publicService';

export function RefereeConfirmResultsPage() {
  const [races, setRaces] = useState<any[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [racesLoading, setRacesLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    getRaceSchedule()
      .then((d: any) => setRaces(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setRaces([]))
      .finally(() => setRacesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRaceId) { setResults([]); return; }
    setResultsLoading(true);
    getRaceResults(selectedRaceId)
      .then((d: any) => setResults(d?.result ?? (Array.isArray(d) ? d : [])))
      .catch(() => setResults([]))
      .finally(() => setResultsLoading(false));
  }, [selectedRaceId]);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <PageAmbience accent="red" />
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Xác nhận kết quả"
            subtitle="Xác nhận và công bố kết quả chính thức"
            imageUrl="/images/hero-referee.jpg"
            imagePosition="right 52%"
          />

          {/* Race selector */}
          <div className="relative w-72">
            <select
              value={selectedRaceId}
              onChange={e => setSelectedRaceId(e.target.value)}
              className="w-full bg-white/[0.04] border border-glass-border rounded-lg px-3 py-2 pr-8 text-sm text-white focus:border-gold/40 outline-none appearance-none cursor-pointer"
            >
              <option value="">{racesLoading ? 'Đang tải...' : races.length === 0 ? 'Không có cuộc đua' : '— Chọn cuộc đua —'}</option>
              {races.map((r, i) => (
                <option key={r.id ?? r.raceId ?? i} value={String(r.id ?? r.raceId ?? i)}>
                  {r.name ?? r.raceName ?? `Cuộc đua #${r.id ?? r.raceId ?? i}`}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <div className="glass-panel rounded-xl overflow-hidden relative">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
            {!selectedRaceId ? (
              <div className="p-12 text-center">
                <div className="text-4xl opacity-40 mb-3">🏁</div>
                <div className="text-muted text-sm">Chọn cuộc đua để xem kết quả</div>
              </div>
            ) : resultsLoading ? (
              <div className="p-12 text-center text-muted text-sm">Đang tải...</div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl opacity-40 mb-3">🏁</div>
                <div className="text-muted text-sm">Chưa có kết quả nào cho cuộc đua này</div>
              </div>
            ) : (
              <div className="divide-y divide-glass-border relative z-10">
                {results.map((r, i) => {
                  const isWinner = r.winner === true || r.winner === r.horseName;
                  const posCls = i === 0 ? 'bg-gold/20 text-gold border-gold/30'
                    : i === 1 ? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                    : i === 2 ? 'bg-amber-700/20 text-amber-400 border-amber-700/30'
                    : 'bg-white/[0.04] text-muted border-glass-border';
                  return (
                    <div key={r.id ?? i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-serif font-bold shrink-0 ${posCls}`}>{i + 1}</div>
                      {isWinner && <Trophy size={14} className="text-gold shrink-0 -ml-1" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-champagne transition-colors truncate">
                          {r.horseName ?? `Ngựa #${r.horseId ?? '—'}`}
                        </div>
                        <div className="text-xs text-muted truncate">
                          Nài: {r.jockeyName ?? `#${r.jockeyId ?? '—'}`}
                          {r.raceName ? ` • ${r.raceName}` : ''}
                        </div>
                      </div>
                      {r.status != null && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/[0.04] text-champagne border-glass-border shrink-0">
                          {r.status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
