import { useEffect, useState } from 'react';
import { Search, Stethoscope, X, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';
import { PageAmbience } from '../../components/layout/PageAmbience';
import { getHorseChecks, submitReport } from '../../api/refereeService';
import { getCurrentUser } from '../../api/authService';
import { toast } from '../../components/ui/Toast';
import { getRaceSchedule } from '../../api/publicService';
import { parseApiError } from '../../api/authService';
import { Pager, paginate } from '../../components/ui/Pager';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

const raceLabel = (r: any) =>
  `${r.name ?? ('Cuộc đua #' + (r.id ?? r.raceId))}${r.raceDate ? ' — ' + r.raceDate : ''}${r.tournamentName ? ' (' + r.tournamentName + ')' : ''}`;

export function RefereeHorseCheckPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const [races, setRaces] = useState<any[]>([]);
  const [raceId, setRaceId] = useState<string>('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getRaceSchedule()
      .then((data: any) => {
        const arr = data?.result ?? (Array.isArray(data) ? data : []);
        setRaces(Array.isArray(arr) ? arr : []);
      })
      .catch(() => setRaces([]));
  }, []);

  const loadList = (id: string) => {
    if (!id) { setList([]); return; }
    setLoading(true);
    setError('');
    getHorseChecks(Number(id))
      .then((data: any) => {
        const arr = data?.result ?? (Array.isArray(data) ? data : []);
        setList(Array.isArray(arr) ? arr : []);
      })
      .catch((err: any) => { setError(parseApiError(err)); setList([]); })
      .finally(() => setLoading(false));
  };

  const onRaceIdChange = (v: string) => {
    setRaceId(v);
    loadList(v);
  };

  // fields verified: { raceEntryId, horseId, horseName, ownerName, jockeyName, laneNo, medicalStatus, status }
  const filtered = list.filter((item: any) => {
    if (tab !== 'all' && (item.status ?? '').toLowerCase() !== tab) return false;
    if (!search.trim()) return true;
    const title = String(item.horseName ?? item.ownerName ?? item.horseId ?? '');
    return title.toLowerCase().includes(search.trim().toLowerCase());
  });

  const [pageNo, setPageNo] = useState(1);
  const pgHC = paginate(filtered, pageNo, 10);

  // ── Modal cập nhật tình trạng sức khỏe ngựa ──
  // BE CHƯA có API cho trọng tài sửa trực tiếp HealthStatus của ngựa, nên kết quả
  // kiểm tra được gửi dưới dạng BÁO CÁO (POST /referee/reports, kèm reportedHorseId)
  // để Admin nhận và xử lý (đổi tình trạng / gỡ ngựa khỏi làn).
  const HEALTH_OPTIONS = [
    ['Healthy', '🟢 Khỏe mạnh — đủ điều kiện thi đấu'],
    ['Minor Issue', '🟡 Vấn đề nhẹ — cần theo dõi'],
    ['Injured', '🔴 Chấn thương — KHÔNG đủ điều kiện'],
    ['Sick', '🔴 Bệnh — KHÔNG đủ điều kiện'],
  ] as const;
  const [checkTarget, setCheckTarget] = useState<any | null>(null);
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [healthDesc, setHealthDesc] = useState('');
  const [checkError, setCheckError] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);

  const isUnfit = healthStatus === 'Injured' || healthStatus === 'Sick';

  function openCheck(item: any) {
    setCheckTarget(item);
    setHealthStatus(item.medicalStatus === 'Healthy' ? 'Healthy' : (item.medicalStatus ?? 'Healthy'));
    setHealthDesc('');
    setCheckError('');
  }

  async function handleSubmitCheck() {
    if (!checkTarget) return;
    // Mô tả BẮT BUỘC — mô tả này sẽ đến tay Admin (và Admin thông báo owner/jockey)
    if (!healthDesc.trim()) {
      setCheckError('Vui lòng ghi mô tả tình trạng — mô tả này sẽ được gửi cho Admin, chủ ngựa và jockey.');
      return;
    }
    setCheckLoading(true); setCheckError('');
    try {
      const user = getCurrentUser();
      const horseName = checkTarget.horseName ?? ('#' + checkTarget.horseId);
      await submitReport({
        raceId: Number(raceId),
        refereeId: user?.refereeId, // BE tự resolve theo token nếu thiếu
        reportedHorseId: Number(checkTarget.horseId),
        content: `[KIỂM TRA SỨC KHỎE] Ngựa "${horseName}" (làn ${checkTarget.laneNo ?? '?'}) — kết luận: ${healthStatus}. Mô tả: ${healthDesc.trim()}`,
        violationNote: isUnfit ? `Ngựa "${horseName}" KHÔNG đủ điều kiện thi đấu — đề nghị Admin gỡ khỏi làn ${checkTarget.laneNo ?? ''} và thông báo chủ ngựa/jockey.` : undefined,
      });
      toast.success(isUnfit
        ? `Đã gửi kết luận "${healthStatus}" cho ngựa "${horseName}" tới Admin — kèm đề nghị gỡ khỏi làn đua.`
        : `Đã gửi kết quả kiểm tra sức khỏe ngựa "${horseName}" tới Admin.`);
      setCheckTarget(null);
      loadList(raceId);
    } catch (err: any) {
      setCheckError(parseApiError(err));
    } finally {
      setCheckLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: 'var(--page-bg)'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <PageAmbience accent="red" />
        <Topbar />
        <main className="relative z-10 max-w-400 mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Kiểm tra ngựa"
            subtitle="Xem xét và phê duyệt hồ sơ ngựa"
            imageUrl="/images/hero-referee.jpg"
            imagePosition="right 52%"
          />

          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-muted font-medium mb-1.5">Cuộc đua</label>
              <select value={raceId} onChange={e => onRaceIdChange(e.target.value)}
                className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none focus:border-gold/40 transition-colors">
                <option value="">-- Chọn cuộc đua --</option>
                {races.map((r: any) => {
                  const id = r.id ?? r.raceId;
                  return <option key={String(id)} value={String(id)}>{raceLabel(r)}</option>;
                })}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/4 border border-glass-border rounded-lg px-3 py-2 w-64">
              <Search size={14} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm ngựa / chủ ngựa..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-glass-border">
            {([['all', 'Tất cả'], ['pending', 'Chờ kiểm tra'], ['approved', 'Đạt yêu cầu'], ['rejected', 'Không đạt']] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t ? 'text-gold border-gold' : 'text-muted border-transparent hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          {error && <div className="glass-panel rounded-xl p-4 text-sm text-red-400 border border-red-500/30">{error}</div>}

          {loading ? (
            <div className="glass-panel rounded-xl p-12 text-center text-muted text-sm">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
              <div className="text-4xl opacity-40 mb-3">🐴</div>
              <div className="text-muted text-sm">Chưa có dữ liệu</div>
            </div>
          ) : (
            <div className="space-y-3">
              {pgHC.paged.map((item: any, i: number) => {
                const title = item.horseName ?? ('#' + item.horseId);
                return (
                  <div key={item.raceEntryId ?? item.horseId ?? i} className="glass-panel rounded-xl p-5 border border-glass-border relative overflow-hidden">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="text-white font-serif text-base">{title}</div>
                      {item.status != null && (
                        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/25 text-gold text-xs font-bold">{String(item.status)}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
                      {item.laneNo != null && <span>Làn: <span className="text-white/80">{String(item.laneNo)}</span></span>}
                      {item.medicalStatus != null && (
                        <span>Y tế: <span className={`font-bold ${String(item.medicalStatus).toLowerCase() === 'healthy' ? 'text-emerald-400' : 'text-red-400'}`}>{String(item.medicalStatus)}</span></span>
                      )}
                      {item.status != null && <span>Trạng thái: <span className="text-white/80">{String(item.status)}</span></span>}
                      {item.jockeyName != null && <span>Nài: <span className="text-white/80">{String(item.jockeyName)}</span></span>}
                      {item.ownerName != null && <span>Chủ ngựa: <span className="text-white/80">{String(item.ownerName)}</span></span>}
                    </div>
                    <div className="mt-3 pt-3 border-t border-glass-border/40 flex justify-end">
                      <button onClick={() => openCheck(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-champagne text-xs font-bold border border-gold/25 hover:bg-gold/20 transition-colors">
                        <Stethoscope size={13} /> Cập nhật tình trạng
                      </button>
                    </div>
                  </div>
                );
              })}
                <Pager page={pgHC.page} totalPages={pgHC.totalPages} total={pgHC.total} onChange={setPageNo} />
            </div>
          )}

        </main>
      </div>

      {/* ── Modal: cập nhật tình trạng sức khỏe (mô tả bắt buộc → gửi Admin) ── */}
      {checkTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel rounded-2xl p-7 w-full max-w-md border border-gold/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0"><Stethoscope size={15} className="text-gold" /></div>
              <div className="min-w-0">
                <h3 className="text-lg font-serif text-white truncate">Kiểm tra: {checkTarget.horseName ?? '#' + checkTarget.horseId}</h3>
                <p className="text-[11px] text-muted">Làn {checkTarget.laneNo ?? '—'} • Chủ: {checkTarget.ownerName ?? '—'} • Nài: {checkTarget.jockeyName ?? '—'}</p>
              </div>
              <div className="flex-1" />
              <button onClick={() => setCheckTarget(null)} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors"><X size={15} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Tình trạng sức khỏe *</label>
                <select value={healthStatus} onChange={e => setHealthStatus(e.target.value)}
                  className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-gold/40" style={{ colorScheme: 'dark' }}>
                  {HEALTH_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>

              {isUnfit && (
                <div className="flex items-start gap-2 text-[11px] text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5 leading-relaxed">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>Ngựa KHÔNG đủ điều kiện → báo cáo sẽ kèm <b>đề nghị gỡ ngựa khỏi làn {checkTarget.laneNo ?? ''}</b>. (Backend chưa có API cho trọng tài tự gỡ entry / đổi HealthStatus — Admin sẽ xử lý dựa trên báo cáo này.)</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Mô tả tình trạng * <span className="normal-case font-normal text-muted/60">(gửi đến Admin, chủ ngựa & jockey)</span></label>
                <textarea value={healthDesc} onChange={e => setHealthDesc(e.target.value)} rows={4}
                  placeholder="VD: Ngựa có dấu hiệu viêm khớp chân trước bên phải, di chuyển khập khiễng khi khởi động..."
                  className="w-full bg-navy/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/50 outline-none focus:border-gold/40 resize-none" />
              </div>

              {checkError && <div className="text-xs text-red-400 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">{checkError}</div>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCheckTarget(null)} className="flex-1 py-2.5 rounded-lg border border-glass-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Hủy</button>
              <button onClick={handleSubmitCheck} disabled={checkLoading}
                className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold disabled:opacity-60">
                {checkLoading ? 'Đang gửi…' : 'Gửi kết quả kiểm tra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
