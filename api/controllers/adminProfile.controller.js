import User from '../models/user.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Function to get provider details by ID
export const getProviderDetails = async (req, res) => {
    const { id } = req.params; // Extract provider ID from request parameters

    try {
        const provider = await User.findById(id); // Fetch provider details from User table using the ID

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' }); // Send 404 if provider not found
        }

        res.json(provider); // Send the fetched provider details as a JSON response
    } catch (error) {
        console.error('Error fetching provider details:', error);
        res.status(500).json({ message: 'Error fetching provider details' }); // Send an error response
    }
};