import React from 'react'
import { useNavigate } from 'react-router-dom';

const GetGenres = () => {
    const ALLOWED_GENRES = [
        "Pop", "Hip-Hop", "Rock", "R&B",
        "Indie", "Classical", "Jazz", "Country", "Other"
    ];
    const navigate = useNavigate();
    const handleGenreClick = (genre) => {
        navigate(`/browse/genres/${genre}`);
    }

    return (
        <div className='home-component'>
            <h1 className='heading home-component-heading'>Genres</h1>
            <div className="genre-grid">

                {
                    ALLOWED_GENRES.map((genre, index) => {
                        return <div className="genre-card" key={index} onClick={() => handleGenreClick(genre)}>
                            <h3 className="genre-name">{genre}</h3>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default GetGenres
