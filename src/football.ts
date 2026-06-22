import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const footballApi = {
  getAllMatches: () =>
    api.get(`/All`),

  getLivematches: () =>
    api.get(`/Live`),

  getPremierleague: () =>
    api.get(`/Premierleague`),

  getMatchDetails: (matchId: any) =>
    api.get(`/statistics/${matchId}`),

  getMatchLineups: (matchId: any) =>
    api.get(`/lineups/${matchId}`)
}