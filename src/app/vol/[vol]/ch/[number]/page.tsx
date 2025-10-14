'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VolumeTabs } from '@/components/VolumeTabs';
import { AIChat } from '@/components/AIChat';
import { client } from '@/lib/amplify-client';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

type TabType = 'formulas' | 'problems' | 'wiki' | 'chat';

export default function ChapterPage({
  params,
}: {
  params: { vol: string; number: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('formulas');
  const [chapter, setChapter] = useState<any>(null);
  const [formulas, setFormulas] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [wiki, setWiki] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedChapter, setRelatedChapter] = useState<any>(null);

  const chapterNumber = parseInt(params.number);

  useEffect(() => {
    fetchChapterData();
  }, [params.vol, params.number]);

  const fetchChapterData = async () => {
    try {
      // Fetch chapter
      const chapterResult = await client.models.Chapter.list({
        filter: {
          volume: { eq: params.vol },
          number: { eq: chapterNumber },
        },
      });

      if (chapterResult.data && chapterResult.data.length > 0) {
        const chap = chapterResult.data[0];
        setChapter(chap);

        // Fetch formulas for this chapter
        const formulasResult = await client.models.Formula.list({
          filter: { chapterId: { eq: chap.id } },
        });
        setFormulas(formulasResult.data || []);

        // Fetch problems for this chapter
        const problemsResult = await client.models.ProblemPost.listByChapter({
          chapterId: chap.id,
        });
        setProblems(problemsResult.data || []);

        // Fetch wiki page
        const wikiResult = await client.models.WikiPage.list({
          filter: { chapterId: { eq: chap.id } },
        });
        if (wikiResult.data && wikiResult.data.length > 0) {
          setWiki(wikiResult.data[0]);
        }

        // Check for related chapter (Vol 3 Ch 3-4 → Vol 1 Ch 16)
        if (params.vol === 'VOL3' && (chapterNumber === 3 || chapterNumber === 4)) {
          const relatedResult = await client.models.Chapter.list({
            filter: {
              volume: { eq: 'VOL1' },
              number: { eq: 16 },
            },
          });
          if (relatedResult.data && relatedResult.data.length > 0) {
            setRelatedChapter(relatedResult.data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading chapter...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Chapter not found</p>
            <button
              onClick={() => router.push(`/vol/${params.vol}`)}
              className="mt-4 text-blue-600 hover:underline"
            >
              ← Back to chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <VolumeTabs currentVolume={params.vol} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/vol/${params.vol}`)}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            ← Back to chapters
          </button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chapter {chapter.number}: {chapter.title}
          </h2>
          {chapter.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {chapter.description}
            </p>
          )}
        </div>

        {/* Related Chapter Banner (Vol 3 Ch 3-4 → Vol 1 Ch 16) */}
        {relatedChapter && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🔗 <strong>Related Topic:</strong> This chapter is related to{' '}
              <button
                onClick={() => router.push(`/vol/VOL1/ch/16`)}
                className="underline font-semibold hover:text-blue-600"
              >
                Volume 1, Chapter 16: Waves
              </button>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex gap-4">
            {(['formulas', 'problems', 'wiki', 'chat'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'formulas' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Formulas ({formulas.length})
              </h3>
              {formulas.length === 0 ? (
                <p className="text-gray-500">No formulas yet for this chapter.</p>
              ) : (
                <div className="grid gap-4">
                  {formulas.map((formula) => (
                    <div
                      key={formula.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {formula.title}
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded mb-2 overflow-x-auto">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {`$${formula.latex}$`}
                        </ReactMarkdown>
                      </div>
                      {formula.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formula.description}
                        </p>
                      )}
                      {formula.tags && formula.tags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {formula.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900
                                       text-blue-800 dark:text-blue-200 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'problems' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Problems ({problems.length})
                </h3>
                <button
                  onClick={() => router.push('/problems/new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Post Problem
                </button>
              </div>
              {problems.length === 0 ? (
                <p className="text-gray-500">No problems yet for this chapter.</p>
              ) : (
                <div className="grid gap-4">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      onClick={() => router.push(`/problems/${problem.id}`)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer
                               hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {problem.title}
                        </h4>
                        {problem.aiVerified && (
                          <span className="text-green-500 text-xl" title="AI Verified">
                            ⭐
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {problem.body}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded ${
                            problem.status === 'SOLVED'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : problem.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {problem.status}
                        </span>
                        {problem.difficulty && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            Difficulty: {problem.difficulty}/5
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wiki' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Collaborative Wiki
              </h3>
              {!wiki ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 mb-4">No wiki page yet for this chapter.</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Create Wiki Page
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {wiki.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[600px]">
              <AIChat chapterId={chapter.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
