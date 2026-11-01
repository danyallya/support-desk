import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/sign-in-form';
import { getWorkspacePrincipal } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  if (await getWorkspacePrincipal()) redirect('/workspace');

  return (
    <main className="northstar-auth">
      <section className="auth-card" aria-labelledby="sign-in-title">
        <Link className="auth-brand" href="/" aria-label="Northstar Support public preview">
          <span className="auth-mark" aria-hidden="true">✦</span>
          <span>northstar<small>SUPPORT</small></span>
        </Link>
        <p className="auth-kicker">TEAM WORKSPACE</p>
        <h1 id="sign-in-title">Welcome back.</h1>
        <p className="auth-intro">Sign in to view conversations from your workspace.</p>
        <SignInForm />
        <p className="auth-note">Access is limited to provisioned team members. New accounts are created by a workspace administrator.</p>
        <Link className="auth-return" href="/">Return to the public preview</Link>
      </section>
    </main>
  );
}
