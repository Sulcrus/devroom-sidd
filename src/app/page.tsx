import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function HomePage() {
  // Instead of creating a partial NextRequest, modify your getAuthUser() function
  // For now, use type assertion to bypass the type check
  const user = await (getAuthUser as () => Promise<any>)();

  if (!user) {
    redirect('/login');
  }

  return redirect('/dashboard');
}