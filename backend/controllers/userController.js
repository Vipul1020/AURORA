const User = require('../models/User');

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

const updateUserSkills = async (req, res) => {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
        return res.status(400).json({ message: 'Skills must be provided as an array.' });
    }
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cleanedSkills = [...new Set(skills.map(s => String(s).trim().toLowerCase()).filter(s => s))];
        user.skills = cleanedSkills;
        await user.save();
        console.log(`Skills updated for user ${userId}:`, cleanedSkills);
        res.status(200).json({ skills: user.skills });
    } catch (error) {
        console.error(`Error updating skills for user ${req.user.id}:`, error);
        res.status(500).json({ message: 'Server error updating skills' });
    }
};

module.exports = {
    getMyProfile,
    updateUserSkills,
};