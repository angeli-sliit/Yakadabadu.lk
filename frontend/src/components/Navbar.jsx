import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#144A20' }} className="navbar navbar-expand-md navbar-light">
      <div className="container">
        {/* Brand/Logo on the left */}
         <img src={logo} alt="Logo" style={{ width: '80px', height: '40px', marginRight: '20px' }} />

        {/* Toggle button for mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* ms-auto pushes links to the right */}
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/Schedulepickup">Reduce</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/reuse">Reuse</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/recycle">Recycle</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-white" to="/signin">Sign In</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;