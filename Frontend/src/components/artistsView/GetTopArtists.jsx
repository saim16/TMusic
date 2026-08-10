import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const GetTopArtists = () => {

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getTopArtists();
    }, [])


    const getTopArtists = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/browse/top-artists`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setArtists(response.data.artists);
            }
        }
        catch (err) {
            console.error("Error fetching artists:", err);

            if (err.response.status === 401) {
                navigate('/login');
            }

            setError(err.response?.data?.message || "Failed to load artists.");
        } finally {
            setLoading(false);
        }
    }

    const handleArtistClick = async (artistId) => {
        // try {
        //     await axios.get(`http://localhost:3000/api/browse/profile/${artistId}`, {
        //         withCredentials: true
        //     });
        navigate(`/browse/profile/${artistId}`);
        // } catch (err) {
        //     console.error("Error fetching artist profile:", err);
        // }
    }

    const goToAllArtists = () => {
        navigate('/all-artists');
    }

    return (

        <div className='home-component' style={{ height: "35vh" }}>
            <h1 className='heading home-component-heading'>Artists</h1>
            {error && <p className="message">{error}</p>}
            {
                loading ? (
                    <div className="loading-text">Loading artists...</div>
                ) :
                    (
                        <div className="artist-grid-home-page">
                            {
                                artists.map((artist) => {
                                    return (<div className="artist-card-home-page" key={artist._id} onClick={() => handleArtistClick(artist._id)}>
                                        <img
                                            src={artist.userimage}
                                            alt={artist.name}
                                            className="artist-image-home-page"
                                        />
                                        <h3 className="artist-name-home-page">{artist.name}</h3>
                                        <p className="artist-followers-home-page">
                                            {artist.followers} {artist.followers === 1 ? 'follower' : 'followers'}
                                        </p>
                                    </div>)
                                })
                            }
                            <div className="see-all" onClick={goToAllArtists}>
                                <p className="text-indicator">All &gt;</p>
                            </div>
                        </div>)
            }
        </div>
    )
}

export default GetTopArtists;
