import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { MatchView } from '../contracts';
import sample from '../contracts/match-view.sample.json';
import { Board } from './Board';

describe('Board', () => {
  it('renders own hand and only the opponent hand count', () => {
    const view = { ...sample, phase: 'mulligan' } as MatchView;

    render(<Board view={view} />);

    expect(screen.getByLabelText('your hand').children).toHaveLength(view.you.hand.length);
    expect(screen.getByTestId('opponent-hand-count').textContent).toBe('4');
  });
});
