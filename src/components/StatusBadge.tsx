interface StatusBadgeProps {
  status: 'NEED_HELP' | 'IN_PROGRESS' | 'SOLVED';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const statusConfig = {
    NEED_HELP: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      icon: '❓',
      label: 'Need Help',
    },
    IN_PROGRESS: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: '⏳',
      label: 'In Progress',
    },
    SOLVED: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      icon: '✓',
      label: 'Solved',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}
      `}
    >
      <span className="leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: number;
  showLabel?: boolean;
}

export function DifficultyBadge({ difficulty, showLabel = true }: DifficultyBadgeProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < difficulty);

  return (
    <div className="inline-flex items-center gap-2">
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
      )}
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <span
            key={i}
            className={`text-lg ${
              filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

interface AIVerifiedBadgeProps {
  verified: boolean;
  note?: string;
}

export function AIVerifiedBadge({ verified, note }: AIVerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30
                 text-purple-700 dark:text-purple-300 rounded-full border border-purple-200
                 dark:border-purple-800 text-sm font-medium"
      title={note}
    >
      <span className="text-lg">⭐</span>
      <span>AI Verified</span>
    </div>
  );
}

interface FeaturedBadgeProps {
  featured: boolean;
}

export function FeaturedBadge({ featured }: FeaturedBadgeProps) {
  if (!featured) return null;

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30
                 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200
                 dark:border-blue-800 text-sm font-medium"
    >
      <span className="text-lg">📌</span>
      <span>Featured</span>
    </div>
  );
}
