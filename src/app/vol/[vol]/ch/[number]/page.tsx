'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VolumeTabs } from '@/components/VolumeTabs';
import { AIChat } from '@/components/AIChat';
import { client } from '@/lib/amplify-client';
import { getCurrentUser } from 'aws-amplify/auth';
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showClassNotes, setShowClassNotes] = useState(false);
  const [classNotes, setClassNotes] = useState<any[]>([]);

  const chapterNumber = parseInt(params.number);

  useEffect(() => {
    checkUser();
    fetchChapterData();
  }, [params.vol, params.number]);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.log('User not authenticated');
      setCurrentUser(null);
    }
  };

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

  const fetchClassNotes = async () => {
    if (!chapter) return;
    try {
      // Fetch all wiki edits for this chapter to show as "class notes"
      const editsResult = await client.models.WikiEdit.list({
        filter: { pageId: { eq: wiki?.id } },
      });
      setClassNotes(editsResult.data || []);
    } catch (error) {
      console.error('Error fetching class notes:', error);
    }
  };

  const createWikiPage = async () => {
    if (!currentUser || !chapter) return;

    const defaultContent = `# ${chapter.title}

## Overview
Start building collaborative notes for this chapter. Add key concepts, examples, and insights.

## Key Concepts
- Add important concepts here
- Include formulas and explanations

## Examples
- Add worked examples
- Include problem-solving strategies

## Additional Resources
- Links to related material
- References and citations

---
*This is a collaborative page. Please contribute your insights and help make this a comprehensive resource for everyone!*`;

    try {
      const result = await client.models.WikiPage.create({
        chapterId: chapter.id,
        content: defaultContent,
      });
      setWiki(result.data);
      setEditContent(defaultContent);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating wiki page:', error);
      alert('Error creating wiki page. Please try again.');
    }
  };

  const startEditing = () => {
    if (!currentUser) {
      alert('Please sign in to edit the wiki page.');
      return;
    }
    setEditContent(wiki.content);
    setIsEditing(true);
  };

  const saveWikiPage = async (summary = '') => {
    if (!currentUser || !wiki) return;

    try {
      // Update the wiki page
      await client.models.WikiPage.update({
        id: wiki.id,
        content: editContent,
      });

      // Create an edit record for version history
      await client.models.WikiEdit.create({
        pageId: wiki.id,
        authorId: currentUser.userId,
        diff: editContent, // In a real app, you'd calculate the actual diff
        summary: summary || 'Updated wiki content',
      });

      setWiki({ ...wiki, content: editContent });
      setIsEditing(false);
      alert('Wiki page updated successfully!');
    } catch (error) {
      console.error('Error saving wiki page:', error);
      alert('Error saving wiki page. Please try again.');
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent('');
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
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Collaborative Wiki & Notes</h3>
                <p className="text-blue-100 mb-4">
                  Share your notes, insights, and explanations with classmates. Everyone can contribute to build a comprehensive study resource!
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (wiki) {
                        fetchClassNotes();
                        setShowClassNotes(true);
                      } else {
                        alert('No wiki page exists yet. Create one to start adding notes!');
                      }
                    }}
                    className="px-6 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30"
                  >
                    VIEW CLASS NOTES
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert('Please sign in to add your notes.');
                        return;
                      }
                      if (wiki) {
                        startEditing();
                      } else {
                        createWikiPage();
                      }
                    }}
                    className="px-6 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30"
                  >
                    ADD YOUR NOTES
                  </button>
                </div>
              </div>

              {showClassNotes && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Class Notes History
                    </h4>
                    <button
                      onClick={() => setShowClassNotes(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ✕ Close
                    </button>
                  </div>
                  {classNotes.length === 0 ? (
                    <p className="text-gray-500">No edit history available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {classNotes.map((note, index) => (
                        <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Edit #{classNotes.length - index} • {new Date(note.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-gray-900 dark:text-white">
                                {note.summary || 'Updated wiki content'}
                              </p>
                            </div>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              Community Edit
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!wiki && !isEditing ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No collaborative notes exist yet for this chapter.</p>
                  <p className="text-sm text-gray-400 mb-6">
                    Be the first to contribute! Create a wiki page to start building a shared knowledge base.
                  </p>
                  {currentUser ? (
                    <button
                      onClick={createWikiPage}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Create Wiki Page
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Please sign in to create a wiki page.
                    </p>
                  )}
                </div>
              ) : isEditing ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Editing Wiki Page
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveWikiPage()}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Tip: Use Markdown syntax and LaTeX for formulas (e.g., $E = mc^2$)
                    </p>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                      placeholder="Enter your notes in Markdown format..."
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Preview:</h5>
                    <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-4 rounded border">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {editContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Collaborative Notes
                    </h4>
                    {currentUser && (
                      <button
                        onClick={startEditing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Edit Page
                      </button>
                    )}
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {wiki.content}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                      This is a collaborative page. {currentUser ? 'Click "Edit Page" to contribute!' : 'Sign in to contribute to these notes.'}
                    </p>
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
