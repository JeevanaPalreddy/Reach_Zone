const mongoose = require('mongoose');
   const templateSchema = new mongoose.Schema({
     title: { type: String, required: true },
     industry: { type: String, required: true },
     goal: { type: String, required: true },
     subjectTemplate: String,
     bodyTemplate: String,
     isDefault: { type: Boolean, default: false },
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
   module.exports = mongoose.model('Template', templateSchema);