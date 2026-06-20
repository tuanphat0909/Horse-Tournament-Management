import { api } from '../services/api';

export const getRoles = () => api.get('/admin/roles');

export const createAccount = (data) => api.post('/admin/accounts', data);

export const getAccounts = () => api.get('/admin/accounts');

export const createTournament = (data) => api.post('/admin/tournaments', data);

export const createRace = (data) => api.post('/admin/races', data);

export const createRaceEntry = (raceId, data) => api.post(`/admin/races/${raceId}/entries`, data);

export const assignReferee = (raceId, refereeId) => api.post(`/admin/races/${raceId}/referees`, { refereeId });

export const getRaceReferees = (raceId) => api.get(`/admin/races/${raceId}/referees`);

export const removeReferee = (raceId, refereeId) => api.delete(`/admin/races/${raceId}/referees/${refereeId}`);

export const createPrizes = (data) => api.post('/admin/payouts/prizes', data);

export const triggerPayout = (raceId) => api.post(`/admin/payouts/trigger/${raceId}`);

// ===== Danh sách quản trị (BE đã có) =====
export const getRegistrations = () => api.get('/admin/registrations');
// Duyệt / từ chối đăng ký. body ReviewRegistrationRequest { status: 'Approved' | 'Rejected' }
// LƯU Ý BE: endpoint này CHƯA tồn tại (BE-git mới có DTO, chưa nối route + RegistrationService.ReviewAsync).
// Cần bổ sung: PUT /admin/registrations/{id}/review.
export const reviewRegistration = (id, status) => api.put(`/admin/registrations/${id}/review`, { status });
export const getAdminReferees = () => api.get('/admin/referees');
export const getViolations = () => api.get('/admin/violations');
export const getPredictions = () => api.get('/admin/predictions');
export const getPredictionStats = () => api.get('/admin/predictions/stats');

// ===== Kết quả & công bố =====
export const publishResult = (raceId) => api.post(`/admin/races/${raceId}/publish`);
export const getAdminRaceResults = (raceId) => api.get(`/admin/races/${raceId}/results`);

// body { name, startDate, endDate, numberOfRounds, status }
export const updateTournament = (id, body) => api.put(`/admin/tournaments/${id}`, body);
