import cardsJson from '../data/cards.json' with { type: 'json' };
import decksJson from '../data/decks.json' with { type: 'json' };
import type { CardDefinition, DeckDefinition } from './types.ts';
import { validateCard, validateDeck } from './validator.ts';

/** Read-only, validated card catalogue. Create once and pass it in; there is no global instance. */
export interface CardCatalog {
  readonly all: readonly CardDefinition[];
  readonly starterDecks: readonly DeckDefinition[];
  getCard(cardId: number): CardDefinition;
  findCard(cardId: number): CardDefinition | undefined;
}

export class ContentValidationError extends Error {
  readonly errors: readonly string[];

  constructor(errors: string[]) {
    super(`Card content is invalid (${errors.length} problem(s)):\n${errors.join('\n')}`);
    this.name = 'ContentValidationError';
    this.errors = errors;
  }
}

export function createCatalog(cards: readonly CardDefinition[], starterDecks: readonly DeckDefinition[]): CardCatalog {
  const byId = new Map<number, CardDefinition>();
  const errors: string[] = [];
  for (const card of cards) {
    if (byId.has(card.Id)) errors.push(`duplicate card id ${card.Id}`);
    else byId.set(card.Id, card);
    errors.push(...validateCard(card));
  }

  const findCard = (cardId: number) => byId.get(cardId);
  for (const deck of starterDecks) errors.push(...validateDeck(deck, findCard));
  if (errors.length > 0) throw new ContentValidationError(errors);

  const all = Object.freeze([...byId.values()].sort((a, b) => a.Id - b.Id));
  return Object.freeze({
    all,
    starterDecks: Object.freeze([...starterDecks]),
    findCard,
    getCard(cardId: number) {
      const card = byId.get(cardId);
      if (!card) throw new Error(`Unknown card id ${cardId}`);
      return card;
    },
  });
}

/** The catalogue generated from the prototype (packages/content/data). */
export const loadCatalog = (): CardCatalog => createCatalog(cardsJson as CardDefinition[], decksJson as DeckDefinition[]);
