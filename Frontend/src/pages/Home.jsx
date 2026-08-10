import React from 'react'
import axios from 'axios'
import GetAllArtists from './AllArtists'
import GetTopArtists from '../components/artistsView/GetTopArtists'
import GetGenres from '../components/GetGenres'
import GetRecents from '../components/GetRecents'

const Home = () => {


    return (
        <div className='page'>
            <GetTopArtists />
            <GetGenres />
            <GetRecents />


        </div>
    )
}

export default Home
