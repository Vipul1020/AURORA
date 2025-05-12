const Job = require('../models/Job');
const axios = require('axios');
const User = require('../models/User');
const { Op } = require("sequelize");

const createJob = async (req, res) => {
  const {
      title, description, location, jobType, companyName,
      salaryMin, salaryMax, salaryCurrency, salaryPeriod, experienceLevel
     } = req.body;
  const recruiterId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  let newJob;

  try {
    newJob = await Job.create({
      title, description, location, jobType, companyName, recruiterId,
      salaryMin: salaryMin || null, salaryMax: salaryMax || null,
      salaryCurrency: salaryCurrency || 'INR', salaryPeriod: salaryPeriod || null,
      experienceLevel: experienceLevel || null,
      keywords: [],
    });
    console.log(`Job ${newJob.id} created initially.`);

    try {
      console.log(`Calling NLP service for Job ID: ${newJob.id}...`);
      const nlpServiceUrl = 'http://localhost:5002/extract-keywords';
      const response = await axios.post(nlpServiceUrl,
        { text: newJob.description },
        { timeout: 10000 }
      );

      if (response.status === 200 && response.data && Array.isArray(response.data.keywords)) {
        newJob.keywords = response.data.keywords;
        await newJob.save();
        console.log(`Successfully updated Job ${newJob.id} with ${response.data.keywords.length} keywords.`);
      } else {
         console.warn(`NLP service returned unexpected response for Job ID ${newJob.id}:`, response.status, response.data);
      }
    } catch (nlpError) {
      console.error(`NLP Service Call Error for Job ID ${newJob.id}: ${nlpError.message}. Job created without AI keywords.`);
      if (nlpError.code === 'ECONNREFUSED') {
           console.error("--> Is the Python NLP service running on port 5002?");
      }
    }
    res.status(201).json(newJob);

  } catch (error) {
    console.error('Error during job creation/saving process:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { keywords: searchTerms } = req.query; 

    let whereClause = {};
    const includeOptions = [{
        model: User,
        as: 'recruiter',
        attributes: ['id', 'firstName', 'lastName', 'email']
    }];

    if (searchTerms) {
      const termsArray = searchTerms.split(',')
        .map(term => term.trim().toLowerCase())
        .filter(term => term.length > 0);

      if (termsArray.length > 0) {
        // Build an array of conditions for the [Op.or] clause
        const orConditions = [
          // Condition 1: Keywords array overlaps with any of the search terms
          { keywords: { [Op.overlap]: termsArray } }
        ];

        // Condition 2: Title contains any of the search terms (case-insensitive)
        termsArray.forEach(term => {
          orConditions.push({
            title: {
              [Op.iLike]: `%${term}%` // Op.iLike for case-insensitive LIKE
            }
          });
        });

        

        whereClause = {
          [Op.or]: orConditions
        };
        console.log("Filtering jobs by search terms (title or keywords):", termsArray, "with whereClause:", JSON.stringify(whereClause));
      }
    }

    const jobs = await Job.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'recruiter',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Server error getting jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByPk(jobId, {
         include: [{
            model: User,
            as: 'recruiter',
            attributes: ['id', 'firstName', 'lastName', 'email']
         }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('Error getting job by ID:', error);
    res.status(500).json({ message: 'Server error getting job' });
  }
};

const getRecommendedJobs = async (req, res) => {
  try {
    const currentJobId = req.params.id;
    const currentJob = await Job.findByPk(currentJobId, {
      attributes: ['keywords'],
    });

    if (!currentJob || !currentJob.keywords || currentJob.keywords.length === 0) {
      return res.status(200).json([]);
    }

    const currentKeywords = currentJob.keywords;
    console.log(`Finding recommendations for Job ${currentJobId} based on keywords:`, currentKeywords);

    const recommendations = await Job.findAll({
      where: {
        id: {
          [Op.ne]: currentJobId
        },
        keywords: {
          [Op.overlap]: currentKeywords
        }
      },
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'companyName', 'location', 'jobType']
    });

    console.log(`Found ${recommendations.length} recommendations.`);
    res.status(200).json(recommendations);

  } catch (error) {
    console.error(`Error getting recommendations for job ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error getting recommendations' });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.id;
    const job = await Job.findByPk(jobId);

    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    if (job.recruiterId !== recruiterId) {
        return res.status(403).json({ message: 'User not authorized to update this job' });
    }

    const originalDescription = job.description;
    const {
        title, description, location, jobType, companyName,
        salaryMin, salaryMax, salaryCurrency, salaryPeriod, experienceLevel
       } = req.body;

    let descriptionChanged = false;
    if (title !== undefined) job.title = title;
    if (description !== undefined && description !== originalDescription) {
        job.description = description;
        descriptionChanged = true;
    }
    if (location !== undefined) job.location = location;
    if (jobType !== undefined) job.jobType = jobType;
    if (companyName !== undefined) job.companyName = companyName;
    job.salaryMin = salaryMin !== undefined ? (salaryMin === '' ? null : Number(salaryMin)) : job.salaryMin;
    job.salaryMax = salaryMax !== undefined ? (salaryMax === '' ? null : Number(salaryMax)) : job.salaryMax;
    job.salaryCurrency = salaryCurrency !== undefined ? salaryCurrency : job.salaryCurrency;
    job.salaryPeriod = salaryPeriod !== undefined ? salaryPeriod : job.salaryPeriod;
    job.experienceLevel = experienceLevel !== undefined ? experienceLevel : job.experienceLevel;

    if (descriptionChanged) {
        console.log(`Description changed for Job ID: ${job.id}. Re-running keyword extraction...`);
        try {
            const nlpServiceUrl = 'http://localhost:5002/extract-keywords';
            const response = await axios.post(nlpServiceUrl,
                { text: job.description },
                { timeout: 10000 }
            );
            if (response.status === 200 && response.data && Array.isArray(response.data.keywords)) {
                job.keywords = response.data.keywords;
                console.log(`Successfully updated keywords for Job ${job.id} based on new description.`);
            } else {
                console.warn(`NLP service returned unexpected response during update for Job ID ${job.id}:`, response.status, response.data);
            }
        } catch (nlpError) {
            console.error(`NLP Service Call Error during update for Job ID ${job.id}: ${nlpError.message}. Proceeding without keyword update.`);
             if (nlpError.code === 'ECONNREFUSED') {
                 console.error("--> Is the Python NLP service running on port 5002?");
             }
        }
    }
    const updatedJob = await job.save();
    console.log(`Job ${jobId} updated by Recruiter ${recruiterId}`);
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(`Error updating job ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error updating job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.id;
    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({ message: 'User not authorized to delete this job' });
    }
    await job.destroy();
    console.log(`Job ${jobId} deleted by Recruiter ${recruiterId}`);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(`Error deleting job ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
};

const getMyPostedJobs = async (req, res) => {
  const recruiterId = req.user.id;
  try {
      const jobs = await Job.findAll({
          where: { recruiterId: recruiterId },
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'title', 'location', 'jobType', 'createdAt', 'updatedAt']
      });
      res.status(200).json(jobs);
  } catch (error) {
      console.error(`Error fetching jobs for recruiter ${recruiterId}:`, error);
      res.status(500).json({ message: 'Server error fetching your posted jobs' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getRecommendedJobs,
  updateJob,
  deleteJob,
  getMyPostedJobs,
};