using Microsoft.EntityFrameworkCore;

namespace Rejoltance.Server.Data;

/// <summary>
/// Persistence (SQLite in dev, PostgreSQL later — ADR-0007). Only finished-match data and accounts live here;
/// live matches stay in memory. Schema changes: EF Core migrations (backlog E6).
/// </summary>
public sealed class RejoltanceDb(DbContextOptions<RejoltanceDb> options) : DbContext(options)
{
    public DbSet<MatchRecord> Matches => Set<MatchRecord>();
}

public sealed class MatchRecord
{
    public int Id { get; set; }
    public required string MatchId { get; set; }
    public ulong Seed { get; set; }
    public int? WinnerSeat { get; set; }
    public DateTimeOffset FinishedAt { get; set; }
}
