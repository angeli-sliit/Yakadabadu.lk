import express from 'express';
import {
  registerDriver,
  loginDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  updateDriverLocation,
  uploadProfilePicture,
  getCurrentDriver // Add this import
} from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerDriver);
router.post('/login', loginDriver);

router.get('/me', protect, getCurrentDriver); // New route to get current driver's details
router.get('/', protect, getDrivers);
router.get('/:id', protect, getDriverById);

router.put('/:id', protect, updateDriver);
router.delete('/:id', protect, deleteDriver);

// Add the update-location route
router.post('/update-location', protect, updateDriverLocation);

// Add the upload-profile-picture route
router.post('/upload-profile-picture', protect, uploadProfilePicture);

export default router;
