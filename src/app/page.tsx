import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function HomePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return redirect('/dashboard');
}
