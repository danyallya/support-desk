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
5. Start the workspace using npm run dev and open http://localhost:3000.

The initial schema is ready for the service layer. Workspace authentication, persistence and email delivery arrive through the 30-day roadmap. Never commit .env, real customer data or the local .npmrc.

## Commands
- npm run dev — local app
- npm run lint — lint application code
- npm run typecheck — strict TypeScript check
- npm run build — production build
- npm run db:generate — regenerate Prisma client
- npm run db:push — synchronize local MongoDB schema
- npm run db:studio — inspect local records

## Data model
MongoDB stores Customer, Agent, Ticket and Message documents. Ticket records hold source, status, priority, tags and service timestamps; messages retain author and internal-note status. Compound indexes support queue and customer history queries.

See AGENTS.md for the daily engineering cycle and BACKLOG.md for the full 30-day delivery plan. The local foundation branch is day-00-foundation.

## Privacy and operations
Every read, mutation, message, search and export must be scoped to an authenticated workspace. Production setup requires secret management, HTTPS, webhook signature validation, delivery monitoring, retention rules and verified backups. Do not cache customer conversations in the service worker.
