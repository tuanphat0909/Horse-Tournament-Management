import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { toast } from '../components/ui/Toast';

/**
 * Kết nối SignalR tới NotificationHub của backend (port từ FE của nhóm,
 * tích hợp vào hệ Toast + chuông Topbar của project này).
 *
 * Khi BE đẩy 'ReceiveNotification' (jockey nhận lời mời, kết quả công bố...):
 *  - hiện Toast ngay lập tức (đồng thời tự lưu vào lịch sử chuông 12h)
 *  - bắn event 'server-notif' để chuông Topbar tải lại danh sách + hiện đốm sáng
 */

let connection: HubConnection | null = null;
let connectedForToken: string | null = null;

function hubUrl(): string {
  // BASE_URL dạng "http://localhost:5000/api" → hub ở "http://localhost:5000/hubs/notification"
  const base = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '') + '/hubs/notification';
}

export function startNotificationHub() {
  const token = localStorage.getItem('token');
  if (!token) { stopNotificationHub(); return; }
  if (connection && connectedForToken === token) return; // đã kết nối với đúng phiên này

  stopNotificationHub();

  const conn = new HubConnectionBuilder()
    .withUrl(hubUrl(), { accessTokenFactory: () => token })
    .configureLogging(LogLevel.Warning)
    .withAutomaticReconnect()
    .build();

  conn.on('ReceiveNotification', (noti: any) => {
    const title = noti?.title ?? 'Thông báo mới';
    const content = noti?.content ?? noti?.message ?? '';
    toast.info(content ? `${title}: ${content}` : title);
    window.dispatchEvent(new CustomEvent('server-notif'));
  });

  conn.start()
    .then(() => { connection = conn; connectedForToken = token; })
    .catch(() => { /* BE chưa bật hub / mất mạng — không làm hỏng trang */ });
}

export function stopNotificationHub() {
  if (connection) {
    connection.stop().catch(() => { /* ignore */ });
    connection = null;
    connectedForToken = null;
  }
}
