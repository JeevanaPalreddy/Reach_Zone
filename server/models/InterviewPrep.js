const mongoose = require('mongoose');

const interviewPrepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobDescription: String,
  fileName: String,
  selfIntroduction: String,
  interviewQuestions: [{
    question: String,
    answer: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
