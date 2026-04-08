import React from 'react';
import type { MatchResponse } from './types/types';

interface MatchCardProps {
    match: MatchResponse;
}

export function MatchCard({ match }: MatchCardProps) {
    const isLive = match.fixture.status.short === '1H' ||
        match.fixture.status.short === '2H' ||
        match.fixture.status.short === 'HT' ||
        match.fixture.status.short === 'ET' ||
        match.fixture.status.short === 'P';

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#111111',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '10px'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'Bebas Neue',
        fontSize: '12px',
        color: '#888888',
        borderBottom: '1px solid #1a1a1a',
        paddingBottom: '8px'
    };

    const liveBadgeStyle: React.CSSProperties = {
        color: '#22c55e',
        fontWeight: 'bold',
        fontFamily: 'Bebas Neue',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const teamsContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const teamRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const teamInfoStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: '500',
        fontFamily: 'Bebas Neue'
    };

    const logoStyle: React.CSSProperties = {
        width: '24px',
        height: '24px',
        objectFit: 'contain'
    };

    const scoreStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Bebas Neue',
        color: isLive ? '#22c55e' : '#ffffff'
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <span>{match.league.name} • {match.league.country}</span>
                {isLive ? (
                    <span style={liveBadgeStyle}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#22c55e',
                            borderRadius: '50%',
                            display: 'inline-block'
                        }} />
                        {match.fixture.status.elapsed}'
                    </span>
                ) : (
                    <span>{match.fixture.status.short}</span>
                )}
            </div>

            <div style={teamsContainerStyle}>
                {/* Home Team */}
                <div style={teamRowStyle}>
                    <div style={teamInfoStyle}>
                        <img src={match.teams.home.logo} alt={match.teams.home.name} style={logoStyle} />
                        <span>{match.teams.home.name}</span>
                    </div>
                    <span style={scoreStyle}>
                        {match.goals.home !== null ? match.goals.home : '-'}
                    </span>
                </div>

                {/* Away Team */}
                <div style={teamRowStyle}>
                    <div style={teamInfoStyle}>
                        <img src={match.teams.away.logo} alt={match.teams.away.name} style={logoStyle} />
                        <span>{match.teams.away.name}</span>
                    </div>
                    <span style={scoreStyle}>
                        {match.goals.away !== null ? match.goals.away : '-'}
                    </span>
                </div>
            </div>
        </div>
    );
}
