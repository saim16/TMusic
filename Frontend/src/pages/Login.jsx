import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    // form elements
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // processing elements
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!username || !password) {
            setMessage('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://tmusic-9k3n.onrender.com/auth/login",
                { username, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                setMessage('Logged in successfully!');
                setUser(response.data.user);
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            }
        } catch (error) {

            if (error.response.data.message === "You are already logged in") {
                navigate('/', { replace: true });
            }

            setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <h1 className="heading">Login</h1>

            <p className={"message"}>{message}</p>

            <form className="auth-form auth-form-login" onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="submit"
                    value={loading ? 'Processing...' : 'Login'}
                    disabled={loading}
                />


            </form>

            <p className='go-to-login'>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;