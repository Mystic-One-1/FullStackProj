import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import styles from './MoviePlayer.module.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const MoviePlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const planMap = {
    Basic: '480p',
    Standard: '720p',
    Premium: '1080p',
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error('Failed to fetch movie', err);
        setError('Movie not found.');
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      setIsFullscreen(!!fullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.target.getBoundingClientRect();
    const clickPos = e.clientX - rect.left;
    const seekTime = (clickPos / rect.width) * video.duration;
    video.currentTime = seekTime;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!movie || !user) {
    return <p style={{ textAlign: 'center' }}>Loading movie...</p>;
  }

  const quality = planMap[user.subscriptionPlan] || '480p';
  const videoSrc = `/videos/${quality}.mp4`;

  return (
    <div className={styles.wrapper}>
      {/* ✅ Blurred Background Poster (only if not fullscreen) */}
      {!isFullscreen && (
        <div
          className={styles.backgroundPoster}
          style={{
            backgroundImage: `url(${movie.posterUrl || 'https://via.placeholder.com/1280x720.png?text=Movie+Poster'})`
          }}
        />
      )}


      <div className={styles.playerLayout}>
        {/* 🎬 VIDEO SECTION */}
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              poster={movie.posterUrl || 'https://via.placeholder.com/1280x720.png?text=Movie+Poster'}
              onClick={togglePlayPause}
              onTimeUpdate={handleTimeUpdate}
              className={styles.video}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className={styles.controls}>
              <button onClick={togglePlayPause}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <div className={styles.progressBar} onClick={handleSeek}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
              </div>

              <button onClick={toggleFullscreen}>⛶</button>
            </div>
          </div>
        </div>

        {/* 🎞️ MOVIE DETAILS SECTION */}
        <div className={styles.movieInfo}>
          <h2>{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          <p>{movie.synopsis}</p>
        </div>
      </div>

<div className={styles.backButton}>
  <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
</div>
    </div>
  );
};

export default MoviePlayer;
