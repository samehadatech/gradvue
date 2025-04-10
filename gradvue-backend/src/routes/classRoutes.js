// import express from 'express';
// import School from '../models/School.js';
// import Class from '../models/Class.js';
// import User from '../models/User.js';
// import { verifyToken } from '../middlewares/authMiddleware.js';
// import { allowRoles } from '../middlewares/roleMiddleware.js';

// const router = express.Router();

// // Create class under a school
// router.post(
//   '/',
//   verifyToken,
//   allowRoles('principal', 'admin'),
//   async (req, res) => {
//     try {
//       const { schoolId, name, tuitionTemplate } = req.body;

//       const newClass = new Class({
//         name,
//         schoolId,
//         tuitionTemplate,
//       });

//       const savedClass = await newClass.save();

//       // Add class to school
//       await School.findByIdAndUpdate(schoolId, {
//         $push: { classes: savedClass._id },
//       });

//       res.status(201).json({ success: true, class: savedClass });
//     } catch (err) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }
// );

// // Assign users to class (students or teachers)
// router.post(
//   '/assign-users',
//   verifyToken,
//   allowRoles('principal', 'admin'),
//   async (req, res) => {
//     try {
//       const { classId, userIds, role } = req.body; // role = 'student' or 'teacher'

//       if (!['student', 'teacher'].includes(role)) {
//         return res
//           .status(400)
//           .json({ success: false, error: 'Invalid role provided' });
//       }

//       await Class.findByIdAndUpdate(classId, {
//         $addToSet: {
//           [`${role}s`]: { $each: userIds },
//         },
//       });

//       await User.updateMany(
//         { _id: { $in: userIds } },
//         {
//           $set: {
//             classId,
//           },
//         }
//       );

//       res
//         .status(200)
//         .json({ success: true, message: `${role}s assigned to class` });
//     } catch (err) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }
// );

// export default router;

import express from 'express';
import ClassModel from '../models/Class.js';
import SchoolModel from '../models/School.js';
import UserModel from '../models/User.js';
import TuitionModel from '../models/Tuition.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// CREATE a class
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, schoolId, tuitionTemplate } = req.body;

    const newClass = await ClassModel.create({
      name,
      schoolId,
      tuitionTemplate, // e.g., { amount: 30000, breakdown: { tuition: 25000, books: 5000 } }
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating class' });
  }
});

// ASSIGN users to class and generate tuition for students
router.post('/assign-users', verifyToken, async (req, res) => {
  try {
    const { classId, userIds, role } = req.body;

    const targetClass = await ClassModel.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const assignedUsers = await Promise.all(
      userIds.map(async (userId) => {
        const user = await UserModel.findById(userId);
        if (!user) return null;

        user.classId = classId;
        user.role = role;
        await user.save();

        // If student, create tuition record based on class template
        if (role === 'student') {
          const existingTuition = await TuitionModel.findOne({
            studentId: user._id,
            classId,
          });
          if (!existingTuition) {
            await TuitionModel.create({
              studentId: user._id,
              classId,
              schoolId: targetClass.schoolId,
              amount: targetClass.tuitionTemplate?.amount || 0,
              breakdown: targetClass.tuitionTemplate?.breakdown || {},
              status: 'unpaid',
              urgency: 'medium',
            });
          }
        }

        return user;
      })
    );

    res.status(200).json({
      message: 'Users assigned to class successfully',
      assignedUsers: assignedUsers.filter(Boolean),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning users to class' });
  }
});

export default router;
