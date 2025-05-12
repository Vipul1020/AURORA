const express = require('express');
const { getMyProfile, updateUserSkills } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.use(protect);

router.get('/me', getMyProfile); 
router.put('/me/skills', updateUserSkills); 


module.exports = router;