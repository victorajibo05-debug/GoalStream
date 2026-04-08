import React from 'react';

export function LoadingSpinner() {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: '#888888',
        gap: '16px'
    };

    const spinnerStyle: React.CSSProperties = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '3px solid #1a1a1a',
        borderTopColor: '#22c55e', // green accent
        animation: 'spin 1s linear infinite',
    };

    // Adding keyframes injection as inline style isn't fully capable of keyframes natively without this hack
    return (
        <div style={containerStyle}>
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
            <div style={spinnerStyle} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Loading matches...</span>
        </div>
    );
}
