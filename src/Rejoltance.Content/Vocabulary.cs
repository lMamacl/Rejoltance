using System.Collections.Frozen;

namespace Rejoltance.Content;

/// <summary>
/// Every DSL word the engine understands. A card using anything else is rejected at load time
/// (fail loud, ADR-0005 — the prototype silently returned [] for unknown targets).
/// Extend these sets only together with the kernel handler and a rule test.
/// </summary>
public static class Vocabulary
{
    public static readonly FrozenSet<string> CardTypes = Set(Content.CardTypes.Unit, Content.CardTypes.Spell);

    public static readonly FrozenSet<string> Triggers = Set(
        "OnPlayed", "OnDeath", "OnKill", "OnSacrificed", "OnOtherUnitSacrificed", "OnFriendlyUnitDied",
        "OnFriendlyCardDrawn", "OnOpponentCardDrawn", "OnStatusApplied", "OnPreCombatLine", "OnPostCombatLine",
        "OnDamagedEnemyUnit", "OnDamagedEnemyHero", "OnFriendlyActionPlayed", "Passive");

    public static readonly FrozenSet<string> Actions = Set(
        "AbsorbStats", "AddCardToHand", "AddResource", "ApplyStatus", "BonusAttack", "BuffStats", "DealDamage",
        "DestroyUnit", "DrawCard", "DrawFromDiscard", "GiveToOpponent", "Heal", "HealToFull", "LoseHealth",
        "MakeAUnit", "ModifyGlobalBuff", "MoveRight", "ReturnToHand", "SacrificeUnit", "SacrificeUnits",
        "ShuffleDeck", "Silence", "SummonUnit", "Transform", "TutorCard");

    public static readonly FrozenSet<string> Targets = Set(
        "AllEnemyUnits", "AllOtherUnitsOnBoard", "AllUnitsOnBoard", "EnemyHero", "EnemySpellsInHand",
        "FriendlyHero", "FriendlySpellsInHand", "OppositeEnemyUnit", "OtherFriendlyUnits", "SelectedTarget",
        "Self", "TargetEnemyUnit", "TargetFriendlyUnit");

    public static readonly FrozenSet<string> Keywords = Set(
        "Armored", "Armor2", "Breakthrough", "BurnSource", "Burning", "Flying", "Marked", "SoulGuard",
        "SplashDamage", "Stunned", "Unkillable");

    public static readonly FrozenSet<string> Conditions = Set(
        "And", "Or", "Not", "IsSelf", "IsSubtype", "IsStatus", "IsEnemy", "IsFriendly", "HasSubtypeOnBoard");

    public static readonly FrozenSet<string> Zones = Set("Board", "Hand");

    private static FrozenSet<string> Set(params string[] items) => items.ToFrozenSet(StringComparer.Ordinal);
}
