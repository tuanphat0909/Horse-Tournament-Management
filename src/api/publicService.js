import { api } from '../services/api';

export const getJockeyRankings = () => api.get('/public/rankings/jockeys');
export const getHorseRankings = () => api.get('/public/rankings/horses');
export const getRaceSchedule = () => api.get('/public/races/schedule');
export const getLiveRaces = () => api.get('/public/races/live');
// BE trả về result dạng PHÂN TRANG: { items: [...], totalCount, page, pageSize }
// → chuẩn hoá result về MẢNG để mọi trang gọi .map không bị crash (trang trắng).
export const getNotifications = async (page = 1, pageSize = 50) => {
  const data = await api.get(`/public/notifications?page=${page}&pageSize=${pageSize}`);
  const r = data?.result;
  const items = Array.isArray(r) ? r : (r?.items ?? []);
  return { ...data, result: items, totalCount: r?.totalCount ?? items.length };
};
export const markNotificationRead = (id) => api.put(`/public/notifications/${id}/read`);
// PUT /public/notifications/read-all — đánh dấu đã đọc tất cả (MỚI)
export const markAllNotificationsRead = () => api.put('/public/notifications/read-all');
// DELETE /public/notifications/{id} — xóa (mềm) một thông báo (MỚI)
export const deleteNotification = (id) => api.delete(`/public/notifications/${id}`);

export const getTournaments = () => api.get('/public/tournaments');
export const getTournamentDetail = (id) => api.get(`/public/tournaments/${id}`);

// ===== Chi tiết cuộc đua / lằn đua / kết quả / vòng (phục vụ dropdown) =====
export const getRaceDetail = (id) => api.get(`/public/races/${id}`);
// dropdown chọn ngựa trong 1 race (cho cược + dự đoán)
export const getRaceEntries = (raceId) => api.get(`/public/races/${raceId}/entries`);
export const getRaceResultsPublic = (raceId) => api.get(`/public/races/${raceId}/results`);
export const getRound = (roundId) => api.get(`/public/rounds/${roundId}`);
export const getTournamentRounds = (tournamentId) => api.get(`/public/tournaments/${tournamentId}/rounds`);

