import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import styles from './MoviePlayer.module.css'; // Make sure this file exists and is styled

const MoviePlayer = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

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

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!movie) {
    return <p style={{ textAlign: 'center' }}>Loading movie...</p>;
  }

  return (
    <div className={styles.videoContainer}>
      <img
        className={styles.videoLogo}
        src="/play_img.png"
        alt="Logo"
      />

      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlayPause}
          poster={movie.posterUrl || 'https://via.placeholder.com/1280x720.png?text=Movie+Poster'}
        >
          <source
            src={movie.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <button onClick={togglePlayPause} className={styles.playPauseBtn}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default MoviePlayer;
