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
        router.push('/auth/login');
      } else if (window.location.pathname.startsWith('/auth') || window.location.pathname === '/') {
        window.location.href = '/tenant/dashboard';
      }
    }
  }, [session, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default Router;