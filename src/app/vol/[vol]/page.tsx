'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VolumeTabs } from '@/components/VolumeTabs';

export default function VolumePage({ params }: { params: Promise<{ vol: string }> }) {
  const router = useRouter();
  const [vol, setVol] = useState<string>('');

  useEffect(() => {
    params.then(({ vol }) => setVol(vol));
  }, [params]);

  const mockChapters = [
    { number: 1, title: 'Temperature and Heat' },
    { number: 2, title: 'Kinetic Theory of Gases' },
    { number: 3, title: 'The First Law of Thermodynamics' },
    { number: 4, title: 'The Second Law of Thermodynamics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Physics Volume {vol}
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockChapters.map((chapter) => (
            <div
              key={chapter.number}
              onClick={() => router.push(`/vol/${vol}/ch/${chapter.number}`)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Chapter {chapter.number}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {chapter.title}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Database Migration Notice
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Chapter data is being migrated from AWS Amplify to Supabase. 
            Full functionality will be restored once the migration is complete.
          </p>
        </div>
      </main>
    </div>
  );
}
