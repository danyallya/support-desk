import { NextResponse } from 'next/server';
import { getWorkspacePrincipal } from '@/lib/auth';
import { isObjectId } from '@/lib/session-policy';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store' };

export async function GET(_request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const principal = await getWorkspacePrincipal();
  if (!principal) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: privateHeaders });

  const { customerId } = await params;
  if (!isObjectId(customerId)) return NextResponse.json({ error: 'Customer not found.' }, { status: 404, headers: privateHeaders });

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, workspaceId: principal.workspaceId },
    select: { id: true, name: true, company: true, plan: true, createdAt: true },
  });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404, headers: privateHeaders });

  return NextResponse.json({ customer }, { headers: privateHeaders });
}
