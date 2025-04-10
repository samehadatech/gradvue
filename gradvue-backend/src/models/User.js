import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['principal', 'teacher', 'parent', 'student'],
    default: 'student',
  },
  assignedClass: { type: String }, // For teachers and students
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },

  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);
