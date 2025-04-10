// // import mongoose from 'mongoose';

// // const tuitionSchema = new mongoose.Schema(
// //   {
// //     studentId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: 'User',
// //       required: true,
// //     },
// //     term: { type: String, required: true }, // e.g. "2024/2025 Term 1"
// //     breakdown: [
// //       {
// //         title: String, // e.g. "Tuition", "Library", "Uniform"
// //         amount: Number,
// //       },
// //     ],
// //     amountPaid: { type: Number, default: 0 },
// //     dueDate: { type: Date, required: true },
// //     notes: { type: String },
// //   },
// //   { timestamps: true }
// // );

// // // Virtual to calculate total amount
// // tuitionSchema.virtual('totalAmount').get(function () {
// //   return this.breakdown.reduce((sum, item) => sum + item.amount, 0);
// // });

// // // Virtual to get status and urgency
// // tuitionSchema.virtual('statusInfo').get(function () {
// //   const total = this.breakdown.reduce((sum, item) => sum + item.amount, 0);
// //   const outstanding = total - this.amountPaid;
// //   const percentPaid = (this.amountPaid / total) * 100;

// //   let status = 'paid';
// //   let statusColor = 'green';

// //   if (percentPaid < 100 && percentPaid >= 50) {
// //     status = 'partial';
// //     statusColor = 'yellow';
// //   } else if (percentPaid < 50) {
// //     status = 'unpaid';
// //     statusColor = 'red';
// //   }

// //   return { total, outstanding, percentPaid, status, statusColor };
// // });

// // tuitionSchema.set('toJSON', { virtuals: true });
// // tuitionSchema.set('toObject', { virtuals: true });

// // export default mongoose.model('Tuition', tuitionSchema);
// //////////////////////////////////////
// import mongoose from 'mongoose';

// const tuitionSchema = new mongoose.Schema(
//   {
//     studentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     term: { type: String, required: true }, // e.g. "2024/2025 Term 1"
//     breakdown: [
//       {
//         title: { type: String, required: true },
//         amount: { type: Number, required: true },
//         paid: { type: Number, default: 0 },
//       },
//     ],
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Tuition', tuitionSchema);

// models/Tuition.js
const tuitionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    amount: Number,
    breakdown: Object, // optional object like { tuition: 20000, uniform: 5000 }
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'partial'],
      default: 'unpaid',
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);
