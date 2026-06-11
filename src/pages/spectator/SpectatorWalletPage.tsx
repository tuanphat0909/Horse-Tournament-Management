import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, ArrowDownLeft, TrendingUp, TrendingDown,
  Clock, CheckCircle, Plus, DollarSign, Coins,
} from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const COINS_PER_USD = 100;
const BALANCE = 3_500;

type TxType = 'deposit' | 'win' | 'loss' | 'bet';
interface Tx {
  id: number;
  type: TxType;
  desc: string;
  amount: number;
  usd?: number;
  date: string;
  status?: 'pending' | 'done';
}

const TRANSACTIONS: Tx[] = [
  { id: 1, type: 'win',     desc: 'Thắng cược — Thunderstrike (Vòng 3)',  amount: +1000, date: '14/06/2026', status: 'done' },
  { id: 2, type: 'bet',     desc: 'Đặt cược — Storm Rider (Vòng 4)',       amount: -500,  date: '18/06/2026', status: 'pending' },
  { id: 3, type: 'bet',     desc: 'Đặt cược — Silver Arrow (Vòng 4)',      amount: -300,  date: '18/06/2026', status: 'pending' },
  { id: 4, type: 'deposit', desc: 'Nạp tiền',                              amount: +2000, usd: 20, date: '10/06/2026', status: 'done' },
  { id: 5, type: 'win',     desc: 'Thắng cược — Desert Wind (Vòng 2)',     amount: +1200, date: '11/06/2026', status: 'done' },
  { id: 6, type: 'loss',    desc: 'Thua cược — Desert Wind (Vòng 3)',      amount: -100,  date: '14/06/2026', status: 'done' },
  { id: 7, type: 'deposit', desc: 'Nạp tiền',                              amount: +1000, usd: 10, date: '01/06/2026', status: 'done' },
  { id: 8, type: 'loss',    desc: 'Thua cược — Thunderstrike (Vòng 2)',    amount: -200,  date: '11/06/2026', status: 'done' },
  { id: 9, type: 'bet',     desc: 'Đặt cược — Golden Flash (Vòng 4)',      amount: -120,  date: '18/06/2026', status: 'pending' },
];

const QUICK_AMTS = [5, 10, 20, 50];

