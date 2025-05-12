const express = require('express');
const { applyForJob, getMyApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/me', protect, restrictTo('candidate'), getMyApplications);

router.put('/:applicationId/status', protect, restrictTo('recruiter'), updateApplicationStatus); 

module.exports = router;