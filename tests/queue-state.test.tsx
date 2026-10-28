import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QueueState } from '../components/queue-state';
describe('Northstar queue state contract', () => {
  it('distinguishes empty filters from loading and failure', () => {
    const markup = (state: 'loading' | 'empty' | 'error') => renderToStaticMarkup(createElement(QueueState, { state, onRetry: () => {} }));
    expect(markup('empty')).toContain('Try another search or status');
    expect(markup('loading')).toContain('role="status"');
    expect(markup('loading')).toContain('Loading conversations');
    expect(markup('error')).toContain('role="alert"');
    expect(markup('error')).toContain('Retry queue');
    expect(markup('error')).toContain('has not been sent');
  });
});
