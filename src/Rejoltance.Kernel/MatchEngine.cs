using System.Collections.Immutable;
using Rejoltance.Content;
using Rejoltance.Contracts;

namespace Rejoltance.Kernel;

public sealed record MatchSetup(string MatchId, ulong Seed, IReadOnlyList<int> DeckSeatA, IReadOnlyList<int> DeckSeatB);

public sealed record ReduceResult(MatchState State, IReadOnlyList<DomainEvent> Events);

/// <summary>An intent the rules do not allow in the current state. The state is left unchanged.</summary>
public sealed class IllegalIntentException(string message) : Exception(message);

/// <summary>
/// The rules engine: reduce(state, seat, intent) → (state, events). Pure and deterministic.
/// Unimplemented rules throw <see cref="NotImplementedException"/> with the backlog reference (fail loud).
/// </summary>
public sealed class MatchEngine(ICardCatalog catalog)
{
    public ReduceResult NewMatch(MatchSetup setup)
    {
        ValidateDeck(setup.DeckSeatA, "seat 0");
        ValidateDeck(setup.DeckSeatB, "seat 1");

        var rng = SeededRng.FromSeed(setup.Seed);
        (var deckA, rng) = rng.Shuffle(setup.DeckSeatA);
        (var deckB, rng) = rng.Shuffle(setup.DeckSeatB);

        var state = new MatchState
        {
            MatchId = setup.MatchId,
            Rng = rng,
            Players = [new PlayerState { Seat = 0, Deck = [.. deckA] }, new PlayerState { Seat = 1, Deck = [.. deckB] }],
        };
        var events = new List<DomainEvent> { new MatchStarted(setup.MatchId) };

        // R-02: both players start at 20 HP and draw 4 cards before the mulligan.
        for (var seat = 0; seat < 2; seat++)
        {
            for (var i = 0; i < GameRules.OpeningHand; i++)
            {
                state = Draw(state, seat, events);
            }
        }

        return new ReduceResult(state, events);
    }

    public ReduceResult Reduce(MatchState state, int seat, Intent intent)
    {
        if (seat is not (0 or 1))
        {
            throw new ArgumentOutOfRangeException(nameof(seat), seat, "Seat must be 0 or 1.");
        }

        if (state.Result is not null)
        {
            throw new IllegalIntentException("The match is already finished.");
        }

        var events = new List<DomainEvent>();
        var next = intent switch
        {
            MulliganIntent mulligan => Mulligan(state, seat, mulligan, events),
            SurrenderIntent => Finish(state, winnerSeat: 1 - seat, reason: "surrender", events),
            ChooseOrderIntent or PlayCardIntent or EndStepIntent or AnswerPendingIntent =>
                throw new NotImplementedException($"{intent.GetType().Name}: not implemented yet (backlog E1 — Kernel)."),
            _ => throw new IllegalIntentException($"Unknown intent {intent.GetType().Name}."),
        };
        return new ReduceResult(next, events);
    }

    public IReadOnlyList<LegalAction> LegalActions(MatchState state, int seat)
    {
        if (state.Result is not null)
        {
            return [];
        }

        var actions = new List<LegalAction>();
        if (state.Phase == MatchPhase.Mulligan && !state.Player(seat).MulliganDone)
        {
            actions.Add(new LegalAction("mulligan"));
        }

        actions.Add(new LegalAction("surrender"));
        return actions;
    }

    /// <summary>
    /// R-03 (prototype v11, engine.js mulligan): draw replacements first, then put the returned cards back and shuffle the deck.
    /// Note: RE_JOLTANCE.md says "bottom of deck, no shuffle" — tracked in docs/02-rules/ROZBIEZNOSCI.md.
    /// </summary>
    private MatchState Mulligan(MatchState state, int seat, MulliganIntent intent, List<DomainEvent> events)
    {
        var player = state.Player(seat);
        if (state.Phase != MatchPhase.Mulligan || player.MulliganDone)
        {
            throw new IllegalIntentException("Mulligan is not available now.");
        }

        var returned = intent.CardInstanceIds.Distinct().ToList();
        var returnedCards = returned
            .Select(id => player.Hand.FirstOrDefault(c => c.InstanceId == id)
                ?? throw new IllegalIntentException($"Card instance {id} is not in your hand."))
            .ToList();

        state = state.WithPlayer(seat, player with { Hand = player.Hand.RemoveRange(returnedCards) });
        foreach (var _ in returnedCards)
        {
            state = Draw(state, seat, events);
        }

        player = state.Player(seat);
        var (deck, rng) = state.Rng.Shuffle([.. player.Deck, .. returnedCards.Select(c => c.CardId)]);
        state = state.WithPlayer(seat, player with { Deck = [.. deck], MulliganDone = true }) with { Rng = rng };
        events.Add(new MulliganDone(seat, returnedCards.Count));

        if (state.Players.All(p => p.MulliganDone))
        {
            state = state with { Phase = MatchPhase.ChooseOrder };
        }

        return state;
    }

    /// <summary>
    /// R-14: empty deck → fatigue damage 1, 2, 3… (no reshuffle). R-13: full hand (8) → drawn card goes to discard.
    /// </summary>
    internal static MatchState Draw(MatchState state, int seat, List<DomainEvent> events)
    {
        var player = state.Player(seat);
        if (player.Deck.IsEmpty)
        {
            var amount = player.FatigueCounter + 1;
            state = state.WithPlayer(seat, player with { FatigueCounter = amount, Hp = player.Hp - amount });
            events.Add(new FatigueDamage(seat, amount));
            return CheckDefeat(state, events);
        }

        var cardId = player.Deck[0];
        var deck = player.Deck.RemoveAt(0);
        if (player.Hand.Count >= GameRules.HandLimit)
        {
            events.Add(new CardBurned(seat, cardId));
            return state.WithPlayer(seat, player with { Deck = deck, Discard = player.Discard.Add(cardId) });
        }

        var instance = new CardInstance(state.NextInstanceId, cardId);
        events.Add(new CardDrawn(seat, instance.InstanceId, cardId));
        return state.WithPlayer(seat, player with { Deck = deck, Hand = player.Hand.Add(instance) })
            with
        { NextInstanceId = state.NextInstanceId + 1 };
    }

    private static MatchState CheckDefeat(MatchState state, List<DomainEvent> events)
    {
        var dead = state.Players.Where(p => p.Hp <= 0).Select(p => p.Seat).ToList();
        return dead.Count switch
        {
            0 => state,
            // R-71: both heroes dead at once = draw (prototype outcome depends on check order, see ROZBIEZNOSCI.md D-01).
            2 => Finish(state, winnerSeat: null, reason: "draw", events),
            _ => Finish(state, winnerSeat: 1 - dead[0], reason: "hp", events),
        };
    }

    private static MatchState Finish(MatchState state, int? winnerSeat, string reason, List<DomainEvent> events)
    {
        events.Add(new MatchFinished(winnerSeat, reason));
        return state with { Phase = MatchPhase.Finished, ActiveSeat = null, Result = new MatchResult(winnerSeat, reason) };
    }

    private void ValidateDeck(IReadOnlyList<int> cards, string owner)
    {
        var problems = ContentValidator.ValidateDeck(new DeckDefinition(owner, cards), catalog).ToList();
        if (problems.Count > 0)
        {
            throw new IllegalIntentException(string.Join("; ", problems));
        }
    }
}
