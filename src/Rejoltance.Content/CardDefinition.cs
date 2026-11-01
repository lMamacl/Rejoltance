namespace Rejoltance.Content;

/// <summary>
/// A card as data (DSL). Field names mirror prototype/revibance/cards.js so the JSON stays copy-compatible.
/// Adding a card = adding JSON; adding a new action/trigger = registry change + tests (docs/00-start/jak-dodac-karte.md).
/// </summary>
public sealed record CardDefinition
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Type { get; init; }
    public int Cost { get; init; }
    public int? Attack { get; init; }
    public int? Health { get; init; }
    public string Description { get; init; } = "";
    public IReadOnlyList<string> Subtypes { get; init; } = [];
    public IReadOnlyList<string> Keywords { get; init; } = [];
    public IReadOnlyDictionary<string, int> KeywordParams { get; init; } = new Dictionary<string, int>();
    public IReadOnlyList<EffectDefinition> Effects { get; init; } = [];

    public bool IsUnit => Type == CardTypes.Unit;
    public bool IsSpell => Type == CardTypes.Spell;

    /// <summary>Tokens (id &gt;= 900) are created by effects and cannot be put in a deck.</summary>
    public bool IsToken => Id >= CardRules.FirstTokenId;
}

public sealed record EffectDefinition
{
    public required string Trigger { get; init; }
    public string? Zone { get; init; }
    public string? Targeting { get; init; }
    public IReadOnlyList<string> ChoiceLabels { get; init; } = [];
    public ConditionDefinition? Condition { get; init; }
    public IReadOnlyList<ActionDefinition> Actions { get; init; } = [];
}

public sealed record ConditionDefinition
{
    public required string Condition { get; init; }
    public string? TargetParam { get; init; }
    public IReadOnlyList<ConditionDefinition> SubConditions { get; init; } = [];
}

public sealed record ActionDefinition
{
    public required string Type { get; init; }
    public string? Target { get; init; }
    public int? Amount { get; init; }
    public int? BuffAtk { get; init; }
    public int? BuffHp { get; init; }
    public string? StatusKeyword { get; init; }
    public int? ValueParam { get; init; }
    public string? StringParam { get; init; }
    public bool? OnlyIfSacrificed { get; init; }
    public bool? IfAlive { get; init; }
    public string? AmountFrom { get; init; }
    public int? Min { get; init; }
    public int? Max { get; init; }
    public int? Into { get; init; }
    public int? Partner { get; init; }
    public int? PartnerInto { get; init; }
}

public sealed record DeckDefinition(string Name, IReadOnlyList<int> Cards);

public static class CardTypes
{
    public const string Unit = "Unit";
    public const string Spell = "Spell";
}

public static class CardRules
{
    public const int DeckSize = 30;
    public const int MaxCopies = 3;
    public const int FirstTokenId = 900;
}
