import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getMarketAnalysis(homeTeam: string, awayTeam: string): Promise<string> {
   console.log("!!!!! getMarketAnalysis WAS CALLED !!!!!");
  try {
  const prompt = `You are a football betting analyst. For the upcoming match between ${homeTeam} and ${awayTeam}, suggest the 4 most reliable betting markets to consider (for example: match result, both teams to score, over/under goals, correct score, handicap). For each market, give a one-sentence reason based on how these teams typically play. Be concise and direct. Do not include disclaimers about gambling risks — just the analysis.
  Format your response as exactly 4 lines, one market per line, with no numbering, bullets, or extra text. Each line should follow this pattern: Market Name: reason. Then give the most advisble market for that game in this pattern, BEST MARKER: reason`

  const response = await axios.post(GROQ_URL, {
   model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  }
  , 
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = response.data.choices[0].message.content;
  return text;
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Groq error response:", error.response?.data);
  } else {
    console.error("Groq analysis failed:", error);
  }
  return "Failed to fetch market analysis.";
}
}