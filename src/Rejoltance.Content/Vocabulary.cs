using System.Collections.Frozen;

namespace Rejoltance.Content;

/// <summary>
/// Every DSL word the engine understands. A card using anything else is rejected at load time
/// (fail loud, ADR-0005 — the prototype silently returned [] for unknown targets).
/// The sets contain every word used by prototype/game/cards.js (ADR-0013); the kernel implements them rule by rule.
/// A word that is new to the prototype is added here together with a rule spec (R-nn) and, once implemented, its test.
/// </summary>
public static class Vocabulary
{
    public static readonly FrozenSet<string> CardTypes = Set(Content.CardTypes.Unit, Content.CardTypes.Spell);

    public static readonly FrozenSet<string> Triggers = Set(
        "OnAttackDone", "OnDamagedEnemyHero", "OnDamagedEnemyUnit", "OnDeath", "OnEndOfRound",
        "OnEnemyUnitGainedStats", "OnEnemyUnitPlayed", "OnFriendlyActionPlayed", "OnFriendlyCardDrawn",
        "OnFriendlyCardPlayed", "OnFriendlyUnitDamaged", "OnFriendlyUnitDied", "OnFriendlyUnitHpOne",
        "OnFriendlyUnitSummoned", "OnKill", "OnOpponentCardDrawn", "OnOpponentCardGained", "OnOtherUnitSacrificed",
        "OnPlayed", "OnPostCombatLine", "OnPreCombatLine", "OnSacrificed", "OnStartOfRound", "OnStatusApplied",
        "Passive");

    public static readonly FrozenSet<string> Actions = Set(
        "AbsorbAttackOnKill", "AbsorbStats", "AddCardToDeck", "AddCardToEnemyDeck", "AddCardToHand", "AddResource",
        "AllowUnitsInAction", "ApplyStatus", "AuraBuff", "BonusAttack", "BuffStats", "CopyLastEnemyCard", "CopySelf",
        "CopyUnit", "DamageImmunity", "DealDamage", "DestroyUnit", "DrawCard", "DrawFromDiscard",
        "DrawKilledLastRound", "GiveToOpponent", "GrantActionPlay", "GrantKeyword", "GrantRule", "Heal", "HealToFull",
        "IncreaseMaxHp", "LaneDebuff", "LoseBlood", "LoseHealth", "MakeAUnit", "Merge", "ModifyCost", "ModifyDamage",
        "ModifyGlobalBuff", "MoveLane", "MoveRight", "MoveToSourceLane", "PlayNextTwice", "Reanimate", "ReplayPlayed",
        "RespawnSelf", "ReturnToHand", "SacrificeUnit", "SacrificeUnits", "ScaleAttack", "ShuffleDeck", "Silence",
        "SpendBlood", "SummonUnit", "Transform", "TransformInHand", "TutorCard");

    public static readonly FrozenSet<string> Targets = Set(
        "AdjacentFriendlyUnits", "AllEnemyUnits", "AllFriendlyUnits", "AllOtherUnitsOnBoard", "AllUnitsOnBoard",
        "EnemyHero", "EnemySpellsInHand", "EnemyUnitsNearLane", "EventUnit", "EventUnitAndAdjacent", "FriendlyHero",
        "FriendlySpellsInHand", "OppositeEnemyUnit", "OtherFriendlyUnits", "SelectedTarget", "Self",
        "SelfLaneEnemyAndAdjacentAny", "TargetAnyUnit", "TargetEnemyUnit", "TargetEnemyUnitOrHero",
        "TargetFriendlyUnit", "TargetFriendlyUnitOrHero");

    public static readonly FrozenSet<string> Keywords = Set(
        "AntiAirborne", "Armor2", "Armored", "BounceImmune", "Breakthrough", "BurnSource", "Burning", "Dodge",
        "Evolving", "Flying", "Lifesteal", "Marked", "Protected", "SilenceImmune", "SoulGuard", "SplashDamage",
        "Stunned", "Taunt", "Unactionable", "Unkillable");

    public static readonly FrozenSet<string> Conditions = Set(
        "And", "Or", "Not", "HasSubtypeOnBoard", "IsEnemy", "IsFriendly", "IsSelf", "IsStatus", "IsSubtype",
        "NotFromHistory", "PlayedSubtype", "SameLane");

    public static readonly FrozenSet<string> Zones = Set(
        "Board", "Deck", "Discard", "Hand");

    private static FrozenSet<string> Set(params string[] items) => items.ToFrozenSet(StringComparer.Ordinal);
}
