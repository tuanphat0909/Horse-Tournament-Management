import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, Eye } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';
import { PageAmbience } from '../../components/layout/PageAmbience';
import { getRegistrations, approveRegistration, rejectRegistration } from '../../api/adminService';
import { parseApiError } from '../../api/authService';
import { Pager, paginate } from '../../components/ui/Pager';
import { toast } from '../../components/ui/Toast';

type TabType = 'pending' | 'approved' | 'rejected';

const TAB_CONFIG = {
  pending: { label: 'Chờ duyệt', color: 'text-yellow-400', bg: 'border-yellow-400/40 bg-yellow-400/5', match: 'pending' },
  approved: { label: 'Đã duyệt', color: 'text-emerald-400', bg: 'border-emerald-400/40 bg-emerald-400/5', match: 'approved' },
  rejected: { label: 'Từ chối', color: 'text-red-400', bg: 'border-red-400/40 bg-red-400/5', match: 'rejected' },
};

export function AdminRegistrationsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trạng thái thao tác duyệt/từ chối
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewError, setReviewError] = useState('');
  // Modal "Xem & Duyệt": nút Duyệt bị ẨN cho tới khi admin tick xác nhận đã
  // kiểm tra jockey (BE chưa có API cho admin xem hợp đồng để tự kiểm tra).
  const [reviewTarget, setReviewTarget] = useState<any | null>(null);
  const [jockeyChecked, setJockeyChecked] = useState(false);

  function loadRegistrations() {
    setLoading(true);
    setError('');
    getRegistrations()
      .then((data: any) => {
        const list = data?.result ?? (Array.isArray(data) ? data : []);
        setRegistrations(list);
      })
      .catch((err: unknown) => setError(parseApiError(err as Error)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadRegistrations(); }, []);

  async function handleReview(id: number, status: 'Approved' | 'Rejected', horseName?: string) {
    setReviewError('');
    setReviewingId(id);
    try {
      if (status === 'Approved') await approveRegistration(id);
      else await rejectRegistration(id);
      setRegistrations(prev => prev.map(r => ((r.registrationId ?? r.id) === id ? { ...r, status } : r)));
      toast.success(status === 'Approved'
        ? `Đã duyệt đơn đăng ký của ngựa "${horseName ?? '#' + id}"!`
        : `Đã từ chối đơn đăng ký của ngựa "${horseName ?? '#' + id}".`);
      setReviewTarget(null); setJockeyChecked(false);
      loadRegistrations();
    } catch (err: unknown) {
      setReviewError(parseApiError(err as Error));
    } finally {
      setReviewingId(null);
    }
  }

  const counts: Record<TabType, number> = {
    pending: registrations.filter(r => (r.status ?? '').toLowerCase() === 'pending').length,
    approved: registrations.filter(r => (r.status ?? '').toLowerCase() === 'approved').length,
    rejected: registrations.filter(r => (r.status ?? '').toLowerCase() === 'rejected').length,
  };

  const filtered = registrations.filter(r => {
    const matchesTab = (r.status ?? '').toLowerCase() === TAB_CONFIG[tab].match;
    const q = search.toLowerCase();
    const matchesSearch =
      (r.horseName ?? '').toLowerCase().includes(q) ||
      (r.tournamentName ?? '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const { paged, totalPages, total, page: safePage } = paginate(filtered, page, 10);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: 'var(--page-bg)'}}>
      <Sidebar />
      <div className="flex-1 relative min-w-0 overflow-y-auto">
        <PageAmbience accent="gold" />
        <Topbar />
        <main className="relative z-10 max-w-400 mx-auto px-8 py-6 space-y-6">

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
              return (
                <button
                  key={t}
                  onClick={() => { setTab(t); setPage(1); }}
                  className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${
                    tab === t ? `${cfg.color} border-current` : 'text-muted border-transparent hover:text-white'
                  }`}
                >
                  {cfg.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold ${tab === t ? cfg.bg + ' ' + cfg.color : 'bg-white/5 text-muted'}`}>
                    {counts[t]}
                  </span>
                </button>
              );
            })}
            <div className="ml-auto mb-1 flex items-center gap-2 bg-white/4 border border-glass-border rounded-lg px-3 py-1.5 w-56">
              <Search size={13} className="text-muted shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm ngựa, giải đấu..." className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-full" />
            </div>
          </div>

          {reviewError && (
            <div className="text-sm px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{reviewError}</div>
          )}

          {/* Table */}
          {error ? (
            <div className="text-sm px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
          ) : loading ? (
            <div className="text-center py-12 text-muted text-sm">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
              <div className="text-4xl opacity-40 mb-3">📝</div>
              <div className="text-muted text-sm">Chưa có dữ liệu</div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl overflow-hidden relative">
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-glass-border">
                    <th className="px-5 py-3 font-bold">Ngựa</th>
                    <th className="px-5 py-3 font-bold">Chủ ngựa</th>
                    <th className="px-5 py-3 font-bold">Jockey</th>
                    <th className="px-5 py-3 font-bold">Giải đấu</th>
                    <th className="px-5 py-3 font-bold">Trạng thái</th>
                    <th className="px-5 py-3 font-bold">Ngày đăng ký</th>
                    <th className="px-5 py-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r, i) => {
                    const id = r.registrationId ?? r.id;
                    const isPending = (r.status ?? '').toLowerCase() === 'pending';
                    const busy = reviewingId === id;
                    return (
                    <tr key={id ?? i} className="border-b border-glass-border/40 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 text-white font-medium">{r.horseName ?? '—'}</td>
                      <td className="px-5 py-3 text-body">{r.ownerName ?? '—'}</td>
                      <td className="px-5 py-3">
                        {/* BE chưa trả thông tin hợp đồng jockey cho admin — form sẵn chờ API */}
                        {r.jockeyName
                          ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">🏇 {r.jockeyName}</span>
                          : <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/4 border border-glass-border text-muted/60" title="Backend chưa cung cấp dữ liệu hợp đồng jockey cho admin — cần API GET /admin/jockey-contracts">Chưa có dữ liệu</span>}
                      </td>
                      <td className="px-5 py-3 text-body">{r.tournamentName ?? '—'}</td>
                      <td className="px-5 py-3 text-body">{r.status ?? '—'}</td>
                      <td className="px-5 py-3 text-muted">{r.registeredAt ? new Date(r.registeredAt).toLocaleString() : '—'}</td>
                      <td className="px-5 py-3">
                        {isPending ? (
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => { setReviewTarget(r); setJockeyChecked(false); }}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-champagne text-xs font-bold border border-gold/25 hover:bg-gold/20 transition-colors disabled:opacity-50"
                            >
                              <Eye size={13} /> Xem & Duyệt
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-muted/50 text-xs">—</div>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pager page={safePage} totalPages={totalPages} total={total} onChange={setPage} />
            </motion.div>
          )}

        </main>
      </div>

      {/* ── Modal Xem & Duyệt: nút Duyệt chỉ hiện sau khi xác nhận jockey ── */}
      {reviewTarget && (() => {
        const id = reviewTarget.registrationId ?? reviewTarget.id;
        const busy = reviewingId === id;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-panel rounded-2xl p-7 w-full max-w-md border border-gold/20 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0"><Eye size={15} className="text-gold" /></div>
                <h3 className="text-lg font-serif text-white">Xét duyệt đơn đăng ký</h3>
                <div className="flex-1" />
                <button onClick={() => setReviewTarget(null)} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors"><X size={15} /></button>
              </div>

              <div className="space-y-2 mb-4">
                {[
                  ['Ngựa', reviewTarget.horseName ?? '—'],
                  ['Chủ ngựa', reviewTarget.ownerName ?? '—'],
                  ['Giải đấu', reviewTarget.tournamentName ?? '—'],
                  ['Ngày đăng ký', reviewTarget.registeredAt ? new Date(reviewTarget.registeredAt).toLocaleString('vi-VN') : '—'],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted">{l}</span>
                    <span className="text-white font-medium text-right">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted">Jockey</span>
                  <span className="text-yellow-400 text-right text-xs leading-snug max-w-55">
                    Chưa có dữ liệu — backend chưa cung cấp API hợp đồng cho admin.
                    Owner chỉ nộp được đơn khi jockey đã ký (chặn ở hệ thống), nhưng hãy kiểm tra chéo nếu cần.
                  </span>
                </div>
              </div>

              {/* Tick xác nhận → nút Duyệt mới xuất hiện */}
              <label className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-gold/5 border border-gold/15 cursor-pointer mb-4">
                <input type="checkbox" checked={jockeyChecked} onChange={e => setJockeyChecked(e.target.checked)} className="mt-0.5 accent-[#C9A84C]" />
                <span className="text-xs text-champagne/90 leading-relaxed">
                  Tôi xác nhận ngựa này <b>đã có jockey chấp nhận hợp đồng</b> cho giải đấu — đủ điều kiện thi đấu.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReview(id, 'Rejected', reviewTarget.horseName)}
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 text-sm font-bold transition-colors disabled:opacity-50">
                  <X size={13} className="inline mr-1" /> Từ chối
                </button>
                {jockeyChecked && (
                  <button
                    onClick={() => handleReview(id, 'Approved', reviewTarget.horseName)}
                    disabled={busy}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-sm font-bold transition-colors disabled:opacity-50">
                    <Check size={13} className="inline mr-1" /> {busy ? 'Đang duyệt…' : 'Duyệt'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
