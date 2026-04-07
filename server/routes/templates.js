const router = require('express').Router();
   const Template = require('../models/Template');
   const auth = require('../middleware/auth');
   // Get templates by industry/goal
   router.get('/', async (req, res) => {
     try {
       const { industry, goal } = req.query;
       const filter = {};
       if (industry) filter.industry = industry;
       if (goal) filter.goal = goal;
       const templates = await Template.find(filter);
       res.json(templates);
     } catch (err) {
       res.status(500).json({ msg: 'Server error' });
} });
   // Seed default templates
   router.post('/seed', async (req, res) => {
     try {
       const defaults = [
         { title: 'Tech Internship Reach', industry: 'Technology',
           goal: 'internship', isDefault: true,
           subjectTemplate: 'Quick question about [ROLE] at [COMPANY]',
           bodyTemplate: 'Hi [NAME], I am [STUDENT] studying [MAJOR]...' },
         { title: 'Finance Referral Ask', industry: 'Finance',
           goal: 'referral', isDefault: true,
           subjectTemplate: '[STUDENT] — [COLLEGE] student, quick ask',
           bodyTemplate: 'Dear [NAME], I came across your profile...' },
         { title: 'Mentorship Request', industry: 'General',
           goal: 'mentorship', isDefault: true,
           subjectTemplate: 'Would love 15 min of your time',
           bodyTemplate: 'Hi [NAME], I am a [YEAR] at [COLLEGE]...' },
       ];
       await Template.insertMany(defaults);
       res.json({ msg: 'Templates seeded' });
     } catch (err) {
       res.status(500).json({ msg: 'Seed failed' });
} });
   module.exports = router;
