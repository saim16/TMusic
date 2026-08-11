import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState([]);
    const [savedSongs, setSavedSongs] = useState([]);
    const [queue, setQueue] = useState([]);
    const [currSong, setCurrSong] = useState(null);
    const [currQueueIndex, setCurrQueueIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isArtist, setIsArtist] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get("https://tmusic-9k3n.onrender.com/user/get-user", {
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
            const response = await axios.post(`https://tmusic-9k3n.onrender.com/stream/save/${songId}`, {}, {
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
            const response = await axios.patch(`https://tmusic-9k3n.onrender.com/api/browse/profile/${artistId}/follow`, {}, {
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

    const playSongFromList = (clickedSong, songs) => {
        setQueue(songs);

        const clickedSongIndex = songs.findIndex(song => song._id === clickedSong._id);
        if (clickedSongIndex === -1) return;

        setCurrQueueIndex(clickedSongIndex);
        playSong(clickedSong._id);
    };

    const playSong = async (songId) => {
        try {
            const response = await axios.get(`https://tmusic-9k3n.onrender.com/stream/play/${songId}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setCurrSong(response.data.song);
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Error playing song:", err);
        }
    };

    const togglePlayPause = () => {
        if (!currSong) return;
        setIsPlaying(prev => !prev);
    };

    const handleSongEnd = () => {
        const nextIndex = currQueueIndex + 1;
        if (nextIndex >= queue.length) {
            setIsPlaying(false);
            setCurrSong(null)
            return;
        }

        setCurrQueueIndex(currQueueIndex + 1);
        const nextSong = queue[nextIndex];
        playSong(nextSong._id);
    };

    const playPrevSong = (currSongId) => {
        let prevIndex = currQueueIndex - 1;
        if (prevIndex < 0) {
            prevIndex++;
        }
        else {
            setCurrQueueIndex(currQueueIndex - 1);
        }
        if (queue.length === 0) {
            playSong(currSongId);
            return;
        }
        const prevSong = queue[prevIndex];
        playSong(prevSong._id);
    }

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
            togglePlayPause,
            playSongFromList,
            handleSongEnd,
            playPrevSong,
            currQueueIndex
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);