const express = require('express');
const router = express.Router();
const { createCourse, getCourses, createModule, getModulesWithLearningItems, createQuiz, createExam, createExamQuestion, getQuizzes, getExams, getExamQuestions } = require('../controllers/courseController');

router.post('/', createCourse);
router.get('/', getCourses);
router.post('/modules', createModule);
router.get('/:courseId/modules', getModulesWithLearningItems);
router.post('/quizzes', createQuiz);
router.post('/exams', createExam);
router.post('/exam-questions', createExamQuestion);
router.get('/modules/:moduleId/quizzes', getQuizzes);
router.get('/:courseId/exams', getExams);
router.get('/exams/:examId/questions', getExamQuestions);

module.exports = router;
