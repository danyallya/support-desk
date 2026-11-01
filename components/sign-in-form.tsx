'use client';

import { useActionState } from 'react';
import { signInAction, type SignInState } from '@/app/sign-in/actions';

const initialState: SignInState = { error: null };

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initialState);

  return (
    <form className="auth-form" action={action}>
      <label htmlFor="workspaceSlug">Workspace slug</label>
      <input id="workspaceSlug" name="workspaceSlug" autoComplete="organization" defaultValue="northstar-sample" required maxLength={50} />

      <label htmlFor="email">Team email</label>
      <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128} />

      {state.error && <p className="auth-error" role="alert" aria-live="polite">{state.error}</p>}
      <button className="auth-submit" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in securely'}
      </button>
    </form>
  );
}
