import mongoose from 'mongoose';
import User from './models/User.js';
import School from './models/School.js';
import Class from './models/Class.js';
import Tuition from './models/Tuition.js';

// Sample tuition template for seeding
const tuitionTemplate = {
  amount: 30000, // Total amount for tuition
  breakdown: {
    tuition: 25000, // Tuition part
    books: 5000, // Books/materials
  },
  status: 'unpaid',
  urgency: 'high',
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await mongoose.connection.db.dropDatabase();

    // Create a school
    const school = await School.create({
      name: 'Greenwood International School',
      address: '123 Elm St, Lagos, Nigeria',
      contact: '+234 123 4567',
    });

    // Create a class with the tuition template
    const newClass = await Class.create({
      name: 'Class 1A',
      schoolId: school._id,
      tuitionTemplate, // Attach the tuition template to the class
    });

    // Create sample users (students and teachers)
    const students = [
      { firstName: 'John', lastName: 'Doe', role: 'student' },
      { firstName: 'Jane', lastName: 'Smith', role: 'student' },
    ];

    const teachers = [
      { firstName: 'Mr.', lastName: 'Brown', role: 'teacher' },
      { firstName: 'Ms.', lastName: 'Green', role: 'teacher' },
    ];

    // Insert students and teachers into the database
    const allUsers = [
      ...students.map((student) => ({ ...student, schoolId: school._id })),
      ...teachers.map((teacher) => ({ ...teacher, schoolId: school._id })),
    ];

    const createdUsers = await User.insertMany(allUsers);

    // Assign students and teachers to the class and generate tuition for students
    const userIds = createdUsers.map((user) => user._id);
    await Promise.all(
      userIds.map(async (userId) => {
        const user = await User.findById(userId);
        if (user.role === 'student') {
          // Generate tuition record for the student
          await Tuition.create({
            studentId: user._id,
            classId: newClass._id,
            schoolId: school._id,
            amount: tuitionTemplate.amount,
            breakdown: tuitionTemplate.breakdown,
            status: 'unpaid',
            urgency: 'high',
          });
        }
      })
    );

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Connect to database and seed
mongoose
  .connect('mongodb://localhost:27017/gradvue', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    seedDatabase();
  });
