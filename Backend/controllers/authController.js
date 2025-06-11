const { validationResult, checkSchema } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const { registerValidationRules, loginValidationRules } = require("../validators/authValidator");

const runValidations = validations => async (req, res) => {
  for (let validation of validations) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return null;
};

exports.registerUser = async (req, res) => {
  const error = await runValidations(registerValidationRules)(req, res);
  if (error) return; 

  const { fullName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const adminExists = await User.exists({ role: "admin" });

    if (role === "admin") {
      if (adminExists) {
        if (req.user && req.user.role !== "admin") {
          return res.status(403).json({ message: "Only admin can register other admins" });
        }
        if (!req.user) {
          return res.status(403).json({ message: "Only admin can register other admins" });
        }
      }
    }

    const user = await User.create({ fullName, email, password, role });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  const error = await runValidations(loginValidationRules)(req, res);
  if (error) return;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};
