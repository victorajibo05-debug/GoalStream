import { useState, useEffect } from "react";
import { MatchCard } from "./MatchCard";
import { fetchPrediction } from "../services/predictionService";
import type { MatchResponse, Prediction } from "./types/types";

interface MatchListProps {
    matches: MatchResponse[];
}


export function MatchList({ matches }: MatchListProps) {
    const [predictions, setPredictions] = useState<Record<string, Prediction>>({});

    

useEffect(() => {
  matches.forEach(async (match) => {
    const key = match.fixture.id; // or whatever uniquely identifies a match
    const result = await fetchPrediction(
      match.teams.home.name,
      match.teams.away.name,
      match.fixture.date
    );
    setPredictions((prev) => ({ ...prev, [key]: result }));
  });
}, [matches]);

// Sort matches by league name
const sortedMatches = [...matches].sort((a, b) =>
        a.league.name.localeCompare(b.league.name)
    );

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        gap: '12px',

    };

    const emptyStateStyle: React.CSSProperties = {
        padding: '40px',
        textAlign: 'center',
        color: '#888888',
        backgroundColor: '#111111',
        borderRadius: '12px',
        border: '1px solid #1a1a1a',
    };

    if (!matches || matches.length === 0) {
        return (
            <div style={emptyStateStyle}>
                <h3>Feature not available yet</h3>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Check back later for updates.
                </p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {sortedMatches.map((match) => (
                <MatchCard
                    key={match.fixture.id}
                    match={match}
                    prediction={predictions[match.fixture.id]}
                />
            ))}
        </div>
    );
}
