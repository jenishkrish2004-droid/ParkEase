// ============================================================
// Database Seed Script
// ============================================================
// Run with: npm run db:seed -w server
// ============================================================

import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@parkora.com' },
    update: {},
    create: {
      email: 'admin@parkora.com',
      passwordHash: adminPasswordHash,
      firstName: 'Parkora',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create test user
  const userPasswordHash = await bcrypt.hash('User@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@parkora.com' },
    update: {},
    create: {
      email: 'user@parkora.com',
      passwordHash: userPasswordHash,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Test user created: ${user.email}`);

  // Create test owner
  const ownerPasswordHash = await bcrypt.hash('Owner@123', 12);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@parkora.com' },
    update: {},
    create: {
      email: 'owner@parkora.com',
      passwordHash: ownerPasswordHash,
      firstName: 'Test',
      lastName: 'Owner',
      role: UserRole.OWNER,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Test owner created: ${owner.email}`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
