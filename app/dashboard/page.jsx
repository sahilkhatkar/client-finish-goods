'use client';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
      Dashboard
      <h1>Welcome, {user?.name || 'User'}</h1>
      <p>Your brand: {user?.brand || 'N/A'}</p>
      <p>Your role: {user?.role || 'N/A'}</p>
    </div>
  );
}
