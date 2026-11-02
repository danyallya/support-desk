import { NextResponse } from 'next/server';
import { getWorkspacePrincipal } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  buildQueueCursorWhere,
  buildQueueWhere,
  encodeQueueCursor,
  parseQueueCursor,
  parseQueueOwner,
  parseQueueStatus,
  QUEUE_PAGE_SIZE,
} from '@/lib/ticket-queue';

export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store' };

export async function GET(request: Request) {
  const principal = await getWorkspacePrincipal();
  if (!principal) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: privateHeaders });

  const query = new URL(request.url).searchParams;
  const status = parseQueueStatus(query.get('status'));
  const owner = parseQueueOwner(query.get('owner'));
  const cursor = parseQueueCursor(query.get('cursor'));
  if (!status || !owner || cursor === undefined) {
    return NextResponse.json({ error: 'Invalid queue filter or cursor.' }, { status: 400, headers: privateHeaders });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      ...buildQueueWhere({ workspaceId: principal.workspaceId, agentId: principal.agentId, status, owner }),
      ...(cursor ? buildQueueCursorWhere(cursor) : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: QUEUE_PAGE_SIZE + 1,
    select: {
      id: true,
      number: true,
      subject: true,
      status: true,
      priority: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      assigneeId: true,
    },
  });

  const hasMore = tickets.length > QUEUE_PAGE_SIZE;
  const page = hasMore ? tickets.slice(0, QUEUE_PAGE_SIZE) : tickets;
  const last = page.at(-1);
  return NextResponse.json({
    tickets: page,
    nextCursor: hasMore && last ? encodeQueueCursor({ updatedAt: last.updatedAt, id: last.id }) : null,
  }, { headers: privateHeaders });
}
