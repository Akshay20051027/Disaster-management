const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify');
const Student = require('../models/Student');
const School = require('../models/School');

const bulkUpload = async (req, res) => {
  try {
    const { schoolId } = req.query;
    if (!schoolId) return res.status(400).json({ success: false, message: 'Missing schoolId' });

    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });

    if (!req.file) return res.status(400).json({ success: false, message: 'File is required' });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const added = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = row.name || row.Name;
      const email = row.email || row.Email;
      if (!name || !email) continue;
      const username = (email.split('@')[0]).toLowerCase();
      // plaintext password as in original app (not recommended)
      const password = Math.random().toString(36).slice(-8);
      const created = await Student.create({ name, email, username, password, school: school._id });
      added.push({ name, email, username, password });
    }

    fs.unlinkSync(req.file.path);

    res.json({ success: true, message: 'Students uploaded successfully', students_added: added });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

const downloadStudents = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const students = await Student.find({ school: schoolId }).select('name email username password').lean();
    if (!students || students.length === 0) return res.status(404).json({ success: false, message: 'No students found' });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_school_${schoolId}.csv`);
    const stringifier = stringify({ header: true, columns: ['name','email','username','password'] });
    students.forEach(s => stringifier.write([s.name, s.email, s.username, s.password]));
    stringifier.end();
    stringifier.pipe(res);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const listStudents = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const students = await Student.find({ school: schoolId }).select('id name email username');
    res.json(students);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { bulkUpload, downloadStudents, listStudents };

// Additional: Student Dashboard (for individual student)
// GET /api/students/dashboard/:studentId
const studentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const school = await School.findById(student.school).lean();
    const stats = {
      region_state: school?.region_state || 'N/A',
      total_students: await Student.countDocuments({ school: student.school }),
      school_type: school?.school_type || 'N/A'
    };

    return res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        username: student.username
      },
      school: school ? { id: school._id, school_name: school.school_name } : null,
      stats
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports.studentDashboard = studentDashboard;
