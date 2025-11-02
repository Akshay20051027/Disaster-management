import axios from 'axios';

// Use environment variable `REACT_APP_API_URL` when provided.
// In production, default to a relative path so the frontend can be served from the same origin as the backend.
const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const apiClient = axios.create({
  baseURL: API_URL,
});

// You can add interceptors to handle JWT tokens for authentication later

// --- GET APIs (Fetching Data) ---
export const getCourses = () => apiClient.get('/courses');
export const getCourseModules = (courseId) => apiClient.get(`/courses/${courseId}/modules`);
export const getModuleQuizzes = (moduleId) => apiClient.get(`/courses/modules/${moduleId}/quizzes`);
export const getCourseExams = (courseId) => apiClient.get(`/courses/${courseId}/exams`);
export const getExamQuestions = (examId) => apiClient.get(`/courses/exams/${examId}/questions`);
export const getCourseProgress = (courseId) => apiClient.get(`/courses/${courseId}/progress`);
export const getModuleDetails = (moduleId) => apiClient.get(`/modules/${moduleId}/details`);
export const createLearningItem = (itemData) => apiClient.post('/learning-items', itemData);

// In src/services/api.js
export const getCourseOutline = (courseId) => apiClient.get(`/courses/${courseId}/outline`);
export const submitExam = (examId, submissionData) => apiClient.post(`/exams/${examId}/submit`, submissionData);
// --- POST APIs (Creating Data) ---

// Original Course and Exam creation
export const createCourse = (courseData) => apiClient.post('/courses', courseData);
export const createModule = (moduleData) => apiClient.post('/modules', moduleData);
export const createExam = (examData) => apiClient.post('/exams', examData);
export const createExamQuestion = (questionData) => apiClient.post('/exam-questions', questionData);


// === MODIFIED: Added Functions for Gamified Learning ===
// These are the new functions that were missing before.

export const createFlashcard = (cardData) => apiClient.post('/flashcards', cardData);

export const createFeynmanActivity = (activityData) => apiClient.post('/feynman-activities', activityData);

// =======================================================