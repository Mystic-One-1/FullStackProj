import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserDetails.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const UserDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      toast.error('❌ Failed to load user');
    }
  };

  const handleBanToggle = () => {
    confirmAlert({
      title: `${user.banned ? 'Unban' : 'Ban'} User`,
      message: `Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const route = user.banned ? 'unban' : 'ban';
              await API.patch(`/users/${id}/${route}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
              });
              toast.success(`✅ User ${user.banned ? 'unbanned' : 'banned'}`);
              fetchUser();
            } catch (err) {
              toast.error('❌ Action failed');
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleDelete = () => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure you want to permanently delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await API.delete(`/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              toast.success('✅ User deleted');
              navigate('/admin/users');
            } catch (err) {
              toast.error('❌ Delete failed');
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-details-container">
      <h2>👤 User Details</h2>
      <div className="user-details-box">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Plan:</strong> {user.subscriptionPlan}</p>
        <p><strong>Status:</strong> {user.banned ? '🚫 Banned' : '✅ Active'}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="user-actions">
        <button onClick={handleBanToggle} className={user.banned ? 'unban-btn' : 'ban-btn'}>
          {user.banned ? 'Unban User' : 'Ban User'}
        </button>
        <button onClick={handleDelete} className="delete-btn">
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
