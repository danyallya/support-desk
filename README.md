# Northstar Support

**Customer care, in focus.**

Northstar is a support desk for SaaS teams that need fast, considerate conversations with enough customer context to make each reply useful. The workspace brings the shared queue, conversation thread, ownership and service health together without burying the customer behind operational metrics.

## Product experience
- Shared inbox with searchable conversations, status and priority.
- Conversation thread with customer context, assignment and resolution actions.
- Team response-time, satisfaction and resolution overview.
- Responsive workspace with light and dark themes and an installable PWA shell.
- Planned email delivery, SLA policies, saved replies, team permissions, XLSX/PDF reports and audit history.

The current foundation presents the product workflow with illustrative customer records. Reply and resolve controls are interaction previews until authenticated persistence and an email provider are integrated; no email is sent from this preview.

## Technology
Next.js App Router, React, TypeScript, Tailwind CSS, React Icons, Prisma ORM and MongoDB. Recharts, XLSX and jsPDF are included for planned reporting.

## Local setup
Requirements: Node.js 20.11+, npm and MongoDB 7+.

1. Copy .env.example to .env and set DATABASE_URL for a local MongoDB deployment.
2. Install dependencies using npm ci.
3. Generate the Prisma client with npm run db:generate.
4. Apply the initial document schema with npm run db:push.
5. Optionally load synthetic sample records with npm run db:seed.
6. Start the workspace using npm run dev and open http://localhost:3000.

The initial schema is ready for the service layer. Workspace authentication, persistence and email delivery arrive through the 30-day roadmap. Never commit .env, real customer data or the local .npmrc.

## Commands
- npm run dev — local app
- npm run lint — lint application code
- npm run typecheck — strict TypeScript check
- npm run build — production build
- npm run db:generate — regenerate Prisma client
- npm run db:push — synchronize local MongoDB schema
- npm run db:seed — upsert synthetic records into the dedicated local northstar_desk database
- npm run db:studio — inspect local records

## Data model
MongoDB stores Customer, Agent, Ticket and Message documents. Ticket records hold source, status, priority, tags and service timestamps; messages retain author and internal-note status. Compound indexes support queue and customer history queries.

See AGENTS.md for the daily engineering cycle and BACKLOG.md for the full 30-day delivery plan. The local foundation branch is day-00-foundation.

## Day 01 workflow acceptance

- Ticket statuses are Open, Pending, Resolved and Closed. Resolve moves an Open or Pending ticket to Resolved; reopen moves a Resolved or Closed ticket to Open. Invalid transitions are rejected. A successful reply action is not considered delivered until the email integration confirms it.
- The current `/` route is a local workflow preview: it shows a queue, selected conversation, customer context and reply composer using illustrative records. There are no implemented ticket API routes or authenticated workspace sessions yet.
- The service worker caches the offline shell, manifest, icon and same-origin static assets. It skips `/api/` and network-only navigation requests, so customer conversation responses are not added to the cache.

## Authorization matrix and API/test plan

| Actor | Queue and customer reads | Ticket changes and replies | Workspace administration |
|---|---|---|---|
| Anonymous visitor | Denied | Denied | Denied |
| Authenticated workspace member | Only records in their active workspace | Only records in their active workspace; validated status changes and audited messages | Denied unless a later capability explicitly grants access |
| Workspace administrator | Only records in their active workspace | Same workspace boundary; actions remain validated and audited | Membership, roles and settings within their workspace |

The server must derive workspace identity from the authenticated session, never from a caller-supplied workspace ID. Cross-workspace ticket, customer, message, search and export requests must not disclose whether a record exists.

Planned route contract: `GET /api/tickets` lists a workspace-scoped queue with status/search filters and cursor pagination; `GET /api/tickets/:id` returns a scoped conversation and customer context; `PATCH /api/tickets/:id` validates status, assignee, priority and tags; `POST /api/tickets/:id/messages` validates a reply or internal note and records delivery state; `GET /api/customers/:id` returns scoped customer context. These endpoints are contracts for future backlog work, not implemented routes.

Tests must cover anonymous denial, member/admin workspace isolation, missing-record responses, legal and illegal state transitions, filtered pagination, input validation, audit history, internal notes never being emailed, reply delivery retries/idempotency, and service-worker exclusion of private responses. The current Vitest suite is a preview render plus pure status-transition tests; it does not yet prove authorization or email delivery.

## Privacy and operations
Every read, mutation, message, search and export must be scoped to an authenticated workspace. Production setup requires secret management, HTTPS, webhook signature validation, delivery monitoring, retention rules and verified backups. Do not cache customer conversations in the service worker.

## Delivery and review

Northstar review must verify Resolve/Reopen against ticket contracts, preserve auditable message state and workspace isolation, and separate preview replies from confirmed delivery. Follow [DELIVERY-POLICY.md](DELIVERY-POLICY.md) from Day 02 for sequential execution, scope-driven commits and this repository's separate branch/PR with GitHub panel review and merge.

## Contributions and examples

See [CONTRIBUTING.md](CONTRIBUTING.md) for reproducible reports, genuine collaboration and product examples such as a sandbox ticket walkthrough that distinguishes preview from delivery. Contributions follow the product backlog and reviewed PR workflow.

## Day 02 inbox shell

DeskShell shares sidebar/header/search and compact navigation. Queue status buttons report selected state and real sample counts, including Resolved; an empty search uses QueueState, whose loading/error variants are prepared and tested without claiming a live request. Queue/customer/tag/automation/settings links lead to honest preview sections. Compact navigation returns from mobile detail before targeting the queue; detail focuses its heading and Back restores the selected card. Reply preview retains the draft and explicitly queues/sends nothing. Theme stays session-local. Keyboard/focus/responsive/theme behavior still needs browser review, blocked by Work settings. Workspace authorization, live inbox, persistent ownership views and draft storage per ticket remain future service work.

## Day 03 Prisma Mongo boundary

`lib/prisma.ts` is a server-only Prisma Client singleton reused across Next.js development hot reloads. Prisma opens connections when queries run; it is not imported by the preview UI. The existing unique indexes and compound indexes cover ticket queue status/priority/update time, customer history, assignee queues and ticket message history; no speculative index was added without measured query plans.

The optional seed accepts only the loopback MongoDB database named `northstar_desk`. It upserts one reserved `.invalid` customer, one sample agent, two fictional tickets and three messages with stable ObjectIds. One message is explicitly an internal note. Seed data is local only and no email is sent. The MongoDB service was unavailable during this Day 03 run, so applying `db:push` and verifying repeat seed behavior remain pending.

Issue #3 (a reply draft shared across tickets) and Issue #5 (selected ticket and customer context disagree) remain open. Durable reply work must keep drafts per ticket and verify the selected customer before the Day 09 composer can send anything.
