# Northstar Support — 30-day delivery plan

Northstar gives SaaS support teams one reliable place for customer requests, context, ownership and service quality.

## Required daily cycle
Review yesterday’s code, diff, bugs and tests; add or update focused tests; implement today’s product scope; debug and check phone/tablet/desktop, keyboard and both themes; run lint, typecheck, tests and production build when possible and record truthful results; update README and this backlog; reprioritize discovered work and write tomorrow’s task. Keep internal registry settings, credentials and customer records out of Git.

## Day 00 foundation prepared
Next.js + TypeScript App Router, Tailwind CSS, React Icons, MongoDB + Prisma document schema, PWA shell, responsive ticket queue/conversation UI and local day-00-foundation branch.

| Day | Deliverable |
|---|---|
| 01 | Write support workflow acceptance criteria, authorization matrix and API/test plan. |
| 02 | Extract reusable dashboard shell, queue states and accessible responsive navigation. |
| 03 | Configure Prisma Mongo client, connection lifecycle, indexes and safe synthetic seed. |
| 04 | Add team authentication and workspace membership; reject cross-workspace access. |
| 05 | Implement ticket list, status tabs, owner scoping and cursor pagination. |
| 06 | Add ticket detail, message timeline and internal-note distinctions. |
| 07 | Implement assignment, priority, status and tag updates with audit history. |
| 08 | Add full-text/search filters for requester, subject, ID, status and tags. |
| 09 | Add reply composer, validation and durable outbound-message queue. |
| 10 | Integrate a sandbox email provider and idempotent delivery/retry handling. |
| 11 | Add customer profile and account context panel with permission checks. |
| 12 | Add team roster, workload overview and saved inbox views. |
| 13 | Build response-time and resolution charts from persisted event timestamps. |
| 14 | Add XLSX service reports with timezone, scope and formula-injection checks. |
| 15 | Generate branded PDF reports and verify page breaks and summaries. |
| 16 | Add SLA policies, business hours and first-response deadlines. |
| 17 | Add SLA warning/overdue states and notification preferences. |
| 18 | Build snooze/reminder controls and reopen behavior. |
| 19 | Add saved replies with placeholders and preview before sending. |
| 20 | Add tags, rules and transparent automation execution history. |
| 21 | Add customer CSAT survey flow, response capture and reporting. |
| 22 | Add workspace roles and capability-based access control. |
| 23 | Add safe bulk actions with confirmation, partial-failure reporting and audit trail. |
| 24 | Add account-scoped conversation export and retention controls. |
| 25 | Harden email/webhook signature checks, rate limits and input validation. |
| 26 | Review screen reader flow, keyboard operation, contrast and motion preferences. |
| 27 | Complete tablet/mobile queue and conversation interaction; test narrow widths. |
| 28 | Optimize Mongo indexes, pagination and bundle; document measured limits. |
| 29 | Run end-to-end support journey, backup/restore rehearsal and release build. |
| 30 | Publish operations guide, deployment and integration setup, release notes and next roadmap. |

## Completion gate
Every day records reviewed code, focused tests, completed scope, debugging, accessibility/responsive/theme checks, verification outcomes, updated docs and a clear next day. Do not invent sent replies or create commits for activity alone.