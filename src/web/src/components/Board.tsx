import type { MatchView, UnitView } from '../contracts';
import { useMatchStore } from '../state/matchStore';

/** Renders a MatchView. Never decides legality — it only shows what the server sent. */
export function Board({ view }: { view: MatchView }) {
  const cards = useMatchStore((s) => s.cards);
  const name = (id: number) => cards[id]?.name ?? `#${id}`;

  return (
    <section className="board" aria-label="board">
      <div className="hero">
        Opponent — HP {view.opponent.hp} · Blood {view.opponent.blood}/{view.opponent.maxBlood} · hand{' '}
        <span data-testid="opponent-hand-count">{view.opponent.handCount}</span> · deck {view.opponent.deckCount}
      </div>
      <Lanes units={view.opponent.lanes} name={name} />
      <Lanes units={view.you.lanes} name={name} />
      <div className="hero">
        You — HP {view.you.hp} · Blood {view.you.blood}/{view.you.maxBlood} · deck {view.you.deckCount} · phase{' '}
        <strong>{view.phase}</strong> · round {view.round}
      </div>
      <ul className="hand" aria-label="your hand">
        {view.you.hand.map((c) => (
          <li key={c.instanceId} className="card">
            <span className="cost">{c.cost}</span> {name(c.cardId)}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Lanes({ units, name }: { units: (UnitView | null)[]; name: (id: number) => string }) {
  return (
    <div className="lanes">
      {units.map((u, lane) => (
        <div key={lane} className="slot">
          {u ? `${name(u.cardId)} ${u.attack}/${u.health}` : `lane ${lane}`}
        </div>
      ))}
    </div>
  );
}
