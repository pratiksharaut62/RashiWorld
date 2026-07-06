'use client';

import { useState } from 'react';
import '@/styles/admin-login.css';
import { supabase } from '@/lib/supabaseClient';

const AdminLogin = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            setIsLoading(false);
            setError(authError.message || 'Access Denied: Invalid admin credentials.');
            return;
        }

        const userRole = data?.user?.user_metadata?.role;

        if (userRole === 'admin') {
            setIsLoading(false);
            onLoginSuccess();
        } else {
            await supabase.auth.signOut();
            setIsLoading(false);
            setError('Access Denied: You do not have administrator privileges.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-card">
                <h2 className="login-title">Admin Login</h2>

                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label>Admin Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-input"
                        placeholder="admin@rashi.com"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Authenticating...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
