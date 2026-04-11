const mongoose = require('mongoose');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
  projectsToDisplayList,
  projectsNeedMigration,
} = require('../utils/projects');

function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id));
}
// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, major, year } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password: password,
                      college, major, year });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
                           { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
                           { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name,
               email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = toObjectId(req.user.id);
    const raw = await User.collection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );
    if (!raw) return res.status(404).json({ msg: 'Not found' });

    if (raw?.projects?.length) {
      raw.projects = projectsToDisplayList(raw.projects);
    }

    res.json(raw);
  } catch (err) {
    console.error('GET /profile', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, college, major, year, skills, projects, bio } = req.body;
    const projectsList = Array.isArray(projects)
      ? projects.map((p) => (typeof p === 'string' ? p.trim() : String(p))).filter(Boolean)
      : [];
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, college, major, year, skills, projects: projectsList, bio },
      { new: true, runValidators: true }
    ).select('-password').lean();
    if (user?.projects?.length) {
      user.projects = projectsToDisplayList(user.projects);
    }
    res.json(user);
  } catch (err) {
    console.error('PUT /profile', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;