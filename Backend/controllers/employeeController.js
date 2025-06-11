const Employee = require("../models/Employee");
const Department = require("../models/Department");
const User = require("../models/User");

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ error: "Name, Email, and Department are required." });
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({ error: "❌ Department does not exist" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "❌ Email is already registered" });
    }

    const defaultPassword = "123456";
    const user = new User({
      fullName: name,
      email,
      password: defaultPassword,
      role: "employee",
    });
    await user.save();

    const employee = new Employee({
      name,
      email,
      phone,
      department,
      designation,
      user: user._id,
    });
    await employee.save();

    res.status(201).json({
      message: "✅ Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Server error while creating employee" });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const query = {
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (department) {
      query.department = department;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate("department", "name")
        .skip(skip)
        .limit(parseInt(limit)),
      Employee.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      employees,
      total,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "department",
      "name"
    );

    if (!employee || employee.isDeleted) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { department } = req.body;

    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return res.status(400).json({ error: "Department does not exist" });
      }
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("department", "name");

    if (!employee || employee.isDeleted) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true }, 
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await Employee.find({
      department: req.params.departmentId,
      isDeleted: false,
    }).populate("department", "name");

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
