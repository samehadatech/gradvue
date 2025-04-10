// import Tuition from '../models/Tuition.js';
// import User from '../models/User.js';

// export const createTuition = async (req, res) => {
//   try {
//     const { studentId, term, breakdown, dueDate, notes } = req.body;

//     const student = await User.findById(studentId);
//     if (!student || student.role !== 'student') {
//       return res.status(400).json({ message: 'Invalid student' });
//     }

//     const tuition = await Tuition.create({
//       studentId,
//       term,
//       breakdown,
//       dueDate,
//       notes,
//     });

//     res.status(201).json({ message: 'Tuition record created', tuition });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getStudentTuition = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const records = await Tuition.find({ studentId }).sort({ createdAt: -1 });

//     res.json(records);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const payTuition = async (req, res) => {
//   try {
//     const { tuitionId } = req.params;
//     const { amount } = req.body;

//     const tuition = await Tuition.findById(tuitionId);
//     if (!tuition)
//       return res.status(404).json({ message: 'Tuition record not found' });

//     tuition.amountPaid += amount;
//     await tuition.save();

//     res.json({ message: 'Payment recorded', tuition });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import Tuition from '../models/Tuition.js';

export const createTuition = async (req, res) => {
  try {
    const { studentId, term, breakdown } = req.body;

    const newTuition = new Tuition({
      studentId,
      term,
      breakdown,
      createdBy: req.user._id, // from JWT
    });

    await newTuition.save();
    res.status(201).json(newTuition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTuitionByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const tuitionRecords = await Tuition.find({ studentId }).populate(
      'studentId',
      'name email'
    );
    res.json(tuitionRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
