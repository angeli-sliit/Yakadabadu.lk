import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';

// Register a new driver
export const registerDriver = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      birthday,
      nationality,
      employeeId,
      employeeType,
      nic,
      employeeStatus,
      joinedDate,
    } = req.body;

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ error: 'Driver already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = new Driver({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      birthday,
      nationality,
      employeeId,
      employeeType,
      nic,
      employeeStatus,
      joinedDate,
    });

    await driver.save();

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ driver, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login driver
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      driver: {
        id: driver._id,
        name: `${driver.firstName} ${driver.lastName}`,
        email: driver.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current authenticated driver's profile
export const getCurrentDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-password');
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const driverObj = driver.toObject();
    driverObj.fullName = `${driver.firstName} ${driver.lastName}`;

    res.status(200).json(driverObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await Driver.findById(driverId).select('-password');
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update driver details
export const updateDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updates = req.body;
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updates, {
      new: true,
    }).select('-password');
    if (!updatedDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(200).json(updatedDriver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const { driverId, lat, lng } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { currentLocation: { lat, lng } },
      { new: true }
    );
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a driver
export const deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const deletedDriver = await Driver.findByIdAndDelete(driverId);
    if (!deletedDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const driverId = req.user.id; // Assuming the driver is authenticated
    const { profilePicture } = req.body; // Base64-encoded image

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { profilePicture },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
