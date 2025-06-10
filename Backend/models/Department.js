const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Engineering', 'Sales', 'HR', 'Marketing', 'Finance', 'Support'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Department', departmentSchema);
