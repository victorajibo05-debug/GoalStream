import React, { useState, useEffect } from 'react';

type TabOption = 'live' | 'all' | 'World Cup' | 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1' | 'UEFA Champions League' | 'UEFA Europa League';

interface TabsProps {
    activeTab: TabOption;
    onTabChange: (tab: TabOption) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        backgroundColor: '#111111',
        padding: '5px',
        borderRadius: '10px',
        width: isMobile ? '100%' : '100%',
        maxWidth: '100%',
        overflowX: isMobile ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    };

    const getTabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'Bebas Neue',
        fontWeight: '600',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        backgroundColor: isActive ? '#22c55e' : 'transparent',
        color: isActive ? '#000000' : '#888888',
    });

    const leagues: TabOption[] = ['Premier League', 'World Cup', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'UEFA Champions League', 'UEFA Europa League'];
    const isLeagueActive = leagues.includes(activeTab);

    return (
        <div style={containerStyle}>
            <button
                style={getTabStyle(activeTab === 'all')}
                onClick={() => onTabChange('all')}
            >
                All Matches
            </button>
            <button
                style={getTabStyle(activeTab === 'live')}
                onClick={() => onTabChange('live')}
            >
                Live Matches
            </button>

            {isMobile ? (
                <select
                    style={{
                        ...getTabStyle(isLeagueActive),
                        outline: 'none',
                    }}
                    value={isLeagueActive ? activeTab : ''}
                    onChange={(e) => onTabChange(e.target.value as TabOption)}
                >
                    <option value="" disabled style={{ color: '#000' }}>Leagues...</option>
                    {leagues.map((league) => (
                        <option key={league} value={league} style={{ backgroundColor: '#111111', color: '#ffffff' }}>
                            {league}
                        </option>
                    ))}
                </select>
            ) : (
                leagues.map((league) => (
                    <button
                        key={league}
                        style={getTabStyle(activeTab === league)}
                        onClick={() => onTabChange(league)}
                    >
                        {league}
                    </button>
                ))
            )}
        </div>
    );
}
