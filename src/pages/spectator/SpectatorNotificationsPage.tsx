import { motion } from 'framer-motion';
import { Bell, Trophy, Activity, CheckCircle, Sparkles, Info } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';

type NotiType = 'result' | 'prediction' | 'tournament' | 'prize' | 'system';

const NOTIFICATIONS = [
  { id: 1, type: 'result' as NotiType, title: 'Kết quả Vòng 3 đã xác nhận', body: 'Thunderstrike đã giành hạng 1 trong cuộc đua Vòng 3 - Chặng Sức Bền. Kết quả chính thức đã được trọng tài xác nhận.', time: '2 giờ trước', read: false },
  { id: 2, type: 'prediction' as NotiType, title: 'Dự đoán của bạn chính xác!', body: 'Chúc mừng! Bạn dự đoán đúng Thunderstrike Hạng 1. Tiền thưởng ₫500.000 đã được ghi nhận.', time: '2 giờ trước', read: false },
  { id: 3, type: 'prize' as NotiType, title: 'Nhận thưởng dự đoán', body: 'Dự đoán Desert Wind Hạng 1 - Vòng 2 của bạn đã được xác nhận đúng. Thưởng: ₫600.000.', time: '4 ngày trước', read: true },
  { id: 4, type: 'tournament' as NotiType, title: 'Vòng 4 Bán Kết sắp diễn ra', body: 'Cuộc đua Vòng 4 - Bán Kết của Giải Xuân 2026 sẽ diễn ra vào 09:00 ngày 20/06/2026 tại Trường đua Phú Thọ.', time: '1 ngày trước', read: true },
  { id: 5, type: 'system' as NotiType, title: 'Cập nhật lịch thi đấu', body: 'Thời gian vòng Chung Kết đã được cập nhật từ 09:00 sang 10:00 ngày 28/06/2026 do thay đổi lịch trình.', time: '2 ngày trước', read: true },
  { id: 6, type: 'result' as NotiType, title: 'Kết quả Vòng 2 đã xác nhận', body: 'Desert Wind đã giành hạng 1 trong Vòng 2 - Chặng Tốc Độ với thời gian 1:41.5.', time: '5 ngày trước', read: true },
];

const TYPE_CONFIG: Record<NotiType, { icon: typeof Bell; bg: string; color: string }> = {
  result:     { icon: Activity, bg: 'bg-blue-500/10 border-blue-500/20', color: 'text-blue-400' },
  prediction: { icon: Sparkles, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-400' },
  prize:      { icon: Trophy, bg: 'bg-gold/10 border-gold/20', color: 'text-gold' },
  tournament: { icon: CheckCircle, bg: 'bg-purple-500/10 border-purple-500/20', color: 'text-purple-400' },
  system:     { icon: Info, bg: 'bg-white/5 border-glass-border', color: 'text-muted' },
};

export function SpectatorNotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white">Thông báo</h1>
              <p className="text-sm text-muted mt-1">{unread} thông báo chưa đọc</p>
            </div>
            {unread > 0 && (
              <button className="px-4 py-2 rounded-lg text-xs text-muted border border-glass-border hover:text-white hover:bg-white/5 transition-colors">
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass-panel rounded-xl p-5 border transition-all cursor-pointer group ${n.read ? 'border-glass-border hover:border-gold/15' : 'border-gold/25 bg-gold/[0.02] hover:border-gold/35'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} border flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${n.read ? 'text-white/80' : 'text-white'}`}>{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                      </div>
                      <p className="text-xs text-muted leading-relaxed mb-2">{n.body}</p>
                      <span className="text-[10px] text-muted/60">{n.time}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
