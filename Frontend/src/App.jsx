import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Navbar from './components/Header/Navbar'
import './App.css'
import Login from './pages/Login'
import AllArtists from './pages/AllArtists'
import GenreSongs from './pages/GenreSongs'
import SavedSongs from './pages/SavedSongs'
import ArtistPage from './pages/ArtistPage'
import ArtistSongs from './pages/ArtistSongs'
import Analytics from './pages/Analytics'
import MusicPlayer from './MusicPlayer'
import ArtistCentre from './pages/ArtistCentre'
import UploadSong from './pages/UploadSong'
import { useUser } from './Context/UserContext'


const App = () => {
  const { togglePlayPause } = useUser();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        togglePlayPause();
        console.log("pressing space");
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/register' element=<Register /> />
        <Route path='/login' element=<Login /> />

        <Route path="/" element=<Home /> />
        <Route path="/all-artists" element=<AllArtists /> />
        <Route path="/browse/genres/:genreName" element=<GenreSongs /> />
        <Route path="/browse/profile/:artistId" element=<ArtistPage /> />
        <Route path="/browse/profile/:artistId/songs" element=<ArtistSongs /> />
        <Route path="/user/saved-songs" element=<SavedSongs /> />
        <Route path="/user/analytics" element=<Analytics /> />

        <Route path="/artist-centre/" element=<ArtistCentre /> />
        <Route path="/artist-centre/publish" element=<UploadSong /> />


      </Routes>
      <MusicPlayer />
    </div>
  )
}

export default App
