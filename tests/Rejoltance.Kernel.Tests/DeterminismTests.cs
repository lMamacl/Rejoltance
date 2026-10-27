using System.Text.Json;

namespace Rejoltance.Kernel.Tests;

public sealed class DeterminismTests
{
    [Fact]
    public void Same_seed_gives_identical_match()
    {
        var a = TestMatches.Start(seed: 7).State;
        var b = TestMatches.Start(seed: 7).State;

        Assert.Equal(JsonSerializer.Serialize(a), JsonSerializer.Serialize(b));
    }

    [Fact]
    public void Different_seeds_give_different_decks()
    {
        var a = TestMatches.Start(seed: 1).State.Player(0).Deck;
        var b = TestMatches.Start(seed: 2).State.Player(0).Deck;

        Assert.NotEqual(a, b);
    }

    [Fact]
    public void Shuffle_is_a_permutation()
    {
        var items = Enumerable.Range(0, 30).ToList();

        var (shuffled, _) = SeededRng.FromSeed(123).Shuffle(items);

        Assert.Equal(items, shuffled.Order());
        Assert.NotEqual(items, shuffled);
    }

    [Fact]
    public void NextInt_stays_in_range()
    {
        var rng = SeededRng.FromSeed(99);
        for (var i = 0; i < 1000; i++)
        {
            (var value, rng) = rng.NextInt(4);
            Assert.InRange(value, 0, 3);
        }
    }
}
