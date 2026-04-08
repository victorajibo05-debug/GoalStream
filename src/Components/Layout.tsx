import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  return (
    <div style={layoutStyle}>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
}
