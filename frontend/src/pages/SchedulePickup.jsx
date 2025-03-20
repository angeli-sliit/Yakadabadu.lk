import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Logo from '../images/schedule.jpg'; // Replace with your own image

const URL = "http://localhost:4000/appointments"; // Replace with your actual API endpoint

function SchedulePickup() {
  const [pickup, setPickup] = useState({
    itemType: '',
    scale: '',
    image: null,
    customerName: '',
    contactNumber: '',
    address: '',
    pickupDate: '',
    returnOption: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPickup((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPickup((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(pickup).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to schedule pickup");

      console.log('Pickup scheduled:', await response.json());
      setSuccess(true);
      setPickup({
        itemType: '',
        scale: '',
        image: null,
        customerName: '',
        contactNumber: '',
        address: '',
        pickupDate: '',
        returnOption: '',
      });
    } catch (err) {
      setError('Error scheduling pickup. Please try again.');
      console.error("Error:", err.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 5 }}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, maxWidth: 900, backgroundColor: '#FFFFFF' }}>
        <Grid container spacing={4} alignItems="stretch" sx={{ height: '128vh' }}>

            {/* Left Column: Image Section */}
{/* Left Column: Image Section */}
<Grid item xs={12} sm={5} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    width: '100%',
    height: '100%', // Ensure it takes full height
    minHeight: '400px', // Adjust this if needed
    padding: 2
  }}>
    <img 
      src={Logo} 
      alt="Yakadabadu.lk" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' // Ensures the image fills the space without distortion
      }} 
    />
  </Box>
</Grid>


            {/* Right Column: Form Section */}
            <Grid item xs={12} sm={7}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333333' }}>
                Schedule Pickup
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: 2, color: '#777777' }}>
                We help you with your waste management!
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {/* Item Type */}
                <InputLabel sx={{ color: '#333333' }}>Item Type</InputLabel>
                <Select
                  fullWidth
                  name="itemType"
                  value={pickup.itemType}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                >
                  <MenuItem value="metal">Metal</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="wood">Wood</MenuItem>
                </Select>

                {/* Scale */}
                <InputLabel sx={{ color: '#333333' }}>Scale</InputLabel>
                <Select
                  fullWidth
                  name="scale"
                  value={pickup.scale}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                >
                  <MenuItem value="small">Small (Less than 5kg)</MenuItem>
                  <MenuItem value="medium">Medium (5-10kg)</MenuItem>
                  <MenuItem value="large">Large (10-20kg)</MenuItem>
                  <MenuItem value="extra-large">Extra Large (Above 20kg)</MenuItem>
                </Select>

                {/* Image Upload */}
                <InputLabel sx={{ color: '#333333' }}>Upload Image</InputLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'block', marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                />

                {/* Customer Name */}
                <TextField
                  fullWidth
                  placeholder="Customer Name"
                  variant="outlined"
                  name="customerName"
                  value={pickup.customerName}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                />

                {/* Contact Number */}
                <TextField
                  fullWidth
                  placeholder="Contact Number"
                  variant="outlined"
                  name="contactNumber"
                  value={pickup.contactNumber}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                />

                {/* Address */}
                <TextField
                  fullWidth
                  placeholder="Address"
                  variant="outlined"
                  name="address"
                  value={pickup.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                />

                {/* Preferred Pickup Date */}
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  name="pickupDate"
                  value={pickup.pickupDate}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                />

                {/* Return Option */}
                <InputLabel sx={{ color: '#333333' }}>What do you want in return?</InputLabel>
                <Select
                  fullWidth
                  name="returnOption"
                  value={pickup.returnOption}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2, backgroundColor: '#FFFFFF', borderRadius: 2 }}
                >
                  <MenuItem value="broom">Broom</MenuItem>
                  <MenuItem value="basin">Basin</MenuItem>
                  <MenuItem value="cash">Cash (Amount depends on the item scale)</MenuItem>
                  <MenuItem value="nothing">I want nothing—just take these and leave</MenuItem>
                </Select>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    paddingY: 1.5,
                    borderRadius: 2,
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Schedule Pickup
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default SchedulePickup;
