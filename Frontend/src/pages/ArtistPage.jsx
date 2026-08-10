import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../Context/UserContext';
import './ArtistPage.css'

const ArtistPage = () => {
    const { artistId } = useParams();
    const navigate = useNavigate();
    const { isFollowing, toggleFollowArtist, isSaved, toggleSaveSong, playSong } = useUser();

    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchArtistData();
    }, [artistId]);

    const fetchArtistData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`http://localhost:3000/api/browse/profile/${artistId}`, { withCredentials: true });

            if (res.data.success) {
                setArtist(res.data.artist);
                setSongs(res.data.songs);
            }
        } catch (err) {
            console.error("Error loading artist profile:", err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
            setError("Failed to load artist details.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAllSongs = () => {

        navigate(`/browse/profile/${artistId}/songs`)
    };

    if (loading && !artist) {
        return (
            <div className="page">
                <div className="loading-text">Loading artist profile...</div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="page">
                <p className="message">{error || "Artist not found."}</p>
            </div>
        );
    }

    const following = isFollowing(artist._id);

    return (
        <div className="page artist-page">
            {/* Artist Header / Banner */}
            <div className="artist-header">
                <img
                    src={artist.userimage || '/default-avatar.png'}
                    alt={artist.name}
                    className="artist-avatar"
                />
                <div className="artist-info">
                    <span className="verified-badge">Verified Artist</span>
                    <h1 className="artist-name-profile">{artist.name} <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd" />
                    </svg>
                    </h1>

                    <button
                        className={`follow-btn ${following ? 'following' : ''}`}
                        onClick={() => toggleFollowArtist(artist)}
                    >
                        {following ? 'Following' : 'Follow'}
                    </button>
                </div>
            </div>

            <div className="artist-songs-section">
                <h2 className="heading">
                    Popular Songs
                </h2>

                <div className="song-grid">
                    {songs.length === 0 ? (
                        <p className="no-data">No songs uploaded yet.</p>
                    ) : (
                        songs.map((song) => {
                            const saved = isSaved(song._id);

                            return (
                                <div key={song._id} className="song-card">
                                    <div className="song-image-div" onClick={(e) => playSong(song._id)}>
                                        <img
                                            src={song.songImageUrl}
                                            alt={song.songTitle}
                                            className="song-image"
                                        />
                                        <div className="play">
                                            <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="song-info">
                                        <h3 className="song-title">{song.songTitle}</h3>
                                        <p className="song-streams">{song.streams || 0} streams</p>
                                    </div>

                                    {/* Like Button */}
                                    <div
                                        className="save-song-div"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaveSong(song);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {saved ? (
                                            <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {songs.length > 0 && (
                    <div className="see-all-container">
                        <button className="see-all-btn" onClick={handleToggleAllSongs}>
                            See All Songs
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistPage;