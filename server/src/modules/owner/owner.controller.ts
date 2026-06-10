import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';
import * as ownerService from './owner.service';

export async function getOwnerMetricsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const metrics = await ownerService.getOwnerMetrics(userId);
    sendSuccess(res, { metrics });
  } catch (error) {
    next(error);
  }
}
