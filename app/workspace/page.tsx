import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/app/workspace/actions';
import { getWorkspacePrincipal } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  buildQueueCursorWhere,
  buildQueueWhere,
  encodeQueueCursor,
  parseQueueCursor,
  parseQueueOwner,
  parseQueueStatus,
  QUEUE_PAGE_SIZE,
  TICKET_STATUSES,
  type QueueOwner,
  type QueueStatus,
} from '@/lib/ticket-queue';

export const dynamic = 'force-dynamic';

type WorkspaceSearchParams = { status?: string; owner?: string; cursor?: string };

function queueHref(status: QueueStatus, owner: QueueOwner, cursor?: string) {
  const params = new URLSearchParams();
  if (status !== 'ALL') params.set('status', status);
  if (owner !== 'all') params.set('owner', owner);
  if (cursor) params.set('cursor', cursor);
  const query = params.toString();
  return query ? `/workspace?${query}` : '/workspace';
}

export default async function WorkspacePage({ searchParams }: { searchParams: Promise<WorkspaceSearchParams> }) {
  const principal = await getWorkspacePrincipal();
  if (!principal) redirect('/sign-in');

  const params = await searchParams;
  const status = parseQueueStatus(params.status ?? null);
  const owner = parseQueueOwner(params.owner ?? null);
  const cursor = parseQueueCursor(params.cursor ?? null);
  if (!status || !owner || cursor === undefined) redirect('/workspace');

  const rows = await prisma.ticket.findMany({
    where: {
      ...buildQueueWhere({ workspaceId: principal.workspaceId, agentId: principal.agentId, status, owner }),
      ...(cursor ? buildQueueCursorWhere(cursor) : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: QUEUE_PAGE_SIZE + 1,
    select: { id: true, number: true, subject: true, status: true, priority: true, updatedAt: true },
  });
  const hasMore = rows.length > QUEUE_PAGE_SIZE;
  const tickets = hasMore ? rows.slice(0, QUEUE_PAGE_SIZE) : rows;
  const last = tickets.at(-1);
  const nextCursor = hasMore && last ? encodeQueueCursor({ updatedAt: last.updatedAt, id: last.id }) : null;
  const statuses: { value: QueueStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    ...TICKET_STATUSES.map((value) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() })),
  ];

  return (
    <main className="northstar-auth workspace-page">
      <section className="auth-card workspace-card" aria-labelledby="workspace-title">
        <header className="workspace-head">
          <Link className="auth-brand" href="/" aria-label="Northstar Support public preview">
            <span className="auth-mark" aria-hidden="true">✦</span>
            <span>northstar<small>SUPPORT</small></span>
          </Link>
          <form action={signOutAction}><button className="auth-signout" type="submit">Sign out</button></form>
        </header>
        <p className="auth-kicker">PRIVATE TEAM WORKSPACE</p>
        <h1 id="workspace-title">{principal.workspaceName}</h1>
        <p className="auth-intro">Signed in as {principal.agentName} · {principal.role.toLowerCase()}</p>
        <section className="workspace-queue" aria-labelledby="workspace-queue-title">
          <div className="workspace-queue-head">
            <h2 id="workspace-queue-title">Workspace conversations</h2>
            <span aria-label={`${tickets.length} conversations on this page`}>{tickets.length}</span>
          </div>
          <nav className="workspace-queue-tabs" aria-label="Filter conversations by status">
            {statuses.map((item) => (
              <Link key={item.value} href={queueHref(item.value, owner)} aria-current={status === item.value ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="workspace-queue-owners" aria-label="Filter conversations by owner">
            {([{ value: 'all', label: 'Everyone' }, { value: 'mine', label: 'Assigned to me' }, { value: 'unassigned', label: 'Unassigned' }] as const).map((item) => (
              <Link key={item.value} href={queueHref(status, item.value)} aria-current={owner === item.value ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          {tickets.length ? (
            <ul>
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <span className="workspace-ticket-number">#{ticket.number}</span>
                  <span className="workspace-ticket-subject">{ticket.subject}</span>
                  <span className="workspace-ticket-status">{ticket.status.toLowerCase()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="workspace-empty">No conversations match these filters.</p>
          )}
          {nextCursor && <div className="workspace-pagination"><Link href={queueHref(status, owner, nextCursor)}>Next page</Link></div>}
        </section>
        <p className="auth-note">The public preview remains synthetic. No customer email is sent from this workspace preview.</p>
      </section>
    </main>
  );
}
