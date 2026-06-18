import axios from "axios";
import type { Prediction } from "../Components/types/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchPrediction(
  homeTeam: string,
  awayTeam: string,
  matchDate: string
): Promise<Prediction> {
  const response = await axios.post<Prediction>(
    `${API_BASE_URL}/api/predict`,
    {
      home_team: homeTeam,
      away_team: awayTeam,
      match_date: matchDate,
    }
  );

  return response.data;

  
}