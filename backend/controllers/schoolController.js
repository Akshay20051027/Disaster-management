const School = require('../models/School');
const Student = require('../models/Student');

const getDashboard = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const school = await School.findById(schoolId).lean();
    if (!school) return res.status(404).json({ message: 'School not found' });
    const students = await Student.find({ school: schoolId }).select('id name email username').lean();
    res.json({
      school: { id: school._id, school_name: school.school_name, school_type: school.school_type },
      students,
      stats: {
        total_staff: school.num_staff || 0,
        total_students: students.length,
        region_state: school.region_state || null
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getDashboard };
