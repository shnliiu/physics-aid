'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VOLUMES = [
  { id: 'VOL1', label: 'Volume 1', description: 'Mechanics' },
  { id: 'VOL2', label: 'Volume 2', description: 'Thermodynamics' },
  { id: 'VOL3', label: 'Volume 3', description: 'Modern Physics' },
];

export function VolumeTabs({ currentVolume }: { currentVolume?: string }) {
  const router = useRouter();
  const [activeVolume, setActiveVolume] = useState(currentVolume || 'VOL1');

  const handleVolumeChange = (volumeId: string) => {
    setActiveVolume(volumeId);
    router.push(`/vol/${volumeId}`);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex gap-4 px-6" aria-label="Volumes">
        {VOLUMES.map((volume) => (
          <button
            key={volume.id}
            onClick={() => handleVolumeChange(volume.id)}
            className={`
              px-4 py-3 border-b-2 font-medium text-sm transition-colors
              ${
                activeVolume === volume.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
            aria-current={activeVolume === volume.id ? 'page' : undefined}
          >
            <div className="flex flex-col items-start">
              <span>{volume.label}</span>
              <span className="text-xs text-gray-400">{volume.description}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
