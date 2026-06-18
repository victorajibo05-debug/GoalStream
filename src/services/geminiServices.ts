import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchMarketAnalysis(
  homeTeam: string,
  awayTeam: string
): Promise<string> {
  const response = await axios.post<{ analysis: string }>(
    `${API_BASE_URL}/api/groq`,
    {
      home_team: homeTeam,
      away_team: awayTeam,
    }
  );

  return response.data.analysis;
}