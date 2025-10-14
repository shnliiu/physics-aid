'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tutor page (main app)
    router.push('/tutor');
  }, [router]);

  return null; // Redirecting...
}