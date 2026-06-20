import { api } from '../services/api';

function parseApiError(err) {
  try {
    const parsed = JSON.parse(err.message);
    const base = parsed.message || parsed.title || err.message;
    // BE kèm nguyên nhân thật trong `detail` (vd lỗi 500) → hiển thị để dễ chẩn đoán
    return parsed.detail ? `${base} — ${parsed.detail}` : base;
  } catch {
    return err.message;
  }
}

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.result.accessToken);
  localStorage.setItem('user', JSON.stringify(data.result.user));
  return data.result.user;
}

export async function register(fullName, email, password, confirmPassword) {
  const data = await api.post('/auth/register', { fullName, email, password, confirmPassword });
  localStorage.setItem('token', data.result.accessToken);
  localStorage.setItem('user', JSON.stringify(data.result.user));
  return data.result.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export { parseApiError };
