import { Request, Response } from 'express';
import { prisma, useRealDb, memoryDb } from '../lib/db';

// 1. Get all rooms with calculated occupancy
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    if (useRealDb && prisma) {
      const rooms = await prisma.room.findMany({
        include: {
          students: true
        }
      });
      
      const formattedRooms = rooms.map(room => {
        const occupancy = room.students.length;
        const availableBeds = Math.max(0, room.capacity - occupancy);
        let calculatedStatus = room.status;
        
        if (room.status === 'AVAILABLE') {
          if (occupancy >= room.capacity) {
            calculatedStatus = 'OCCUPIED';
          }
        }
        
        return {
          ...room,
          occupancy,
          availableBeds,
          status: calculatedStatus
        };
      });
      res.status(200).json(formattedRooms);
    } else {
      // Memory DB fallback
      const formattedRooms = memoryDb.rooms.map(room => {
        const occupancy = memoryDb.students.filter(s => s.roomId === room.id).length;
        const availableBeds = Math.max(0, room.capacity - occupancy);
        let calculatedStatus = room.status;
        
        if (room.status === 'AVAILABLE') {
          if (occupancy >= room.capacity) {
            calculatedStatus = 'OCCUPIED';
          }
        }
        
        return {
          ...room,
          occupancy,
          availableBeds,
          status: calculatedStatus
        };
      });
      res.status(200).json(formattedRooms);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
  }
};

// 2. Add Room (Admin only)
export const addRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomNumber, category, floor, capacity, price, studyTables, chairs, cupboards, hasBathroom, hasWifi } = req.body;

    if (!roomNumber || !category || !floor || !capacity || !price) {
      res.status(400).json({ message: 'Please provide roomNumber, category, floor, capacity, and price' });
      return;
    }

    if (useRealDb && prisma) {
      const existingRoom = await prisma.room.findUnique({ where: { roomNumber } });
      if (existingRoom) {
        res.status(400).json({ message: 'Room number already exists' });
        return;
      }

      const newRoom = await prisma.room.create({
        data: {
          roomNumber,
          category,
          floor: Number(floor),
          capacity: Number(capacity),
          price: Number(price),
          studyTables: Number(studyTables || 0),
          chairs: Number(chairs || 0),
          cupboards: Number(cupboards || 0),
          hasBathroom: !!hasBathroom,
          hasWifi: !!hasWifi,
          images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop'],
          status: 'AVAILABLE'
        }
      });
      res.status(201).json(newRoom);
    } else {
      // Memory DB
      const existingRoom = memoryDb.rooms.find(r => r.roomNumber === roomNumber);
      if (existingRoom) {
        res.status(400).json({ message: 'Room number already exists' });
        return;
      }

      const newRoom = {
        id: `room_${Date.now()}`,
        roomNumber,
        category,
        floor: Number(floor),
        capacity: Number(capacity),
        price: Number(price),
        status: 'AVAILABLE' as const,
        studyTables: Number(studyTables || 0),
        chairs: Number(chairs || 0),
        cupboards: Number(cupboards || 0),
        hasBathroom: !!hasBathroom,
        hasWifi: !!hasWifi,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop'],
      };

      memoryDb.rooms.push(newRoom);
      res.status(201).json(newRoom);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding room', error: error.message });
  }
};

// 3. Edit Room Details / Pricing
export const editRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { price, capacity, category, status } = req.body;

    if (useRealDb && prisma) {
      const updatedRoom = await prisma.room.update({
        where: { id },
        data: {
          price: price !== undefined ? Number(price) : undefined,
          capacity: capacity !== undefined ? Number(capacity) : undefined,
          category,
          status
        }
      });
      res.status(200).json(updatedRoom);
    } else {
      // Memory DB
      const roomIdx = memoryDb.rooms.findIndex(r => r.id === id);
      if (roomIdx === -1) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }

      memoryDb.rooms[roomIdx] = {
        ...memoryDb.rooms[roomIdx],
        price: price !== undefined ? Number(price) : memoryDb.rooms[roomIdx].price,
        capacity: capacity !== undefined ? Number(capacity) : memoryDb.rooms[roomIdx].capacity,
        category: category || memoryDb.rooms[roomIdx].category,
        status: status || memoryDb.rooms[roomIdx].status
      };

      res.status(200).json(memoryDb.rooms[roomIdx]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

// 4. Delete Room
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (useRealDb && prisma) {
      await prisma.room.delete({ where: { id } });
      res.status(200).json({ message: 'Room deleted successfully' });
    } else {
      // Memory DB
      const roomIdx = memoryDb.rooms.findIndex(r => r.id === id);
      if (roomIdx === -1) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }
      memoryDb.rooms.splice(roomIdx, 1);
      res.status(200).json({ message: 'Room deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};
