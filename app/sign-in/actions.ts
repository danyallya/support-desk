'use server';

import { redirect } from 'next/navigation';
import { createMemberSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password-hash.mjs';

export type SignInState = { error: string | null };

const invalidCredentials = 'The workspace, email, or password is incorrect.';
const dummyPasswordHash = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

export async function signInAction(_previousState: SignInState, formData: FormData): Promise<SignInState> {
  const workspaceSlug = String(formData.get('workspaceSlug') ?? '').trim().toLowerCase();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const passwordValue = formData.get('password');
  const password = typeof passwordValue === 'string' ? passwordValue : '';

  if (
    !/^[a-z0-9-]{3,50}$/.test(workspaceSlug)
    || !/^\S+@\S+\.\S+$/.test(email)
    || password.length > 128
  ) {
    return { error: invalidCredentials };
  }

  const agent = await prisma.agent.findUnique({
    where: { email },
    select: { id: true, active: true, passwordHash: true },
  });
  const passwordMatches = await verifyPassword(password, agent?.passwordHash ?? dummyPasswordHash);
  if (!agent?.active || !passwordMatches) return { error: invalidCredentials };

  const membership = await prisma.workspaceMember.findFirst({
    where: { agentId: agent.id, workspace: { slug: workspaceSlug } },
    select: { workspaceId: true },
  });
  if (!membership) return { error: invalidCredentials };

  await createMemberSession(agent.id, membership.workspaceId);
  redirect('/workspace');
}
