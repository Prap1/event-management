const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// Register a user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate if user already exists by email
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create and save user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
