import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ArtistCentre.css';
import { Link } from 'react-router-dom'

const ArtistCentre = () => {
    const [streams, setStreams] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getTotalStreams = async () => {
        const response = await axios.get("http://localhost:3000/artist/total-streams", {
            withCredentials: true
        });

        setStreams(response.data.streams);
        setFollowers(response.data.followers);
    };

    const getPopularSongs = async () => {
        const response = await axios.get("http://localhost:3000/artist/popular-songs", {
            withCredentials: true
        });

        setSongs(response.data.songs || response.data);
    };

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            await Promise.all([getTotalStreams(), getPopularSongs()]);
        } catch (err) {
            console.error("Error fetching artist data:", err);
            setError("Failed to fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) {
        return <div className="page">Loading...</div>;
    }

    if (error) {
        return <div className="page">{error}</div>;
    }

    return (
        <div className="page">

            <div className="artist-centre-component">
                <h1 className='heading home-component-heading'>Create</h1>
                <div className="artist-centre-component-info">
                    <h3>Publish song &rarr;</h3>
                    <p className="more-info">Share Your New Song With The World!</p>
                    <button className="go-to-upload-song">
                        <Link style={{ color: "white", textDecoration: "none" }} to="/artist-centre/publish">Publish Now!</Link>
                    </button>
                </div>
            </div>

            <div className="artist-centre-component">
                <h1 className='heading home-component-heading'>Stats</h1>
                <div className="artist-centre-component-info">
                    <h3>Total Streams: {streams}</h3>
                    <h3>Total Followers: {followers}</h3>
                </div>
            </div>

            <div className="artist-centre-component">
                <h1 className='heading home-component-heading'>Popular Songs</h1>
                <div className="artist-centre-component-info">
                    {songs.length === 0 ? (
                        <p className="more-info">No songs found.</p>
                    ) : (
                        songs.map((song) => (
                            <div key={song._id} className="song-card">
                                <h3>{song.songTitle || song.title}</h3>
                                <p className="more-info">{song.streams || 0} streams</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div >
    );
};

export default ArtistCentre;