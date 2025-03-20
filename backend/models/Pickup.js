import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  pickupType: { 
    type: String, 
    required: true 
  },
  scheduledTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'completed', 'cancelled'],
    default: 'pending' 
  },
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver' 
  }
}, { 
  timestamps: true 
});

const Pickup = mongoose.model('Pickup', pickupSchema);
export default Pickup;