import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './pages/Homepage';
import './styles.css'; // Importing the CSS file
import SchedulePickup from './pages/SchedulePickup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/schedulepickup" element={<SchedulePickup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
