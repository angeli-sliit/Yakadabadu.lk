// frontend/src/pages/Home.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const driverName = localStorage.getItem('driverName');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="container flex-grow-1 py-5">
        <h1 className="text-center text-primary fw-bold mb-3">
          Welcome {driverName || 'Driver'}!
        </h1>
        
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            onClick={() => navigate('/driver-dashboard')}
            className="btn btn-success px-4 py-2"
          >
            Today's Pickup
          </button>
          <button
            onClick={() => navigate('/driver-profile')}
            className="btn btn-primary px-4 py-2"
          >
            User Profile
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;