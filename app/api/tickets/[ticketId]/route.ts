import { NextResponse } from 'next/server';
import { getWorkspacePrincipal } from '@/lib/auth';
import { isObjectId } from '@/lib/session-policy';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store' };

export async function GET(_request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  const principal = await getWorkspacePrincipal();
  if (!principal) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: privateHeaders });

  const { ticketId } = await params;
  if (!isObjectId(ticketId)) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404, headers: privateHeaders });

  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId, workspaceId: principal.workspaceId },
    select: {
      id: true,
      number: true,
      subject: true,
      status: true,
      priority: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      customerId: true,
    },
  });
  if (!ticket) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404, headers: privateHeaders });

  const customer = await prisma.customer.findFirst({
    where: { id: ticket.customerId, workspaceId: principal.workspaceId },
    select: { name: true, company: true, plan: true },
  });

  const ticketDetails = {
    id: ticket.id,
    number: ticket.number,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    tags: ticket.tags,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
  return NextResponse.json({ ticket: { ...ticketDetails, customer } }, { headers: privateHeaders });
}
