using Rejoltance.Content;
using Rejoltance.Contracts;

namespace Rejoltance.Kernel;

/// <summary>
/// The only way state leaves the kernel: one <see cref="MatchView"/> per seat (fog of war in one place).
/// The opponent's hand and both decks are reduced to counts.
/// </summary>
public sealed class Projection(ICardCatalog catalog, MatchEngine engine)
{
    public MatchView ToView(MatchState state, int seat)
    {
        var you = state.Player(seat);
        var opponent = state.Player(1 - seat);
        return new MatchView(
            MatchId: state.MatchId,
            Round: state.Round,
            Phase: state.Phase,
            YourSeat: seat,
            ActiveSeat: state.ActiveSeat,
            You: new PlayerView(
                you.Hp,
                you.Blood,
                you.MaxBlood,
                [.. you.Hand.Select(c => new HandCardView(c.InstanceId, c.CardId, catalog.GetCard(c.CardId).Cost))],
                you.Deck.Count,
                you.Discard.Count,
                Lanes(you)),
            Opponent: new OpponentView(
                opponent.Hp,
                opponent.Blood,
                opponent.MaxBlood,
                opponent.Hand.Count,
                opponent.Deck.Count,
                opponent.Discard.Count,
                Lanes(opponent)),
            LegalActions: engine.LegalActions(state, seat),
            Pending: Pending(state, seat),
            Result: state.Result);
    }

    /// <summary>Events about hidden cards are redacted for the other seat.</summary>
    public IReadOnlyList<DomainEvent> ToViewerEvents(IEnumerable<DomainEvent> events, int seat) =>
        [.. events.Select(e => e is CardDrawn drawn && drawn.Seat != seat ? drawn with { InstanceId = 0, CardId = 0 } : e)];

    private static PendingInteraction? Pending(MatchState state, int seat) =>
        state.Phase == MatchPhase.Mulligan && !state.Player(seat).MulliganDone
            ? new PendingInteraction($"mulligan-{seat}", "mulligan", seat, [])
            : null;

    private static UnitView?[] Lanes(PlayerState player) =>
        [.. player.Lanes.Select(u => u is null ? null : new UnitView(u.InstanceId, u.CardId, u.Attack, u.Health, [.. u.Keywords]))];
}
