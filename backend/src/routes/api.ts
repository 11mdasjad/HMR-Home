import { Router } from 'express';
import { registerUser, loginUser, getProfile, updateProfile, verifyOTP } from '../controllers/authController';
import { getRooms, addRoom, editRoom, deleteRoom } from '../controllers/roomController';
import { createLead, confirmBooking, getLeads, updateLead, getBookings } from '../controllers/bookingController';
import { raiseComplaint, getComplaints, updateComplaint, createAnnouncement, getAnnouncements, getDashboardStats } from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/verify-otp', verifyOTP);
router.get('/auth/profile', authenticateJWT, getProfile);
router.put('/auth/profile', authenticateJWT, updateProfile);

// Room Routes
router.get('/rooms', getRooms);
router.post('/rooms', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), addRoom);
router.put('/rooms/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), editRoom);
router.delete('/rooms/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteRoom);

// Booking Routes
router.post('/bookings/lead', createLead);
router.post('/bookings/confirm', authenticateJWT, confirmBooking);
router.get('/bookings', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getBookings);

// Support Lead Routes
router.get('/leads', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getLeads);
router.put('/leads/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateLead);

// Complaint Routes
router.post('/complaints', authenticateJWT, raiseComplaint);
router.get('/complaints', authenticateJWT, getComplaints);
router.put('/complaints/:id', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateComplaint);

// Announcement Routes
router.get('/announcements', getAnnouncements);
router.post('/announcements', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), createAnnouncement);

// Stats & Dashboard
router.get('/dashboard/stats', authenticateJWT, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getDashboardStats);

export default router;
