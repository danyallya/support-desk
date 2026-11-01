import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getWorkspacePrincipal: vi.fn(),
  ticketFindMany: vi.fn(),
  ticketFindFirst: vi.fn(),
  customerFindFirst: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ getWorkspacePrincipal: mocks.getWorkspacePrincipal }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ticket: { findMany: mocks.ticketFindMany, findFirst: mocks.ticketFindFirst },
    customer: { findFirst: mocks.customerFindFirst },
  },
}));

import { GET as listTickets } from '../app/api/tickets/route';
import { GET as getTicket } from '../app/api/tickets/[ticketId]/route';
import { GET as getCustomer } from '../app/api/customers/[customerId]/route';

const principal = {
  agentId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
  agentEmail: 'sample.agent@northstar.invalid',
  agentName: 'Casey Sample',
  workspaceId: 'cccccccccccccccccccccccc',
  workspaceName: 'Northstar Sample Workspace',
  workspaceSlug: 'northstar-sample',
  role: 'ADMIN' as const,
};

describe('workspace-scoped read routes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('denies anonymous queue reads before querying tickets', async () => {
    mocks.getWorkspacePrincipal.mockResolvedValue(null);

    const response = await listTickets();

    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(mocks.ticketFindMany).not.toHaveBeenCalled();
  });

  it('filters ticket lists by the authenticated workspace', async () => {
    mocks.getWorkspacePrincipal.mockResolvedValue(principal);
    mocks.ticketFindMany.mockResolvedValue([{ id: '111111111111111111111111', number: 930001 }]);

    const response = await listTickets();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(mocks.ticketFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { workspaceId: principal.workspaceId },
      take: 50,
    }));
    expect(await response.json()).toEqual({ tickets: [{ id: '111111111111111111111111', number: 930001 }] });
  });

  it('returns the same not-found result when a ticket belongs to another workspace', async () => {
    mocks.getWorkspacePrincipal.mockResolvedValue(principal);
    mocks.ticketFindFirst.mockResolvedValue(null);

    const response = await getTicket(new Request('http://localhost/api/tickets/222222222222222222222222'), {
      params: Promise.resolve({ ticketId: '222222222222222222222222' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Ticket not found.' });
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(mocks.ticketFindFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: '222222222222222222222222', workspaceId: principal.workspaceId },
    }));
  });

  it('scopes customer reads and returns no foreign-customer details', async () => {
    mocks.getWorkspacePrincipal.mockResolvedValue(principal);
    mocks.customerFindFirst.mockResolvedValue(null);

    const response = await getCustomer(new Request('http://localhost/api/customers/aaaaaaaaaaaaaaaaaaaaaaaa'), {
      params: Promise.resolve({ customerId: 'aaaaaaaaaaaaaaaaaaaaaaaa' }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Customer not found.' });
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(mocks.customerFindFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'aaaaaaaaaaaaaaaaaaaaaaaa', workspaceId: principal.workspaceId },
    }));
  });
});
