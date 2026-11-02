using System.Collections.Immutable;
using Rejoltance.Contracts;

namespace Rejoltance.Kernel;

/// <summary>Numbers from the rules (docs/02-rules). Changing one is a rules change: update R-nn and its test.</summary>
public static class GameRules
{
    public const int StartingHp = 20;
    public const int MaxBlood = 10;
    public const int HandLimit = 8;
    public const int OpeningHand = 4;
    public const int LaneCount = 4;

    /// <summary>R-10: max Blood equals the round number, capped at 10.</summary>
    public static int MaxBloodForRound(int round) => Math.Clamp(round, 0, MaxBlood);
}

/// <summary>
/// Full authoritative state of one match. Lives only on the server; clients get <see cref="MatchView"/>.
/// Immutable: the kernel returns a new state for every intent.
/// </summary>
public sealed record MatchState
{
    public required string MatchId { get; init; }
    public required SeededRng Rng { get; init; }
    public required ImmutableArray<PlayerState> Players { get; init; }
    public int Round { get; init; }
    public MatchPhase Phase { get; init; } = MatchPhase.Mulligan;
    public int? ActiveSeat { get; init; }
    public int NextInstanceId { get; init; } = 1;
    public MatchResult? Result { get; init; }

    public PlayerState Player(int seat) => Players[seat];

    public MatchState WithPlayer(int seat, PlayerState player) => this with { Players = Players.SetItem(seat, player) };
}

public sealed record PlayerState
{
    public required int Seat { get; init; }
    public int Hp { get; init; } = GameRules.StartingHp;
    public int Blood { get; init; }
    public int MaxBlood { get; init; }

    /// <summary>Deck holds card ids only; instance ids are assigned when a card leaves the deck, so they never leak deck order.</summary>
    public ImmutableList<int> Deck { get; init; } = [];
    public ImmutableList<CardInstance> Hand { get; init; } = [];
    public ImmutableList<int> Discard { get; init; } = [];
    public ImmutableArray<UnitState?> Lanes { get; init; } = [.. new UnitState?[GameRules.LaneCount]];
    public int FatigueCounter { get; init; }
    public bool MulliganDone { get; init; }
}

public sealed record CardInstance(int InstanceId, int CardId);

public sealed record UnitState(int InstanceId, int CardId, int Attack, int Health, ImmutableArray<string> Keywords);
