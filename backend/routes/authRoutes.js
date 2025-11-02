const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, registerSchool, loginSchool, loginStudent, updateAdminPassword, deleteAdmin, updateSchoolPassword, deleteSchool } = require('../controllers/authController');

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.put('/admin/update-password', updateAdminPassword);
router.delete('/admin/:id', deleteAdmin);
router.post('/school/register', registerSchool);
router.post('/school/login', loginSchool);
router.put('/school/update-password', updateSchoolPassword);
router.delete('/school/:id', deleteSchool);
router.post('/student/login', loginStudent);

router.get('/health', (req, res) => res.json({ success: true, message: 'Auth service is running', timestamp: new Date().toISOString() }));

module.exports = router;
