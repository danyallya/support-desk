import { describe, expect, it } from 'vitest';
import { makeMessageUpsertData, makeTicketUpsertData } from '../prisma/seed-data.mjs';

describe('Northstar seed upsert data', () => {
  it('keeps the id for lookup/create but removes it from update fields', () => {
    const messages = [{ id: '333333333333333333333333', body: 'Synthetic note' }];
    const ticket = {
      id: '111111111111111111111111',
      subject: 'Sample ticket',
      status: 'OPEN',
      messages,
    };

    expect(makeTicketUpsertData(ticket)).toEqual({
      id: '111111111111111111111111',
      update: { subject: 'Sample ticket', status: 'OPEN' },
      create: {
        id: '111111111111111111111111',
        subject: 'Sample ticket',
        status: 'OPEN',
      },
      messages,
    });
  });

  it('keeps message ids out of updates while preserving ticket linkage', () => {
    const message = {
      id: '333333333333333333333333',
      body: 'Synthetic internal note',
      internal: true,
    };

    expect(makeMessageUpsertData(message, '111111111111111111111111')).toEqual({
      id: '333333333333333333333333',
      update: {
        body: 'Synthetic internal note',
        internal: true,
        ticketId: '111111111111111111111111',
      },
      create: {
        id: '333333333333333333333333',
        body: 'Synthetic internal note',
        internal: true,
        ticketId: '111111111111111111111111',
      },
    });
  });
});
