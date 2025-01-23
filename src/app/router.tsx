"use client";

import React, { useEffect } from 'react';
import Loading from '@/components/loading';
import { useSession } from './context/SupabaseSessionContext';
import { useRouter } from 'next/navigation';

const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/');
      } else {
        console.log(session);
        const { user } = session;
        router.push(`/tenant/${user.id}/dashboard`);
      }
    }
  }, [session, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default Router;