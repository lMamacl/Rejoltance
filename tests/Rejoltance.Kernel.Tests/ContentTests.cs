using Rejoltance.Content;

namespace Rejoltance.Kernel.Tests;

public sealed class ContentTests
{
    [Fact]
    public void Catalog_contains_all_prototype_cards()
    {
        var cards = TestMatches.Catalog.All;

        Assert.Equal(69, cards.Count(c => !c.IsToken));
        Assert.Equal(9, cards.Count(c => c.IsToken));
    }

    [Fact]
    public void R01_starter_decks_are_legal() =>
        Assert.All(TestMatches.Catalog.StarterDecks, d => Assert.Empty(ContentValidator.ValidateDeck(d, TestMatches.Catalog)));

    [Fact]
    public void R68_unknown_dsl_words_fail_loud()
    {
        var card = new CardDefinition
        {
            Id = 1000,
            Name = "Broken",
            Type = CardTypes.Spell,
            Effects = [new EffectDefinition { Trigger = "OnPlayed", Actions = [new ActionDefinition { Type = "Teleport", Target = "Moon" }] }],
        };

        var ex = Assert.Throws<ContentValidationException>(() => new CardCatalog([card], []));

        Assert.Contains(ex.Errors, e => e.Contains("unknown action 'Teleport'"));
        Assert.Contains(ex.Errors, e => e.Contains("unknown target 'Moon'"));
    }

    [Fact]
    public void R01_deck_rules_reject_tokens_and_extra_copies()
    {
        var deck = new DeckDefinition("bad", [.. Enumerable.Repeat(1, 4), 900, .. Enumerable.Repeat(2, 25)]);

        var errors = ContentValidator.ValidateDeck(deck, TestMatches.Catalog).ToList();

        Assert.Contains(errors, e => e.Contains("4 copies"));
        Assert.Contains(errors, e => e.Contains("token"));
    }
}
