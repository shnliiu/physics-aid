'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VolumeTabs } from '@/components/VolumeTabs';
import { client } from '@/lib/amplify-client';

interface Chapter {
  id: string;
  volume: string;
  number: number;
  title: string;
  description?: string;
}

export default function VolumePage({ params }: { params: Promise<{ vol: string }> }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [unwrappedParams, setUnwrappedParams] = useState<{ vol: string } | null>(null);

  useEffect(() => {
    params.then(p => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      fetchChapters();
    }
  }, [unwrappedParams]);

  const fetchChapters = async () => {
    if (!unwrappedParams) return;
    try {
      const result = await client.models.Chapter.list({
        filter: { volume: { eq: unwrappedParams.vol } }
      });

      if (result.data) {
        const sortedChapters = result.data.sort((a: any, b: any) => a.number - b.number);
        setChapters(sortedChapters as Chapter[]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Physics 4C TA
          </h1>
        </div>
      </header>

      {/* Volume Tabs */}
      {unwrappedParams && <VolumeTabs currentVolume={unwrappedParams.vol} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {unwrappedParams?.vol === 'VOL1' && 'Volume 1: Mechanics'}
            {unwrappedParams?.vol === 'VOL2' && 'Volume 2: Thermodynamics'}
            {unwrappedParams?.vol === 'VOL3' && 'Volume 3: Modern Physics'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Select a chapter to view formulas, problems, and collaborative notes
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading chapters...
          </div>
        ) : chapters.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No chapters found for this volume yet.
            </p>
            <p className="text-sm text-gray-400">
              Run the scraper to import chapters from OpenStax.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => router.push(`/vol/${unwrappedParams?.vol}/ch/${chapter.number}`)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg
                         transition-shadow cursor-pointer p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chapter {chapter.number}
                  </h3>
                </div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {chapter.title}
                </h4>
                {chapter.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {chapter.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
