import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/app/workspace/actions';
import { getWorkspacePrincipal } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function WorkspacePage() {
  const principal = await getWorkspacePrincipal();
  if (!principal) redirect('/sign-in');

  const tickets = await prisma.ticket.findMany({
    where: { workspaceId: principal.workspaceId },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: { id: true, number: true, subject: true, status: true, priority: true, updatedAt: true },
  });

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
            <span>{tickets.length}</span>
          </div>
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
            <p className="workspace-empty">No conversations belong to this workspace yet.</p>
          )}
        </section>
        <p className="auth-note">The public preview remains synthetic. No customer email is sent from this workspace preview.</p>
      </section>
    </main>
  );
}