const TX_CONFIG: Record<TxType, { color: string; bg: string; label: string }> = {
  deposit: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Nạp tiền' },
  win:     { color: 'text-gold',        bg: 'bg-gold/10 border-gold/20',               label: 'Thắng cược' },
  loss:    { color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         label: 'Thua cược' },
  bet:     { color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20',   label: 'Đặt cược' },
};

const child = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function SpectatorWalletPage() {
  const [usdInput, setUsdInput] = useState('');
  const [quickAmt, setQuickAmt] = useState<number | null>(null);
  const [txFilter, setTxFilter] = useState<TxType | 'all'>('all');
  const [deposited, setDeposited] = useState(false);

  const effectiveUsd = quickAmt ?? (parseFloat(usdInput) || 0);
  const coinsPreview = effectiveUsd * COINS_PER_USD;

  function handleDeposit() {
    if (effectiveUsd <= 0) return;
    setDeposited(true);
    setTimeout(() => setDeposited(false), 2500);
    setUsdInput('');
    setQuickAmt(null);
  }

  const filtered = txFilter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === txFilter);

  const totalWon   = TRANSACTIONS.filter(t => t.type === 'win').reduce((s, t) => s + t.amount, 0);
  const totalLost  = TRANSACTIONS.filter(t => t.type === 'loss').reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalDeposited = TRANSACTIONS.filter(t => t.type === 'deposit').reduce((s, t) => s + (t.usd ?? 0), 0);
  const pendingCoins = TRANSACTIONS.filter(t => t.type === 'bet' && t.status === 'pending').reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen text-body font-sans flex" style={{backgroundColor: '#0b101e'}}>
      <Sidebar />
      <div className="relative flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="relative z-10 max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Ví của tôi"
            subtitle="Nạp tiền, theo dõi coins và lịch sử giao dịch"
            imageUrl="/images/hero-spectator.jpg"
            imagePosition="center 50%"
            badge={
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-bold uppercase tracking-widest">
                <Coins size={10} /> $1 = {COINS_PER_USD} coins
              </div>
            }
          />

          {/* Balance card + mini stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
            {/* Main balance */}
            <motion.div variants={child} className="col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden border border-gold/15">
              <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-gradient-to-br from-gold/20 to-amber-900/10 blur-[40px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Wallet size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Số dư khả dụng</div>
                    <div className="text-[10px] text-muted/60">{pendingCoins.toLocaleString()} coins đang đặt cược</div>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-serif font-bold text-white">{BALANCE.toLocaleString()}</span>
                  <span className="text-lg text-gold font-bold mb-1">coins</span>
                </div>
                <div className="text-sm text-muted">${(BALANCE / COINS_PER_USD).toFixed(2)} USD tương đương</div>
              </div>
            </motion.div>

            {/* Stats */}
            {[
              { label: 'Tổng đã nạp', value: `$${totalDeposited}`, sub: `${(totalDeposited * COINS_PER_USD).toLocaleString()} coins`, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-900/20', icon: ArrowDownLeft },
              { label: 'Tổng thắng', value: `+${totalWon.toLocaleString()}`, sub: `$${(totalWon / COINS_PER_USD).toFixed(2)}`, color: 'text-gold', bg: 'from-gold/15 to-amber-900/20', icon: TrendingUp },
              { label: 'Tổng thua', value: `-${totalLost.toLocaleString()}`, sub: `$${(totalLost / COINS_PER_USD).toFixed(2)}`, color: 'text-red-400', bg: 'from-red-500/15 to-red-900/20', icon: TrendingDown },
            ].map((s, i) => (
              <motion.div key={i} variants={child} className="glass-panel rounded-xl p-5 relative overflow-hidden">
                <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${s.bg} blur-[30px] opacity-60`} />
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} border border-white/[0.08] flex items-center justify-center ${s.color} mb-3 relative z-10`}>
                  <s.icon size={16} />
                </div>
                <div className={`relative z-10 text-xl font-serif font-bold ${s.color}`}>{s.value}</div>
                <div className="relative z-10 text-[10px] text-muted/70 mt-0.5">{s.sub}</div>
                <div className="relative z-10 text-[11px] text-muted font-medium mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Deposit + Transaction history */}
          <div className="grid grid-cols-[400px_1fr] gap-6">

            {/* Deposit panel */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-xl p-6 h-fit">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Plus size={15} className="text-emerald-400" />
                </div>
                <h2 className="text-base font-serif text-white">Nạp tiền</h2>
              </div>

              {/* Quick amounts */}
              <div className="mb-4">
                <div className="text-[11px] text-muted font-medium mb-2 uppercase tracking-wider">Nhanh</div>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_AMTS.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setQuickAmt(quickAmt === amt ? null : amt); setUsdInput(''); }}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all ${quickAmt === amt ? 'bg-gold/15 border-gold/40 text-gold' : 'bg-white/[0.03] border-glass-border text-muted hover:text-white hover:border-white/20'}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="mb-4">
                <div className="text-[11px] text-muted font-medium mb-2 uppercase tracking-wider">Hoặc nhập thủ công</div>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="number"
                    min="1"
                    value={usdInput}
                    onChange={e => { setUsdInput(e.target.value); setQuickAmt(null); }}
                    placeholder="0.00"
                    className="w-full bg-white/[0.04] border border-glass-border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-muted/50 outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              {/* Preview */}
              {coinsPreview > 0 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-gold/5 border border-gold/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Bạn sẽ nhận được</span>
                    <span className="text-sm font-bold text-gold">{coinsPreview.toLocaleString()} coins</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted">Tỉ giá</span>
                    <span className="text-xs text-muted/70">$1 = {COINS_PER_USD} coins</span>
                  </div>
                </motion.div>
              )}

              {/* Confirm */}
              <button
                onClick={handleDeposit}
                disabled={coinsPreview <= 0}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${coinsPreview > 0 ? 'btn-gold' : 'bg-white/5 text-muted cursor-not-allowed border border-glass-border'}`}
              >
                {deposited ? '✓ Nạp thành công!' : coinsPreview > 0 ? `Nạp $${effectiveUsd} → ${coinsPreview.toLocaleString()} coins` : 'Chọn số tiền'}
              </button>

              {/* Rate info */}
              <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-glass-border">
                <div className="text-[10px] text-muted/70 uppercase tracking-wider font-bold mb-2">Thông tin</div>
                <div className="space-y-1">
                  {[['$1', '100 coins'], ['$10', '1,000 coins'], ['$50', '5,000 coins']].map(([usd, coins]) => (
                    <div key={usd} className="flex justify-between text-xs">
                      <span className="text-muted">{usd} USD</span>
                      <span className="text-champagne font-medium">{coins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Transaction history */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-serif text-white">Lịch sử giao dịch</h2>
                {/* Filter */}
                <div className="flex items-center gap-1">
                  {([['all', 'Tất cả'], ['deposit', 'Nạp'], ['win', 'Thắng'], ['loss', 'Thua'], ['bet', 'Cược']] as [TxType | 'all', string][]).map(([f, label]) => (
                    <button key={f} onClick={() => setTxFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${txFilter === f ? 'bg-gold/15 text-gold border border-gold/30' : 'text-muted hover:text-white'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filtered.map((tx, i) => {
                  const cfg = TX_CONFIG[tx.type];
                  const TxIcon = tx.type === 'deposit' ? ArrowDownLeft
                    : tx.type === 'win' ? TrendingUp
                    : tx.type === 'loss' ? TrendingDown
                    : tx.status === 'pending' ? Clock : CheckCircle;
                  const isPos = tx.amount > 0;
                  return (
                    <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-glass-border hover:border-white/10 transition-all">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg} ${cfg.color}`}>
                        <TxIcon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/90 font-medium truncate">{tx.desc}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted">{tx.date}</span>
                          {tx.status === 'pending' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Chờ KQ</span>
                          )}
                          {tx.usd && (
                            <span className="text-[10px] text-muted/60">${tx.usd} USD</span>
                          )}
                        </div>
                      </div>
                      <div className={`text-sm font-bold shrink-0 tabular-nums ${isPos ? 'text-emerald-400' : tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-[10px] font-normal text-muted">coins</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted text-sm">Không có giao dịch</div>
              )}
            </motion.div>
          </div>

        </main>
      </div>
    </div>
  );
}
