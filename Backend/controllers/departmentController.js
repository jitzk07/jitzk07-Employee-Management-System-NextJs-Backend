const Department = require('../models/Department');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    const department = new Department({ name });
    await department.save();
    
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Department already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};