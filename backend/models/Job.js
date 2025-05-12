const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Internship', 'Contract'),
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salaryCurrency: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'INR',
  },
  salaryPeriod: {
    type: DataTypes.ENUM('Yearly', 'Monthly', 'Hourly'),
    allowNull: true,
  },
  experienceLevel: {
    type: DataTypes.ENUM('Internship', 'Entry-level', 'Mid-level', 'Senior-level', 'Lead', 'Executive'),
    allowNull: true,
  },
}, {
  tableName: 'jobs',
  timestamps: true,
});

module.exports = Job;