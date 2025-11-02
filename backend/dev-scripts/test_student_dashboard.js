const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    const { studentDashboard } = require('./controllers/studentController');
    const Student = require('./models/Student');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dis_app');

    const s = await Student.findOne({ username: 'rahul_s' }).lean();
    if (!s) throw new Error('Seed student rahul_s not found');

    const req = { params: { studentId: s._id.toString() } };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(payload) { console.log(JSON.stringify(payload, null, 2)); },
      setHeader() {},
    };

    await studentDashboard(req, res);
  } catch (err) {
    console.error('Test error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
