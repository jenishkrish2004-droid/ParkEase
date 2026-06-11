import { Badge } from '@/components/ui/Badge';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export function VerificationBadge({ status }: { status?: VerificationStatus }) {
  if (!status || status === 'PENDING') {
    return <Badge variant="warning">Not Verified</Badge>;
  }
  if (status === 'UNDER_REVIEW') {
    return <Badge variant="info">Under Review</Badge>;
  }
  if (status === 'APPROVED') {
    return <Badge variant="success">Verified</Badge>;
  }
  if (status === 'REJECTED') {
    return <Badge variant="danger">Verification Rejected</Badge>;
  }
  return null;
}
