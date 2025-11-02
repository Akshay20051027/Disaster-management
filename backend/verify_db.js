const mongoose = require('mongoose');
require('dotenv').config();

async function verifyDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ MongoDB Connected Successfully\n');
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📊 DATABASE COLLECTIONS:');
    console.log('========================\n');
    
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`  ${coll.name}: ${count} documents`);
      
      // Show sample data for each collection
      if (count > 0) {
        const sample = await db.collection(coll.name).findOne();
        console.log(`    Sample ID: ${sample._id}`);
      }
    }
    
    console.log('\n========================\n');
    
    // Test specific collections
    const Admin = mongoose.model('Admin', new mongoose.Schema({}, { strict: false }));
    const School = mongoose.model('School', new mongoose.Schema({}, { strict: false }));
    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
    const Module = mongoose.model('Module', new mongoose.Schema({}, { strict: false }));
    const Donation = mongoose.model('Donation', new mongoose.Schema({}, { strict: false }));
    
    console.log('🔍 DETAILED COLLECTION INFO:\n');
    
    const adminCount = await Admin.countDocuments();
    console.log(`Admins: ${adminCount}`);
    if (adminCount > 0) {
      const admin = await Admin.findOne().lean();
      console.log(`  - Username: ${admin.username || admin.email}`);
    }
    
    const schoolCount = await School.countDocuments();
    console.log(`\nSchools: ${schoolCount}`);
    if (schoolCount > 0) {
      const school = await School.findOne().lean();
      console.log(`  - School Name: ${school.school_name}`);
      console.log(`  - Admin Email: ${school.admin_email}`);
    }
    
    const studentCount = await Student.countDocuments();
    console.log(`\nStudents: ${studentCount}`);
    
    const courseCount = await Course.countDocuments();
    console.log(`\nCourses: ${courseCount}`);
    if (courseCount > 0) {
      const courses = await Course.find().lean();
      courses.forEach(c => console.log(`  - ${c.title}`));
    }
    
    const moduleCount = await Module.countDocuments();
    console.log(`\nModules: ${moduleCount}`);
    if (moduleCount > 0) {
      const modules = await Module.find().lean();
      modules.forEach(m => console.log(`  - ${m.title} (Course ID: ${m.course})`));
    }
    
    const donationCount = await Donation.countDocuments();
    console.log(`\nDonations: ${donationCount}`);
    if (donationCount > 0) {
      const donations = await Donation.find().lean();
      donations.forEach(d => console.log(`  - ${d.item_name}: ${d.quantity} (${d.category})`));
    }
    
    console.log('\n✅ Database verification complete!\n');
    
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

verifyDatabase();
