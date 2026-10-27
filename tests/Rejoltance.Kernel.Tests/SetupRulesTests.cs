using Rejoltance.Contracts;

namespace Rejoltance.Kernel.Tests;

// Test names start with the rule id from docs/02-rules/RULES-INDEX.md (R-nn), so coverage can be traced.
public sealed class SetupRulesTests
{
    [Fact]
    public void R01_players_start_with_20_hp_and_4_cards()
    {
        var state = TestMatches.Start().State;

        Assert.All(state.Players, p =>
        {
            Assert.Equal(20, p.Hp);
            Assert.Equal(4, p.Hand.Count);
            Assert.Equal(26, p.Deck.Count);
        });
        Assert.Equal(MatchPhase.Mulligan, state.Phase);
    }

    [Fact]
    public void R02_mulligan_replaces_cards_and_keeps_deck_size()
    {
        var engine = TestMatches.Engine();
        var start = TestMatches.Start().State;
        var returned = start.Player(0).Hand.Take(2).Select(c => c.InstanceId).ToList();

        var after = engine.Reduce(start, 0, new MulliganIntent(returned)).State;

        var player = after.Player(0);
        Assert.Equal(4, player.Hand.Count);
        Assert.Equal(26, player.Deck.Count);
        Assert.DoesNotContain(player.Hand, c => returned.Contains(c.InstanceId));
        Assert.True(player.MulliganDone);
    }

    [Fact]
    public void R02_mulligan_twice_is_illegal()
    {
        var engine = TestMatches.Engine();
        var once = engine.Reduce(TestMatches.Start().State, 0, new MulliganIntent([])).State;

        Assert.Throws<IllegalIntentException>(() => engine.Reduce(once, 0, new MulliganIntent([])));
    }

    [Fact]
    public void R02_mulligan_of_a_card_not_in_hand_is_illegal()
    {
        var engine = TestMatches.Engine();

        Assert.Throws<IllegalIntentException>(() => engine.Reduce(TestMatches.Start().State, 0, new MulliganIntent([999])));
    }

    [Fact]
    public void R02_both_mulligans_move_the_match_to_choose_order()
    {
        var engine = TestMatches.Engine();
        var state = TestMatches.Start().State;

        state = engine.Reduce(state, 0, new MulliganIntent([])).State;
        state = engine.Reduce(state, 1, new MulliganIntent([])).State;

        Assert.Equal(MatchPhase.ChooseOrder, state.Phase);
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(5, 5)]
    [InlineData(10, 10)]
    [InlineData(14, 10)]
    public void R03_max_blood_equals_round_capped_at_10(int round, int expected) =>
        Assert.Equal(expected, GameRules.MaxBloodForRound(round));

    [Fact]
    public void R04_drawing_from_empty_deck_deals_growing_fatigue_damage()
    {
        var state = TestMatches.Start().State;
        state = state.WithPlayer(0, state.Player(0) with { Deck = [] });
        var events = new List<DomainEvent>();

        state = MatchEngine.Draw(state, 0, events);
        state = MatchEngine.Draw(state, 0, events);
        state = MatchEngine.Draw(state, 0, events);

        Assert.Equal(20 - 1 - 2 - 3, state.Player(0).Hp);
        Assert.Equal([1, 2, 3], events.OfType<FatigueDamage>().Select(e => e.Amount));
    }

    [Fact]
    public void R04_fatigue_can_end_the_match()
    {
        var state = TestMatches.Start().State;
        state = state.WithPlayer(0, state.Player(0) with { Deck = [], Hp = 1 });
        var events = new List<DomainEvent>();

        state = MatchEngine.Draw(state, 0, events);

        Assert.Equal(new MatchResult(1, "hp"), state.Result);
        Assert.Equal(MatchPhase.Finished, state.Phase);
    }

    [Fact]
    public void R05_drawing_with_full_hand_sends_card_to_discard()
    {
        var state = TestMatches.Start().State;
        var player = state.Player(0);
        state = state.WithPlayer(0, player with { Hand = [.. Enumerable.Range(100, 8).Select(i => new CardInstance(i, 1))] });
        var events = new List<DomainEvent>();

        state = MatchEngine.Draw(state, 0, events);

        Assert.Equal(8, state.Player(0).Hand.Count);
        Assert.Single(state.Player(0).Discard);
        Assert.Single(events.OfType<CardBurned>());
    }

    [Fact]
    public void Surrender_ends_the_match_for_the_opponent()
    {
        var result = TestMatches.Engine().Reduce(TestMatches.Start().State, 0, new SurrenderIntent());

        Assert.Equal(new MatchResult(1, "surrender"), result.State.Result);
    }

    [Fact]
    public void Unimplemented_intents_fail_loud()
    {
        var engine = TestMatches.Engine();

        Assert.Throws<NotImplementedException>(() => engine.Reduce(TestMatches.Start().State, 0, new EndStepIntent()));
    }
}
