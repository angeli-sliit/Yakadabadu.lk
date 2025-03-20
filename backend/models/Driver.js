import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String }, // Optional field
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  nationality: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  employeeType: { type: String, enum: ['Permanent', 'Contract', 'Trainee'], required: true },
  nic: { type: String, unique: true, required: true },
  employeeStatus: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  joinedDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['available', 'on-route', 'unavailable'], 
    default: 'available' 
  },
  currentLocation: { lat: Number, lng: Number },
  profilePicture: { type: String } // Optional field for profile picture
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;