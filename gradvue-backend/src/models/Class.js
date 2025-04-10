import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Primary 1", "SS2"
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tuitionTemplate: {
      amount: { type: Number },
      breakdown: { type: Object }, // e.g. { schoolFees: 20000, books: 10000 }
    },
  },
  { timestamps: true }
);

export default mongoose.model('Class', classSchema);
