import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, ChevronRight } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { PageHero } from '../../components/layout/PageHero';

const SCHEDULE = [
  { id: 1, date: '20/06/2026', day: 'Thứ Bảy', time: '09:00', horse: 'Thunderstrike', breed: 'Thoroughbred', race: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', location: 'Trường đua Phú Thọ', distance: '1.800m', status: 'upcoming' },
  { id: 2, date: '20/06/2026', day: 'Thứ Bảy', time: '11:30', horse: 'Desert Wind', breed: 'Arabian', race: 'Vòng 4 - Bán Kết', tournament: 'Giải Xuân 2026', location: 'Trường đua Phú Thọ', distance: '1.800m', status: 'upcoming' },
  { id: 3, date: '28/06/2026', day: 'Chủ Nhật', time: '10:00', horse: 'Storm Rider', breed: 'Warmblood', race: 'Chung Kết', tournament: 'Giải Xuân 2026', location: 'Trường đua Phú Thọ', distance: '2.200m', status: 'pending' },
  { id: 4, date: '15/07/2026', day: 'Thứ Tư', time: '08:00', horse: 'Dark Knight', breed: 'Quarter Horse', race: 'Vòng Loại 1', tournament: 'Cúp Vô Địch Quốc Gia 2026', location: 'Trường đua Đại Nam', distance: '1.600m', status: 'pending' },
];

const STATUS_CONFIG = {
  upcoming: { label: 'Đã nhận', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending:  { label: 'Chờ xác nhận', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
};

const DAY_GROUPS = Array.from(new Set(SCHEDULE.map(s => s.date)));

export function JockeySchedulePage() {
  return (
    <div className="min-h-screen bg-[#0B1628] text-body font-sans flex">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <Topbar />
        <main className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

          <PageHero
            title="Lịch thi đấu"
            subtitle="Lịch đua sắp tới của bạn"
            imageUrl="/images/hero-jockey.jpg"
            imagePosition="center 25%"
          />

          <div className="space-y-8">
            {DAY_GROUPS.map(date => {
              const races = SCHEDULE.filter(s => s.date === date);
              const { day } = races[0];
              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20">
                      <Calendar size={13} className="text-gold" />
                      <span className="text-sm font-bold text-gold">{date}</span>
                      <span className="text-xs text-champagne">— {day}</span>
                    </div>
                    <div className="flex-1 h-px bg-glass-border" />
                  </div>

                  <div className="space-y-3">
                    {races.map((r, i) => {
                      const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
                      return (
                        <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                          className="glass-panel rounded-xl border border-glass-border hover:border-gold/20 transition-all group overflow-hidden">
                          <div className="flex items-stretch">
                            <div className="w-20 bg-gradient-to-b from-gold/10 to-transparent flex flex-col items-center justify-center py-5 shrink-0 border-r border-glass-border">
                              <Clock size={14} className="text-gold mb-1" />
                              <span className="text-base font-bold text-white">{r.time.split(':')[0]}</span>
                              <span className="text-xs text-muted">{r.time.split(':')[1]}</span>
                            </div>
                            <div className="flex-1 p-5 flex items-center gap-4">
                              <div className="text-2xl shrink-0">🐴</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-base font-serif font-bold text-white group-hover:text-champagne transition-colors">{r.horse}</span>
                                  <span className="text-xs text-muted">{r.breed}</span>
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-muted">
                                  <span className="flex items-center gap-1"><Trophy size={10} className="text-gold/60" /> {r.race} — {r.tournament}</span>
                                  <span className="flex items-center gap-1"><MapPin size={10} className="text-gold/60" /> {r.location}</span>
                                  <span className="text-champagne font-medium">{r.distance}</span>
                                </div>
                              </div>
                              <button className="text-xs text-gold hover:text-champagne flex items-center gap-1 transition-colors shrink-0 font-medium">
                                Xem chi tiết <ChevronRight size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
