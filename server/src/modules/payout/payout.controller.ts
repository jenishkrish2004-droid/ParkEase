import { Request, Response, NextFunction } from 'express';
import * as payoutService from './payout.service';

export const getPayoutAccountHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const account = await payoutService.getPayoutAccount(userId);
    
    res.status(200).json({
      success: true,
      data: {
        account
      }
    });
  } catch (error) {
    next(error);
  }
};

export const savePayoutAccountHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const account = await payoutService.upsertPayoutAccount(userId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Payout account configured successfully',
      data: {
        account
      }
    });
  } catch (error) {
    next(error);
  }
};
