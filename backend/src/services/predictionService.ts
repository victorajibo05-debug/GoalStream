// src/services/predictionService.ts

import axios from "axios";

const PREDICTION_SERVICE_URL =
  process.env.PREDICTION_SERVICE_URL || "http://127.0.0.1:5001";

export interface PredictRequest {
  home_team: string;
  away_team: string;
  match_date: string;
  stage?: string;
  home_odds?: number;
  draw_odds?: number;
  away_odds?: number;
}

export interface PredictionResult {
  home_win: number;
  draw: number;
  away_win: number;
  confidence: "high" | "medium" | "low";
  value_bet: string | null;
}

export async function getPrediction(
  req: PredictRequest
): Promise<PredictionResult> {
  const response = await axios.post(
    `${PREDICTION_SERVICE_URL}/predict`,
    req,
    { timeout: 10000 }
  );

  return response.data;
}