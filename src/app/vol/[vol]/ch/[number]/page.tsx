'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VolumeTabs } from '@/components/VolumeTabs';
import { AIChat } from '@/components/AIChat';

type TabType = 'formulas' | 'problems' | 'wiki' | 'chat';

export default function ChapterPage({ params }: { params: Promise<{ vol: string; number: string }> }) {
  const { vol, number } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('formulas');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Volume {vol} - Chapter {number}
            </h1>
            <button
              onClick={() => router.push(`/vol/${vol}`)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Volume
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VolumeTabs currentVolume={vol} />

        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            {(['formulas', 'problems', 'wiki', 'chat'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'chat' ? (
            <AIChat />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Chapter Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Volume {vol}, Chapter {number}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
