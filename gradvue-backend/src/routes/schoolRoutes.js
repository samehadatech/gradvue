import express from 'express';
import School from '../models/School.js';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Create a school
router.post(
  '/',
  verifyToken,
  allowRoles('principal', 'admin'),
  async (req, res) => {
    try {
      const { name, address } = req.body;
      const school = new School({
        name,
        address,
        createdBy: req.user._id,
      });

      await school.save();

      // Assign creator to school
      await User.findByIdAndUpdate(req.user._id, { schoolId: school._id });

      res.status(201).json({ success: true, school });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

export default router;
