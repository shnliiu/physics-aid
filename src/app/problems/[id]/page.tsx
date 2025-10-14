'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/amplify-client';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [problem, setProblem] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const fetchProblem = async () => {
    try {
      const problemResult = await client.models.ProblemPost.get({ id: params.id });
      if (problemResult.data) {
        setProblem(problemResult.data);

        // Fetch comments
        const commentsResult = await client.models.Comment.list({
          filter: { postId: { eq: params.id } }
        });
        setComments(commentsResult.data || []);
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!problem) return;

    setVerifying(true);
    try {
      const result = await client.mutations.verifyProblemSolution({
        problemId: problem.id,
        solution: problem.body,
        canvasJson: problem.canvasJson,
      });

      if (result.data) {
        alert(`AI Verification: ${result.data.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}\n\n${result.data.explanation}`);
        // Refresh problem to show updated verification status
        fetchProblem();
      }
    } catch (error: any) {
      console.error('Error verifying:', error);
      alert(`Verification failed: ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Get current user
      const userResult = await client.models.User.list();
      if (!userResult.data || userResult.data.length === 0) {
        alert('User not found');
        return;
      }

      await client.models.Comment.create({
        postId: params.id,
        authorId: userResult.data[0].id,
        body: newComment,
      });

      setNewComment('');
      fetchProblem(); // Refresh to show new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Problem Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {problem.title}
            </h1>
            {problem.aiVerified && (
              <span className="text-green-500 text-2xl" title="AI Verified Correct">
                ⭐
              </span>
            )}
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 text-sm rounded ${
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
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded">
                Difficulty: {problem.difficulty}/5
              </span>
            )}
            {problem.featured && (
              <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Problem body */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {problem.body}
            </ReactMarkdown>
          </div>

          {/* AI Verification */}
          {problem.aiVerificationNote && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                AI Feedback:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {problem.aiVerificationNote}
              </p>
            </div>
          )}

          {/* Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {problem.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? 'Verifying...' : '🤖 Verify with AI'}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Discussion ({comments.length})
          </h2>

          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {comment.body}
                    </ReactMarkdown>
                  </div>
                  {comment.aiVerified && (
                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 inline-block">
                      ⭐ AI Verified
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add a comment
            </label>
            <textarea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, solutions, or questions..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
