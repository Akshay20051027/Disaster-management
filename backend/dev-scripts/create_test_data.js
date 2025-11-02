const mongoose = require('mongoose');
require('dotenv').config();

async function createTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB\n');

    // Import models
    const Admin = require('./models/Admin');
    const School = require('./models/School');
    const Student = require('./models/Student');
    const Course = require('./models/Course');
    const Module = require('./models/Module');
    const Quiz = require('./models/Quiz');
    const Exam = require('./models/Exam');
    const ExamQuestion = require('./models/ExamQuestion');
    const bcrypt = require('bcryptjs');

    console.log('🔄 Creating test data...\n');

    // 1. Create Test Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.create({
      full_name: 'Test Admin',
      email: 'admin@test.com',
      username: 'admin',
      password: adminPassword
    });
    console.log('✅ Admin Created:');
    console.log('   Email: admin@test.com');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

    // 2. Create Test School
    const schoolPassword = await bcrypt.hash('school123', 12);
    const school = await School.create({
      school_name: 'Demo High School',
      school_type: 'High School',
      address: '123 Education Street, Delhi',
      region_state: 'Delhi',
      contact_info: '+91-11-12345678',
      num_students: 500,
      num_staff: 50,
      admin_name: 'Principal Kumar',
      admin_email: 'principal@demo.com',
      admin_phone: '+91-9876543210',
      password: schoolPassword,
      terms_accepted: true,
      emergency_contact_pref: 'email'
    });
    console.log('✅ School Created:');
    console.log('   School Name: Demo High School');
    console.log('   Email: principal@demo.com');
    console.log('   Password: school123');
    console.log('   School ID: ' + school._id + '\n');

    // 3. Create Test Students
    const studentPassword = await bcrypt.hash('student123', 12);
    const students = await Student.insertMany([
      {
        school: school._id,
        name: 'Rahul Sharma',
        email: 'rahul@student.com',
        username: 'rahul_s',
        password: studentPassword
      },
      {
        school: school._id,
        name: 'Priya Patel',
        email: 'priya@student.com',
        username: 'priya_p',
        password: studentPassword
      },
      {
        school: school._id,
        name: 'Amit Singh',
        email: 'amit@student.com',
        username: 'amit_s',
        password: studentPassword
      }
    ]);
    console.log('✅ Students Created (3):');
    students.forEach(s => {
      console.log(`   - ${s.name} (${s.username})`);
    });
    console.log('   Password for all: student123\n');

    // 4. Create Test Courses
    const courses = await Course.insertMany([
      {
        title: 'Disaster Management Basics',
        description: 'Learn fundamental concepts of disaster preparedness and response'
      },
      {
        title: 'Emergency First Aid',
        description: 'Essential first aid techniques for emergency situations'
      },
      {
        title: 'Community Resilience',
        description: 'Building strong communities to face natural disasters'
      }
    ]);
    console.log('✅ Courses Created (3):');
    courses.forEach(c => {
      console.log(`   - ${c.title}`);
    });
    console.log('');

    // 5. Create Modules for first course
    const modules = await Module.insertMany([
      {
        course: courses[0]._id,
        title: 'Introduction to Disasters',
        content: 'Understanding different types of natural and man-made disasters, their causes, and impacts on communities.',
        video_url: 'https://www.youtube.com/watch?v=sample1',
        module_order: 1
      },
      {
        course: courses[0]._id,
        title: 'Disaster Preparedness',
        content: 'Creating emergency plans, assembling disaster kits, and preparing your home and family for emergencies.',
        video_url: 'https://www.youtube.com/watch?v=sample2',
        module_order: 2
      },
      {
        course: courses[0]._id,
        title: 'Emergency Response',
        content: 'How to respond during disasters, evacuation procedures, and communication strategies.',
        video_url: 'https://www.youtube.com/watch?v=sample3',
        module_order: 3
      }
    ]);
    console.log('✅ Modules Created (3) for "Disaster Management Basics":');
    modules.forEach(m => {
      console.log(`   ${m.module_order}. ${m.title}`);
    });
    console.log('');

    // 6. Create Quizzes
    const quizzes = await Quiz.insertMany([
      {
        module: modules[0]._id,
        question: 'What is the most common natural disaster in India?',
        option_a: 'Earthquake',
        option_b: 'Flood',
        option_c: 'Cyclone',
        option_d: 'Drought',
        correct_option: 'B'
      },
      {
        module: modules[0]._id,
        question: 'Which organization coordinates disaster response in India?',
        option_a: 'NDMA',
        option_b: 'WHO',
        option_c: 'UN',
        option_d: 'Red Cross',
        correct_option: 'A'
      },
      {
        module: modules[1]._id,
        question: 'How many days of water should an emergency kit contain?',
        option_a: '1 day',
        option_b: '3 days',
        option_c: '7 days',
        option_d: '14 days',
        correct_option: 'B'
      }
    ]);
    console.log('✅ Quizzes Created (3)\n');

    // 7. Create Exam
    const exam = await Exam.create({
      course: courses[0]._id,
      module: modules[2]._id,
      title: 'Final Assessment - Disaster Management'
    });
    console.log('✅ Exam Created: Final Assessment\n');

    // 8. Create Exam Questions
    const examQuestions = await ExamQuestion.insertMany([
      {
        exam: exam._id,
        question: 'During an earthquake, you should:',
        option_a: 'Run outside immediately',
        option_b: 'Stand in a doorway',
        option_c: 'Drop, Cover, and Hold On',
        option_d: 'Use the elevator',
        correct_option: 'C'
      },
      {
        exam: exam._id,
        question: 'What is the emergency helpline number in India?',
        option_a: '100',
        option_b: '101',
        option_c: '102',
        option_d: '112',
        correct_option: 'D'
      },
      {
        exam: exam._id,
        question: 'Which of these should NOT be in your emergency kit?',
        option_a: 'Flashlight',
        option_b: 'Candles and matches',
        option_c: 'First aid supplies',
        option_d: 'Important documents',
        correct_option: 'B'
      }
    ]);
    console.log('✅ Exam Questions Created (3)\n');

    // Summary
    console.log('════════════════════════════════════════════════════════');
    console.log('📊 TEST DATA SUMMARY');
    console.log('════════════════════════════════════════════════════════\n');
    
    console.log('👨‍💼 ADMIN LOGIN:');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123\n');

    console.log('🏫 SCHOOL LOGIN:');
    console.log('   URL: http://localhost:3000/school/login');
    console.log('   Email: principal@demo.com');
    console.log('   Password: school123\n');

    console.log('🎓 STUDENT LOGIN (any of these):');
    console.log('   URL: http://localhost:3000/student/login');
    console.log('   1. Username: rahul_s  | Password: student123');
    console.log('   2. Username: priya_p  | Password: student123');
    console.log('   3. Username: amit_s   | Password: student123\n');

    console.log('📚 COURSES:');
    console.log('   - Disaster Management Basics (3 modules, quizzes, 1 exam)');
    console.log('   - Emergency First Aid');
    console.log('   - Community Resilience\n');

    console.log('🌐 FRONTEND: http://localhost:3000');
    console.log('🔧 BACKEND:  http://localhost:8000/api\n');

    console.log('════════════════════════════════════════════════════════');
    console.log('✅ All test data created successfully!');
    console.log('════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

createTestData();
