# Northstar Support — 30-day delivery plan

Northstar gives SaaS support teams one reliable place for customer requests, context, ownership and service quality.

## Required daily cycle
Review yesterday’s code, diff, bugs and tests; add or update focused tests; implement today’s product scope; debug and check phone/tablet/desktop, keyboard and both themes; run lint, typecheck, tests and production build when possible and record truthful results; update README and this backlog; reprioritize discovered work and write tomorrow’s task. Keep internal registry settings, credentials and customer records out of Git.

## Day 00 foundation prepared
Next.js + TypeScript App Router, Tailwind CSS, React Icons, MongoDB + Prisma document schema, PWA shell, responsive ticket queue/conversation UI and local day-00-foundation branch.

### Day 00 validation
Nexus returned 404 for packages used by this project. Following the user's approval, dependencies were installed with npmjs fallback. The ignored local .npmrc preserves Nexus as default and contains only required scope overrides. Tests, lint, typecheck and production build passed; Day 01 has not started.

| Day | Deliverable |
|---|---|
| 01 | Done — define ticket workflow acceptance, authorization matrix and planned API/test contract; correct the Resolve status defect found in review. |
| 02 | Merged — DeskShell, queue states/status counts and compact navigation. PR #4 merged at `8fd36ea`; Issue #3 (shared reply draft) and Issue #5 (selected customer/context mismatch) remain open. |
| 03 | In progress — server-only Prisma client lifecycle and loopback-only synthetic seed implemented; existing indexes reviewed. Applying the schema and verifying two seed runs await local MongoDB. |
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

- Day 01: Done. Ticket status acceptance and workspace authorization/API test contracts are documented. Review found and fixed Resolve incorrectly setting a ticket to Pending; transition rules now have unit coverage. The app still has preview-only controls and no auth/API implementation. Day 02 will complete the dashboard shell and accessible responsive navigation.

## Process change effective Day 02 — 2026-10-27

Apply [DELIVERY-POLICY.md](DELIVERY-POLICY.md) to every remaining ticket: finish Northstar Support before the next repository, use meaningful scope-driven commits and deliver through its own reviewed PR. A blocked external gate needs a concrete record and next action. This adds delivery gates without moving Day 02–30 product work or changing completed history.

## Contribution integration — 2026-10-27

Effective Day 02: apply [CONTRIBUTING.md](CONTRIBUTING.md) inside existing tickets. At already scheduled weekly reviews, assess real feedback such as a synthetic Resolve/Reopen or SLA boundary case with timezone assumptions; at documentation/setup tickets, improve a sandbox ticket walkthrough that distinguishes preview from delivery. Day 30 records actual contribution evidence and outstanding external dependencies. No day is renumbered and no quota or badge is a completion criterion. Next scope remains: Day 03 — Prisma Mongo client, connection lifecycle, existing indexes and safe synthetic seed acceptance.

- Discovery (Day 02, target Day 09): reply draft currently belongs to the session rather than a ticket. Before durable outbound replies, preserve separate drafts per ticket and verify switching cannot send a draft to another requester. No reply is queued/sent by the current preview.
