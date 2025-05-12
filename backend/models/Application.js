const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('applied', 'viewed', 'shortlisted', 'rejected'),
    allowNull: false,
    defaultValue: 'applied',
  },
}, {
  tableName: 'applications',
  timestamps: true,
});

module.exports = Application;