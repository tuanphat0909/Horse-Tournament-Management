export interface MockUser {
  role: string;
  name: string;
}

const KEY = 'equestria_user';

const ROLE_NAMES: Record<string, string> = {
  owner: 'Nguyễn Văn An',
  jockey: 'Trần Đức Minh',
  referee: 'Lê Hoàng Nam',
  spectator: 'Phạm Thu Hà',
  admin: 'Admin Hệ Thống',
};

export function getMockUser(): MockUser | null {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setMockUser(role: string): void {
  localStorage.setItem(KEY, JSON.stringify({ role, name: ROLE_NAMES[role] ?? 'User' }));
}

export function clearMockUser(): void {
  localStorage.removeItem(KEY);
}

export function getRoleDashboard(role: string): string {
  const map: Record<string, string> = {
    owner: '/owner/dashboard',
    jockey: '/jockey/dashboard',
    referee: '/referee/dashboard',
    spectator: '/spectator/dashboard',
    admin: '/admin/dashboard',
  };
  return map[role] ?? '/dashboard';
}
