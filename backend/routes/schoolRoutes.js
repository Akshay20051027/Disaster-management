const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getDashboard } = require('../controllers/schoolController');

router.get('/dashboard/:schoolId', authenticateToken, getDashboard);

module.exports = router;
