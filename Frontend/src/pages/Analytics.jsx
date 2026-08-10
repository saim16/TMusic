import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const Analytics = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        getTop50Songs();
    }, []);

    const getTop50Songs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/user/analytics`, {
                withCredentials: true
            });

            if (response.data.success) {
                setSongs(response.data.songs);
            }
        } catch (err) {
            console.error("Error fetching most played songs:", err);

            if (err.response?.status === 401) {
                navigate('/login');
            }

            setError(err.response?.data?.message || `Failed to load songs.`);
        } finally {
            setLoading(false);
        }
    };

    const { isSaved, toggleSaveSong, playSong } = useUser();
    if (!isSaved || !toggleSaveSong) {
        return <h3>Loading...</h3>
    }


    return (
        <div className='page'>
            <h1 className="heading" style={{ textTransform: 'capitalize' }}>
                Your most played Songs
            </h1>

            {error && <p className="message">{error}</p>}

            {loading ? (
                <div className="loading-text">Loading songs...</div>
            ) : (
                <>
                    <div className="song-grid">
                        {songs.length === 0 ? "No songs." : songs.map((item) => (
                            <div
                                key={item.song._id}
                                className="song-card"
                            >
                                <div className="song-image-div" onClick={(e) => playSong(item.song._id)}>
                                    <img
                                        src={item.song.songImageUrl}
                                        alt={item.song.songTitle}
                                        className="song-image"
                                    />
                                    <div className="play">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
                                        </svg>

                                    </div>
                                </div>
                                <div className="song-info">
                                    <h3 className="song-title">{item.song.songTitle}</h3>
                                    <p className="song-artist">
                                        {item.song.artist?.name}
                                    </p>
                                    <p className="song-streams">
                                        {item.streams} times played
                                    </p>
                                </div>
                                <div className="save-song-div"
                                    onClick={(e) => {

                                        if (toggleSaveSong) toggleSaveSong(item.song._id);
                                    }}>
                                    {isSaved(item.song._id)}
                                    {isSaved(item.song._id) ? <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                    </svg>
                                        : <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                        </svg>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>

                </>
            )}
        </div>
    );
};

export default Analytics;