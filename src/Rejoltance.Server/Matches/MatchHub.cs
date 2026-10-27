using Microsoft.AspNetCore.SignalR;
using Rejoltance.Contracts;
using Rejoltance.Kernel;

namespace Rejoltance.Server.Matches;

/// <summary>Typed client interface: everything the server pushes to a browser.</summary>
public interface IMatchClient
{
    Task MatchUpdated(MatchView view, IReadOnlyList<DomainEvent> events);
}

/// <summary>Real-time endpoint (/hubs/match). Accepts only intents; returns per-seat projections.</summary>
public sealed class MatchHub(MatchSessionManager sessions, ILogger<MatchHub> logger) : Hub<IMatchClient>
{
    public MatchView StartSandbox(string deckA, string deckB, ulong? seed = null)
    {
        var view = sessions.CreateSandbox(Context.ConnectionId, deckA, deckB, seed);
        logger.LogInformation("Sandbox match {MatchId} created by {Connection}", view.MatchId, Context.ConnectionId);
        return view;
    }

    public async Task<MatchView> SendIntent(string matchId, Intent intent)
    {
        try
        {
            var (view, events) = await sessions.ApplyAsync(matchId, Context.ConnectionId, intent);
            await Clients.Caller.MatchUpdated(view, events);
            return view;
        }
        catch (IllegalIntentException ex)
        {
            throw new HubException(ex.Message);
        }
        catch (NotImplementedException ex)
        {
            throw new HubException(ex.Message);
        }
    }
}
