import axios from 'axios';
import { CONFIG } from "../config/env.ts"

const headers = {
    'x-apisports-key': CONFIG.API_KEY,
    'x-apisports-host': CONFIG.API_HOST,
};

const BASE = CONFIG.BASE_URL;


const handleError = (error: any, message: string) => {
    if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data}`);
    }
    throw new Error(message);
};

export const getAllmatches = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get<any>(`${BASE}/fixtures?date=${today}`, { headers }
        );
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to fetch matches');
    }

};
export const getLivematches = async () => {
    try {
        const response = await axios.get<any>(`${BASE}/fixtures?live=all`, { headers }

        );
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to fetch live matches');
    }
};

export const getPremierleague = async (leagueId: any, season: any) => {
    try {
        const response = await axios.get<any>(`${BASE}/fixtures?league=${leagueId}&season=${season}`, { headers }

        );
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to matches');
    }
};

export const getMatchDetails = async (matchId: any) => {
    try {
        const response = await axios.get<any>(`${BASE}/fixtures/statistics?fixture=${matchId}`, { headers }

        );
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to fetch match details');
    }
};

export const getMatchLineups = async (matchId: any) => {
    try {
        const response = await axios.get<any>(`${BASE}/fixtures/lineups?fixture=${matchId}`, { headers }

        );
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to fetch match lineups');
    }
};