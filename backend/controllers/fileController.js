const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QuizFile = require('../models/QuizFile');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'quiz_pdfs');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const moduleId = req.params.moduleId || 'mod';
    cb(null, `${moduleId}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  }
});

const uploadQuizPdf = [upload.single('file'), async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const record = await QuizFile.create({ module: moduleId, file_url: req.file.path.replace(/\\/g,'/') });
    res.json({ message: 'Quiz PDF uploaded successfully', file_path: record.file_url });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}];

const getQuizPdf = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const record = await QuizFile.findOne({ module: moduleId }).sort({ uploaded_at: -1 });
    if (!record) return res.status(404).json({ message: 'No quiz PDF found for this module' });
    res.sendFile(path.resolve(record.file_url));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { uploadQuizPdf, getQuizPdf };
