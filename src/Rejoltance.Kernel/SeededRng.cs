namespace Rejoltance.Kernel;

/// <summary>
/// Deterministic RNG (SplitMix64). The whole generator state is one <see cref="ulong"/> stored in
/// <see cref="MatchState"/>, so replay = seed + ordered intents (ADR-0004). Immutable: every call returns the next state.
/// </summary>
public readonly record struct SeededRng(ulong State)
{
    public static SeededRng FromSeed(ulong seed) => new(seed);

    public (ulong Value, SeededRng Next) NextUInt64()
    {
        var state = unchecked(State + 0x9E3779B97F4A7C15UL);
        var z = state;
        z = unchecked((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9UL);
        z = unchecked((z ^ (z >> 27)) * 0x94D049BB133111EBUL);
        return (z ^ (z >> 31), new SeededRng(state));
    }

    /// <summary>Uniform integer in [0, <paramref name="exclusiveMax"/>) without modulo bias.</summary>
    public (int Value, SeededRng Next) NextInt(int exclusiveMax)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(exclusiveMax);
        var bound = (ulong)exclusiveMax;
        var threshold = (0UL - bound) % bound;
        var rng = this;
        while (true)
        {
            (var value, rng) = rng.NextUInt64();
            if (value >= threshold)
            {
                return ((int)(value % bound), rng);
            }
        }
    }

    /// <summary>Fisher–Yates shuffle; returns a new list and the advanced generator.</summary>
    public (IReadOnlyList<T> Items, SeededRng Next) Shuffle<T>(IReadOnlyList<T> items)
    {
        var result = items.ToArray();
        var rng = this;
        for (var i = result.Length - 1; i > 0; i--)
        {
            (var j, rng) = rng.NextInt(i + 1);
            (result[i], result[j]) = (result[j], result[i]);
        }

        return (result, rng);
    }
}
