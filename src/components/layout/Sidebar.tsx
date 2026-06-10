import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Flag, Trophy, Calendar, BarChart3,
  Bell, LogOut, Users, ClipboardList,
  ShieldCheck, FileText, Target, Star, Activity,
  Megaphone, UserCheck, AlertTriangle,
} from 'lucide-react';
import { getMockUser, clearMockUser } from '../../utils/mockAuth';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Tài khoản', path: '/admin/users' },
    { icon: Trophy, label: 'Giải đấu', path: '/admin/tournaments' },
    { icon: Calendar, label: 'Lịch đua', path: '/admin/races' },
    { icon: ClipboardList, label: 'Duyệt đăng ký', path: '/admin/registrations' },
    { icon: UserCheck, label: 'Phân công trọng tài', path: '/admin/referees' },
    { icon: Megaphone, label: 'Công bố kết quả', path: '/admin/results' },
    { icon: AlertTriangle, label: 'Xử lý vi phạm', path: '/admin/violations' },
    { icon: Target, label: 'Dự đoán', path: '/admin/predictions' },
  ],
  owner: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/owner/dashboard' },
    { icon: Flag, label: 'Ngựa của tôi', path: '/owner/horses' },
    { icon: Trophy, label: 'Giải đấu', path: '/owner/tournaments' },
    { icon: ClipboardList, label: 'Đăng ký đua', path: '/owner/registrations' },
    { icon: Users, label: 'Jockey', path: '/owner/jockeys' },
    { icon: BarChart3, label: 'Kết quả & Thưởng', path: '/owner/results' },
  ],
  jockey: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/jockey/dashboard' },
    { icon: Bell, label: 'Lời mời', path: '/jockey/invitations' },
    { icon: Flag, label: 'Cuộc đua của tôi', path: '/jockey/races' },
    { icon: Calendar, label: 'Lịch thi đấu', path: '/jockey/schedule' },
    { icon: Star, label: 'Thành tích', path: '/jockey/stats' },
    { icon: AlertTriangle, label: 'Vi phạm của tôi', path: '/jockey/violations' },
  ],
  referee: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/referee/dashboard' },
    { icon: ShieldCheck, label: 'Kiểm tra ngựa', path: '/referee/horse-check' },
    { icon: Activity, label: 'Ghi vi phạm', path: '/referee/violations' },
    { icon: Flag, label: 'Xác nhận kết quả', path: '/referee/confirm-results' },
    { icon: FileText, label: 'Biên bản', path: '/referee/reports' },
  ],
  spectator: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/spectator/dashboard' },
    { icon: Trophy, label: 'Giải đấu & Lịch đua', path: '/spectator/tournaments' },
    { icon: Activity, label: 'Kết quả Live', path: '/spectator/live' },
    { icon: Target, label: 'Dự đoán của tôi', path: '/spectator/predictions' },
    { icon: Bell, label: 'Thông báo', path: '/spectator/notifications' },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Quản trị viên',
  owner: 'Chủ ngựa',
  jockey: 'Jockey',
  referee: 'Trọng tài',
  spectator: 'Khán giả',
};

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getMockUser();
  const role = user?.role ?? 'owner';
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.owner;

  function handleLogout() {
    clearMockUser();
    navigate('/login');
  }

  return (
    <aside className="w-[280px] shrink-0 h-screen sticky top-0 border-r border-glass-border bg-[#0A1220] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center gap-2.5 border-b border-glass-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/30">
          <svg viewBox="0 0 24 24" fill="var(--color-gold)" className="w-4 h-4">
            <path d="M12 2C9 2 8 5 8 5L6 6V10L8 12V18L6 20H8V22H10V20H14V22H16V20H18L16 18V12L18 10V6L16 5C16 5 15 2 12 2Z" />
          </svg>
        </div>
        <span className="font-serif text-lg font-bold text-champagne tracking-wider">EQUESTRIA</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted/50 font-bold px-3 mb-2">Menu</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all duration-200 ${
                isActive
                  ? 'bg-gold/10 text-champagne border border-gold/20'
                  : 'text-muted hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-gold' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-glass-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center font-serif text-base font-bold text-champagne">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name ?? 'User'}</div>
            <div className="text-[11px] text-gold font-medium">{ROLE_LABELS[role] ?? role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted hover:text-white transition-colors p-1"
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
