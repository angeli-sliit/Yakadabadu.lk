import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [route, setRoute] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [driverRes, pickupRes] = await Promise.all([
          axios.get('http://localhost:5000/api/drivers', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/pickups', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setDrivers(driverRes.data);
        setPickups(pickupRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const assignDriver = async (pickupId, driverId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        'http://localhost:5000/api/pickups/assign',
        { pickupId, driverId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPickups(prev =>
        prev.map(p =>
          p._id === pickupId ? { ...p, driver: driverId, status: 'assigned' } : p
        )
      );
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  const optimizeRoute = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/pickups/optimize-route', {
        origin,
        destination
      });
      setRoute(res.data.optimizedRoute);
    } catch (error) {
      console.error('Error optimizing route:', error);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Assign Pickups Section */}
        <div className="mb-4">
          <h4>Assign Pickups</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Pickup Type</th>
                <th>Address</th>
                <th>Status</th>
                <th>Assigned Driver</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map(pickup => (
                <tr key={pickup._id}>
                  <td>{pickup.pickupType}</td>
                  <td>{pickup.address}</td>
                  <td>{pickup.status}</td>
                  <td>
                    <select
                      className="form-select"
                      onChange={e => assignDriver(pickup._id, e.target.value)}
                      value={pickup.driver || ''}
                    >
                      <option value="">Select Driver</option>
                      {drivers.map(driver => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Optimize Route Section */}
        <div className="mb-4">
          <h4>Optimize Route</h4>
          <div className="mb-2">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Origin"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
            <button className="btn btn-primary" onClick={optimizeRoute}>
              Optimize
            </button>
          </div>
          {route && (
            <div className="mt-4">
              <h5>Optimized Route Details</h5>
              <pre className="bg-white p-2 rounded">{JSON.stringify(route, null, 2)}</pre>
              <MapComponent route={route} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
