import { api } from '../services/api';

export const getRefereeDashboard = () => api.get('/referee/dashboard');
export const getRaceHorseChecks = (raceId) => api.get(`/referee/races/${raceId}/horse-checks`);
export const getRaceViolations = (raceId) => api.get(`/referee/races/${raceId}/violations`);
export const getRaceReports = (raceId) => api.get(`/referee/races/${raceId}/reports`);
export const getRaceResults = (raceId) => api.get(`/referee/races/${raceId}/results`);
