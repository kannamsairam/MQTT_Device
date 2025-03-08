// For react

const User = require('../models/userModel');

const loginWithUUID = async (req, res) => {
    try {
        const { userUUID } = req.body;

        if (!userUUID) {
            return res.status(400).json({ message: 'User UUID is required' });
        }

        // Find user by UUID
        const user = await User.findOne({ uuid: userUUID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Login successful',
            user: {   
                userUUID: user.uuid,
                userName: user.userName,
                mobile: user.mobile,
                organization: user.Organization
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { loginWithUUID };
