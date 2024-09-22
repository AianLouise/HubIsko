import User from '../models/user.model.js'; // Adjust the import path as necessary

export const test = (req, res) => {
    res.json({
        message: 'API is working!',
    });
};

// Get user details by ID
export const getUserDetailsById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};