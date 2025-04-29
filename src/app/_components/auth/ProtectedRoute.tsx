'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleBasedRedirect from './RoleBasedRedirect';
import ErrorMessage from "@/app/_components/error/index";
import Loader from "@/app/_components/loader/index";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  loadingComponent = (
    <Loader />
  )
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/auth/login');
    }
  }, [router]);

  if (!isMounted) {
    return loadingComponent;
  }

  return (
    <RoleBasedRedirect
      allowedRoles={allowedRoles}
      loadingComponent={loadingComponent}
    >
      {children}
    </RoleBasedRedirect>
  );
}