const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    const { loginStudent } = require('./controllers/authController');
    const Student = require('./models/Student');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dis_app');

    const s = await Student.findOne({ username: 'rahul_s' }).lean();
    if (!s) throw new Error('Seed student rahul_s not found');

    // Mock req/res
    const req = { body: { email_or_username: 'rahul_s', password: 'student123' } };
    const res = {
      statusCode: 200,
      body: null,
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; console.log(JSON.stringify({ statusCode: this.statusCode, ...payload }, null, 2)); },
    };

    await loginStudent(req, res);
  } catch (err) {
    console.error('Test error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
