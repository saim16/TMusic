import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const LogoPart = () => {
    return (
        <div className='logo-part'>
            <img src={logo} alt="" className='logo' />
            <Link to="/">
                <h3 className='logo-text'>TMUSIC</h3>
            </Link>

        </div>
    )
}

export default LogoPart
