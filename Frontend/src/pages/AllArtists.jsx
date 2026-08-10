import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const AllArtists = () => {
    // const { following } = useUser();

    // setTimeout(() => {

    //     if (following) {
    //         console.log(following);
    //     }
    // }, 2000);
    const { isFollowing, toggleFollowArtist } = useUser();

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getArtists(page);
    }, [page]);

    const getArtists = async (currentPage) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://tmusic-9k3n.onrender.com/api/browse/all-artists?page=${currentPage}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setArtists(response.data.artists);
                setTotalPages(response.data.totalPages);
                setHasNextPage(response.data.hasNextPage);
                setHasPrevPage(response.data.hasPrevPage);
            }
        } catch (err) {
            console.error("Error fetching artists:", err);

            if (err.response.status === 401) {
                navigate('/login');
            }

            setError(err.response?.data?.message || "Failed to load artists.");
        } finally {
            setLoading(false);
        }
    };

    const handleArtistClick = async (artistId) => {
        try {
            await axios.get(`https://tmusic-9k3n.onrender.com/api/browse/profile/${artistId}`, {
                withCredentials: true
            });
            navigate(`/browse/profile/${artistId}`);
        } catch (err) {
            console.error("Error fetching artist profile:", err);
        }
    };

    return (
        <div className='page'>
            <h1 className="heading">Artists</h1>

            {error && <p className="message error">{error}</p>}

            {loading ? (
                <div className="loading-text">Loading artists...</div>
            ) : (
                <>
                    <div className="artist-grid">
                        {artists.map((artist) => (
                            <div
                                key={artist._id}
                                className="artist-card"
                                onClick={() => handleArtistClick(artist._id)}
                            >
                                <img
                                    src={artist.userimage}
                                    alt={artist.name}
                                    className="artist-image"
                                />
                                <div className="artist-info">
                                    <h3 className="artist-name">{artist.name}</h3>
                                    <p className="artist-followers">
                                        <span className="follower-count">{artist.followers}</span>
                                        {artist.followers === 1 ? ' follower' : ' followers'}
                                    </p>
                                </div>
                                <div className="follow-artist-div" onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFollowArtist(artist._id)
                                }}>
                                    {isFollowing(artist._id) ? "Followed" : "Follow"}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={!hasPrevPage || loading}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            &larr; Previous
                        </button>

                        <span className="page-info">
                            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
                        </span>

                        <button
                            className="pagination-btn"
                            disabled={!hasNextPage || loading}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next &rarr;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllArtists;