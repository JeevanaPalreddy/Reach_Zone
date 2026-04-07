const mongoose = require('mongoose');
   const emailSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     recipientName: { type: String, required: true },
     recipientRole: { type: String },
     recipientCompany: { type: String },
     outreachGoal: {
       type: String,
       enum: ['internship', 'referral', 'mentorship', 'informational'],
       required: true
}, tone: {
       type: String,
       enum: ['formal', 'friendly', 'concise'],
       default: 'friendly'
     },
     generatedSubject: String,
     generatedBody: String,
     status: {
       type: String,
       enum: ['draft', 'sent', 'replied', 'ghosted'],
       default: 'draft'
     },
     followUpCount: { type: Number, default: 0 },
     sentAt: Date,
     createdAt: { type: Date, default: Date.now }
});
   module.exports = mongoose.model('Email', emailSchema);
