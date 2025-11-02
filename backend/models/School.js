const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  school_name: { type: String, required: true },
  school_type: { type: String, required: true },
  address: String,
  region_state: String,
  contact_info: String,
  num_students: { type: Number, default: 0 },
  num_staff: { type: Number, default: 0 },
  admin_name: { type: String, required: true },
  admin_email: { type: String, required: true, unique: true },
  admin_phone: String,
  password: { type: String, required: true },
  terms_accepted: { type: Boolean, default: false },
  emergency_contact_pref: String
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);
