import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PickupListPDF from '../components/PickupListPDF';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PickupConfirmationModal from '../components/PickupConfirmationModal';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const [location] = useState({ lat: 6.9271, lng: 79.8612 });
  const [pickups, setPickups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [actionMode, setActionMode] = useState('confirm');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverPickups = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/pickups/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch pickups');
        }

        const data = await response.json();
        setPickups(data);
      } catch (error) {
        console.error('Error fetching pickups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverPickups();
  }, [navigate]);

  const handleConfirmPickup = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:5000/api/pickups/${currentPickup._id}/confirm`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to confirm pickup');
      }

      const updatedPickup = await response.json();
      setPickups(prev =>
        prev.map(pickup => pickup._id === updatedPickup._id ? updatedPickup : pickup)
      );
    } catch (error) {
      console.error('Error confirming pickup:', error);
    }
  };

  const handleCancelPickup = async (reason) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:5000/api/pickups/${currentPickup._id}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to cancel pickup');
      }

      const updatedPickup = await response.json();
      setPickups(prev =>
        prev.map(pickup => pickup._id === updatedPickup._id ? updatedPickup : pickup)
      );
    } catch (error) {
      console.error('Error canceling pickup:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1 container py-4">
        <h1 className="text-center text-primary fw-bold mb-4">Driver Dashboard</h1>
        
        <div className="mb-5">
          <MapComponent location={location} />
        </div>

        <div className="text-center mt-4">
          <PDFDownloadLink
            document={<PickupListPDF pickups={pickups} />}
            fileName="assigned_pickups.pdf"
          >
            {({ loading }) => (
              <button className="btn btn-danger px-4 py-2">
                {loading ? 'Generating PDF...' : "Download Pickup List"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        <div className="mt-4">
          {pickups.length === 0 ? (
            <p className="text-center">
              {new Date().getHours() < 18 
                ? "No pickups assigned to you today"
                : "No upcoming pickups scheduled"}
            </p>
          ) : (
            pickups.map((pickup) => (
              <div key={pickup._id} className="card mb-3 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">{pickup.user?.name || 'Customer'}</h5>
                    <p className="card-text mb-0">{pickup.address}</p>
                    <small className="text-muted">
                      Scheduled: {new Date(pickup.scheduledTime).toLocaleString()}
                    </small>
                    <br />
                    <small className={`badge ${pickup.status === 'assigned' ? 'bg-warning' : 'bg-success'}`}>
                      {pickup.status}
                    </small>
                  </div>
                  <div>
                    <button 
                      className="btn btn-success me-2"
                      onClick={() => {
                        setCurrentPickup(pickup);
                        setActionMode('confirm');
                        setShowModal(true);
                      }}
                      disabled={pickup.status !== 'assigned'}
                    >
                      ✓ Confirm
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setCurrentPickup(pickup);
                        setActionMode('cancel');
                        setShowModal(true);
                      }}
                      disabled={pickup.status !== 'assigned'}
                    >
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
      <PickupConfirmationModal
        show={showModal}
        onConfirm={handleConfirmPickup}
        onCancel={handleCancelPickup}
        onClose={() => setShowModal(false)}
        mode={actionMode}
      />
    </div>
  );
};

export default DriverDashboard;