import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const GetRecents = () => {
    const { playSong } = useUser();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getRecents();
    }, []);

    const getRecents = async () => {
        try {
            const response = await axios.get(`https://tmusic-9k3n.onrender.com/stream/recents`, {
                withCredentials: true
            });

            if (response.data.success) {
                setSongs(response.data.songs);
            }
        } catch (err) {
            console.error("Error fetching recents:", err);

            // Added optional chaining ?.
            if (err.response?.status === 401) {
                navigate('/login');
            }

            setError(err.response?.data?.message || "Failed to load recents.");
        } finally {
            setLoading(false);
        }
    };

    // Added missing click handler
    const handleSongClick = (songId) => {
        navigate(`/browse/song/${songId}`);
    };

    return (
        <div className='home-component' style={{ height: "35vh" }}>
            <h1 className='heading home-component-heading'>Recents</h1>
            {error && <p className="message">{error}</p>}

            {loading ? (
                <div className="loading-text">Loading recents...</div>
            ) : (
                <div className="song-grid-home-page">
                    {songs.length === 0 ? (
                        <p className="no-data">No recently played songs.</p>
                    ) : (
                        songs.map((song) => (
                            <div
                                key={song._id}
                                className="song-card-home-page"
                            >
                                <div className="song-image-div-home-page" onClick={(e) => playSong(song._id)}>
                                    <img
                                        src={song.songImageUrl}
                                        alt={song.songTitle}
                                        className="song-image-home-page"
                                    />
                                    <div className="play">
                                        ▶︎
                                    </div>
                                </div>

                                <h3 className="song-name-home-page">{song.songTitle}</h3>
                                <p className="song-artist">
                                    {song.artist?.name || "Unknown Artist"}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GetRecents;