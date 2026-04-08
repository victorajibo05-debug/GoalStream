import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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