import '@fontsource/bebas-neue';
import React from 'react';

export function Header() {
    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: "flex-start",
        padding: '20px 0',
        borderBottom: '1px solid #1a1a1a',
        marginBottom: '10px',
        flexDirection: 'column'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontFamily: 'Bebas Neue',
        fontWeight: 'bolder',
        margin: 0,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '2px',
        marginBottom: '0px'
    };

    const subTitle: React.CSSProperties = {
        fontSize: '12px',
        fontFamily: 'Bebas Neue',
        fontWeight: 'bold',
        margin: 0,
        color: '#888888',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '2px'
    };

    const accentStyle: React.CSSProperties = {
        color: '#22c55e' // Green accent
    };

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>
                <span>Goal</span><span style={accentStyle}>Stream</span><span>.</span>
            </h1>
            <p style={subTitle}>Latest Football Scores</p>
        </header>
    );
}