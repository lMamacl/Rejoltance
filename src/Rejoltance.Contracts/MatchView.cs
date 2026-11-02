namespace Rejoltance.Contracts;

/// <summary>
/// What one seat is allowed to see (fog of war). Produced only by the projection, never by hand.
/// Contract 4 of 5. The server never sends the full game state to a client.
/// </summary>
public sealed record MatchView(
    string MatchId,
    int Round,
    MatchPhase Phase,
    int YourSeat,
    int? ActiveSeat,
    PlayerView You,
    OpponentView Opponent,
    IReadOnlyList<LegalAction> LegalActions,
    PendingInteraction? Pending,
    MatchResult? Result);

public enum MatchPhase
{
    Mulligan,
    ChooseOrder,
    UnitStep,
    MixedStep,
    ActionStep,
    Combat,
    Finished,
}

public sealed record PlayerView(
    int Hp,
    int Blood,
    int MaxBlood,
    IReadOnlyList<HandCardView> Hand,
    int DeckCount,
    int DiscardCount,
    IReadOnlyList<UnitView?> Lanes);

/// <summary>The opponent's hand and deck are only counts: card identities never leave the server.</summary>
public sealed record OpponentView(
    int Hp,
    int Blood,
    int MaxBlood,
    int HandCount,
    int DeckCount,
    int DiscardCount,
    IReadOnlyList<UnitView?> Lanes);

public sealed record HandCardView(int InstanceId, int CardId, int Cost);

public sealed record UnitView(int InstanceId, int CardId, int Attack, int Health, IReadOnlyList<string> Keywords);

/// <summary>
/// Contract 2 of 5: the single source of legality. UI highlights it, the server validates against it,
/// bots generate moves from it.
/// </summary>
public sealed record LegalAction(string Kind, int? CardInstanceId = null, IReadOnlyList<int>? Lanes = null);

/// <summary>
/// Contract 3 of 5: the kernel asks a question instead of blocking (mulligan, order, target choice).
/// </summary>
public sealed record PendingInteraction(string Id, string Kind, int Seat, IReadOnlyList<string> Options);

public sealed record MatchResult(int? WinnerSeat, string Reason);
