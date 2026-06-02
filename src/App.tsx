import { useState, useEffect } from 'react';
import { Layout } from './Components/Layout';
import {Header} from './Components/Header';
import { Tabs } from './Components/Tabs';
import { MatchList } from './Components/MatchList';
import { LoadingSpinner } from './Components/Loading';
import { footballApi } from './football';
import type { MatchResponse } from './Components/types/types';
import { AlertCircle, RefreshCw } from 'lucide-react';




export default function App() {
  const [Allmatches, setAllmatches] = useState<MatchResponse[]>([]);
  const [livematches, setlivematches] = useState<MatchResponse[]>([]);
  const [Premierleague, setPremierleague] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'all' | 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1' | 'UEFA Champions League' | 'UEFA Europa League'>('all');

  // Fetch function — used on load AND when refresh is clicked
  const fetchMatches = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      footballApi.getAllMatches(),
      footballApi.getLivematches(),
      footballApi.getPremierleague()
    ])
      .then(([allRes, liveRes, PremierleagueRes]) => {
        setAllmatches(allRes.data.response);
        setlivematches(liveRes.data.response);
        setPremierleague(PremierleagueRes.data.response);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch matches");
        setLoading(false);
      });



  };

  // Run once when page loads
  useEffect(() => {
    fetchMatches();
  }, []);

  const controlBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  };

  const refreshButtonStyle: React.CSSProperties = {
    padding: '8px',
    color: '#22c55e',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.5 : 1,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const errorContainerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'center'
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '60px',
    paddingTop: '32px',
    borderTop: '1px solid #1a1a1a',
    textAlign: 'center'
  };

  return (
    <Layout>
      <Header />

      <div style={controlBarStyle}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <button
          onClick={fetchMatches}
          disabled={loading}
          style={refreshButtonStyle}
          title="Refresh scores"
        >
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-icon { animation: spin 1s linear infinite; }
          `}</style>
          <RefreshCw
            className={loading ? 'animate-spin-icon' : ''}
            style={{ width: '20px', height: '20px' }}
          />
        </button>
      </div>

      {error ? (
        <div style={errorContainerStyle}>
          <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#ef4444', margin: '0 0 4px 0' }}>
              Connection Error
            </h3>
            <p style={{ fontSize: '14px', color: '#888888', maxWidth: '300px', margin: '0 auto' }}>
              {error}
            </p>
          </div>
          <button
            onClick={fetchMatches}
            style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        // Shows live or all matches depending on which tab is active
        <MatchList matches={activeTab === 'live' ? livematches : activeTab === 'all' ? Allmatches : Premierleague} />
      )}

      <footer style={footerStyle}>
        <p style={{ color: '#555', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', margin: 0 }}>
          Powered by API-Football • Updated Real-time
        </p>
      </footer>
    </Layout>
  );
}