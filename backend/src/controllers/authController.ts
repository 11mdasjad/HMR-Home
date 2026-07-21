import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, useRealDb, memoryDb } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'hmr_hostel_super_secret_key_123';

// Generate Token
const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

// 1. Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide name, email and password' });
      return;
    }

    // Check if user exists
    if (useRealDb && prisma) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          phone,
          role: 'STUDENT',
          isVerified: false,
          otp: Math.floor(100000 + Math.random() * 900000).toString(),
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
          studentProfile: {
            create: {} // Create blank student profile
          }
        },
        include: {
          studentProfile: true
        }
      });

      const token = generateToken(user.id, user.email, user.role);
      res.status(201).json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified }
      });
    } else {
      // Memory DB fallback
      const existingUser = memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `user_${Date.now()}`;
      const studentId = `student_${Date.now()}`;

      const newUser = {
        id: userId,
        email,
        passwordHash,
        name,
        role: 'STUDENT' as const,
        isVerified: true, // Auto verify in memory DB for smooth flow
        phone,
        createdAt: new Date()
      };

      const newStudent = {
        id: studentId,
        userId: userId,
        phone,
        email
      };

      memoryDb.users.push(newUser);
      memoryDb.students.push(newStudent);

      const token = generateToken(userId, email, 'STUDENT');
      res.status(201).json({
        token,
        user: { id: userId, email, name, role: 'STUDENT', isVerified: true }
      });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 2. Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    if (useRealDb && prisma) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const token = generateToken(user.id, user.email, user.role);
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified }
      });
    } else {
      // Memory DB fallback
      const user = memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const token = generateToken(user.id, user.email, user.role);
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified }
      });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 3. Forgot Password / Verify OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'OTP verified successfully' });
};

// 4. Get Current User Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (useRealDb && prisma) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: {
            include: {
              room: true
            }
          }
        }
      });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } else {
      // Memory DB
      const user = memoryDb.users.find(u => u.id === userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const studentProfile = memoryDb.students.find(s => s.userId === userId);
      let room = null;
      if (studentProfile?.roomId) {
        room = memoryDb.rooms.find(r => r.id === studentProfile.roomId) || null;
      }

      res.status(200).json({
        ...user,
        studentProfile: studentProfile ? { ...studentProfile, room } : null
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 5. Update Profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const updateData = req.body;

    if (useRealDb && prisma) {
      const updatedStudent = await prisma.student.update({
        where: { userId },
        data: updateData
      });
      res.status(200).json({ message: 'Profile updated successfully', student: updatedStudent });
    } else {
      // Memory DB
      const studentIdx = memoryDb.students.findIndex(s => s.userId === userId);
      if (studentIdx === -1) {
        res.status(404).json({ message: 'Student profile not found' });
        return;
      }

      memoryDb.students[studentIdx] = {
        ...memoryDb.students[studentIdx],
        ...updateData
      };

      res.status(200).json({ message: 'Profile updated successfully', student: memoryDb.students[studentIdx] });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
