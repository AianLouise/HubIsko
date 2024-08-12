import ScholarshipApplication from '../models/scholarshipApplication.model.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};