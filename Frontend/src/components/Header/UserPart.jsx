import React from 'react'
import { useUser } from '../../Context/UserContext'
import StatsIcon from '../icons/StatsIcon'
import { Link } from 'react-router-dom'
import CreateIcon from '../icons/CreateIcon'


const UserPart = () => {
    const { isArtist } = useUser();

    const { user } = useUser();
    // console.log(user);
    if (!user) {
        return <div className="user-part">Loading...</div>; // or return null;
    }


    return (
        <div className='user-part'>
            <div className="tool-bar">

                {isArtist ? <Link to="/artist-centre"> <CreateIcon /> </Link> : null}

                <Link to="/user/analytics"> <StatsIcon /> </Link>
                <Link to="/user/saved-songs">

                    <svg className="w-6 h-6 text-gray-800 dark:text-white saved-songs" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />

                    </svg>
                </Link>

            </div>
            <h3 className='user-name'>{user.name}</h3>
            <div className="user-image-and-menu-div">

                <img src={user.userimage} alt="" className="user-image" />
                <div className="menu">
                    {isArtist ? <Link to="/artist-centre"><h3>Artist Centre</h3></Link> : null}
                    <Link to="/user/analytics"><h3>Stats</h3></Link>
                    <Link to="/user/saved-songs"><h3>Saved Songs</h3></Link>
                </div>
            </div>

        </div>
    )
}

export default UserPart
