import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database rooms...');
  
  // Clean first
  await prisma.room.deleteMany({});
  
  // Seed 3 Seater rooms (30 rooms, floor 1)
  for (let r = 101; r <= 130; r++) {
    await prisma.room.create({
      data: {
        roomNumber: String(r),
        category: '3 Seater',
        floor: 1,
        capacity: 3,
        price: 125000,
        studyTables: 3,
        chairs: 3,
        cupboards: 3,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600&auto=format&fit=crop'],
        status: 'AVAILABLE'
      }
    });
  }

  // Seed 2 Seater rooms (20 rooms, floor 2)
  for (let r = 201; r <= 220; r++) {
    await prisma.room.create({
      data: {
        roomNumber: String(r),
        category: '2 Seater',
        floor: 2,
        capacity: 2,
        price: 140000,
        studyTables: 2,
        chairs: 2,
        cupboards: 2,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'],
        status: 'AVAILABLE'
      }
    });
  }

  // Seed Single Seater rooms (20 rooms, floor 3)
  for (let r = 301; r <= 320; r++) {
    await prisma.room.create({
      data: {
        roomNumber: String(r),
        category: 'Single Seater',
        floor: 3,
        capacity: 1,
        price: 160000,
        studyTables: 1,
        chairs: 1,
        cupboards: 1,
        hasBathroom: true,
        hasWifi: true,
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop'],
        status: 'AVAILABLE'
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
