import { Link, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function UnderDevelopmentPage() {
  const location = useLocation();

  return (
    <PageLayout showFooter={false}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl" aria-hidden="true">🚧</span>
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Under Development</h1>
        <p className="text-secondary-500 max-w-md mx-auto mb-8">
          The page <code className="bg-secondary-100 px-1.5 py-0.5 rounded text-sm text-secondary-700">{location.pathname}</code> is currently being built. Check back soon!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Link
            to="/dashboard"
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-semibold',
              'bg-primary-600 text-white hover:bg-primary-700',
              'transition-colors no-underline'
            )}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
