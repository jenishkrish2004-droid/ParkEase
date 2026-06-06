import { Request, Response } from 'express';
import * as userService from './user.service';

export async function getProfile(req: Request, res: Response) {
  const userId = req.user!.id;
  const profile = await userService.getProfile(userId);
  res.status(200).json({ success: true, data: profile });
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user!.id;
  const updatedUser = await userService.updateProfile(userId, req.body);
  res.status(200).json({ success: true, data: updatedUser });
}

export async function updatePassword(req: Request, res: Response) {
  const userId = req.user!.id;
  await userService.updatePassword(userId, req.body);
  res.status(200).json({ success: true, message: 'Password updated successfully' });
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.user!.id;
  await userService.deleteAccount(userId);
  res.status(200).json({ success: true, message: 'Account deleted successfully' });
}
