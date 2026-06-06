import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MyReviewsPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-6">My Reviews</h1>
        
        <div className="flex space-x-4 border-b border-secondary-200 mb-6 overflow-x-auto">
          <button className="px-4 py-2 text-sm font-semibold text-primary-600 border-b-2 border-primary-600">Reviews by You</button>
          <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Reviews for You</button>
        </div>

        <EmptyState
          title="No reviews yet"
          description="You haven't left any reviews for parking spots yet."
        />
      </div>
    </PageLayout>
  );
}
