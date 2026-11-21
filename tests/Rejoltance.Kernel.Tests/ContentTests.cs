using System.Text.Json;
using Rejoltance.Content;

namespace Rejoltance.Kernel.Tests;

public sealed class ContentTests
{
    [Fact]
    public void Catalog_contains_all_prototype_cards()
    {
        var cards = TestMatches.Catalog.All;

        Assert.Equal(130, cards.Count(c => !c.IsToken));
        Assert.Equal(29, cards.Count(c => c.IsToken));
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

    [Fact]
    public void R68_dsl_reads_zone_lists_and_counted_amounts()
    {
        const string json = """
            [{ "Id": 1001, "Name": "Probe", "Type": "Spell", "Cost": 1,
               "Effects": [{ "Trigger": "OnPlayed", "Zone": ["Deck", "Hand"],
                             "Actions": [{ "Type": "DealDamage", "Target": "EnemyHero", "Amount": { "Count": "Blood", "Max": 5 } },
                                         { "Type": "Heal", "Target": "FriendlyHero", "Amount": 3 }] }] }]
            """;

        var card = JsonSerializer.Deserialize<List<CardDefinition>>(json)!.Single();
        var effect = card.Effects.Single();

        Assert.Empty(ContentValidator.ValidateCard(card));
        Assert.Equal(["Deck", "Hand"], effect.Zone);
        Assert.Equal(new DslNumber { Count = "Blood", Max = 5 }, effect.Actions[0].Amount);
        Assert.Equal(3, effect.Actions[1].Amount!.Value);
    }
}
