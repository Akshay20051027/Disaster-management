const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const School = require('../models/School');
const Student = require('../models/Student');

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

// Admin register
const registerAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { full_name, email, username, password } = req.body;
    const exists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ success: false, message: 'Email or username already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ full_name, email, username, password: hashed });
    const token = signToken({ sub: admin._id.toString(), role: 'admin', username });
    res.status(201).json({ success: true, message: 'Admin registered', token });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email_or_username, password } = req.body;
    const admin = await Admin.findOne({ $or: [{ email: email_or_username }, { username: email_or_username }] });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = signToken({ sub: admin._id.toString(), role: 'admin', username: admin.username });
    res.json({ success: true, message: 'Login successful', token });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// School register
const registerSchool = async (req, res) => {
  try {
    const school = req.body;
    if (!school.terms_accepted) return res.status(400).json({ success: false, message: 'Terms must be accepted' });
    const dup = await School.findOne({ admin_email: school.admin_email });
    if (dup) return res.status(400).json({ success: false, message: 'Email already exists' });
    const hashed = await bcrypt.hash(school.password, 12);
    const created = await School.create({ ...school, password: hashed });
    res.status(201).json({ success: true, message: 'School/Organization registered', id: created._id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// School login
const loginSchool = async (req, res) => {
  try {
    const { email_or_username, password } = req.body;
    const school = await School.findOne({ $or: [{ admin_email: email_or_username }, { admin_name: email_or_username }] });
    if (!school) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, school.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = signToken({ sub: school._id.toString(), role: 'school', admin_email: school.admin_email });
    res.json({ success: true, message: 'Login successful', token, school_id: school._id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Student login
const loginStudent = async (req, res) => {
  try {
    const { email_or_username, password } = req.body;
    const student = await Student.findOne({ $or: [{ email: email_or_username }, { username: email_or_username }] });
    if (!student) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    let ok = false;
    // Support bcrypt hashes (versions $2a$, $2b$, $2y$). Simple prefix check is sufficient.
    if (typeof student.password === 'string' && student.password.startsWith('$2')) {
      ok = await bcrypt.compare(password, student.password);
    } else {
      ok = password === student.password;
    }
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = signToken({ sub: student._id.toString(), role: 'student', student_id: student._id, username: student.username, school_id: student.school.toString() });
    res.json({ success: true, message: 'Login successful', token, student_id: student._id, school_id: student.school });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { registerAdmin, loginAdmin, registerSchool, loginSchool, loginStudent };

// Additional account management endpoints
const updateAdminPassword = async (req, res) => {
  try {
    const { admin_id, old_password, new_password } = req.body;
    if (!admin_id || !old_password || !new_password) return res.status(400).json({ success: false, message: 'admin_id, old_password, new_password required' });
    const admin = await Admin.findById(admin_id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    const ok = await bcrypt.compare(old_password, admin.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid old password' });
    admin.password = await bcrypt.hash(new_password, 12);
    await admin.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Admin.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const updateSchoolPassword = async (req, res) => {
  try {
    const { school_id, old_password, new_password } = req.body;
    if (!school_id || !old_password || !new_password) return res.status(400).json({ success: false, message: 'school_id, old_password, new_password required' });
    const school = await School.findById(school_id);
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });
    const ok = await bcrypt.compare(old_password, school.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid old password' });
    school.password = await bcrypt.hash(new_password, 12);
    await school.save();
    res.json({ success: true, message: 'School password updated successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await School.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: 'School not found' });
    res.json({ success: true, message: 'School deleted successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports.updateAdminPassword = updateAdminPassword;
module.exports.deleteAdmin = deleteAdmin;
module.exports.updateSchoolPassword = updateSchoolPassword;
module.exports.deleteSchool = deleteSchool;
