// ============================================================
// Review
// ============================================================

export interface IReview {
  id: string;
  userId: string;
  parkingSpotId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  ownerReply: string | null;
  ownerReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Review with user info for display */
export interface IReviewWithUser extends IReview {
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}
