import { NextResponse } from 'next/server';
import { getWorkspacePrincipal } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  const principal = await getWorkspacePrincipal();
  if (!principal) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: privateHeaders });

  const tickets = await prisma.ticket.findMany({
    where: { workspaceId: principal.workspaceId },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      number: true,
      subject: true,
      status: true,
      priority: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ tickets }, { headers: privateHeaders });
}
