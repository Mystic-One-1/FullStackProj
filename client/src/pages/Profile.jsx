import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css'; // 🔄 Add this line for external styling

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="profile-loading">🎬 Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">🎥 Welcome back, {user.name}!</h2>
        <p><span className="label">📧 Email:</span> {user.email}</p>
        <p><span className="label">🎭 Role:</span> {user.role}</p>
        <p><span className="label">📺 Plan:</span> {user.subscriptionPlan || 'None'}</p>
      </div>
    </div>
  );
};

export default Profile;
