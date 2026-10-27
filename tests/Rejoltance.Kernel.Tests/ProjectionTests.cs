using System.Text.Json;
using Rejoltance.Contracts;

namespace Rejoltance.Kernel.Tests;

public sealed class ProjectionTests
{
    private static readonly Projection Projection = new(TestMatches.Catalog, TestMatches.Engine());

    [Fact]
    public void R06_opponent_hand_is_only_a_count()
    {
        var start = TestMatches.Start();

        var view = Projection.ToView(start.State, seat: 0);

        Assert.Equal(4, view.You.Hand.Count);
        Assert.Equal(4, view.Opponent.HandCount);
        var json = JsonSerializer.Serialize(view.Opponent);
        foreach (var card in start.State.Player(1).Hand)
        {
            Assert.DoesNotContain($"\"InstanceId\":{card.InstanceId},", json);
        }
    }

    [Fact]
    public void R06_opponent_draw_events_are_redacted()
    {
        var start = TestMatches.Start();

        var events = Projection.ToViewerEvents(start.Events, seat: 0).OfType<CardDrawn>().ToList();

        Assert.All(events.Where(e => e.Seat == 1), e => Assert.Equal((0, 0), (e.InstanceId, e.CardId)));
        Assert.All(events.Where(e => e.Seat == 0), e => Assert.NotEqual(0, e.CardId));
    }

    [Fact]
    public void Mulligan_is_offered_as_legal_action_and_pending_interaction()
    {
        var view = Projection.ToView(TestMatches.Start().State, seat: 1);

        Assert.Contains(view.LegalActions, a => a.Kind == "mulligan");
        Assert.Equal("mulligan", view.Pending?.Kind);
    }
}
