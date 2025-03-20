import express from 'express';
import {
  schedulePickup,
  assignPickup,
  updatePickupStatus,
  listPickups,
  optimizeRoute,
} from '../controllers/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/add', protect, schedulePickup);
router.post('/assign', protect, assignPickup);
router.post('/update-status', protect, updatePickupStatus);
router.get('/me', protect, listPickups);  // Driver-specific pickups
router.post('/optimize-route', protect, optimizeRoute);

router.get('/', protect, listPickups);

export default router;