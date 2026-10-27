import { useEffect } from 'react';
import './App.css';
import { useMatchStore } from './state/matchStore';
import { Board } from './components/Board';

const DECKS = ['MachineAggro', 'TeaMaidCombo', 'CollectorSpam', 'TheRitual', 'RaceAggro'];

export default function App() {
  const { view, error, busy, loadCards, startSandbox, send } = useMatchStore();

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  return (
    <main className="app">
      <header>
        <h1>RE:JOLTANCE</h1>
        <p className="muted">Szkielet: sandbox meczu przez SignalR. Reguły gry powstają w backlogu (E1).</p>
      </header>

      {!view && (
        <button disabled={busy} onClick={() => void startSandbox(DECKS[0], DECKS[1])}>
          Start sandbox match
        </button>
      )}

      {error && <p role="alert" className="error">{error}</p>}

      {view && (
        <>
          <Board view={view} />
          <div className="actions">
            {view.pending?.kind === 'mulligan' && (
              <button disabled={busy} onClick={() => void send({ type: 'mulligan', cardInstanceIds: [] })}>
                Keep hand (mulligan 0)
              </button>
            )}
            <button disabled={busy} onClick={() => void send({ type: 'endStep' })}>
              End step (not implemented yet)
            </button>
          </div>
        </>
      )}
    </main>
  );
}
