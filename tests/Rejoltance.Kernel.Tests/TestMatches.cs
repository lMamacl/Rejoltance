using Rejoltance.Content;

namespace Rejoltance.Kernel.Tests;

/// <summary>Shared fixtures: the real embedded catalog and helpers to start a match.</summary>
internal static class TestMatches
{
    public static readonly ICardCatalog Catalog = CardCatalog.LoadEmbedded();

    public static MatchEngine Engine() => new(Catalog);

    public static IReadOnlyList<int> Deck(string name = "MachineAggro") =>
        Catalog.StarterDecks.Single(d => d.Name == name).Cards;

    public static ReduceResult Start(ulong seed = 42) =>
        Engine().NewMatch(new MatchSetup("test", seed, Deck(), Deck("TeaMaidCombo")));
}
