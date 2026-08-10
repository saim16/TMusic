import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    // form elements
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Listener');
    const [otp, setOtp] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('https://ik.imagekit.io/tda3yj5sh/tmusic/userimages/image_1785654887568_tsDN9hX_6?updatedAt=1785654893575');

    // processing elements
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const previewImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessage('');

        if (!name || !username || !email || !password) {
            setMessage('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://tmusic-9k3n.onrender.com/auth/send-otp",
                { username, email },
                { withCredentials: true }
            );

            if (response.data.message === "You are already logged in") {
                navigate('/', { replace: true });
            }

            if (response.data.success) {
                setIsOtpSent(true);
                setMessage(response.data.message || 'OTP sent successfully to your email.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!otp) {
            setMessage('Please enter the OTP sent to your email.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('otp', otp);

            if (userImage) {
                formData.append('userimage', userImage);
            }

            const response = await axios.post(
                "https://tmusic-9k3n.onrender.com/auth/register",
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setMessage('Account created successfully!');
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <h1 className="heading">Register</h1>

            <p className={"message"}>{message}</p>

            <form className="auth-form" onSubmit={isOtpSent ? handleRegister : sendOTP}>

                <div className='user-image-div'>

                    <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className='user-image-preview'
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={previewImage}
                            disabled={isOtpSent}
                            id='hidden-upload'
                        />
                        <label htmlFor="hidden-upload">Upload Image</label>
                    </div>
                </div>
                <div className="user-input-div">

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isOtpSent}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={isOtpSent}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isOtpSent}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isOtpSent}
                        required
                    />

                    <div className="select-role-div">
                        Select Role
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isOtpSent}
                        >
                            <option value="Listener">Listener</option>
                            <option value="Artist">Artist</option>
                        </select>
                    </div>


                    {isOtpSent && (
                        <div className='enter-otp-div'>
                            <input
                                type="text"
                                placeholder="Enter 4-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="4"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setIsOtpSent(false)}
                            >
                                Edit Details
                            </button>
                        </div>
                    )}

                    <input
                        type="submit"
                        value={loading ? 'Processing...' : isOtpSent ? 'Verify OTP & Register' : 'Send OTP'}
                        disabled={loading}
                    />
                </div>

            </form>

            <p className='go-to-login'>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;