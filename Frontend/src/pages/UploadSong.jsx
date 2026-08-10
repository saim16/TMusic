import React, { useState } from 'react'
import './UploadSong.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadSong = () => {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [songTitle, setSongTitle] = useState("");
    const [genre, setGenre] = useState("Pop");
    const [song, setSong] = useState(null);
    const [songImage, setSongImage] = useState(null);
    const [songImagePreview, setSongImagePreview] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPUwqzEdGZBWtJKrP81Zh-LmXb_kHb6MMPgV67UceURnF2Jh_DmID5l24&s=10");

    const uploadSongImage = (e) => {
        const file = e.target.files[0];
        setSongImage(file);
        setSongImagePreview(URL.createObjectURL(file));
    }
    const uploadSongAudio = (e) => {
        const file = e.target.files[0];
        setSong(file);
    }

    const navigate = useNavigate();

    const handleSongUpload = async (e) => {
        e.preventDefault();

        if (!songTitle || !genre || !song || !songImage) {
            setMessage('Please fill in all required fields.');
            return;
        }

        setMessage('');

        setLoading(true);

        const formData = new FormData();
        formData.append('songTitle', songTitle);
        formData.append('genre', genre);
        formData.append('song', song);
        formData.append('songImage', songImage);

        try {
            const response = await axios.post("http://localhost:3000/artist/publish-song", formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                setMessage('Song Published successfully!');
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }

            setMessage(error.response?.data?.message || 'Failed to upload song. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='page auth-page'>

            <p className="message">{message}</p>

            <h1 className="heading">Publish Song</h1>

            <form className="auth-form upload-song-form" onSubmit={(e) => handleSongUpload(e)}>

                <div className="upload-image-and-song-div">

                    <div className="upload-song-image-div">
                        <img src={songImagePreview} alt="" className="upload-song-image" />
                        <label htmlFor="upload-song-image-input">Upload Cover Image</label>
                        <input type="file" accept="image/*" id='upload-song-image-input' required onChange={uploadSongImage} />
                    </div>

                    <div className="upload-song-div">
                        <label htmlFor="upload-song-file">Upload Song</label>
                        <input type="file" id="upload-song-file" accept='audio/*' required onChange={uploadSongAudio} />
                    </div>
                </div>


                <div className="upload-song-info-div">
                    <input type="text" placeholder='Enter Song Name' onChange={(e) => setSongTitle(e.target.value)} />
                    <select onChange={e => setGenre(e.target.value)}>
                        <option value="Pop">Pop</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                        <option value="Rock">Rock</option>
                        <option value="R&B">R&B</option>
                        <option value="Indie">Indie</option>
                        <option value="Classical">Classical</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Country">Country</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="submit" value={loading ? "Publishing..." : "Publish"} disabled={loading ? true : false} className='upload-song-submit-btn' />
                </div>

            </form>
        </div>
    )
}

export default UploadSong
