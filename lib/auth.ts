import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  createSessionToken,
  getSessionExpiry,
  hashSessionToken,
  isSessionExpired,
  isSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/session-policy';

export type WorkspacePrincipal = {
  agentId: string;
  agentEmail: string;
  agentName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: 'ADMIN' | 'MEMBER';
};

const cookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  expires,
});

export async function createMemberSession(agentId: string, workspaceId: string): Promise<void> {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_agentId: { workspaceId, agentId } },
    select: { agent: { select: { active: true } } },
  });
  if (!membership?.agent.active) throw new Error('An active workspace membership is required.');

  const token = createSessionToken();
  const expiresAt = getSessionExpiry();
  await prisma.session.create({
    data: { tokenHash: hashSessionToken(token), agentId, workspaceId, expiresAt },
  });
  (await cookies()).set(SESSION_COOKIE_NAME, token, cookieOptions(expiresAt));
}

export async function getWorkspacePrincipal(): Promise<WorkspacePrincipal | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!isSessionToken(token)) return null;

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({ where: { tokenHash } });
  if (!session) return null;

  if (isSessionExpired(session.expiresAt)) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_agentId: { workspaceId: session.workspaceId, agentId: session.agentId } },
    select: {
      role: true,
      workspace: { select: { id: true, name: true, slug: true } },
      agent: { select: { id: true, email: true, name: true, active: true } },
    },
  });

  if (!membership?.agent.active) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return {
    agentId: membership.agent.id,
    agentEmail: membership.agent.email,
    agentName: membership.agent.name,
    workspaceId: membership.workspace.id,
    workspaceName: membership.workspace.name,
    workspaceSlug: membership.workspace.slug,
    role: membership.role,
  };
}

export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (isSessionToken(token)) {
    await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
