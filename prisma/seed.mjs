import { PrismaClient } from '@prisma/client';
import { assertSafeSeedTarget } from './seed-policy.mjs';

assertSafeSeedTarget(process.env.DATABASE_URL);

const prisma = new PrismaClient();
const sampleCustomer = {
  id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
  email: 'sample.customer@northstar.invalid',
  name: 'Jordan Sample',
  company: 'Northstar Demo Workspace',
  plan: 'Sample',
};
const sampleAgent = {
  id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
  email: 'sample.agent@northstar.invalid',
  name: 'Casey Sample',
  active: true,
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
  await prisma.customer.upsert({
    where: { id: sampleCustomer.id },
    update: { email: sampleCustomer.email, name: sampleCustomer.name, company: sampleCustomer.company, plan: sampleCustomer.plan },
    create: sampleCustomer,
  });

  await prisma.agent.upsert({
    where: { id: sampleAgent.id },
    update: { email: sampleAgent.email, name: sampleAgent.name, active: sampleAgent.active },
    create: sampleAgent,
  });

  for (const { messages, ...ticket } of sampleTickets) {
    await prisma.ticket.upsert({
      where: { id: ticket.id },
      update: ticket,
      create: ticket,
    });

    for (const message of messages) {
      await prisma.message.upsert({
        where: { id: message.id },
        update: { ...message, ticketId: ticket.id },
        create: { ...message, ticketId: ticket.id },
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
