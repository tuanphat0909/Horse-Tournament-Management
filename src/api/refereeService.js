import { api } from '../services/api';

// ===== Đọc dữ liệu theo cuộc đua =====
export const getRefereeDashboard = () => api.get('/referee/dashboard');
export const getRaceViolations = (raceId) => api.get(`/referee/races/${raceId}/violations`);
export const getRaceReports = (raceId) => api.get(`/referee/races/${raceId}/reports`);
export const getRaceResults = (raceId) => api.get(`/referee/races/${raceId}/results`);
export const getHorseChecks = (raceId) => api.get(`/referee/races/${raceId}/horse-checks`);

// ===== Ghi dữ liệu =====
// body LogViolationRequest { raceId, refereeId, description, penalty }
export const logViolation = (body) => api.post('/referee/violations', body);
// body CreateRefereeReportRequest { raceId?, refereeId?, assignmentId?, content, violationNote?, reportedUserId?, reportedHorseId? }
export const submitReport = (body) => api.post('/referee/reports', body);
// body SubmitRaceResultRequest { raceId, winner, refereeId? }
export const submitResult = (body) => api.post('/referee/results', body);
