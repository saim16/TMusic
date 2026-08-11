import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';


const Logout = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const handleLogout = async () => {
        try {
            await axios.post(
                `https://tmusic-9k3n.onrender.com/auth/logout`,
                {},
                { withCredentials: true }
            );

            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <div>

        </div>
    )
}

export default Logout
