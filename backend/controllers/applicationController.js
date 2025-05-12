const Application = require('../models/Application');
const Job = require('../models/Job'); 
const User = require('../models/User'); 
const { Op } = require("sequelize");


const applyForJob = async (req, res) => {
    const jobId = req.params.jobId;
    const candidateId = req.user.id;

    try {
        
        const jobExists = await Job.findByPk(jobId, { attributes: ['id'] });
        if (!jobExists) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        const existingApplication = await Application.findOne({
            where: { candidateId, jobId }
        });

        if (existingApplication) {
            return res.status(409).json({ message: 'You have already applied for this job' }); // 409 Conflict
        }

        
        const newApplication = await Application.create({
            candidateId,
            jobId,
            status: 'applied' 
        });

        console.log(`User ${candidateId} applied for Job ${jobId}`);
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });

    } catch (error) {
        console.error(`Error applying for job ${jobId} by user ${candidateId}:`, error);
        res.status(500).json({ message: 'Server error submitting application' });
    }
};


const getMyApplications = async (req, res) => {
    const candidateId = req.user.id;

    try {
        const applications = await Application.findAll({
            where: { candidateId },
            include: [{ 
                model: Job,
                as: 'job', 
                attributes: ['id', 'title', 'companyName', 'location'] 
            }],
            order: [['createdAt', 'DESC']] 
        });

        res.status(200).json(applications);

    } catch (error) {
        console.error(`Error fetching applications for user ${candidateId}:`, error);
        res.status(500).json({ message: 'Server error fetching applications' });
    }
};

const getJobApplicants = async (req, res) => {
    const jobId = req.params.jobId;
    const recruiterId = req.user.id;

    try {
        const job = await Job.findOne({ where: { id: jobId, recruiterId: recruiterId }, attributes: ['id'] });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or you are not authorized to view its applicants.' });
        }

        const applications = await Application.findAll({
            where: { jobId: jobId },
            include: [{
                model: User,
                as: 'candidate', 
                attributes: ['id', 'firstName', 'lastName', 'email', 'skills'] 
            }],
            order: [['createdAt', 'ASC']] 
        });

        res.status(200).json(applications);

    } catch (error) {
        console.error(`Error fetching applicants for job ${jobId}:`, error);
        res.status(500).json({ message: 'Server error fetching applicants' });
    }
};



const updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body; 
    const recruiterId = req.user.id;

    const allowedStatuses = Application.getAttributes().status.values; 
    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}` });
    }

    try {
        const application = await Application.findByPk(applicationId, {
            include: [{
                model: Job,
                as: 'job', 
            }]
        });
       
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.job || application.job.recruiterId !== recruiterId) {
             return res.status(403).json({ message: 'User not authorized to update this application status' });
        }

        application.status = status;
        await application.save();

        console.log(`Application ${applicationId} status updated to '${status}' by Recruiter ${recruiterId}`);
       
        const updatedApplication = await Application.findByPk(applicationId, {
             include: [{ model: User, as: 'candidate', attributes: ['id', 'firstName', 'lastName', 'email', 'skills'] }] 
         }); 

        res.status(200).json(updatedApplication);

    } catch (error) {
        console.error(`Error updating status for application ${applicationId}:`, error);
        res.status(500).json({ message: 'Server error updating application status' });
    }
};


module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants, 
    updateApplicationStatus 
};