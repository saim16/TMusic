import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState([]);
    const [savedSongs, setSavedSongs] = useState([]);
    const [currSong, setCurrSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/user/get-user", {
                withCredentials: true
            });

            if (response.data.success) {
                const fetchedUser = response.data.user;
                setUser(fetchedUser);
                setFollowing(response.data.user.following || []);
                setSavedSongs(response.data.user.savedSongs || []);
                if (fetchedUser.role == "Artist") {
                    setIsArtist(true);
                }
            }
            return response.data.user;

        } catch (err) {
            console.error("Failed to load user data:", err);

            if (err.response?.status === 401) {
                navigate('/login');
            }
            setUser(null);
        }
    };

    const isSaved = (songId) => {
        if (!songId || !savedSongs) return false;
        return savedSongs.some(item => {
            const id = typeof item === 'object' ? item._id : item;
            return String(id) === String(songId);
        });
    };

    // Accepts either a song object or songId
    const toggleSaveSong = async (songInput) => {
        const songId = typeof songInput === 'object' ? songInput._id : songInput;
        const currentlySaved = isSaved(songId);

        setSavedSongs(prev =>
            currentlySaved
                ? prev.filter(item => (typeof item === 'object' ? item._id !== songId : item !== songId))
                : [...prev, songInput]
        );

        try {
            const response = await axios.post(`http://localhost:3000/stream/save/${songId}`, {}, {
                withCredentials: true
            });

            if (response.data.success) {
                await fetchUser();
            }

        } catch (err) {
            console.error("Error toggling save song:", err);
            fetchUser();
        }
    };


    const isFollowing = (artistId) => {
        if (!artistId || !following) return false;
        return following.some(item => {
            const id = typeof item === 'object' ? item._id : item;
            return String(id) === String(artistId);
        });
    };

    const toggleFollowArtist = async (artistInput) => {
        const artistId = typeof artistInput === 'object' ? artistInput._id : artistInput;
        const currentlyFollowing = isFollowing(artistId);

        setFollowing(prev =>
            currentlyFollowing
                ? prev.filter(item => (typeof item === 'object' ? item._id !== artistId : item !== artistId))
                : [...prev, artistInput]
        );

        try {
            const response = await axios.patch(`http://localhost:3000/api/browse/profile/${artistId}/follow`, {}, {
                withCredentials: true
            });

            if (response.data.success) {
                await fetchUser();
            }

        } catch (err) {
            console.error("Error toggling follow artist:", err);
            fetchUser();
        }
    };

    const playSong = async (songId) => {
        try {
            const response = await axios.get(`http://localhost:3000/stream/play/${songId}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setCurrSong(response.data.song);
                setIsPlaying(true);
            }

        } catch (err) {
            console.error("Error toggling follow artist:", err);
            fetchUser();
        }
    }

    const togglePlayPause = () => {
        if (!currSong) return;
        setIsPlaying(prev => !prev);
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            following,
            savedSongs,
            fetchUser,
            isArtist,
            isSaved,
            toggleSaveSong,
            isFollowing,
            toggleFollowArtist,
            playSong,
            isPlaying,
            currSong,
            togglePlayPause
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);