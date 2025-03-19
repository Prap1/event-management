const express = require('express');
const { register, login } = require('../controller/authController');
const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Login an existing user

module.exports = router;
