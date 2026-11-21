import { describe, expect, it } from 'vitest';
import { ContentValidationError, createCatalog, isToken, loadCatalog, validateCard, validateDeck, type CardDefinition } from '../src/index.ts';

const catalog = loadCatalog();

describe('card catalogue (prototype/game, ADR-0013)', () => {
  it('contains all prototype cards and tokens', () => {
    expect(catalog.all.filter((c) => !isToken(c))).toHaveLength(130);
    expect(catalog.all.filter((c) => isToken(c))).toHaveLength(29);
  });

  it('R01_starter_decks_are_legal', () => {
    for (const deck of catalog.starterDecks) expect(validateDeck(deck, catalog.findCard)).toEqual([]);
  });

  it('R68_unknown_dsl_words_fail_loud', () => {
    const broken: CardDefinition = {
      Id: 1000,
      Name: 'Broken',
      Type: 'Spell',
      Cost: 1,
      Description: '',
      Effects: [{ Trigger: 'OnPlayed', Actions: [{ Type: 'Teleport', Target: 'Moon' }] }],
    };

    const error = (() => {
      try {
        createCatalog([broken], []);
      } catch (e) {
        return e;
      }
    })();

    expect(error).toBeInstanceOf(ContentValidationError);
    expect((error as ContentValidationError).errors).toEqual(
      expect.arrayContaining([expect.stringContaining("unknown action 'Teleport'"), expect.stringContaining("unknown target 'Moon'")]),
    );
  });

  it('R68_dsl_reads_zone_lists_and_counted_amounts', () => {
    const probe: CardDefinition = {
      Id: 1001,
      Name: 'Probe',
      Type: 'Spell',
      Cost: 1,
      Description: '',
      Effects: [
        {
          Trigger: 'OnPlayed',
          Zone: ['Deck', 'Hand'],
          Actions: [
            { Type: 'DealDamage', Target: 'EnemyHero', Amount: { Count: 'Blood', Max: 5 } },
            { Type: 'Heal', Target: 'FriendlyHero', Amount: 3 },
          ],
        },
      ],
    };

    expect(validateCard(probe)).toEqual([]);
  });

  it('R01_deck_rules_reject_tokens_and_extra_copies', () => {
    const deck = { name: 'bad', cards: [...Array(4).fill(1), 900, ...Array(25).fill(2)] };

    const errors = validateDeck(deck, catalog.findCard);

    expect(errors).toEqual(expect.arrayContaining([expect.stringContaining('4 copies'), expect.stringContaining('token')]));
  });
});
