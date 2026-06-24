import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else {
                setMessage("Account created successfully!  Please check your email for verification instructions.");
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
            } else {
                setMessage("Logged in successfully!");
            }
        }

        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) {
            setError(error.message);
        }
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '500px',
        margin: '50px auto',
        padding: '24px',
        backgroundColor: '#111111',
        borderRadius: '12px',
        border: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 12px',
        backgroundColor: '#000000',
        border: '1px solid #333333',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Bebas Neue',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px',
        backgroundColor: '#22c55e',
        color: '#000000',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontFamily: 'Bebas Neue',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
    };

    const googleButtonStyle: React.CSSProperties = {
        padding: '10px',
        backgroundColor: '#ffffff',
        color: '#000000',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontFamily: 'Bebas Neue',
        cursor: 'pointer',
    };

    const linkStyle: React.CSSProperties = {
        color: '#22c55e',
        fontSize: '13px',
        cursor: 'pointer',
        textAlign: 'center',
        fontFamily: 'Bebas Neue',
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ color: '#ffffff', fontFamily: 'Bebas Neue', margin: 0, textAlign: 'center' }}>
                {isSignUp ? 'Create Account' : 'Log In'}
            </h2>

            <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                    minLength={6}
                />
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', margin: 0 }}>{error}</p>}
            {message && <p style={{ color: '#22c55e', fontSize: '13px', textAlign: 'center', margin: 0 }}>{message}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#444444', fontSize: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a1a' }} />
                OR
                <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a1a' }} />
            </div>

            <button onClick={handleGoogleLogin} style={googleButtonStyle}>
                Continue with Google
            </button>

            <p style={linkStyle} onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </p>
        </div>
    );
}