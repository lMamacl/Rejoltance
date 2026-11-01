using System.Collections.Frozen;
using System.Reflection;
using System.Text.Json;

namespace Rejoltance.Content;

/// <summary>Read-only, validated card catalog. Register once as a singleton; never a static instance.</summary>
public interface ICardCatalog
{
    IReadOnlyCollection<CardDefinition> All { get; }
    IReadOnlyList<DeckDefinition> StarterDecks { get; }
    CardDefinition GetCard(int cardId);
    bool TryGetCard(int cardId, out CardDefinition? card);
}

public sealed class CardCatalog : ICardCatalog
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly FrozenDictionary<int, CardDefinition> _cards;

    public CardCatalog(IEnumerable<CardDefinition> cards, IEnumerable<DeckDefinition> starterDecks)
    {
        var list = cards.ToList();
        var duplicates = list.GroupBy(c => c.Id).Where(g => g.Count() > 1).Select(g => $"duplicate card id {g.Key}");
        var errors = duplicates.Concat(list.SelectMany(ContentValidator.ValidateCard)).ToList();
        _cards = list.DistinctBy(c => c.Id).ToFrozenDictionary(c => c.Id);
        StarterDecks = starterDecks.ToList();
        errors.AddRange(StarterDecks.SelectMany(d => ContentValidator.ValidateDeck(d, this)));
        if (errors.Count > 0)
        {
            throw new ContentValidationException(errors);
        }
    }

    public IReadOnlyCollection<CardDefinition> All => _cards.Values;

    public IReadOnlyList<DeckDefinition> StarterDecks { get; }

    public CardDefinition GetCard(int cardId) =>
        _cards.TryGetValue(cardId, out var card) ? card : throw new KeyNotFoundException($"Unknown card id {cardId}");

    public bool TryGetCard(int cardId, out CardDefinition? card) => _cards.TryGetValue(cardId, out card);

    /// <summary>Loads the catalog embedded in this assembly (Data/cards.json, Data/decks.json).</summary>
    public static CardCatalog LoadEmbedded()
    {
        var assembly = typeof(CardCatalog).Assembly;
        return new CardCatalog(
            Read<List<CardDefinition>>(assembly, "Rejoltance.Content.cards.json"),
            Read<List<DeckDefinition>>(assembly, "Rejoltance.Content.decks.json"));
    }

    private static T Read<T>(Assembly assembly, string resource)
    {
        using var stream = assembly.GetManifestResourceStream(resource)
            ?? throw new InvalidOperationException($"Embedded resource '{resource}' not found");
        return JsonSerializer.Deserialize<T>(stream, JsonOptions)
            ?? throw new InvalidOperationException($"Embedded resource '{resource}' is empty");
    }
}

public sealed class ContentValidationException(IReadOnlyList<string> errors)
    : Exception($"Card content is invalid ({errors.Count} problem(s)):{Environment.NewLine}{string.Join(Environment.NewLine, errors)}")
{
    public IReadOnlyList<string> Errors { get; } = errors;
}
