import React from 'react';
import { MatchCard } from './MatchCard';
import type { MatchResponse } from './types/types';

interface MatchListProps {
    matches: MatchResponse[];
}

export function MatchList({ matches }: MatchListProps) {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
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
                <h3>No matches available</h3>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Check back later for updates.
                </p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {matches.map((match) => (
                <MatchCard key={match.fixture.id} match={match} />
            ))}
        </div>
    );
}
