import React from 'react';

interface TabsProps {
    activeTab: 'live' | 'all' | 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1' | 'UEFA Champions League' | 'UEFA Europa League';
    onTabChange: (tab: 'live' | 'all' | 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1' | 'UEFA Champions League' | 'UEFA Europa League') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        backgroundColor: '#111111',
        padding: '5px',
        borderRadius: '10px',
        width: 'max-content'
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
        backgroundColor: isActive ? '#22c55e' : 'transparent', // green for active, transparent for inactive
        color: isActive ? '#000000' : '#888888', // black text on green, grey text otherwise
    });

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
            <button
                style={getTabStyle(activeTab === 'Premier League')}
                onClick={() => onTabChange('Premier League')}
            >
                Premier League
            </button>
            <button
                style={getTabStyle(activeTab === 'La Liga')}
                onClick={() => onTabChange('La Liga')}
            >
                La Liga
            </button>
            <button
                style={getTabStyle(activeTab === 'Serie A')}
                onClick={() => onTabChange('Serie A')}
            >
                Serie A
            </button>
            <button
                style={getTabStyle(activeTab === 'Bundesliga')}
                onClick={() => onTabChange('Bundesliga')}
            >
                Bundesliga
            </button>
            <button
                style={getTabStyle(activeTab === 'Ligue 1')}
                onClick={() => onTabChange('Ligue 1')}
            >
                Ligue 1
            </button>
            <button
                style={getTabStyle(activeTab === 'UEFA Champions League')}
                onClick={() => onTabChange('UEFA Champions League')}
            >
                UEFA Champions League
            </button>
            <button
                style={getTabStyle(activeTab === 'UEFA Europa League')}
                onClick={() => onTabChange('UEFA Europa League')}
            >
                UEFA Europa League
            </button>
        </div>
    );
}
