const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { bulkUpload, downloadStudents, listStudents, studentDashboard } = require('../controllers/studentController');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

router.post('/bulk-upload', upload.single('file'), bulkUpload);
router.get('/download/:schoolId', downloadStudents);
router.get('/:schoolId', authenticateToken, listStudents);
router.get('/dashboard/:studentId', authenticateToken, studentDashboard);

module.exports = router;
