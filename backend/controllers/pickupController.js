import Pickup from '../models/Pickup.js';
import { getOptimizedRoute } from '../utils/googleMaps.js';
import Driver from '../models/Driver.js';


// Optimize route using Google Maps API
export const optimizeRoute = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const optimizedRoute = await getOptimizedRoute(origin, destination);
    res.status(200).json({ optimizedRoute });
  } catch (err) {
    res.status(500).json({ error: 'Failed to optimize route: ' + err.message });
  }
};

// Schedule a pickup
export const schedulePickup = async (req, res) => {
  try {
    const { user, address, pickupType, scheduledTime } = req.body;
    const pickup = new Pickup({ user, address, pickupType, scheduledTime });
    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Assign a pickup to a driver
export const assignPickup = async (req, res) => {
  try {
    const { pickupId, driverId } = req.body;
    
    const pickup = await Pickup.findById(pickupId);
    const driver = await Driver.findById(driverId);
    const user = await User.findById(pickup.user); // Add this line

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Rest of your existing code
    pickup.driver = driverId;
    pickup.status = 'assigned';
    await pickup.save();
    
    res.status(200).json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update pickup status
export const updatePickupStatus = async (req, res) => {
  try {
    const { pickupId, status } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ error: "Pickup not found" });

    pickup.status = status;
    await pickup.save();
    res.status(200).json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all pickups
export const listPickups = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = req.originalUrl.includes('/me') ? {
      driver: req.user._id,
      scheduledTime: { $gte: today },
      status: 'assigned'
    } : {};

    const pickups = await Pickup.find(filter)
      .populate('driver', 'firstName lastName')
      .populate('user', 'name');

    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOptimizedRoute = async (origin, destination) => {
  const googleMapsClient = new google.maps.Client({ key: process.env.GOOGLE_MAPS_API_KEY });
  try {
    const response = await googleMapsClient.directions({
      origin,
      destination,
      travelMode: 'DRIVING',
    });
    return response.routes[0].legs;
  } catch (err) {
    throw new Error('Failed to get optimized route: ' + err.message);
  }
};
