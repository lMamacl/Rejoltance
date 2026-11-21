import { CardRules, isToken, isUnit, type CardDefinition, type ConditionDefinition, type DeckDefinition, type DslNumber } from './types.ts';
import { Vocabulary } from './vocabulary.ts';

/** Zones where the effect is active, normalised to a list. */
export const zonesOf = (zone: string | string[] | undefined): string[] => (zone === undefined ? [] : Array.isArray(zone) ? zone : [zone]);

const isDslNumber = (value: unknown): value is DslNumber =>
  typeof value === 'number' || (typeof value === 'object' && value !== null && typeof (value as { Count?: unknown }).Count === 'string');

/** Static checks on one card. Returns every problem instead of stopping at the first. */
export function validateCard(card: CardDefinition): string[] {
  const at = `card ${card.Id} '${card.Name}'`;
  const problems: string[] = [];

  if (!Vocabulary.cardTypes.has(card.Type)) problems.push(`${at}: unknown type '${card.Type}'`);
  if (isUnit(card) && (card.Attack === undefined || card.Health === undefined)) problems.push(`${at}: unit without Attack/Health`);
  if (card.Cost < 0) problems.push(`${at}: negative cost`);

  for (const keyword of [...(card.Keywords ?? []), ...Object.keys(card.KeywordParams ?? {})]) {
    if (!Vocabulary.keywords.has(keyword)) problems.push(`${at}: unknown keyword '${keyword}'`);
  }

  for (const effect of card.Effects ?? []) {
    if (!Vocabulary.triggers.has(effect.Trigger)) problems.push(`${at}: unknown trigger '${effect.Trigger}'`);
    for (const zone of zonesOf(effect.Zone)) {
      if (!Vocabulary.zones.has(zone)) problems.push(`${at}: unknown zone '${zone}'`);
    }
    if (effect.Condition) problems.push(...validateCondition(effect.Condition, at));

    for (const action of effect.Actions) {
      if (!Vocabulary.actions.has(action.Type)) problems.push(`${at}: unknown action '${action.Type}'`);
      if (action.Target !== undefined && !Vocabulary.targets.has(action.Target)) problems.push(`${at}: unknown target '${action.Target}' in ${action.Type}`);
      if (action.StatusKeyword !== undefined && !Vocabulary.keywords.has(action.StatusKeyword)) {
        problems.push(`${at}: unknown status '${action.StatusKeyword}' in ${action.Type}`);
      }
      for (const field of ['Amount', 'BuffAtk', 'BuffHp'] as const) {
        if (action[field] !== undefined && !isDslNumber(action[field])) problems.push(`${at}: ${field} in ${action.Type} is not a number or { Count }`);
      }
    }
  }

  return problems;
}

function validateCondition(condition: ConditionDefinition, at: string): string[] {
  const problems = Vocabulary.conditions.has(condition.Condition) ? [] : [`${at}: unknown condition '${condition.Condition}'`];
  for (const sub of condition.SubConditions ?? []) problems.push(...validateCondition(sub, at));
  return problems;
}

/** R-01: a legal deck has exactly 30 cards, at most 3 copies of a card and no tokens. */
export function validateDeck(deck: DeckDefinition, findCard: (id: number) => CardDefinition | undefined): string[] {
  const at = `deck '${deck.name}'`;
  const problems: string[] = [];
  if (deck.cards.length !== CardRules.DeckSize) problems.push(`${at}: has ${deck.cards.length} cards, expected ${CardRules.DeckSize}`);

  const copies = new Map<number, number>();
  for (const id of deck.cards) copies.set(id, (copies.get(id) ?? 0) + 1);

  for (const [id, count] of copies) {
    const card = findCard(id);
    if (!card) {
      problems.push(`${at}: unknown card id ${id}`);
      continue;
    }
    if (isToken(card)) problems.push(`${at}: token ${card.Id} '${card.Name}' cannot be in a deck`);
    if (count > CardRules.MaxCopies) problems.push(`${at}: ${count} copies of ${card.Id} '${card.Name}' (max ${CardRules.MaxCopies})`);
  }
  return problems;
}
