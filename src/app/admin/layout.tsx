'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized');
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      if (!supabase) return;
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold">
              Portfolio Admin
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/admin/home" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/admin/projects" className="text-sm font-medium hover:text-primary">
              Projects
            </Link>
            <Link href="/admin/experience" className="text-sm font-medium hover:text-primary">
              Experience
            </Link>
            <Link href="/admin/skills" className="text-sm font-medium hover:text-primary">
              Skills
            </Link>
            <Link href="/admin/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/admin/messages" className="text-sm font-medium hover:text-primary">
              Messages
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
} 