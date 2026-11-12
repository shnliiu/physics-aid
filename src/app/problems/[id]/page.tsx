'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useSupabase();
  const problemId = params.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Problem Details
            </h1>
            <button
              onClick={() => router.push('/problems')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Problems
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Database Migration Notice
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Problem details are being migrated from AWS Amplify to Supabase. 
            This functionality will be restored once the migration is complete.
          </p>
          <p className="text-sm text-gray-500">
            Problem ID: {problemId}
          </p>
        </div>
      </main>
    </div>
  );
}
