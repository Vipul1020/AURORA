const express = require('express');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecommendedJobs,
  getMyPostedJobs,

} = require('../controllers/jobController');
const { applyForJob } = require('../controllers/applicationController'); 
const { getJobApplicants } = require('../controllers/applicationController'); 
const { protect, restrictTo } = require('../middleware/authMiddleware'); 

const router = express.Router();


router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.get('/:id/recommendations', getRecommendedJobs); 

router.get('/my-postings/all', protect, restrictTo('recruiter'), getMyPostedJobs); 
router.get('/:jobId/applicants', protect, restrictTo('recruiter'), getJobApplicants); 

router.post('/', protect, restrictTo('recruiter'), createJob);

router.put('/:id', protect, restrictTo('recruiter'), updateJob); 
router.delete('/:id', protect, restrictTo('recruiter'), deleteJob); 
router.post('/:jobId/apply', protect, restrictTo('candidate'), applyForJob);

module.exports = router;