const express = require('express');
const router = express.Router();
const { uploadQuizPdf, getQuizPdf } = require('../controllers/fileController');

router.post('/modules/:moduleId/quiz-pdf', uploadQuizPdf);
router.get('/modules/:moduleId/quiz-pdf', getQuizPdf);

module.exports = router;
