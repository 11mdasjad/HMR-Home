import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (socketIo: Server) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Join a room (e.g. support chat channel)
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(`🔌 Client ${socket.id} joined room: ${roomName}`);
    });

    // Support chat messaging
    socket.on('send_message', (data) => {
      const { room, text, sender } = data;
      const message = {
        id: `msg_${Date.now()}`,
        text,
        sender,
        timestamp: new Date()
      };
      
      if (io) {
        io.to(room).emit('receive_message', message);
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  return io;
};

// Real-time broadcasts
export const emitRoomUpdate = (roomId: string, roomNumber: string, status: string, occupancy: number, capacity: number) => {
  if (io) {
    io.emit('room_update', { roomId, roomNumber, status, occupancy, capacity });
    console.log(`📡 Real-time Room Update: Room ${roomNumber} is now ${status} (${occupancy}/${capacity})`);
  }
};

export const emitNewLead = (lead: any) => {
  if (io) {
    io.emit('new_lead', lead);
    console.log(`📡 Real-time Support Lead: New inquiry from ${lead.fullName} for ${lead.preferredCategory}`);
  }
};

export const emitComplaintUpdate = (complaint: any) => {
  if (io) {
    io.emit('complaint_update', complaint);
    console.log(`📡 Real-time Complaint Update: Complaint ${complaint.id} status changed to ${complaint.status}`);
  }
};
