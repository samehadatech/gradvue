// import express from 'express';
// import {
//   createTuition,
//   getStudentTuition,
//   payTuition,
// } from '../controllers/tuitionController.js';

// const router = express.Router();

// router.post('/', createTuition); // Create a new tuition record
// router.get('/:studentId', getStudentTuition); // View student's tuition
// router.patch('/:tuitionId/pay', payTuition); // Add payment to tuition

// export default router;

import express from 'express';
import {
  createTuition,
  getTuitionByStudent,
} from '../controllers/tuitionController.js';
import verifyToken from '../middlewares/authMiddleware.js';
// import roleMiddleware from '../middlewares/roleMiddleware.js'; // for future

const router = express.Router();

// Add tuition (Only principal or appointed proxy)
router.post('/', verifyToken, createTuition);

// View tuition for a student
router.get('/:studentId', verifyToken, getTuitionByStudent);

export default router;
