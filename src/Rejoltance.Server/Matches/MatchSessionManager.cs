using System.Collections.Concurrent;
using Rejoltance.Content;
using Rejoltance.Contracts;
using Rejoltance.Kernel;

namespace Rejoltance.Server.Matches;

/// <summary>
/// Owns live matches in memory. One <see cref="SemaphoreSlim"/> per match serialises intents from both seats,
/// so the kernel never sees concurrent mutations.
/// </summary>
public sealed class MatchSessionManager(ICardCatalog catalog, MatchEngine engine, Projection projection, TimeProvider clock)
{
    private readonly ConcurrentDictionary<string, MatchSession> _sessions = new();

    public MatchView CreateSandbox(string connectionId, string deckA, string deckB, ulong? seed)
    {
        var matchId = $"m-{clock.GetUtcNow():yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";
        var setup = new MatchSetup(matchId, seed ?? (ulong)Random.Shared.NextInt64(), Deck(deckA), Deck(deckB));
        var result = engine.NewMatch(setup);
        var session = new MatchSession(matchId, setup.Seed, connectionId) { State = result.State };
        _sessions[matchId] = session;
        return projection.ToView(session.State, seat: 0);
    }

    public async Task<(MatchView View, IReadOnlyList<DomainEvent> Events)> ApplyAsync(string matchId, string connectionId, Intent intent)
    {
        if (!_sessions.TryGetValue(matchId, out var session))
        {
            throw new IllegalIntentException($"Match '{matchId}' does not exist.");
        }

        // Sandbox: the creator controls seat 0. Seat assignment for PvP is backlog E3.
        if (session.OwnerConnectionId != connectionId)
        {
            throw new IllegalIntentException("You are not a player in this match.");
        }

        const int seat = 0;
        await session.Gate.WaitAsync();
        try
        {
            var result = engine.Reduce(session.State, seat, intent);
            session.State = result.State;
            session.Intents.Add(intent);
            return (projection.ToView(result.State, seat), projection.ToViewerEvents(result.Events, seat));
        }
        finally
        {
            session.Gate.Release();
        }
    }

    public int ActiveMatches => _sessions.Count;

    private IReadOnlyList<int> Deck(string name) =>
        catalog.StarterDecks.FirstOrDefault(d => d.Name == name)?.Cards ?? throw new IllegalIntentException($"Unknown starter deck '{name}'.");

    private sealed class MatchSession(string id, ulong seed, string ownerConnectionId)
    {
        public string Id { get; } = id;
        public ulong Seed { get; } = seed;
        public string OwnerConnectionId { get; } = ownerConnectionId;
        public SemaphoreSlim Gate { get; } = new(1, 1);
        public required MatchState State { get; set; }

        /// <summary>Replay = seed + ordered intents (ADR-0004).</summary>
        public List<Intent> Intents { get; } = [];
    }
}
