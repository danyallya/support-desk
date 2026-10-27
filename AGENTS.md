# Northstar Support contributor guide

## Product direction
Northstar is an efficient, considerate support workspace for a growing SaaS team. Keep the queue scannable, conversation context close at hand, and customer language respectful.

## Required daily cycle
1. Read this guide, BACKLOG.md, Git status and previous-day notes.
2. Review old code, test coverage and open bugs; reproduce defects before edits.
3. Write or update focused tests for existing behavior and today's acceptance criteria.
4. Implement the planned outcome and debug nearby failures.
5. Check responsive layouts, keyboard interactions, theme contrast, lint, typecheck, tests and production build where the environment permits; record exact results.
6. Update README, backlog, technical decisions and tomorrow's tasks. Add newly found work with priority and reason.
7. Commit only reviewed, relevant work. Keep .npmrc, .env, customer data and credentials untracked. Never force-push.

## Engineering
- Keep inbox credentials and database access server-side.
- Enforce workspace authorization on every ticket, customer, message, export and search.
- Validate outbound replies and preserve an auditable message history.
- Exclude private inbox routes and response bodies from service-worker caches.
- Use accessible status/priority labels, keyboard shortcuts with visible help, and phone/tablet layouts.
- Treat email delivery as an integration; never claim a preview reply was sent.

## Delivery from Day 02

- Read and follow [DELIVERY-POLICY.md](DELIVERY-POLICY.md). Finish Northstar Support and its own PR panel review, merge and sync before the next portfolio repository, or record an exact external blocker. No concurrent project or subagent work.
- Choose commit counts, boundaries, content and wording from this product's real changes; do not copy a fixed history pattern from other projects.
- Review the latest pushed head and checks in GitHub and merge through this repository's PR panel. Respect required independent approvals; self-review does not replace them.
