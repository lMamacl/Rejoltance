// Every DSL word the engine understands. A card using anything else is rejected at load time
// (fail loud, ADR-0005 — the prototype silently returned [] for unknown targets).
// The sets contain every word used by prototype/game/cards.js (ADR-0013); the engine implements them rule by rule.
// A word that is new to the prototype is added here together with a rule spec (R-nn) and, once implemented, its test.

const set = (...words: string[]): ReadonlySet<string> => Object.freeze(new Set(words));

export const Vocabulary = Object.freeze({
  cardTypes: set('Unit', 'Spell'),

  triggers: set(
    'OnAttackDone', 'OnDamagedEnemyHero', 'OnDamagedEnemyUnit', 'OnDeath', 'OnEndOfRound',
    'OnEnemyUnitGainedStats', 'OnEnemyUnitPlayed', 'OnFriendlyActionPlayed', 'OnFriendlyCardDrawn',
    'OnFriendlyCardPlayed', 'OnFriendlyUnitDamaged', 'OnFriendlyUnitDied', 'OnFriendlyUnitHpOne',
    'OnFriendlyUnitSummoned', 'OnKill', 'OnOpponentCardDrawn', 'OnOpponentCardGained', 'OnOtherUnitSacrificed',
    'OnPlayed', 'OnPostCombatLine', 'OnPreCombatLine', 'OnSacrificed', 'OnStartOfRound', 'OnStatusApplied',
    'Passive',
  ),

  actions: set(
    'AbsorbAttackOnKill', 'AbsorbStats', 'AddCardToDeck', 'AddCardToEnemyDeck', 'AddCardToHand', 'AddResource',
    'AllowUnitsInAction', 'ApplyStatus', 'AuraBuff', 'BonusAttack', 'BuffStats', 'CopyLastEnemyCard', 'CopySelf',
    'CopyUnit', 'DamageImmunity', 'DealDamage', 'DestroyUnit', 'DrawCard', 'DrawFromDiscard',
    'DrawKilledLastRound', 'GiveToOpponent', 'GrantActionPlay', 'GrantKeyword', 'GrantRule', 'Heal', 'HealToFull',
    'IncreaseMaxHp', 'LaneDebuff', 'LoseBlood', 'LoseHealth', 'MakeAUnit', 'Merge', 'ModifyCost', 'ModifyDamage',
    'ModifyGlobalBuff', 'MoveLane', 'MoveRight', 'MoveToSourceLane', 'PlayNextTwice', 'Reanimate', 'ReplayPlayed',
    'RespawnSelf', 'ReturnToHand', 'SacrificeUnit', 'SacrificeUnits', 'ScaleAttack', 'ShuffleDeck', 'Silence',
    'SpendBlood', 'SummonUnit', 'Transform', 'TransformInHand', 'TutorCard',
  ),

  targets: set(
    'AdjacentFriendlyUnits', 'AllEnemyUnits', 'AllFriendlyUnits', 'AllOtherUnitsOnBoard', 'AllUnitsOnBoard',
    'EnemyHero', 'EnemySpellsInHand', 'EnemyUnitsNearLane', 'EventUnit', 'EventUnitAndAdjacent', 'FriendlyHero',
    'FriendlySpellsInHand', 'OppositeEnemyUnit', 'OtherFriendlyUnits', 'SelectedTarget', 'Self',
    'SelfLaneEnemyAndAdjacentAny', 'TargetAnyUnit', 'TargetEnemyUnit', 'TargetEnemyUnitOrHero',
    'TargetFriendlyUnit', 'TargetFriendlyUnitOrHero',
  ),

  keywords: set(
    'AntiAirborne', 'Armor2', 'Armored', 'BounceImmune', 'Breakthrough', 'BurnSource', 'Burning', 'Dodge',
    'Evolving', 'Flying', 'Lifesteal', 'Marked', 'Protected', 'SilenceImmune', 'SoulGuard', 'SplashDamage',
    'Stunned', 'Taunt', 'Unactionable', 'Unkillable',
  ),

  conditions: set(
    'And', 'Or', 'Not', 'HasSubtypeOnBoard', 'IsEnemy', 'IsFriendly', 'IsSelf', 'IsStatus', 'IsSubtype',
    'NotFromHistory', 'PlayedSubtype', 'SameLane',
  ),

  zones: set('Board', 'Deck', 'Discard', 'Hand'),
});
