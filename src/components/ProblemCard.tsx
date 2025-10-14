'use client';

import { useRouter } from 'next/navigation';
import { StatusBadge, DifficultyBadge, AIVerifiedBadge, FeaturedBadge } from './StatusBadge';

interface ProblemCardProps {
  problem: {
    id: string;
    title: string;
    body: string;
    status: 'NEED_HELP' | 'IN_PROGRESS' | 'SOLVED';
    difficulty?: number;
    aiVerified?: boolean;
    featured?: boolean;
    tags?: string[];
  };
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/problems/${problem.id}`)}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl
                 transition-all duration-300 cursor-pointer p-6 border border-gray-100
                 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700
                 hover:-translate-y-1 transform"
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600
                       dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
          {problem.title}
        </h3>
        <div className="flex items-center gap-2 ml-2">
          {problem.aiVerified && (
            <span className="text-2xl" title="AI Verified">
              ⭐
            </span>
          )}
          {problem.featured && (
            <span className="text-xl" title="Featured">
              📌
            </span>
          )}
        </div>
      </div>

      {/* Body preview */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {problem.body}
      </p>

      {/* Footer with status and difficulty */}
      <div className="flex items-center justify-between gap-4">
        <StatusBadge status={problem.status} size="sm" />
        {problem.difficulty && (
          <DifficultyBadge difficulty={problem.difficulty} showLabel={false} />
        )}
      </div>

      {/* Tags */}
      {problem.tags && problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {problem.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600
                       dark:text-gray-300 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {problem.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{problem.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}
