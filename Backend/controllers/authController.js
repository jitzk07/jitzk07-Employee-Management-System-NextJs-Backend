const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    // 1️⃣ Check if user with email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Check if any admin already exists
    const adminExists = await User.exists({ role: "admin" });

    // 3️⃣ Admin registration restriction logic (place this here)
    if (role === "admin") {
      if (adminExists) {
        // Only block if token exists but is not admin
        if (req.user && req.user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Only admin can register other admins" });
        }
        // If no token at all, block too
        if (!req.user) {
          return res
            .status(403)
            .json({ message: "Only admin can register other admins" });
        }
      }
    }

    // 4️⃣ Create new user
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
