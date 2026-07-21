// Memory database fallback for HMR Hostel when MongoDB is not connected/active
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  phone?: string | null;
  createdAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  fatherName?: string | null;
  motherName?: string | null;
  gender?: string | null;
  dob?: Date | null;
  phone?: string | null;
  emergencyContact?: string | null;
  collegeName?: string | null;
  course?: string | null;
  year?: string | null;
  studentId?: string | null;
  aadharNumber?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianRelation?: string | null;
  bloodGroup?: string | null;
  medicalHistory?: string | null;
  photoUrl?: string | null;
  aadharUrl?: string | null;
  collegeIdUrl?: string | null;
  signatureUrl?: string | null;
  roomId?: string | null;
  bedNumber?: string | null;
}

export interface Room {
  id: string;
  roomNumber: string;
  category: string; // "3 Seater", "2 Seater", "Single Seater"
  floor: number;
  capacity: number;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  studyTables: number;
  chairs: number;
  cupboards: number;
  hasBathroom: boolean;
  hasWifi: boolean;
  images: string[];
}

export interface Booking {
  id: string;
  bookingId: string;
  studentId: string;
  roomId: string;
  bedNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'CANCELLED';
  fullName: string;
  phone: string;
  email: string;
  collegeName: string;
  course: string;
  year: string;
  aadharNumber: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  paymentId?: string | null;
  qrCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportLead {
  id: string;
  leadId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredCategory: string;
  selectedRoomNumber?: string | null;
  selectedBedNumber?: string | null;
  bookingProgress: string;
  status: 'NEW_INQUIRY' | 'PENDING' | 'CONTACTED' | 'INTERESTED' | 'CONFIRMED' | 'CLOSED';
  assignedTo?: string | null;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  transactionId: string;
  studentId: string;
  amount: number;
  method: string;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  receiptUrl?: string | null;
  createdAt: Date;
}

export interface Complaint {
  id: string;
  studentId: string;
  roomId: string;
  category: string; // "ELECTRICITY", "WATER", etc.
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date | null;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}

export interface Visitor {
  id: string;
  studentId: string;
  visitorName: string;
  relationship: string;
  purpose: string;
  checkIn: Date;
  checkOut?: Date | null;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string | null;
  timestamp: Date;
}

class InMemoryDatabase {
  users: User[] = [];
  students: Student[] = [];
  rooms: Room[] = [];
  bookings: Booking[] = [];
  supportLeads: SupportLead[] = [];
  payments: Payment[] = [];
  complaints: Complaint[] = [];
  announcements: Announcement[] = [];
  attendanceLogs: Attendance[] = [];
  visitors: Visitor[] = [];
  auditLogs: AuditLog[] = [];

  constructor() {
    this.seedRooms();
    this.seedAdmins();
  }

  private seedRooms() {
    // Total rooms = 70
    // 3 Seater: 30 Rooms (101 to 130)
    for (let r = 101; r <= 130; r++) {
      this.rooms.push({
        id: `room_3s_${r}`,
        roomNumber: String(r),
        category: '3 Seater',
        floor: 1,
        capacity: 3,
        price: 125000,
        status: 'AVAILABLE',
        studyTables: 3,
        chairs: 3,
        cupboards: 3,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop'],
      });
    }

    // 2 Seater: 20 Rooms (201 to 220)
    for (let r = 201; r <= 220; r++) {
      this.rooms.push({
        id: `room_2s_${r}`,
        roomNumber: String(r),
        category: '2 Seater',
        floor: 2,
        capacity: 2,
        price: 140000,
        status: 'AVAILABLE',
        studyTables: 2,
        chairs: 2,
        cupboards: 2,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'],
      });
    }

    // Single Seater: 20 Rooms (301 to 320)
    for (let r = 301; r <= 320; r++) {
      this.rooms.push({
        id: `room_1s_${r}`,
        roomNumber: String(r),
        category: 'Single Seater',
        floor: 3,
        capacity: 1,
        price: 160000,
        status: 'AVAILABLE',
        studyTables: 1,
        chairs: 1,
        cupboards: 1,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop'],
      });
    }
  }

  private seedAdmins() {
    // Seed default Admin & Super Admin for quick access
    // Admin password: password123
    this.users.push({
      id: 'admin_user_id',
      email: 'admin@hmr.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      name: 'Hostel Admin Manager',
      role: 'ADMIN',
      isVerified: true,
      createdAt: new Date(),
    });

    this.users.push({
      id: 'super_admin_user_id',
      email: 'superadmin@hmr.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      name: 'HMR Super Admin',
      role: 'SUPER_ADMIN',
      isVerified: true,
      createdAt: new Date(),
    });

    // Seed a couple of announcements
    this.announcements.push({
      id: 'ann_1',
      title: 'Hostel Re-opening & Check-in Schedule',
      content: 'All students are requested to complete check-in procedures between July 25th and July 30th. Please bring a printed copy of your booking receipt and college ID.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: 'Hostel Admin Manager'
    });

    this.announcements.push({
      id: 'ann_2',
      title: 'Wi-Fi Maintenance Notice',
      content: 'Wi-Fi services will undergo scheduled maintenance on Sunday from 2 AM to 5 AM. Internet services might be disrupted during this period.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdBy: 'Hostel Admin Manager'
    });
  }
}

export const db = new InMemoryDatabase();
