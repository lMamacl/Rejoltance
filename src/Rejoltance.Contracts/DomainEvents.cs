using System.Text.Json.Serialization;

namespace Rejoltance.Contracts;

/// <summary>
/// Contract 5 of 5: facts emitted by the kernel. The client animates events instead of diffing states.
/// Events carrying hidden information are filtered per seat by the projection.
/// </summary>
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(MatchStarted), "matchStarted")]
[JsonDerivedType(typeof(CardDrawn), "cardDrawn")]
[JsonDerivedType(typeof(CardBurned), "cardBurned")]
[JsonDerivedType(typeof(FatigueDamage), "fatigueDamage")]
[JsonDerivedType(typeof(MulliganDone), "mulliganDone")]
[JsonDerivedType(typeof(MatchFinished), "matchFinished")]
public abstract record DomainEvent;

public sealed record MatchStarted(string MatchId) : DomainEvent;

/// <summary>A card moved from deck to hand. <paramref name="CardId"/> is hidden from the opponent.</summary>
public sealed record CardDrawn(int Seat, int InstanceId, int CardId) : DomainEvent;

/// <summary>Drawn with a full hand: the card goes to the discard pile (public).</summary>
public sealed record CardBurned(int Seat, int CardId) : DomainEvent;

/// <summary>Draw from an empty deck: 1, 2, 3... damage.</summary>
public sealed record FatigueDamage(int Seat, int Amount) : DomainEvent;

public sealed record MulliganDone(int Seat, int Replaced) : DomainEvent;

public sealed record MatchFinished(int? WinnerSeat, string Reason) : DomainEvent;
