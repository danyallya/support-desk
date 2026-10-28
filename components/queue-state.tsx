export function QueueState({ state, onRetry }: { state: 'loading' | 'empty' | 'error'; onRetry?: () => void }) {
  return <div className="empty-list" role={state === 'error' ? 'alert' : 'status'}>
    <h3>{state === 'loading' ? 'Loading conversations' : state === 'empty' ? 'No conversations found' : 'Conversations unavailable'}</h3>
    <p>{state === 'loading' ? 'Waiting for the queue.' : state === 'empty' ? 'Try another search or status. Existing conversation drafts remain in this session.' : 'The queue could not be loaded. Your reply has not been sent.'}</p>
    {state === 'error' && onRetry && <button onClick={onRetry}>Retry queue</button>}
  </div>;
}
