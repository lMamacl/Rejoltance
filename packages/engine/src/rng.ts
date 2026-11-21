// Deterministic RNG (SplitMix64). The whole generator state is one unsigned 64-bit integer kept in MatchState,
// so a replay is just seed + ordered intents (ADR-0004, R-83). Pure functions: every call returns the next state.
// The arithmetic is done on BigInt and masked to 64 bits; it gives exactly the same numbers as the former C# kernel.

const MASK = (1n << 64n) - 1n;
const GOLDEN_GAMMA = 0x9e3779b97f4a7c15n;

export type RngState = bigint;

export function seedRng(seed: number | bigint): RngState {
  const value = BigInt(seed);
  if (value < 0n || value > MASK) throw new RangeError(`Seed must be a non-negative 64-bit integer, got ${seed}`);
  return value;
}

export function nextUInt64(state: RngState): [value: bigint, next: RngState] {
  const next = (state + GOLDEN_GAMMA) & MASK;
  let z = next;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK;
  return [z ^ (z >> 31n), next];
}

/** Uniform integer in [0, exclusiveMax) without modulo bias. */
export function nextInt(state: RngState, exclusiveMax: number): [value: number, next: RngState] {
  if (!Number.isInteger(exclusiveMax) || exclusiveMax <= 0) throw new RangeError(`exclusiveMax must be a positive integer, got ${exclusiveMax}`);
  const bound = BigInt(exclusiveMax);
  const threshold = ((MASK + 1n) - bound) % bound;
  let rng = state;
  for (;;) {
    const [value, next] = nextUInt64(rng);
    rng = next;
    if (value >= threshold) return [Number(value % bound), rng];
  }
}

/** Fisher–Yates shuffle; returns a new array and the advanced generator. */
export function shuffle<T>(state: RngState, items: readonly T[]): [items: T[], next: RngState] {
  const result = [...items];
  let rng = state;
  for (let i = result.length - 1; i > 0; i--) {
    const [j, next] = nextInt(rng, i + 1);
    rng = next;
    [result[i], result[j]] = [result[j], result[i]];
  }
  return [result, rng];
}
