import React, { useRef, useState, useEffect } from 'react';
import { useUser } from './Context/UserContext';
import './MusicPlayer.css'
import { Link } from 'react-router-dom'

const MusicPlayer = () => {
    const { currSong, isPlaying, togglePlayPause, setIsPlaying, queue, handleSongEnd, playPrevSong, currQueueIndex } = useUser();

    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!audioRef.current || !currSong) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => console.error("Playback error:", err));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currSong]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!currSong) return null;

    return (
        <div className="music-player-bar">
            <audio
                ref={audioRef}
                src={currSong.songUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            <div className="player-left">
                <img
                    src={currSong.songImageUrl || '/placeholder.png'}
                    alt={currSong.songTitle}
                    className="player-song-img"
                />
                <div className="player-song-details">
                    <span className="player-song-title">{currSong.songTitle || "Unknown Song"}</span>
                    <span className="player-song-artist">{currSong.artist?.name || "Unknown Artist"}</span>
                </div>
            </div>

            <div className="player-center">
                <div className="player-controls">
                    <button className="prev-btn control-btn" onClick={() => {
                        if (currQueueIndex === 0) {
                            if (audioRef.current) {
                                audioRef.current.currentTime = 0;
                                audioRef.current.play();
                            }
                            return;
                        }
                        playPrevSong(currSong._id)

                    }}>
                        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 5v14l-11-7zm-11 0v14H5V5z" />
                        </svg>

                    </button>
                    <button className="play-pause-btn control-btn" onClick={togglePlayPause}>
                        {isPlaying ? (
                            /* Pause Icon */
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            /* Play Icon */
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}



                    </button>
                    <button className="next-btn control-btn" onClick={handleSongEnd}>
                        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 5v14l11-7zm11 0v14h2V5z" />
                        </svg>
                    </button>
                </div>

                <div className="seekbar-container">
                    <span className="time">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="seekbar"
                    />
                    <span className="time">{formatTime(duration)}</span>
                </div>
            </div>

            {/* <div className="player-right"></div> */}
        </div>
    );
};

export default MusicPlayer;