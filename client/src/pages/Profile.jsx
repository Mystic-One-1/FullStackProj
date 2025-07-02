import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : 'None';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="profile-loading-screen">
        <p className="profile-loading">⏳ Syncing your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-loading-screen">
        <p className="profile-loading">⚠️ User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <section className="profile-card">
        <h1 className="profile-title">🎥 Welcome, {user.name || 'Guest'}!</h1>

        <div className="profile-info">
          <p>
            <span className="label">📧 Email:</span> {user.email || '—'}
          </p>
          <p>
            <span className="label">🎭 Role:</span> {capitalize(user.role)}
          </p>
          <p>
            <span className="label">📺 Plan:</span>{' '}
            {capitalize(user.subscriptionPlan) || 'None'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Profile;
