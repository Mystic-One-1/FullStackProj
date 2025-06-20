import React from 'react';
import { useParams } from 'react-router-dom';

const MoviePlayer = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎬 Playing Movie ID: {id}</h2>
      <video width="640" height="360" controls autoPlay>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>This is a placeholder video.</p>
    </div>
  );
};

export default MoviePlayer;
