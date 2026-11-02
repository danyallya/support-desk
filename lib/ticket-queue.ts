import type { TicketStatus } from '@prisma/client';

export const TICKET_STATUSES = ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'] as const;
export type QueueStatus = (typeof TICKET_STATUSES)[number] | 'ALL';
export type QueueOwner = 'all' | 'mine' | 'unassigned';
export const QUEUE_PAGE_SIZE = 20;

export type QueueCursor = { updatedAt: Date; id: string };

export function parseQueueStatus(value: string | null): QueueStatus | null {
  if (!value || value === 'ALL') return 'ALL';
  return TICKET_STATUSES.includes(value as (typeof TICKET_STATUSES)[number])
    ? (value as QueueStatus)
    : null;
}

export function parseQueueOwner(value: string | null): QueueOwner | null {
  if (!value || value === 'all') return 'all';
  return value === 'mine' || value === 'unassigned' ? value : null;
}

export function encodeQueueCursor(cursor: QueueCursor): string {
  return Buffer.from(JSON.stringify({ updatedAt: cursor.updatedAt.toISOString(), id: cursor.id })).toString('base64url');
}

export function parseQueueCursor(value: string | null): QueueCursor | null | undefined {
  if (!value) return null;
  if (value.length > 256) return undefined;
  try {
    const decoded: unknown = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (!decoded || typeof decoded !== 'object' || !('updatedAt' in decoded) || !('id' in decoded)) return undefined;
    const { updatedAt, id } = decoded as { updatedAt: unknown; id: unknown };
    if (typeof updatedAt !== 'string' || typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) return undefined;
    const date = new Date(updatedAt);
    if (!Number.isFinite(date.getTime()) || date.toISOString() !== updatedAt) return undefined;
    return { updatedAt: date, id };
  } catch {
    return undefined;
  }
}

export function buildQueueWhere(input: {
  workspaceId: string;
  agentId: string;
  status: QueueStatus;
  owner: QueueOwner;
}) {
  return {
    workspaceId: input.workspaceId,
    ...(input.status === 'ALL' ? {} : { status: input.status as TicketStatus }),
    ...(input.owner === 'mine' ? { assigneeId: input.agentId } : {}),
    ...(input.owner === 'unassigned' ? { assigneeId: null } : {}),
  };
}

export function buildQueueCursorWhere(cursor: QueueCursor) {
  return {
    OR: [
      { updatedAt: { lt: cursor.updatedAt } },
      { updatedAt: cursor.updatedAt, id: { lt: cursor.id } },
    ],
  };
}
