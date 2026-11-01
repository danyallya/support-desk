import { PrismaClient } from '@prisma/client';
import { assertSafeSeedTarget } from './seed-policy.mjs';
import { makeMessageUpsertData, makeTicketUpsertData } from './seed-data.mjs';
import { hashPassword } from '../lib/password-hash.mjs';

assertSafeSeedTarget(process.env.DATABASE_URL);
const samplePasswordHash = await hashPassword(process.env.NORTHSTAR_SAMPLE_PASSWORD ?? '');

const prisma = new PrismaClient();
const sampleWorkspace = {
  id: 'cccccccccccccccccccccccc',
  slug: 'northstar-sample',
  name: 'Northstar Sample Workspace',
};
const sampleMembershipId = 'dddddddddddddddddddddddd';
const sampleCustomer = {
  id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
  email: 'sample.customer@northstar.invalid',
  name: 'Jordan Sample',
  company: 'Northstar Demo Workspace',
  plan: 'Sample',
  workspaceId: sampleWorkspace.id,
};
const sampleAgent = {
  id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
  email: 'sample.agent@northstar.invalid',
  name: 'Casey Sample',
  active: true,
  passwordHash: samplePasswordHash,
};
const sampleTickets = [
  {
    id: '111111111111111111111111',
    number: 930001,
    subject: 'Sample domain setup question',
    status: 'OPEN',
    priority: 'HIGH',
    source: 'sample',
    tags: ['setup', 'sample'],
    createdAt: new Date('2026-10-27T09:00:00.000Z'),
    updatedAt: new Date('2026-10-29T09:30:00.000Z'),
    firstResponseAt: new Date('2026-10-27T09:15:00.000Z'),
    customerId: sampleCustomer.id,
    assigneeId: sampleAgent.id,
    workspaceId: sampleWorkspace.id,
    messages: [
      {
        id: '333333333333333333333333',
        body: 'This is a fictional customer message for local workflow review.',
        authorName: sampleCustomer.name,
        authorType: 'customer',
        internal: false,
        createdAt: new Date('2026-10-27T09:00:00.000Z'),
      },
      {
        id: '444444444444444444444444',
        body: 'Synthetic internal note. No reply was sent.',
        authorName: sampleAgent.name,
        authorType: 'agent',
        internal: true,
        createdAt: new Date('2026-10-27T09:15:00.000Z'),
      },
    ],
  },
  {
    id: '222222222222222222222222',
    number: 930002,
    subject: 'Sample billing-cycle question',
    status: 'PENDING',
    priority: 'NORMAL',
    source: 'sample',
    tags: ['billing', 'sample'],
    createdAt: new Date('2026-10-28T13:00:00.000Z'),
    updatedAt: new Date('2026-10-28T13:20:00.000Z'),
    firstResponseAt: new Date('2026-10-28T13:20:00.000Z'),
    customerId: sampleCustomer.id,
    assigneeId: sampleAgent.id,
    workspaceId: sampleWorkspace.id,
    messages: [
      {
        id: '555555555555555555555555',
        body: 'Fictional ticket history for testing queue and customer context.',
        authorName: sampleCustomer.name,
        authorType: 'customer',
        internal: false,
        createdAt: new Date('2026-10-28T13:00:00.000Z'),
      },
    ],
  },
];

async function upsertSampleData() {
  await prisma.workspace.upsert({
    where: { id: sampleWorkspace.id },
    update: { slug: sampleWorkspace.slug, name: sampleWorkspace.name },
    create: sampleWorkspace,
  });

  await prisma.customer.upsert({
    where: { id: sampleCustomer.id },
    update: { email: sampleCustomer.email, name: sampleCustomer.name, company: sampleCustomer.company, plan: sampleCustomer.plan, workspaceId: sampleWorkspace.id },
    create: sampleCustomer,
  });

  await prisma.agent.upsert({
    where: { id: sampleAgent.id },
    update: { email: sampleAgent.email, name: sampleAgent.name, active: sampleAgent.active, passwordHash: sampleAgent.passwordHash },
    create: sampleAgent,
  });

  await prisma.workspaceMember.upsert({
    where: { workspaceId_agentId: { workspaceId: sampleWorkspace.id, agentId: sampleAgent.id } },
    update: { role: 'ADMIN' },
    create: { id: sampleMembershipId, workspaceId: sampleWorkspace.id, agentId: sampleAgent.id, role: 'ADMIN' },
  });

  for (const sampleTicket of sampleTickets) {
    const { id, update, create, messages } = makeTicketUpsertData(sampleTicket);
    await prisma.ticket.upsert({
      where: { id },
      update,
      create,
    });

    for (const message of messages) {
      const { id: messageId, update, create } = makeMessageUpsertData(message, id);
      await prisma.message.upsert({
        where: { id: messageId },
        update,
        create,
      });
    }
  }
}

try {
  await upsertSampleData();
  console.log(`Seeded ${sampleTickets.length} synthetic tickets in local northstar_desk.`);
} catch {
  console.error('Northstar seed failed. Check that the local northstar_desk database is reachable and its schema is pushed.');
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
