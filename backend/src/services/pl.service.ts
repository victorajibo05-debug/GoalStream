import axios from 'axios';
import {cache, TTL} from './cache';

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const SLUG = 'eng.1';

async function fetchCached<T>(url: string, ttl: number): Promise<T> {
  const cached = cache.get<T>(url);
  if (cached) return cached;
  const { data } = await axios.get<T>(url, { timeout: 10000 });
  cache.set(url, data, ttl);
  return data;
}

function today(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

export const getTodayMatches = async () => {
  const url = `${BASE}/${SLUG}/scoreboard?dates=${today()}`;
  const data = await fetchCached<any>(url, TTL.LIVE);

  const events = data.events ?? [];

   const matches = events.map((event: any) => {
    const competition = event.competitions?.[0];
    const home = competition?.competitors?.find((c: any) => c.homeAway === 'home');
    const away = competition?.competitors?.find((c: any) => c.homeAway === 'away');

    return {
      id: event.id,
      name: event.name,
      date: event.date,
      status: {
        state: event.status?.type?.state,           
        completed: event.status?.type?.completed,  
        displayClock: event.status?.displayClock,   
        detail: event.status?.type?.shortDetail,    
      },
      home: {
        id: home?.team?.id,
        name: home?.team?.displayName,
        shortName: home?.team?.shortDisplayName,
        logo: home?.team?.logo,
        score: home?.score ?? null,
        winner: home?.winner ?? null,
      },
      away: {
        id: away?.team?.id,
        name: away?.team?.displayName,
        shortName: away?.team?.shortDisplayName,
        logo: away?.team?.logo,
        score: away?.score ?? null,
        winner: away?.winner ?? null,
      },
      venue: competition?.venue?.fullName ?? null,
    };
  });

  return {
    date: today(),
    total: matches.length,
    matches,
  };
};