// controllers/locationController.js
import Location from '../models/location.model.js';

// Save location
export const saveLocation = async (req, res) => {
  try {
    const { userId, location } = req.body;

    // Check if location for this user already exists
    let userLocation = await Location.findOne({ userId });

    if (userLocation) {
      // Update existing location
      userLocation.region = location.region;
      userLocation.province = location.province;
      userLocation.city = location.city;
      userLocation.barangay = location.barangay;
      await userLocation.save();
    } else {
      // Create a new location record
      userLocation = new Location({
        userId,
        region: location.region,
        province: location.province,
        city: location.city,
        barangay: location.barangay,
      });
      await userLocation.save();
    }

    res.status(200).json({ message: 'Location saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save location' });
  }
};

// Get location
export const getLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const userLocation = await Location.findOne({ userId });

    if (!userLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ location: userLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch location' });
  }
};
