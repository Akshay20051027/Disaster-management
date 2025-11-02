const Course = require('../models/Course');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const Exam = require('../models/Exam');
const ExamQuestion = require('../models/ExamQuestion');

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: 'Course created', course_id: course._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getCourses = async (req, res) => {
  const courses = await Course.find().lean();
  res.json(courses);
};

const createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json({ message: 'Module created', module_id: module._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getModulesWithLearningItems = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const modules = await Module.find({ course: courseId }).sort({ module_order: 1 }).lean();
    const moduleIds = modules.map(m => m._id);

    // quizzes and exams
    const quizzes = await Quiz.find({ module: { $in: moduleIds } }).lean();
    const exams = await Exam.find({ $or: [{ course: courseId }, { module: { $in: moduleIds } }] }).lean();
    const examIds = exams.map(e => e._id);
    const examQuestionsAll = await ExamQuestion.find({ exam: { $in: examIds } }).lean();

    const quizzesByModule = quizzes.reduce((acc, q) => { (acc[q.module] ||= []).push(q); return acc; }, {});
    const examQuestionsByExam = examQuestionsAll.reduce((acc, q) => { (acc[q.exam] ||= []).push(q); return acc; }, {});

    const response = modules.map(m => {
      const learning_items = [];
      if (m.content) learning_items.push({ id: `module-content-${m._id}`, title: 'Learning Material', item_type: 'content', text_content: m.content, status: 'not-started' });
      if (m.video_url) learning_items.push({ id: `module-video-${m._id}`, title: 'Instructional Video', item_type: 'video', video_url: m.video_url, status: 'not-started' });
      (quizzesByModule[m._id] || []).forEach(quiz => learning_items.push({ id: `quiz-${quiz._id}`, title: `Quick Quiz: ${m.title}` , item_type: 'exam', data: { questions: [quiz] }, status: 'not-started' }));
      exams.filter(e => String(e.module) === String(m._id)).forEach(exam => {
        const questions = examQuestionsByExam[exam._id] || [];
        learning_items.push({ id: `exam-${exam._id}`, title: exam.title, item_type: 'exam', data: { id: exam._id, questions }, status: 'not-started' });
      });
      return { ...m, learning_items, progress: 0 };
    });

    res.json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: 'Quiz created', quiz_id: quiz._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ message: 'Exam created', exam_id: exam._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const createExamQuestion = async (req, res) => {
  try {
    const eq = await ExamQuestion.create(req.body);
    res.status(201).json({ message: 'Exam question created', exam_question_id: eq._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ module: req.params.moduleId }).lean();
  res.json(quizzes);
};

const getExams = async (req, res) => {
  const exams = await Exam.find({ course: req.params.courseId }).lean();
  res.json(exams);
};

const getExamQuestions = async (req, res) => {
  const questions = await ExamQuestion.find({ exam: req.params.examId }).lean();
  res.json(questions);
};

module.exports = { createCourse, getCourses, createModule, getModulesWithLearningItems, createQuiz, createExam, createExamQuestion, getQuizzes, getExams, getExamQuestions };
