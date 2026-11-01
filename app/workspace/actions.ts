'use server';

import { redirect } from 'next/navigation';
import { revokeCurrentSession } from '@/lib/auth';

export async function signOutAction(): Promise<void> {
  await revokeCurrentSession();
  redirect('/sign-in');
}
