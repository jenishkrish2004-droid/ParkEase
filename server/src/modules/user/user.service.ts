import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors';
import * as bcrypt from 'bcrypt';
import type { UpdateProfileInput, UpdatePasswordInput } from './user.schema';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isOwner: true,
      ownerVerified: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // If updating phone, check for uniqueness
  if (data.phone && data.phone !== user.phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) {
      throw new AppError('Phone number already in use', 409, 'PHONE_ALREADY_EXISTS');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isOwner: true,
      ownerVerified: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

export async function updatePassword(userId: string, data: UpdatePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const isValidPassword = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Incorrect current password', 401, 'INVALID_PASSWORD');
  }

  const passwordHash = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true };
}

export async function deleteAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Delete user (cascade will delete refresh tokens, bookings, etc.)
  await prisma.user.delete({ where: { id: userId } });

  return { success: true };
}
