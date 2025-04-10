import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });
};

const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany();

    const users = [
      {
        name: 'Principal Jane',
        email: 'principal@gradvue.com',
        password: '123456',
        role: 'principal',
      },
      {
        name: 'Mr. Smith',
        email: 'teacher@gradvue.com',
        password: '123456',
        role: 'teacher',
      },
      {
        name: 'Mrs. Clara',
        email: 'parent@gradvue.com',
        password: '123456',
        role: 'parent',
      },
      {
        name: 'John Doe',
        email: 'student@gradvue.com',
        password: '123456',
        role: 'student',
      },
    ];

    const created = await User.insertMany(users);
    console.log('Users seeded successfully!\n');

    created.forEach((user) => {
      const token = generateToken(user);
      console.log(`✅ ${user.role.toUpperCase()} (${user.email})`);
      console.log(`🔑 Token:\n${token}\n`);
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
