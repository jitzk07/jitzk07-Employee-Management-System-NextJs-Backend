const express = require('express');
const { loginUser,registerUser, logoutUser } = require('../controllers/authController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register',optionalAuth, registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

module.exports = router;
